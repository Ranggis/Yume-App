import React, { useEffect, useRef } from 'react';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onFinish?: () => void;
}

const PaymentSuccessModal: React.FC<Props> = ({
  visible,
  onClose,
  onConfirm,
  onFinish,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // --- Animasi masuk ---
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible, fadeAnim, scaleAnim]);

  // --- Tombol OK ditekan ---
  const handlePress = () => {
    // Jalankan animasi keluar
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Setelah animasi selesai, baru eksekusi callback
      if (onConfirm) onConfirm();
      if (onFinish) onFinish();
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.iconWrapper}>
            <IconFA name="crown" size={36} color="#fff" />
          </View>

          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.message}>
            You have successfully subscribed 1 month premium. Enjoy the benefits!
          </Text>

          <TouchableOpacity onPress={handlePress} style={styles.okButton} activeOpacity={0.8}>
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default PaymentSuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00C853',
  },
  iconWrapper: {
    backgroundColor: '#00C853',
    borderRadius: 50,
    padding: 16,
    marginBottom: 20,
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  title: {
    color: '#00C853',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  message: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 30,
    lineHeight: 20,
  },
  okButton: {
    backgroundColor: '#00C853',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 35,
  },
  okText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
