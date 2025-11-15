import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import HeaderBack from '../components/HeaderBack'; // header universal kamu
import Ionicons from 'react-native-vector-icons/Ionicons';
import SetupCompleteModal from '../components/SetupCompleteModal'; // pastikan path sesuai ya, Ranggis

const ResetNewPasswordScreen = ({ navigation }: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleRememberPress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    setRememberMe(!rememberMe);
  };

  const handleContinue = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Incomplete', 'Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match!');
      return;
    }
    setShowSuccessModal(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header pakai komponen */}
      <View style={styles.headerWrapper}>
        <HeaderBack title="Create New Password" onBack={() => navigation.goBack()} />
      </View>

      {/* Ilustrasi di bagian atas */}
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Label instruksi */}
      <Text style={styles.label}>Create Your New Password</Text>

      {/* Input password baru */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#666"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons
            name={secureText ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      {/* Input konfirmasi password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          secureTextEntry={secureConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
          <Ionicons
            name={secureConfirm ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      {/* Remember Me */}
      <TouchableOpacity style={styles.rememberContainer} onPress={handleRememberPress}>
        <Animated.View
          style={[
            styles.checkbox,
            rememberMe && styles.checkboxChecked,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {rememberMe && <Ionicons name="checkmark" size={16} color="#000" />}
        </Animated.View>
        <Text style={styles.rememberText}>Remember me</Text>
      </TouchableOpacity>

      {/* Tombol Continue */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      {/* Modal sukses */}
      <SetupCompleteModal
        visible={showSuccessModal}
        onFinish={() => {
          setShowSuccessModal(false);
          navigation.navigate('LoginScreen');
        }}
      />
    </View>
  );
};

export default ResetNewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
  },
  headerWrapper: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginTop: 40,
    marginBottom: 20,
  },
  illustration: {
    width: '100%',
    height: 210,
    marginBottom: 30,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1.3,
    borderColor: '#222',
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 12,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 10,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#00E676',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#00E676',
    borderColor: '#00E676',
    shadowColor: '#00E676',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  rememberText: {
    color: '#ccc',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#00E676',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#00E676',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
