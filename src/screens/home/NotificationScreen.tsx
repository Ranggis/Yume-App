import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// API
import { jikanRecentEpisodes } from '../../api/jikanNotifications';

export default function NotificationScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadAPI();
  }, []);

  const loadAPI = async () => {
    try {
      const data = await jikanRecentEpisodes();

      setNotifications(
        data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          episode: item.episode,
          date: item.date,
          image: item.image,
          tag: item.tag,
        }))
      );
    } catch (err) {
      console.log("Notification API Error:", err);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <TouchableOpacity style={styles.playButton}>
          <Icon name="play" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

        {item.episode ? (
          <Text style={styles.episode}>{item.episode}</Text>
        ) : (
          <Text style={styles.episode}>New Movie</Text>
        )}

        <View
          style={[
            styles.tag,
            {
              backgroundColor:
                item.tag === 'Update' ? '#00C853' : 'rgba(0,200,83,0.1)',
              borderColor: item.tag === 'Update' ? 'transparent' : '#00C853',
            },
          ]}
        >
          <Text
            style={[
              styles.tagText,
              { color: item.tag === 'Update' ? '#fff' : '#00C853' },
            ]}
          >
            {item.tag}
          </Text>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>{item.date}</Text>
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
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 14,
    padding: 10,
  },
  leftContent: {
    position: 'relative',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  playButton: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  episode: {
    color: '#ccc',
    fontSize: 12,
    marginVertical: 4,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { fontSize: 12, fontWeight: 'bold' },
  dateContainer: { alignItems: 'flex-end', justifyContent: 'flex-start' },
  date: { color: '#aaa', fontSize: 12 },
});
