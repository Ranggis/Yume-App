import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";

import {
  getAnimeEpisodes,
  getEpisodeStream,
} from "../../api/animeVideo";

const { width, height } = Dimensions.get("window");

export default function VideoPlayerScreen({ route, navigation }: any) {
  const { slug, animeTitle } = route.params;

  const videoRef = useRef<any>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showEpisodes, setShowEpisodes] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    loadEpisodes();
  }, []);

  // FIX: Episode Drawer animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showEpisodes ? 0 : width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showEpisodes]);

  const loadEpisodes = async () => {
    try {
      setLoading(true);

      const eps = await getAnimeEpisodes(slug);
      setEpisodes(eps);

      if (eps.length > 0) playEpisode(0, eps);
    } catch (err) {
      console.log("Failed load episodes:", err);
    }
  };

  const playEpisode = async (index: number, list?: any[]) => {
    try {
      setLoading(true);

      const epList = list || episodes;
      setCurrentEpisodeIndex(index);

      const ep = epList[index];
      if (!ep) return;

      const stream = await getEpisodeStream(ep.id);

      if (stream) setVideoUrl(stream);
      else console.log("No stream found");
    } catch (err) {
      console.log("Failed play episode:", err);
    } finally {
      setProgress(0);
      setLoading(false);
    }
  };

  const handleProgress = (data: any) => {
    setProgress(data.currentTime);
    setDuration(data.seekableDuration || duration);
  };

  return (
    <View style={styles.container}>
      {videoUrl && (
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          resizeMode="cover"
          paused={paused}
          onLoad={(meta) => setDuration(meta.duration)}
          onProgress={handleProgress}
          style={styles.video}
        />
      )}

      {loading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Overlay & Controls */}
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>{animeTitle}</Text>

          <TouchableOpacity onPress={() => setShowEpisodes(true)}>
            <Icon name="albums-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={() => videoRef.current?.seek(progress - 10)}>
            <Icon name="play-back" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setPaused(!paused)}>
            <Icon
              name={paused ? "play-circle" : "pause-circle"}
              size={60}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => videoRef.current?.seek(progress + 10)}>
            <Icon name="play-forward" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* EPISODE DRAWER FIXED */}
      <Animated.View style={[styles.episodeDrawer, { right: slideAnim }]}>
        <View style={styles.episodeHeader}>
          <TouchableOpacity onPress={() => setShowEpisodes(false)}>
            <Icon name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.episodeTitle}>Episodes</Text>
        </View>

        <FlatList
          data={episodes}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.episodeItem}
              onPress={() => playEpisode(index)}
            >
              <Text style={styles.epName}>{item.title}</Text>
              {index === currentEpisodeIndex && (
                <View style={styles.epProgress} />
              )}
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  video: { width: "100%", height: "100%" },
  loadingWrapper: {
    position: "absolute",
    top: height * 0.4,
    left: width * 0.45,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 35,
  },
  header: {
    marginTop: 40,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { color: "#fff", fontSize: 14 },
  controlsRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  episodeDrawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.55,
    backgroundColor: "#111",
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  episodeHeader: { flexDirection: "row", alignItems: "center" },
  episodeTitle: { color: "#fff", marginLeft: 10 },
  episodeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  epName: { color: "#fff" },
  epProgress: { height: 2, backgroundColor: "#0f0", marginTop: 3 },
});
