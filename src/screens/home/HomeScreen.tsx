import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// API
import { getTrendingAnime } from '../../api/anilist';
import { jikanSeasonNow } from '../../api/jikan';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, "MainTabs">;

// Helper convert title -> Jikan mal_id
async function searchJikanId(title: string) {
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`
    );
    const json = await res.json();
    return json.data?.[0]?.mal_id || null;
  } catch (err) {
    console.log('searchJikanId error:', err);
    return null;
  }
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavProp>();

  const [banner, setBanner] = useState<any>(null);
  const [topHits, setTopHits] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAPI();
  }, []);

  const loadAPI = async () => {
    setLoading(true);
    try {
      const trending = await getTrendingAnime();
      const seasonNow = await jikanSeasonNow();

      setBanner(trending[0]);

      setTopHits(
        trending.map((a: any) => ({
          id: a.id.toString(),
          title: a.title.english || a.title.romaji,
          rating: (a.averageScore || 80) / 10,
          image:
            (a.coverImage &&
              (a.coverImage.extraLarge || a.coverImage.large)) || '',
        }))
      );

      setNewReleases(
        seasonNow.map((a: any) => ({
          id: `mal_${a.mal_id}`,
          title: a.title,
          rating: a.score || 0,
          image: a.images?.jpg?.image_url || '',
          mal_id: a.mal_id,
        }))
      );
    } catch (err) {
      console.log('HomeScreen API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (item: any) => {
    try {
      let malId: number | null = null;

      if (typeof item.id === 'string' && item.id.startsWith('mal_')) {
        malId = item.mal_id || parseInt(item.id.replace('mal_', ''), 10);
      } else {
        malId = await searchJikanId(item.title);
      }

      if (!malId) {
        console.log('MAL ID not found for:', item.title);
        return;
      }

      navigation.navigate("AnimeDetailScreen", { animeId: malId });
    } catch (err) {
      console.log('handleOpenDetail error:', err);
    }
  };

  // ============================================================
  // PLAY BUTTON BANNER → INTEGRASI ke VideoPlayerScreen
  // ============================================================
  const handlePlayBanner = async () => {
    try {
      if (!banner) return;

      const title =
        banner?.title?.english ||
        banner?.title?.romaji ||
        banner?.title?.native ||
        "";

      const malId = await searchJikanId(title);

      if (!malId) {
        console.log("Tidak dapat menemukan MAL ID untuk banner");
        return;
      }

      navigation.navigate("VideoPlayerScreen", {
        animeId: malId,
        animeTitle: title,
      });
    } catch (err) {
      console.log("handlePlayBanner error:", err);
    }
  };

  // Rendering card
  const renderAnimeCard = (item: any) => (
    <TouchableOpacity
      style={styles.animeCard}
      onPress={() => handleOpenDetail(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.animeImage} />
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
        />

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('SearchScreen' as never)}
          >
            <Icon name="search-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('NotificationScreen' as never)}
          >
            <Icon name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* BANNER */}
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri:
                banner?.coverImage?.extraLarge ||
                banner?.coverImage?.large ||
                '',
            }}
            style={styles.bannerImage}
          />

          <View style={styles.overlay} />

          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>
              {banner?.title?.english || banner?.title?.romaji || ''}
            </Text>

            <Text style={styles.bannerGenres}>
              {banner?.genres?.join(', ') || ''}
            </Text>

            <View style={styles.buttonRow}>
              {/* ============================================
                 FIX PLAY BUTTON → TERINTEGRASI BENERAN
                 ============================================ */}
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayBanner}
              >
                <Icon name="play" size={20} color="#fff" />
                <Text style={styles.playText}>Play</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.myListButton}>
                <Icon name="add" size={20} color="#fff" />
                <Text style={styles.myListText}>My List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* TOP HITS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Hits Anime</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('TopHitsScreen' as never)}
          >
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={topHits}
          renderItem={({ item }) => renderAnimeCard(item)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          nestedScrollEnabled={true}
        />

        {/* NEW RELEASES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Episode Releases</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('NewEpisodesScreen' as never)
            }
          >
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={newReleases}
          renderItem={({ item }) => renderAnimeCard(item)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          nestedScrollEnabled={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: '#0D0D0D', flex: 1 },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { width: 40, height: 30, tintColor: '#00C853' },
  headerIcons: { flexDirection: 'row', gap: 16 },
  iconButton: { padding: 5 },

  bannerContainer: { position: 'relative' },
  bannerImage: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerContent: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  bannerGenres: { color: '#ccc', fontSize: 12, marginTop: 4 },

  buttonRow: { flexDirection: 'row', marginTop: 12, gap: 10 },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#00C853',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  playText: { color: '#fff', marginLeft: 6, fontWeight: 'bold' },
  myListButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  myListText: { color: '#fff', marginLeft: 6, fontWeight: 'bold' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 25,
    alignItems: 'center',
  },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  seeAll: { color: '#00C853', fontSize: 13 },

  horizontalList: { paddingHorizontal: 16, marginTop: 10 },

  animeCard: { marginRight: 14, position: 'relative' },
  animeImage: { width: 120, height: 160, borderRadius: 10 },

  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00C853',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  ratingText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
