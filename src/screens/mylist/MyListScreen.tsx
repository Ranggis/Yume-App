import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import { jikanTopAnime } from '../../api/jikan';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Anime {
  id: string;
  title: string;
  image: string;
  rating: number;
}

const MyListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [myList, setMyList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true); // <-- Tambahan

  useEffect(() => {
    loadMyListFromAPI();
  }, []);

  const loadMyListFromAPI = async () => {
    try {
      setLoading(true); // mulai loading

      const data = await jikanTopAnime();

      const formatted = data.slice(0, 10).map((item: any) => ({
        id: item.mal_id.toString(),
        title: item.title,
        image: item.images.jpg.image_url,
        rating: item.score || 8.5,
      }));

      setMyList(formatted);
    } catch (err) {
      console.log("MyList API Error:", err);
    } finally {
      setLoading(false); // selesai loading
    }
  };

  const renderAnimeCard = ({ item }: { item: Anime }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('AnimeDetailScreen', {
          animeId: Number(item.id),
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.poster} />

      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>My List</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <Icon name="search-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* LOADING */}
      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00C853" />
        </View>
      )}

      {/* EMPTY STATE */}
      {!loading && myList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../../assets/EmptyList.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>Your List is Empty</Text>
          <Text style={styles.emptyDesc}>
            It seems that you haven’t added any anime to the list
          </Text>
        </View>
      ) : null}

      {/* LIST */}
      {!loading && myList.length > 0 && (
        <FlatList
          data={myList}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={renderAnimeCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MyListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    tintColor: '#00C853',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 100,
    height: 100,
    tintColor: '#00C853',
    marginBottom: 20,
    opacity: 0.9,
  },
  emptyTitle: {
    color: '#00C853',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDesc: {
    color: '#ccc',
    fontSize: 13,
    textAlign: 'center',
    width: 250,
  },

  listContainer: {
    paddingBottom: 90,
  },
  card: {
    width: '48%',
    aspectRatio: 0.7,
    marginBottom: 15,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00C853',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  ratingText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
