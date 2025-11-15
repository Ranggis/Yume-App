import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const { height } = Dimensions.get("window");

interface DownloadProgressModalProps {
  visible: boolean;
  episodeTitle: string;
  progress: number;
  downloadedMB: number;
  totalMB: number;
  onHide: () => void;
}

const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({
  visible,
  episodeTitle,
  progress,
  downloadedMB,
  totalMB,
  onHide,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : height,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onHide}>
      <TouchableWithoutFeedback onPress={onHide}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.title}>Downloading</Text>
        <Text style={styles.subtitle}>{episodeTitle}</Text>

        <View style={styles.row}>
          <Text style={styles.size}>
            {downloadedMB.toFixed(1)} / {totalMB.toFixed(1)} MB
          </Text>
          <Text style={styles.percent}>{progress.toFixed(0)}%</Text>
        </View>

        <View style={styles.bar}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>

        <TouchableOpacity style={styles.hideBtn} onPress={onHide}>
          <Text style={styles.hideText}>Hide</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  container: {
    position: "absolute",
    bottom: height / 3,
    alignSelf: "center",
    width: "85%",
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 18,
  },
  title: { color: "#00C853", fontSize: 18, fontWeight: "bold", textAlign: "center" },
  subtitle: { color: "#ccc", textAlign: "center", marginTop: 5, marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  size: { color: "#bbb" },
  percent: { color: "#00C853", fontWeight: "bold" },
  bar: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 16,
  },
  fill: { height: "100%", backgroundColor: "#00C853" },
  hideBtn: {
    backgroundColor: "#222",
    paddingVertical: 12,
    borderRadius: 22,
  },
  hideText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});

export default DownloadProgressModal;
