import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface DeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
  anime?: {
    title: string;
    episode: string;
    image: string;
    size: string;
  };
}

const DeleteDownloadModal: React.FC<DeleteModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  anime,
}) => {
  if (!anime) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Garis kecil di atas */}
          <View style={styles.handle} />

          {/* Title */}
          <Text style={styles.deleteTitle}>Delete</Text>
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.confirmText}>
            Are you sure you want to delete this download?
          </Text>

          {/* Anime Info */}
          <View style={styles.animeRow}>
            <Image source={{ uri: anime.image }} style={styles.thumbnail} />
            <View style={styles.animeInfo}>
              <Text numberOfLines={1} style={styles.animeTitle}>
                {anime.title}
              </Text>
              <Text style={styles.episode}>{anime.episode}</Text>
              <View style={styles.sizeBadge}>
                <Text style={styles.sizeText}>{anime.size}</Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
              <Text style={styles.deleteText}>Yes, Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteDownloadModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    width: width,
    backgroundColor: '#151515',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 45,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333',
    marginBottom: 12,
  },
  deleteTitle: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#222',
    marginBottom: 18,
  },
  confirmText: {
    color: '#E0E0E0',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  animeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 30,
  },
  thumbnail: {
    width: 85,
    height: 55,
    borderRadius: 10,
  },
  animeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  animeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  episode: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  sizeBadge: {
    backgroundColor: '#003d1b',
    alignSelf: 'flex-start',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sizeText: {
    color: '#00C853',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    paddingVertical: 14,
    borderRadius: 12,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#00C853',
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
  deleteText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
});
