// src/screens/anime_details/AnimeDetailScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  ActivityIndicator,
  Dimensions,
  ListRenderItem,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";

import { jikanAnimeById, jikanAnimeByGenre } from "../../api/jikan";

// ======== PLAYER IMPORTS (FINAL) ==========
import Video from "react-native-video";
import {
  convertTitleToSlug,
  getAnimeEpisodes as apiGetEpisodes,
  getEpisodeStream,
} from "../../api/animeVideo";
// ==========================================

import DownloadModal from "../components/DownloadModal";
import ShareModal from "../components/ShareModal";
import DownloadProgressModal from "../components/DownloadProgressModal";
import DownloadManager, { QueueItem } from "../../manager/DownloadManager";

import { useComments } from "../../Context/CommentContext";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* TYPES */
interface Genre {
  mal_id: number;
  name: string;
}
interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  score?: number;
  year?: number;
  type?: string;
  rating?: string;
  episodes?: number;
  images: { jpg: { large_image_url: string } };
  genres: Genre[];
}
interface EpisodeItem {
  id: string;
  title: string;
  image: string;
}
interface RecommendItem {
  id: string | number;
  title: string;
  image: string;
  score?: number;
}

export default function AnimeDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { animeId } = route.params as { animeId: number };

  const [detail, setDetail] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendItem[]>([]);
  const [activeTab, setActiveTab] = useState<"more" | "comments">("more");

  const [descExpanded, setDescExpanded] = useState(false);
  const { comments, addComment } = useComments();
  const [newComment, setNewComment] = useState("");

  /* Modals */
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  /* Download Progress */
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressEpisodeTitle, setProgressEpisodeTitle] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedMB, setDownloadedMB] = useState(0);
  const [totalMB, setTotalMB] = useState(150);
  const [progressHidden, setProgressHidden] = useState(false);

  /* Animation */
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tabTranslate = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // PLAYER STATES
  // =====================================================
  const [playerVisible, setPlayerVisible] = useState(false);
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerPaused, setPlayerPaused] = useState(false);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(1);
  const [playerEpisodes, setPlayerEpisodes] = useState<any[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const playerRef = useRef<any>(null);

  // =====================================================
  // LOAD DETAIL
  // =====================================================
  useEffect(() => {
    loadDetail();
  }, [animeId]);

  const loadDetail = async () => {
    setLoading(true);

    try {
      const res: Anime = await jikanAnimeById(animeId);
      setDetail(res);

      const epCount = res.episodes ?? 12;
      setEpisodes(
        Array.from({ length: epCount }).map((_, i) => ({
          id: `${animeId}-ep-${i + 1}`,
          title: `Episode ${i + 1}`,
          image: res.images.jpg.large_image_url,
        }))
      );

      if (res.genres?.length > 0) {
        const g = res.genres[0].mal_id;
        const list: Anime[] = await jikanAnimeByGenre(g);

        setRecommendations(
          list
            .filter((a) => a.mal_id !== animeId)
            .slice(0, 20)
            .map((a) => ({
              id: a.mal_id,
              title: a.title,
              image: a.images.jpg.large_image_url,
              score: a.score,
            }))
        );
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  // =====================================================
  // TAB SWITCH
  // =====================================================
  const switchTab = (tab: "more" | "comments") => {
    if (activeTab === tab) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });

    Animated.spring(tabTranslate, {
      toValue: tab === "more" ? 0 : tabWidth,
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  };

  // =====================================================
  // PLAY HANDLERS (MAIN)
  // =====================================================
  const handlePlayMain = async () => {
    if (!detail) return;

    const slug = convertTitleToSlug(detail.title);
    await startPlayer(slug, 1);
  };

  // =====================================================
  // PLAY FROM EPISODE ITEM
  // =====================================================
  const handlePlayEpisodeItem = async (item: EpisodeItem) => {
    const num = Number(item.title.replace(/\D+/g, "")) || 1;
    const slug = convertTitleToSlug(detail!.title);
    await startPlayer(slug, num);
  };

  // =====================================================
  // START PLAYER
  // =====================================================
  const startPlayer = async (slug: string, episodeNum: number) => {
    setPlayerVisible(true);
    setPlayerLoading(true);
    setPlayerUrl(null);

    try {
      const eps = await apiGetEpisodes(slug);
      setPlayerEpisodes(eps);

      const target =
        eps.find((e: any) => Number(e.number) === Number(episodeNum)) || eps[0];

      const idx = eps.findIndex((e: any) => e.id === target.id);

      setPlayerIndex(idx);

      const stream = await getEpisodeStream(target.id);
      setPlayerUrl(stream);
    } catch {
      setPlayerUrl(null);
    }

    setPlayerLoading(false);
    setPlayerPaused(false);
  };

  // =====================================================
  // PLAYER CONTROLS
  // =====================================================
  const onPlayerProgress = (data: any) => {
    setPlayerProgress(data.currentTime);
    setPlayerDuration(data.seekableDuration || playerDuration);
  };

  const playNext = async () => {
    const next = playerIndex + 1;
    if (next >= playerEpisodes.length) return;

    setPlayerLoading(true);
    const ep = playerEpisodes[next];
    const s = await getEpisodeStream(ep.id);

    if (s) {
      setPlayerIndex(next);
      setPlayerUrl(s);
      setPlayerProgress(0);
    }
    setPlayerLoading(false);
  };

  const playPrev = async () => {
    const prev = playerIndex - 1;
    if (prev < 0) return;

    setPlayerLoading(true);
    const ep = playerEpisodes[prev];
    const s = await getEpisodeStream(ep.id);

    if (s) {
      setPlayerIndex(prev);
      setPlayerUrl(s);
      setPlayerProgress(0);
    }
    setPlayerLoading(false);
  };

  // =====================================================
  // RENDER EPISODE (LIST)
  // =====================================================
  const renderEpisode: ListRenderItem<EpisodeItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.epCard}
      onPress={() => handlePlayEpisodeItem(item)}
    >
      <Image source={{ uri: item.image }} style={styles.epImage} />
      <View style={styles.epPlay}>
        <Icon name="play-circle" size={28} color="#fff" />
      </View>
      <Text style={styles.epLabel}>{item.title}</Text>
    </TouchableOpacity>
  );

  // =====================================================
  // RENDER RECOMMENDATIONS
  // =====================================================
  const renderRecommend: ListRenderItem<RecommendItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.recCard}
      onPress={() =>
        navigation.push("AnimeDetailScreen", {
          animeId: Number(item.id),
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.recImage} />
      <View style={styles.recBadge}>
        <Text style={styles.recBadgeText}>
          {item.score ? item.score.toFixed(1) : "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // =====================================================
  // HEADER UI
  // =====================================================
  const Header = useCallback(() => {
    if (!detail) return null;

    return (
      <View style={{ backgroundColor: "#0D0D0D" }}>
        <ImageBackground
          source={{ uri: detail.images.jpg.large_image_url }}
          style={styles.headerImage}
        >
          <View style={styles.headerOverlay} />
        </ImageBackground>

        <View style={styles.topIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={{ marginRight: 12 }}>
              <Icon name="bookmark-outline" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowShareModal(true)}>
              <Icon name="share-social-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.title}>{detail.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Icon name="star" size={14} color="#00C853" />
              <Text style={styles.metaText}>
                {detail.score?.toFixed(1) ?? "N/A"}
              </Text>
            </View>

            <View style={styles.metaChip}>
              <Text style={styles.metaText}>{detail.year ?? "—"}</Text>
            </View>

            <View style={styles.metaChip}>
              <Text style={styles.metaText}>{detail.rating ?? "—"}</Text>
            </View>

            <View style={styles.metaChip}>
              <Text style={styles.metaText}>{detail.type ?? "TV"}</Text>
            </View>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.playBtn} onPress={handlePlayMain}>
              <Icon name="play" size={18} color="#fff" />
              <Text style={styles.playBtnText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => {
                setProgressHidden(false);
                setShowDownloadModal(true);
              }}
            >
              <Icon name="download-outline" size={18} color="#00C853" />
              <Text style={styles.downloadBtnText}>Download</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.genreText}>
            {detail.genres.map((g) => g.name).join(", ")}
          </Text>

          <View style={{ marginTop: 6 }}>
            <Text
              style={styles.synopsis}
              numberOfLines={descExpanded ? undefined : 4}
            >
              {detail.synopsis}
            </Text>

            {detail.synopsis.length > 120 && (
              <TouchableOpacity onPress={() => setDescExpanded(!descExpanded)}>
                <Text style={styles.viewMore}>
                  {descExpanded ? "View Less" : "View More"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Episodes</Text>
        </View>

        <FlatList
          data={episodes}
          horizontal
          renderItem={renderEpisode}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />

        <View style={styles.tabContainer}>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={styles.tabTouch}
              onLayout={(e) => setTabWidth(e.nativeEvent.layout.width)}
              onPress={() => switchTab("more")}
            >
              <Text
                style={[styles.tab, activeTab === "more" && styles.tabActive]}
              >
                More Like This
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabTouch}
              onPress={() => switchTab("comments")}
            >
              <Text
                style={[
                  styles.tab,
                  activeTab === "comments" && styles.tabActive,
                ]}
              >
                Comments ({comments.length})
              </Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.underline,
              { width: tabWidth, transform: [{ translateX: tabTranslate }] },
            ]}
          />
        </View>

        {activeTab === "comments" && (
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Comments ({comments.length})
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("CommentsScreen")}
              >
                <Text style={{ color: "#00C853", fontWeight: "600" }}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {comments.length > 0 ? (
              <View style={styles.commentBox}>
                <Image
                  source={{ uri: comments[0].avatar }}
                  style={styles.commentAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentUser}>{comments[0].user}</Text>
                  <Text style={styles.commentText}>{comments[0].text}</Text>
                </View>
              </View>
            ) : (
              <Text style={{ color: "#777" }}>No comments yet.</Text>
            )}
          </View>
        )}
      </View>
    );
  }, [
    detail,
    episodes,
    comments.length,
    activeTab,
    tabWidth,
    descExpanded,
  ]);

  // =====================================================
  // LOADING
  // =====================================================
  if (loading || !detail) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  // =====================================================
  // MAIN RENDER
  // =====================================================
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList<any>
        key={activeTab}
        data={activeTab === "more" ? recommendations : []}
        renderItem={activeTab === "more" ? (renderRecommend as any) : undefined}
        keyExtractor={(item) => String(item.id)}
        numColumns={activeTab === "more" ? 2 : 1}
        columnWrapperStyle={
          activeTab === "more" ? { justifyContent: "space-between" } : undefined
        }
        ListHeaderComponent={() => <Header />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: "#0D0D0D",
          paddingBottom: 50,
        }}
      />

      {/* =====================================================
           PLAYER OVERLAY (FINAL)
      ===================================================== */}
      {playerVisible && (
        <View style={styles.playerOverlay}>
          <View style={styles.playerContainer}>
            <TouchableOpacity
              style={styles.playerClose}
              onPress={() => {
                setPlayerVisible(false);
                setPlayerUrl(null);
                setPlayerEpisodes([]);
              }}
            >
              <Icon name="close" size={22} color="#fff" />
            </TouchableOpacity>

            <View style={styles.playerVideoWrapper}>
              {playerLoading && (
                <View style={styles.playerCentered}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}

              {!playerLoading && !playerUrl && (
                <View style={styles.playerCentered}>
                  <Text style={{ color: "#fff" }}>
                    Stream not available.
                  </Text>
                </View>
              )}

              {playerUrl && (
                <Video
                  ref={playerRef}
                  source={{ uri: playerUrl }}
                  resizeMode="contain"
                  paused={playerPaused}
                  onProgress={onPlayerProgress}
                  onLoad={(meta) => setPlayerDuration(meta.duration)}
                  style={styles.playerVideo}
                />
              )}
            </View>

            <View style={styles.playerControls}>
              <TouchableOpacity onPress={playPrev}>
                <Icon name="play-back" size={30} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPlayerPaused((p) => !p)}
                style={{ marginHorizontal: 20 }}
              >
                <Icon
                  name={playerPaused ? "play-circle" : "pause-circle"}
                  size={48}
                  color="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={playNext}>
                <Icon name="play-forward" size={30} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.playerProgressRow}>
              <Text style={styles.playerTimeText}>
                {Math.floor(playerProgress / 60)}:
                {Math.floor(playerProgress % 60)
                  .toString()
                  .padStart(2, "0")}
              </Text>

              <View style={styles.playerProgressBar}>
                <View
                  style={[
                    styles.playerProgressFill,
                    {
                      width: `${
                        (playerProgress / playerDuration) * 100
                      }%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.playerTimeText}>
                {Math.floor(playerDuration / 60)}:
                {Math.floor(playerDuration % 60)
                  .toString()
                  .padStart(2, "0")}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* =====================================================
           MODALS
      ===================================================== */}
      <DownloadModal
        visible={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        episodes={episodes}
        onDownload={(eps) => {
          if (!detail) return;

          const queue: QueueItem[] = eps.map((e) => ({
            id: `${detail.mal_id}-${e}-${Date.now()}`,
            title: e,
            sizeMB: 150,
            progress: 0,
            status: "pending" as const,
            image: detail.images.jpg.large_image_url,
          }));

          DownloadManager.addToQueue(queue);
          setProgressHidden(false);
          setShowProgressModal(true);
          setShowDownloadModal(false);
        }}
      />

      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      <DownloadProgressModal
        visible={showProgressModal}
        episodeTitle={progressEpisodeTitle}
        progress={downloadProgress}
        downloadedMB={downloadedMB}
        totalMB={totalMB}
        onHide={() => {
          setProgressHidden(true);
          setShowProgressModal(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

/* =====================================================
   STYLES (TIDAK DIUBAH)
===================================================== */
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
  },

  headerImage: {
    width: "100%",
    height: 270,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  topIcons: {
    position: "absolute",
    top: 40,
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoBox: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  metaText: {
    color: "#eee",
    fontSize: 12,
    marginLeft: 4,
  },

  btnRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  playBtn: {
    flexDirection: "row",
    backgroundColor: "#00C853",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignItems: "center",
    marginRight: 12,
  },
  playBtnText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },

  downloadBtn: {
    flexDirection: "row",
    borderColor: "#00C853",
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
  },
  downloadBtnText: {
    color: "#00C853",
    fontWeight: "700",
    marginLeft: 8,
  },

  genreText: {
    color: "#aaa",
    marginTop: 4,
  },
  synopsis: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 21,
  },
  viewMore: {
    color: "#00C853",
    marginTop: 6,
    fontWeight: "600",
    fontSize: 14,
  },

  sectionHead: {
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  epCard: {
    width: 150,
    marginRight: 12,
  },
  epImage: {
    width: 150,
    height: 90,
    borderRadius: 12,
  },
  epPlay: {
    position: "absolute",
    top: 28,
    left: 60,
  },
  epLabel: {
    color: "#ddd",
    textAlign: "center",
    marginTop: 5,
  },

  tabContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabTouch: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tab: {
    color: "#777",
    fontSize: 15,
  },
  tabActive: {
    color: "#00C853",
    fontWeight: "700",
  },
  underline: {
    height: 4,
    backgroundColor: "#00C853",
    marginTop: 8,
    borderRadius: 4,
  },

  recCard: {
    width: "48%",
    aspectRatio: 0.7,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  recImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  recBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#00C853",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 6,
  },
  recBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  commentBox: {
    flexDirection: "row",
    padding: 16,
    borderBottomColor: "#1A1A1A",
    borderBottomWidth: 1,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 12,
  },
  commentUser: {
    color: "#00C853",
    fontWeight: "700",
  },
  commentText: {
    color: "#ccc",
  },

  commentInputLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  commentInputRow: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  commentInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 8,
  },

  // ===========================
  // PLAYER STYLES
  // ===========================
  playerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  playerContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  playerClose: {
    position: "absolute",
    top: 48,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 8,
  },
  playerVideoWrapper: {
    width: "100%",
    height: (SCREEN_W * 9) / 16,
    marginTop: 80,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  playerVideo: {
    width: "100%",
    height: "100%",
  },
  playerCentered: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  playerControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  playerProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginTop: 14,
  },
  playerProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#222",
    marginHorizontal: 12,
    borderRadius: 4,
  },
  playerProgressFill: {
    height: 4,
    backgroundColor: "#00C853",
    borderRadius: 4,
  },
  playerTimeText: {
    color: "#fff",
    fontSize: 12,
  },
});
