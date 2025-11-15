import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBack from '../components/HeaderBack';
import auth from '@react-native-firebase/auth';

const ForgotPasswordScreen = ({ navigation, route }: any) => {
  // Ambil data dari IdentifyAccountScreen
  const email = route?.params?.email || null;
  const phoneNumber = route?.params?.phoneNumber || null;

  const [selected, setSelected] = useState<'sms' | 'email' | null>(email ? 'email' : phoneNumber ? 'sms' : null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;

    try {
      setLoading(true);

      if (selected === 'email' && email) {
        // 🔥 Kirim email reset password
        await auth().sendPasswordResetEmail(email);
        Alert.alert(
          'Email Sent',
          `A password reset link has been sent to ${email}. Please check your inbox.`
        );

        navigation.navigate('ResetVerificationScreen', { method: 'email', email });
      }

      if (selected === 'sms' && phoneNumber) {
        // 🔥 Kirim kode verifikasi OTP ke nomor HP
        navigation.navigate('ResetVerificationScreen', {
          method: 'sms',
          phoneNumber,
        });
      }
    } catch (error: any) {
      console.log(error);
      let message = 'Failed to send reset instructions.';
      if (error.code === 'auth/invalid-email') message = 'Invalid email format.';
      if (error.code === 'auth/user-not-found') message = 'No account found with that email.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <HeaderBack title="Forgot Password" onBack={() => navigation.goBack()} />
      </View>

      {/* Illustration */}
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Select which contact details should we use to reset your password
      </Text>

      {/* Option: via SMS */}
      <TouchableOpacity
        style={[
          styles.optionContainer,
          selected === 'sms' && styles.optionActive,
        ]}
        onPress={() => setSelected('sms')}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#00E676" />
        </View>
        <View>
          <Text style={styles.optionLabel}>via SMS:</Text>
          <Text style={styles.optionValue}>
            {phoneNumber ? phoneNumber : '+62 ••••••'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Option: via Email */}
      <TouchableOpacity
        style={[
          styles.optionContainer,
          selected === 'email' && styles.optionActive,
        ]}
        onPress={() => setSelected('email')}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="mail" size={24} color="#00E676" />
        </View>
        <View>
          <Text style={styles.optionLabel}>via Email:</Text>
          <Text style={styles.optionValue}>
            {email ? email : 'yourname@domain.com'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, { opacity: selected ? 1 : 0.5 }]}
        disabled={!selected || loading}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerWrapper: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  illustration: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  optionActive: {
    borderColor: '#00E676',
    backgroundColor: '#0A1F0A',
  },
  iconCircle: {
    backgroundColor: '#0E0E0E',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionLabel: {
    color: '#aaa',
    fontSize: 13,
  },
  optionValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#00E676',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
});
