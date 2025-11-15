import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface AnimeScheduleItem {
  id: string;
  time: string;
  title: string;
  episodes: number;
  image: string;
  inMyList: boolean;
}

async function fetchScheduleFromAPI(day: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/schedules/${day.toLowerCase()}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.log("Schedule API Error:", err);
    return [];
  }
}

export default function ReleaseCalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState<AnimeScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const convertDayToAPIKey = (index: number) => {
    const mapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return mapping[index];
  };

  useEffect(() => {
    loadSchedule();
  }, [selectedDate]);

  const loadSchedule = async () => {
    setLoading(true);
    fadeAnim.setValue(0);

    const dayKey = convertDayToAPIKey(selectedDate.getDay());
    const data = await fetchScheduleFromAPI(dayKey);

    const formatted = data.map((item: any, index: number): AnimeScheduleItem => ({
      id: item.mal_id + "_" + index,
      time: item.broadcast?.time || "Unknown",
      title: item.title,
      episodes: item.episodes || 1,
      image: item.images?.jpg?.image_url || "",
      inMyList: false,
    }));

    setSchedule(formatted);
    setLoading(false);

    fadeIn();
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  // 🔥 Toggle My List
  const toggleMyList = (id: string) => {
    setSchedule((prev) =>
      prev.map((anime) =>
        anime.id === id ? { ...anime, inMyList: !anime.inMyList } : anime
      )
    );
  };

  const generateWeekDays = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const renderSchedule = ({ item }: { item: AnimeScheduleItem }) => (
    <Animated.View style={[styles.scheduleItem, { opacity: fadeAnim }]}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.image }} style={styles.thumbnail} />
        <Icon name="play-circle" size={30} color="#fff" style={styles.playIcon} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.episode}>Episodes {item.episodes}</Text>
        <Text style={styles.time}>{item.time}</Text>

        {/* ⬇️ BUTTON + MY LIST Toggle */}
        <TouchableOpacity
          onPress={() => toggleMyList(item.id)}
          style={[
            styles.listButton,
            item.inMyList ? styles.inListButton : styles.addListButton,
          ]}
        >
          <Text
            style={[
              styles.listButtonText,
              item.inMyList && styles.listButtonTextInList,
            ]}
          >
            {item.inMyList ? '✓ My List' : '+ My List'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E0E" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.headerLogo}
          />
          <Text style={styles.headerTitle}>Release Calendar</Text>
        </View>
        <TouchableOpacity>
          <Icon name="ellipsis-horizontal" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* WEEK BAR */}
      <View style={styles.weekWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {generateWeekDays().map((day, index) => {
            const isSelected = day.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayItem, isSelected && styles.dayItemSelected]}
                onPress={() => setSelectedDate(day)}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                  {daysOfWeek[day.getDay()]}
                </Text>
                <Text style={[styles.dayDate, isSelected && styles.dayDateSelected]}>
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LOADING */}
      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00C853" />
        </View>
      )}

      {/* CONTENT */}
      {!loading && schedule.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../../assets/EmptyCalender.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
        </View>
      ) : !loading ? (
        <FlatList
          data={schedule}
          keyExtractor={(item) => item.id}
          renderItem={renderSchedule}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
            paddingTop: 20,
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0E0E', paddingHorizontal: 16, paddingTop: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 40, height: 40, tintColor: '#00C853' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 8 },

  weekWrapper: { marginBottom: 10 },

  dayItem: { alignItems: 'center', justifyContent: 'center', width: 45, height: 60, borderRadius: 34, backgroundColor: '#1A1A1A', marginRight: 10 },
  dayItemSelected: { backgroundColor: '#00C853' },
  dayLabel: { color: '#aaa', fontSize: 13, fontWeight: 'bold' },
  dayLabelSelected: { color: '#fff' },
  dayDate: { color: '#aaa', fontSize: 15, fontWeight: 'bold' },
  dayDateSelected: { color: '#fff' },

  scheduleItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  thumbnailContainer: { position: 'relative' },
  thumbnail: { width: 100, height: 65, borderRadius: 10 },
  playIcon: { position: 'absolute', top: 18, left: 35 },

  infoContainer: { flex: 1, marginLeft: 12 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600' },
  episode: { color: '#ccc', fontSize: 12 },
  time: { color: '#00C853', fontSize: 12, fontWeight: '600', marginBottom: 6 },

  listButton: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 25, borderWidth: 1, width: 70 },
  addListButton: { borderColor: '#00C853' },
  inListButton: { borderColor: '#00C853', backgroundColor: '#00C853' },
  listButtonText: { color: '#00C853', fontWeight: '600', fontSize: 12 },
  listButtonTextInList: { color: '#fff' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyImage: { width: 320, height: 320 },
});