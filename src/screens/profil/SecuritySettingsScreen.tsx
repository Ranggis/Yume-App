import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderBack from '../components/HeaderBack';
import { useNavigation } from '@react-navigation/native';

const SecuritySettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [rememberMe, setRememberMe] = useState(true);
  const [faceID, setFaceID] = useState(false);
  const [biometric, setBiometric] = useState(true);

  const handleNavigation = (title: string) => {
    Alert.alert(`${title}`, `Navigating to ${title} screen...`);
  };

  const handleChangePin = () => {
    Alert.alert('Change PIN', 'Redirecting to PIN setup screen...');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Redirecting to password change screen...');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
          <HeaderBack
            title="Security"
            onBack={() => navigation.goBack()}
            onRightPress={() => console.log('Scan pressed!')}
          />
      </View>

      {/* Section: Control */}
      <Text style={styles.sectionTitle}>Control</Text>

      <TouchableOpacity
        style={styles.row}
        onPress={() => handleNavigation('Security Alerts')}
      >
        <Text style={styles.label}>Security Alerts</Text>
        <Icon name="chevron-forward" size={20} color="#777" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => handleNavigation('Manage Devices')}
      >
        <Text style={styles.label}>Manage Devices</Text>
        <Icon name="chevron-forward" size={20} color="#777" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => handleNavigation('Manage Permission')}
      >
        <Text style={styles.label}>Manage Permission</Text>
        <Icon name="chevron-forward" size={20} color="#777" />
      </TouchableOpacity>

      {/* Section: Security */}
      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Security</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Remember me</Text>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          thumbColor={rememberMe ? '#00C853' : '#777'}
          trackColor={{ true: '#00C85355', false: '#222' }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Face ID</Text>
        <Switch
          value={faceID}
          onValueChange={setFaceID}
          thumbColor={faceID ? '#00C853' : '#777'}
          trackColor={{ true: '#00C85355', false: '#222' }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Biometric ID</Text>
        <Switch
          value={biometric}
          onValueChange={setBiometric}
          thumbColor={biometric ? '#00C853' : '#777'}
          trackColor={{ true: '#00C85355', false: '#222' }}
        />
      </View>

      <TouchableOpacity
        style={styles.row}
        onPress={() => handleNavigation('Google Authenticator')}
      >
        <Text style={styles.label}>Google Authenticator</Text>
        <Icon name="chevron-forward" size={20} color="#00C853" />
      </TouchableOpacity>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={handleChangePin}>
        <Text style={styles.buttonText}>Change PIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  sectionTitle: {
    color: '#888',
    fontSize: 13,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#1A1A1A',
    borderBottomWidth: 1,
  },
  label: {
    color: '#fff',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default SecuritySettingsScreen;
