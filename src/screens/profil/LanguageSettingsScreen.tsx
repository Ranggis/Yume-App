import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../components/HeaderBack';
import { useNavigation } from '@react-navigation/native';

const availableLanguages = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-UK', label: 'English (UK)' },
  { code: 'zh', label: 'Mandarin' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ar', label: 'Arabic' },
  { code: 'bn', label: 'Bengali' },
  { code: 'ru', label: 'Russian' },
  { code: 'id', label: 'Indonesia' },
];


const LanguageSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedLang, setSelectedLang] = useState('en-US');

  useEffect(() => {
    const loadLang = async () => {
      const saved = await AsyncStorage.getItem('app_language');
      if (saved) setSelectedLang(saved);
    };
    loadLang();
  }, []);

  const handleSelectLang = async (code: string) => {
    setSelectedLang(code);
    await AsyncStorage.setItem('app_language', code);
    Alert.alert('Language Updated', `App language set to ${code.toUpperCase()}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
          <HeaderBack
            title="Language"
            onBack={() => navigation.goBack()}
            onRightPress={() => console.log('Scan pressed!')}
          />
      </View>

      {/* Suggested Section */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Suggested</Text>

        {availableLanguages.slice(0, 2).map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.row}
            onPress={() => handleSelectLang(lang.code)}
          >
            <Text style={styles.label}>{lang.label}</Text>
            {selectedLang === lang.code && (
              <Icon name="checkmark-circle" size={20} color="#00C853" />
            )}
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Language</Text>

        {availableLanguages.slice(2).map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.row}
            onPress={() => handleSelectLang(lang.code)}
          >
            <Text style={styles.label}>{lang.label}</Text>
            {selectedLang === lang.code && (
              <Icon name="checkmark-circle" size={20} color="#00C853" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
});

export default LanguageSettingsScreen;
