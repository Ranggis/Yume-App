import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { height } = Dimensions.get("window");

interface EpisodeItem {
  id: string;
  title: string;
  image: string;
}

interface DownloadModalProps {
  visible: boolean;
  onClose: () => void;
  episodes: EpisodeItem[];
  onDownload: (episodes: string[], quality: string) => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  visible,
  onClose,
  episodes,
  onDownload,
}) => {
  const [selectedEpisodes, setSelectedEpisodes] = useState<string[]>([]);
  const [quality, setQuality] = useState<string>("720p");
  const [showQualityList, setShowQualityList] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const qualities = ["360p", "480p", "720p", "1080p"];

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();

      // Reset modal state ketika ditutup
      setSelectedEpisodes([]);
      setShowQualityList(false);
    }
  }, [visible]);

  const toggleEpisode = (title: string) => {
    if (selectedEpisodes.includes(title)) {
      setSelectedEpisodes(selectedEpisodes.filter((t) => t !== title));
    } else {
      setSelectedEpisodes([...selectedEpisodes, title]);
    }
  };

  const handleDownload = () => {
    if (selectedEpisodes.length === 0) return;
    onDownload(selectedEpisodes, quality);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>Download</Text>

        {/* Episodes Label */}
        <View style={styles.rowBetween}>
          <Text style={styles.subtitle}>Episodes</Text>
          <TouchableOpacity
            style={styles.qualitySelector}
            onPress={() => setShowQualityList(!showQualityList)}
          >
            <Text style={styles.qualityText}>{quality}</Text>
            <Icon
              name={showQualityList ? "chevron-up" : "chevron-down"}
              size={18}
              color="#00C853"
            />
          </TouchableOpacity>
        </View>

        {/* Episode Slider */}
        <FlatList
          data={episodes}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 6 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.episodeSlideCard}
              onPress={() => toggleEpisode(item.title)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.image }} style={styles.episodeSlideImage} />

              {selectedEpisodes.includes(item.title) && (
                <View style={styles.checkedOverlaySlide}>
                  <Icon name="checkmark" size={22} color="#00C853" />
                </View>
              )}

              <Text style={styles.episodeSlideTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Quality Dropdown */}
        {showQualityList && (
          <View style={styles.qualityDropdown}>
            {qualities.map((q) => (
              <TouchableOpacity
                key={q}
                onPress={() => {
                  setQuality(q);
                  setShowQualityList(false);
                }}
              >
                <Text
                  style={[
                    styles.qualityOption,
                    q === quality && styles.selectedQuality,
                  ]}
                >
                  {q}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.downloadButton,
              { opacity: selectedEpisodes.length === 0 ? 0.5 : 1 },
            ]}
            disabled={selectedEpisodes.length === 0}
            onPress={handleDownload}
          >
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#111",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    color: "#aaa",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 35,
  },

  /* EPISODE SLIDER */
  episodeSlideCard: {
    width: 140,
    marginRight: 14,
    position: "relative",
  },
  episodeSlideImage: {
    width: "100%",
    height: 85,
    borderRadius: 10,
  },
  checkedOverlaySlide: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 3,
  },
  episodeSlideTitle: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },

  /* QUALITY */
  qualitySelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00C853",
  },
  qualityText: {
    color: "#00C853",
    marginRight: 6,
    fontSize: 14,
  },
  qualityDropdown: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  qualityOption: {
    color: "#ccc",
    textAlign: "center",
    paddingVertical: 6,
    fontSize: 14,
  },
  selectedQuality: {
    color: "#00C853",
    fontWeight: "bold",
  },

  /* BUTTONS */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop:15
  },
  cancelButton: {
    backgroundColor: "#222",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 35,
  },
  downloadButton: {
    backgroundColor: "#00C853",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 35,
  },
  cancelText: { color: "#fff", fontWeight: "600" },
  downloadText: { color: "#fff", fontWeight: "600" },
});

export default DownloadModal;
