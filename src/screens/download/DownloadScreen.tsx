import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DeleteDownloadModal from "../components/DeleteDownloadModal";
import { useNavigation } from "@react-navigation/native";

import DownloadManager, { QueueItem } from "../../manager/DownloadManager";

const DownloadScreen: React.FC = () => {
  const navigation = useNavigation();

  const [downloads, setDownloads] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAnime, setSelectedAnime] = useState<QueueItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  /** LISTENER QUEUE */
  useEffect(() => {
    const listener = (queue: QueueItem[]) => setDownloads([...queue]);

    DownloadManager.on("update", listener);
    setDownloads(DownloadManager.getQueue());
    setLoading(false);

    return () => DownloadManager.off("update", listener);
  }, []);

  /** CLICK DELETE */
  const handleDeletePress = (anime: QueueItem) => {
    setSelectedAnime(anime);
    setShowModal(true);
  };

  /** CONFIRM DELETE */
  const confirmDelete = () => {
    if (selectedAnime) {
      DownloadManager.removeFromQueue(selectedAnime.id);
    }
    setSelectedAnime(null);
    setShowModal(false);
  };

  /** LOADING */
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.headerLogo}
          />
          <Text style={styles.headerTitle}>Download</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("SearchScreen" as never)}>
          <Icon name="search-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* EMPTY */}
      {downloads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../../assets/EmptyDownload.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
        </View>
      ) : (
        <FlatList
          data={downloads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.downloadRow}>
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{
                    uri:
                      item.image ||
                      "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png",
                  }}
                  style={styles.thumbnail}
                />

                {/* PROGRESS */}
                {item.status === "downloading" && (
                  <View style={styles.progressOverlay}>
                    <View
                      style={[styles.progressFill, { width: `${item.progress}%` }]}
                    />
                  </View>
                )}

                <Icon
                  name="play-circle"
                  size={30}
                  color="#fff"
                  style={styles.playIcon}
                />
              </View>

              <View style={styles.infoContainer}>
                <Text numberOfLines={1} style={styles.title}>
                  {item.title}
                </Text>

                <Text style={styles.episode}>
                  {item.status === "pending" && "Pending..."}
                  {item.status === "downloading" &&
                    `Downloading ${item.progress.toFixed(0)}%`}
                  {item.status === "completed" && "Completed"}
                </Text>

                <View style={styles.sizeBadge}>
                  <Text style={styles.sizeText}>{item.sizeMB} MB</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => handleDeletePress(item)}>
                <Icon name="trash-outline" size={22} color="#00C853" />
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* DELETE MODAL */}
      <DeleteDownloadModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={confirmDelete}
        onClose={() => setShowModal(false)}
        anime={
          selectedAnime
            ? {
                title: selectedAnime.title,
                episode: "Episode ?",
                image: selectedAnime.image,
                size: selectedAnime.sizeMB + " MB",
              }
            : undefined
        }
      />
    </View>
  );
};

export default DownloadScreen;

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  headerLeft: { flexDirection: "row", alignItems: "center" },

  headerLogo: {
    width: 40,
    height: 40,
    tintColor: "#00C853",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  emptyImage: { width: 330, height: 330 },

  downloadRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  thumbnailContainer: { position: "relative" },

  thumbnail: { width: 100, height: 65, borderRadius: 10 },

  /* PROGRESS BAR */
  progressOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 4,
    width: "100%",
    backgroundColor: "#222",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00C853",
  },

  playIcon: { position: "absolute", top: 18, left: 35 },

  infoContainer: { flex: 1, marginLeft: 12 },

  title: { color: "#fff", fontSize: 14, fontWeight: "600", marginBottom: 2 },

  episode: { color: "#ccc", fontSize: 12, marginBottom: 4 },

  sizeBadge: {
    backgroundColor: "#003d1b",
    alignSelf: "flex-start",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  sizeText: {
    color: "#00C853",
    fontSize: 12,
    fontWeight: "600",
  },
});
