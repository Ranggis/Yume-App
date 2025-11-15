import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../components/HeaderBack';
import { useNavigation } from '@react-navigation/native';

const DownloadSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [wifiOnly, setWifiOnly] = useState(true);
  const [smartDownload, setSmartDownload] = useState(false);
  const [videoQuality, setVideoQuality] = useState('720p');
  const [audioQuality, setAudioQuality] = useState('High');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem('download_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setWifiOnly(parsed.wifiOnly);
          setSmartDownload(parsed.smartDownload);
          setVideoQuality(parsed.videoQuality);
          setAudioQuality(parsed.audioQuality);
        }
      } catch (e) {
        console.log('Error loading settings:', e);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async () => {
    const newSettings = { wifiOnly, smartDownload, videoQuality, audioQuality };
    await AsyncStorage.setItem('download_settings', JSON.stringify(newSettings));
    Alert.alert('Saved', 'Your download settings have been updated.');
  };

  const handleDeleteDownloads = () => {
    Alert.alert('Confirm', 'Delete all downloaded files?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Delete',
        style: 'destructive',
        onPress: () => Alert.alert('Deleted', 'All downloads have been removed.'),
      },
    ]);
  };

  const handleDeleteCache = () => {
    Alert.alert('Confirm', 'Clear all app cache?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Clear',
        style: 'destructive',
        onPress: () => Alert.alert('Cleared', 'App cache cleared successfully.'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
          <HeaderBack
            title="Download"
            onBack={() => navigation.goBack()}
            onRightPress={() => console.log('Scan pressed!')}
          />
      </View>
      {/* Settings */}
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Icon name="wifi-outline" size={18} color="#fff" />
          <Text style={styles.label}>Wi-Fi Only</Text>
        </View>
        <Switch
          value={wifiOnly}
          onValueChange={(val) => setWifiOnly(val)}
          thumbColor={wifiOnly ? '#00C853' : '#777'}
          trackColor={{ true: '#00C85355', false: '#222' }}
        />
      </View>

      <TouchableOpacity style={styles.row} onPress={() => setSmartDownload(!smartDownload)}>
        <View style={styles.rowLeft}>
          <Icon name="download-outline" size={18} color="#fff" />
          <Text style={styles.label}>Smart Downloads</Text>
        </View>
        <Switch
          value={smartDownload}
          onValueChange={(val) => setSmartDownload(val)}
          thumbColor={smartDownload ? '#00C853' : '#777'}
          trackColor={{ true: '#00C85355', false: '#222' }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          Alert.alert('Video Quality', 'Select video quality:', [
            { text: '480p', onPress: () => setVideoQuality('480p') },
            { text: '720p', onPress: () => setVideoQuality('720p') },
            { text: '1080p', onPress: () => setVideoQuality('1080p') },
          ])
        }
      >
        <View style={styles.rowLeft}>
          <Icon name="videocam-outline" size={18} color="#fff" />
          <Text style={styles.label}>Video Quality</Text>
        </View>
        <Text style={styles.value}>{videoQuality}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          Alert.alert('Audio Quality', 'Select audio quality:', [
            { text: 'Low', onPress: () => setAudioQuality('Low') },
            { text: 'Medium', onPress: () => setAudioQuality('Medium') },
            { text: 'High', onPress: () => setAudioQuality('High') },
          ])
        }
      >
        <View style={styles.rowLeft}>
          <Icon name="mic-outline" size={18} color="#fff" />
          <Text style={styles.label}>Audio Quality</Text>
        </View>
        <Text style={styles.value}>{audioQuality}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={handleDeleteDownloads}>
        <View style={styles.rowLeft}>
          <Icon name="trash-outline" size={18} color="#fff" />
          <Text style={[styles.label, { color: '#FF4D4D' }]}>Delete All Downloads</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={handleDeleteCache}>
        <View style={styles.rowLeft}>
          <Icon name="trash-bin-outline" size={18} color="#fff" />
          <Text style={[styles.label, { color: '#FF4D4D' }]}>Delete Cache</Text>
        </View>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveText}>Save Settings</Text>
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
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    color: '#fff',
    fontSize: 15,
  },
  value: {
    color: '#00C853',
    fontWeight: '600',
    fontSize: 14,
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

export default DownloadSettingsScreen;
