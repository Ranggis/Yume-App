import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import HeaderBack from '../components/HeaderBack'; // komponen header kamu
import SetupCompleteModal from '../components/SetupCompleteModal'; // modal sukses

const rnBiometrics = new ReactNativeBiometrics();

const SetFingerprintScreen = ({ navigation }: any) => {
  const [showModal, setShowModal] = useState(false);
  const glowAnim = useRef(new Animated.Value(0.7)).current;

  // Animasi glow fingerprint
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleFingerprint = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        Alert.alert(
          'Fingerprint not available',
          'Your device does not support fingerprint authentication.'
        );
        return;
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to enable fingerprint login',
      });

      if (success) {
        setShowModal(true);
      } else {
        Alert.alert('Cancelled', 'Fingerprint setup was cancelled.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to authenticate fingerprint.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <HeaderBack title="Set Your Fingerprint" onBack={() => navigation.goBack()} />
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Add a fingerprint to make your account more secure.
      </Text>

      {/* Fingerprint Glow Animation */}
      <Animated.View
        style={[
          styles.glowContainer,
          { opacity: glowAnim, transform: [{ scale: glowAnim }] },
        ]}
      >
        <Image
          source={require('../../../assets/Fingerpint.png')}
          style={styles.fingerprint}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Helper Text */}
      <Text style={styles.helperText}>
        Please put your finger on the fingerprint scanner to get started.
      </Text>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleFingerprint}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Sukses */}
      <SetupCompleteModal
        visible={showModal}
        onFinish={() => {
          setShowModal(false);
          navigation.navigate('MainTabs');
        }}
      />
    </View>
  );
};

export default SetFingerprintScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerWrapper: {
    alignSelf: 'stretch', // biar header full width
    alignItems: 'flex-start', // biar di kiri
    marginBottom: 10,
  },
  subtitle: {
    color: '#999',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    lineHeight: 20,
  },
  fingerprint: {
    width: 180,
    height: 180,
    tintColor: '#00E676',
  },
  glowContainer: {
    backgroundColor: 'rgba(0,230,118,0.08)',
    borderRadius: 200,
    padding: 35,
    marginBottom: 50,
  },
  helperText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 20,
    marginBottom: 100,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  skipButton: {
    backgroundColor: '#222',
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  continueButton: {
    backgroundColor: '#00E676',
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#00E676',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  skipText: {
    color: '#ccc',
    fontWeight: '600',
    fontSize: 15,
  },
  continueText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
});
