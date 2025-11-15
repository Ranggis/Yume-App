import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const { height } = Dimensions.get('window');

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
}

const platforms = [
  { name: 'WhatsApp', icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' },
  { name: 'Twitter', icon: 'https://cdn-icons-png.flaticon.com/512/733/733579.png' },
  { name: 'Facebook', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' },
  { name: 'Instagram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png' },
  { name: 'Yahoo', icon: 'https://cdn-icons-png.flaticon.com/512/888/888859.png' },
  { name: 'Chat', icon: 'https://cdn-icons-png.flaticon.com/512/134/134914.png' },
  { name: 'WeChat', icon: 'https://cdn-icons-png.flaticon.com/512/888/888853.png' },
  { name: 'TikTok', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046125.png' },
];

const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
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
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: slideAnim }] },
        ]}>
        <Text style={styles.title}>Share to</Text>

        <View style={styles.grid}>
          {platforms.map((item, index) => (
            <TouchableOpacity key={index} style={styles.iconWrapper}>
              <Image source={{ uri: item.icon }} style={styles.icon} />
              <Text style={styles.label}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 18,
  },
  icon: { width: 46, height: 46, borderRadius: 23 },
  label: { color: '#fff', fontSize: 12, marginTop: 6, textAlign: 'center' },
});

export default ShareModal;
