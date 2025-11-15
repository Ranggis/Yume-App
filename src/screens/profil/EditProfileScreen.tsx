import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderBack from '../components/HeaderBack';
import { useNavigation } from '@react-navigation/native';

// Data negara dengan kode dan flag
const countryData: Record<
  string,
  { code: string; flag: string }
> = {
  Indonesia: { code: '+62', flag: 'https://flagcdn.com/w20/id.png' },
  Japan: { code: '+81', flag: 'https://flagcdn.com/w20/jp.png' },
  'United States': { code: '+1', flag: 'https://flagcdn.com/w20/us.png' },
  China: { code: '+86', flag: 'https://flagcdn.com/w20/cn.png' },
  Others: { code: '+00', flag: 'https://flagcdn.com/w20/un.png' },
};

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('M Ranggis Refladi');
  const [username, setUsername] = useState('Ranggis');
  const [email, setEmail] = useState('ranggis@gmail.com');
  const [phone, setPhone] = useState('+62 895 2073 6931');
  const [gender, setGender] = useState('Male');
  const [country, setCountry] = useState('Indonesia');
  const [avatar, setAvatar] = useState(require('../../../assets/ranggis.jpg'));

  const [flagUri, setFlagUri] = useState(countryData['Indonesia'].flag);

  //  Ganti avatar
  const pickImage = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      });

      if (result && result.path) {
        setAvatar({ uri: result.path });
      }
    } catch (error) {
      console.log('Image pick cancelled or failed:', error);
    }
  };

  //  Update profil
  const handleUpdate = () => {
    console.log({
      name,
      username,
      email,
      phone,
      gender,
      country,
      avatar,
    });
    Alert.alert('Profile updated successfully!');
  };

  //  Ganti negara → ubah flag + kode nomor otomatis
  const handleCountryChange = (value: string) => {
    setCountry(value);
    const data = countryData[value];
    setFlagUri(data.flag);

    const newCode = data.code;
    const currentNumber = phone.replace(/^\+\d+\s?/, ''); // hapus kode lama
    setPhone(`${newCode} ${currentNumber}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
          <HeaderBack
            title="Edit Profil"
            onBack={() => navigation.goBack()}
            onRightPress={() => console.log('Scan pressed!')}
          />
      </View>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={avatar} style={styles.avatar} />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Icon name="pencil" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        {/*  Email rata kiri (icon di kanan, text sejajar input lain) */}
        <View style={styles.emailWrapper}>
          <TextInput
            style={[styles.input, styles.emailInput]}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />
          <Icon name="mail-outline" size={18} color="#888" />
        </View>

        {/*  Nomor HP: flag + kode otomatis */}
        <View style={styles.phoneWrapper}>
          <Image source={{ uri: flagUri }} style={styles.flag} />
          <TextInput
            style={[styles.input, { flex: 1, paddingHorizontal: 0 }]}
            placeholder="Phone"
            placeholderTextColor="#888"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Gender */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            dropdownIconColor="#00C853"
            style={styles.picker}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/*  Negara + update flag dan kode otomatis */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={country}
            onValueChange={handleCountryChange}
            dropdownIconColor="#00C853"
            style={styles.picker}
          >
            {Object.keys(countryData).map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  headerWrapper: {
  paddingHorizontal: 0, 
  marginLeft: -10, 
  marginBottom: 10, 
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: '40%',
    backgroundColor: '#00C853',
    borderRadius: 10,
    padding: 5,
  },
  form: {
    gap: 14,
  },
  input: {
    backgroundColor: '#121212',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
  },
  emailWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between', // biar teks rata kiri dan ikon di kanan
  },
  emailInput: {
    flex: 1,
    paddingHorizontal: 0,
  },
  phoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  pickerContainer: {
    backgroundColor: '#121212',
    borderRadius: 10,
  },
  picker: {
    color: '#fff',
    height: 50,
    width: '100%',
  },
  updateButton: {
    backgroundColor: '#00C853',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 35,
  },
  updateText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
