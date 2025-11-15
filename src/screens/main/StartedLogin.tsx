import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StartedLogin = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../../../assets/icon.png')} // ganti dengan ilustrasi kamu
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Let's you in</Text>

      {/* Social Buttons */}
      <TouchableOpacity style={styles.socialButton}>
        <Icon name="facebook" size={22} color="#1877F2" />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Icon name="google" size={22} color="#DB4437" />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Icon name="apple" size={22} color="#fff" />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      {/* OR separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Sign in with password */}
      <TouchableOpacity
        style={styles.signinButton}
        onPress={() => navigation.navigate('LoginScreen' as never)} // nanti diarahkan ke login email
      >
        <Text style={styles.signinText}>Sign in with password</Text>
      </TouchableOpacity>

      {/* Sign up link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen' as never)}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StartedLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  illustration: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  socialText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '500',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: '#999',
    marginHorizontal: 10,
    fontSize: 14,
  },
  signinButton: {
    backgroundColor: '#00E676',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  signinText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: '#ccc',
    fontSize: 14,
  },
  signupText: {
    color: '#00E676',
    fontWeight: '600',
    fontSize: 14,
  },
});
