import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Keyboard,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderBack from '../components/HeaderBack';

const FillProfileScreen = ({ navigation }: any) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<CountryCode>('ID'); // default Indonesia 🇮🇩
  const [country, setCountry] = useState<Country | null>(null);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Listener keyboard — versi super stabil
  useEffect(() => {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    let timeout: any;

    const onShow = () => {
      // Tambah sedikit delay biar animasi transisi halus (tanpa glitch)
      timeout = setTimeout(() => setKeyboardVisible(true), 50);
    };

    const onHide = () => {
      timeout = setTimeout(() => setKeyboardVisible(false), 50);
    };

    const showSub = Keyboard.addListener(show, onShow);
    const hideSub = Keyboard.addListener(hide, onHide);

    return () => {
      clearTimeout(timeout);
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Upload foto
  const handleChoosePhoto = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        mediaType: 'photo',
      });
      setPhoto(image.path);
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Error picking image:', error);
      }
    }
  };

  // Pilih negara
  const onSelect = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <HeaderBack title="Fill Your Profile" onBack={() => navigation.goBack()} />

      {/* Scrollable form content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={60} color="#444" />
            )}
            <TouchableOpacity style={styles.editButton} onPress={handleChoosePhoto}>
              <Ionicons name="pencil" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Input fields */}
        <View style={styles.inputContainer}>
          <TextInput placeholder="Full Name" placeholderTextColor="#777" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput placeholder="Nickname" placeholderTextColor="#777" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            keyboardType="email-address"
            style={styles.input}
          />
          <Ionicons name="mail-outline" size={20} color="#777" />
        </View>

        {/* Phone number */}
        <View style={styles.phoneContainer}>
          <CountryPicker
            countryCode={countryCode}
            withFlag
            withCallingCode
            withFilter
            onSelect={onSelect}
            containerButtonStyle={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#777"
            keyboardType="phone-pad"
            style={styles.phoneInput}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Gender Picker */}
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(value) => setGender(value)}
            style={styles.picker}
            dropdownIconColor="#888"
          >
            <Picker.Item label="Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </ScrollView>

      {/* Tombol bawah — disembunyikan saat keyboard aktif */}
      {!isKeyboardVisible && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate('CreatePinScreen')}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('CreatePinScreen')}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FillProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  scrollContainer: {
    paddingBottom: 120, // biar konten nggak ketutup tombol
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#00E676',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
  },
  phoneInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  picker: {
    color: '#fff',
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderColor: '#111',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
