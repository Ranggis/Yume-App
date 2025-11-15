import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../components/HeaderBack';
import { useNavigation } from '@react-navigation/native';

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [settings, setSettings] = useState({
    general: true,
    newArrival: false,
    newServices: false,
    newReleases: true,
    appUpdates: true,
    subscription: false,
  });

  // Load preferences
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem('notification_settings');
        if (saved) setSettings(JSON.parse(saved));
      } catch (err) {
        console.log('Error loading notification settings', err);
      }
    };
    loadSettings();
  }, []);

  // Save preferences
  const saveSettings = async (newSettings: any) => {
    setSettings(newSettings);
    await AsyncStorage.setItem('notification_settings', JSON.stringify(newSettings));
  };

  const toggleSetting = (key: keyof typeof settings) => {
    const updated = { ...settings, [key]: !settings[key] };

    // Jika general dimatikan, matikan semua
    if (key === 'general' && settings.general === true) {
      for (const k in updated) {
        updated[k as keyof typeof settings] = false;
      }
    }

    // Jika general dihidupkan, aktifkan default beberapa
    if (key === 'general' && settings.general === false) {
      updated.newReleases = true;
      updated.appUpdates = true;
    }

    saveSettings(updated);
  };

  const handleSave = () => {
    Alert.alert('Saved', 'Your notification preferences have been updated.');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
          <HeaderBack
            title="Notification"
            onBack={() => navigation.goBack()}
            onRightPress={() => console.log('Scan pressed!')}
          />
      </View>

      {/* Notification Toggles */}
      {[
        { label: 'General Notification', key: 'general' },
        { label: 'New Arrival', key: 'newArrival' },
        { label: 'New Services Available', key: 'newServices' },
        { label: 'New Releases Movie', key: 'newReleases' },
        { label: 'App Updates', key: 'appUpdates' },
        { label: 'Subscription', key: 'subscription' },
      ].map((item, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.label}>{item.label}</Text>
          <Switch
            value={settings[item.key as keyof typeof settings]}
            onValueChange={() => toggleSetting(item.key as keyof typeof settings)}
            thumbColor={settings[item.key as keyof typeof settings] ? '#00C853' : '#777'}
            trackColor={{ true: '#00C85355', false: '#222' }}
          />
        </View>
      ))}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
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
  saveButton: {
    backgroundColor: '#00C853',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 40,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default NotificationSettingsScreen;
