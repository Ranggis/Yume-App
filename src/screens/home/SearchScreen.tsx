import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import { jikanSearchAnime, jikanTopAnime } from '../../api/jikan';

// =========================
// TYPE DEFINITIONS
// =========================
type NavigationProp = StackNavigationProp<RootStackParamList, 'SearchScreen'>;

interface JikanAnime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  type?: string;
  source?: string;
  genres?: { name: string }[];
  aired?: { from: string | null };
  popularity?: number;
}

interface FilterParams {
  sort: string;
  category: string;
  region: string;
  genre: string;
  year: string;
}

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();

  const filters = route.params?.filters as FilterParams | undefined;

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchResults, setSearchResults] = useState<JikanAnime[]>([]);
  const [recommendations, setRecommendations] = useState<JikanAnime[]>([]);

  // Load recommendations once
  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await jikanTopAnime();
      setRecommendations(data);
    } catch (err) {
      console.log('Recommend API Error:', err);
    }
  };

  // =============== FILTERING ===============
  const filterData = (list: JikanAnime[]) => {
    if (!filters) return list;

    let filtered = [...list];

    if (filters.category === 'Movie') {
      filtered = filtered.filter((a) => a.type === 'Movie');
    } else if (filters.category === 'Episode') {
      filtered = filtered.filter((a) => a.type === 'TV');
    }

    if (filters.region === 'Japan') {
      filtered = filtered.filter((a) => a.source !== 'Manhua');
    } else if (filters.region === 'Chinese') {
      filtered = filtered.filter((a) => a.source === 'Manhua');
    }

    if (filters.genre !== 'All') {
      filtered = filtered.filter((a) =>
        a.genres?.some((g) => g.name.toLowerCase() === filters.genre.toLowerCase())
      );
    }

    if (filters.year !== 'All') {
      filtered = filtered.filter((a) =>
        a.aired?.from?.includes(filters.year)
      );
    }

    if (filters.sort === 'Popularity') {
      filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    if (filters.sort === 'Latest Release') {
      filtered.sort((a, b) => {
        const A = new Date(a.aired?.from || '2000');
        const B = new Date(b.aired?.from || '2000');
        return B.getTime() - A.getTime();
      });
    }

    return filtered;
  };

  // =============== SEARCH ===============
  const handleSearch = async (text: string) => {
    setQuery(text);

    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await jikanSearchAnime(text);
      const filtered = filterData(res);
      setSearchResults(filtered);
    } catch (err) {
      console.log('Search Error:', err);
    }

    setLoading(false);
  };

  // =============== GO TO DETAIL ===============
  const goToDetail = (id: number) => {
    navigation.navigate('AnimeDetailScreen', { animeId: id });
  };

  // =============== RENDER CARD ===============
  const renderItem = ({ item }: { item: JikanAnime }) => (
    <TouchableOpacity
      style={styles.animeItem}
      onPress={() => goToDetail(item.mal_id)}
    >
      <Image source={{ uri: item.images.jpg.image_url }} style={styles.image} />

      <TouchableOpacity style={styles.playIcon}>
        <Icon name="play" size={16} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* HEADER SEARCH */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={18} color="#00C853" />
          <TextInput
            style={styles.input}
            placeholder="Search anime..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={handleSearch}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation.navigate('FilterScreen')}
        >
          <Icon name="filter" size={18} color="#00C853" />
        </TouchableOpacity>
      </View>

      {/* LOADING */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#00C853"
          style={{ marginTop: 20 }}
        />
      )}

      {/* EMPTY (fix error & tampil hanya jika benar-benar kosong) */}
      {!loading &&
        query !== '' &&
        Array.isArray(searchResults) &&
        searchResults.length === 0 && (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../../assets/EmptySearch.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
          </View>
        )}

      {/* LIST */}
      {!loading && (
        <FlatList
          data={query === '' ? recommendations : searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.mal_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

// ==========================
// STYLE (TIDAK DIUBAH SEDIKITPUN)
// ==========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00C853',
    paddingHorizontal: 10,
    height: 45,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00C853',
    padding: 10,
    marginLeft: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop: 12,
  },
  animeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 120,
    height: 80,
  },
  playIcon: {
    position: 'absolute',
    top: '35%',
    left: '18%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 6,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    flexShrink: 1,
    width: '65%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 160,
    paddingHorizontal: 30,
  },
  emptyImage: {
    width: 300,
    height: 300,
  },
});