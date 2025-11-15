import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// API
import { jikanSeasonNow } from '../../api/jikan';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function NewEpisodesScreen({ navigation }: any) {
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    loadAPI();
  }, []);

  const loadAPI = async () => {
    try {
      const data = await jikanSeasonNow();

      setEpisodes(
        data.map((a: any) => ({
          id: a.mal_id.toString(),
          title: a.title,
          episode: `Episode ${a.episodes ?? '?'}`,
          rating: a.score || 8.5,
          image: a.images.jpg.large_image_url,
        }))
      );
    } catch (err) {
      console.log("NewEpisodesScreen API Error:", err);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>

      <Text style={styles.episodeText}>{item.episode}</Text>
      <Text style={styles.titleText} numberOfLines={1}>
        {item.title}
      </Text>
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

        <Text style={styles.headerTitle}>New Episode Releases</Text>

        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen' as never)}>
          <Icon name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Grid List */}
      <FlatList
        data={episodes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
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
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: -75,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00C853',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  episodeText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 8,
  },
  titleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 8,
    marginBottom: 8,
  },
});
