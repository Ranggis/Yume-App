import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// IMPORT API
import { getPopularAnime } from '../../api/anilist';

export default function TopHitsScreen({ navigation }: any) {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // LOAD DATA DARI API
  useEffect(() => {
    async function load() {
      try {
        const data = await getPopularAnime(); 
        setAnimeList(data.map(transform));
      } catch (error) {
        console.log('API error:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // KONVERSI DATA API KE FORMAT UI KAMU
  const transform = (media: any) => ({
    id: media.id.toString(),
    title: media.title.english || media.title.romaji,
    year: media.seasonYear || 'Unknown',
    country: 'Japan',
    genres: media.genres?.slice(0, 3).join(', ') || 'Unknown',
    rating: media.averageScore ? media.averageScore / 10 : 8.5,
    image: media.coverImage?.extraLarge,
    inList: false,
  });

  // 🔥 Toggle My List (SAMAIN KAYAK ReleaseCalendar)
  const toggleMyList = (id: string) => {
    setAnimeList(prev =>
      prev.map(anime =>
        anime.id === id ? { ...anime, inList: !anime.inList } : anime
      )
    );
  };

  const renderAnime = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>

        <Text style={styles.meta}>
          {item.year} | {item.country}
        </Text>

        <Text style={styles.genres} numberOfLines={2}>
          Genre: {item.genres}
        </Text>

        {/* 🔥 MY LIST BUTTON (SUDAH SAMA PERSIS UKURANNYA) */}
        <TouchableOpacity
          onPress={() => toggleMyList(item.id)}
          style={[
            styles.myListButton,
            item.inList ? styles.inListBtn : styles.addListBtn,
          ]}
        >
          <Icon
            name={item.inList ? 'checkmark' : 'add'}
            size={14}
            color={item.inList ? '#00C853' : '#fff'}
          />

          <Text
            style={[
              styles.myListText,
              item.inList ? styles.inListText : styles.addListText,
            ]}
          >
            {item.inList ? 'My List' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Hits Anime</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen' as never)}>
          <Icon name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* LOADING */}
      {loading ? (
        <ActivityIndicator size="large" color="#00C853" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={animeList}
          renderItem={renderAnime}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 20,
    backgroundColor: '#0D0D0D',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: -120,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
  },
  image: {
    width: 90,
    height: 120,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingBadge: {
    backgroundColor: '#00C853',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    flexShrink: 1,
  },
  meta: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
  },
  genres: {
    color: '#ccc',
    fontSize: 11,
    marginBottom: 10,
  },

  /* 🚀 BUTTON DI SAMA-IN UKURAN DENGAN RELEASECALENDAR */
  myListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: 70,            
    height: 28,           
    borderRadius: 25,     
    borderWidth: 1,
    marginTop: 6,
  },

  addListBtn: {
    backgroundColor: '#00C853',
    borderColor: '#00C853',
  },
  inListBtn: {
    backgroundColor: 'transparent',
    borderColor: '#00C853',
  },

  myListText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  addListText: {
    color: '#fff',
  },
  inListText: {
    color: '#00C853',
  },
});