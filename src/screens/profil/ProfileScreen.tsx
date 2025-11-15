import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import LogoutModal from '../components/LogoutModal';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(false);

  // Daftar menu profile
  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profile', onPress: () => navigation.navigate('EditProfileScreen') },
    { icon: 'notifications-outline', title: 'Notification', onPress: () => navigation.navigate('NotificationSettingsScreen') },
    { icon: 'download-outline', title: 'Download', onPress: () => navigation.navigate('DownloadSettingsScreen') },
    { icon: 'shield-checkmark-outline', title: 'Security', onPress: () => navigation.navigate('SecuritySettingsScreen') },
    { icon: 'language-outline', title: 'Language', value: 'English (US)', onPress: () => navigation.navigate('LanguageSettingsScreen') },
    { icon: 'moon-outline', title: 'Dark Mode', switch: true },
    { icon: 'help-circle-outline', title: 'Help Center', onPress: () => navigation.navigate('HelpCenterScreen') },
    { icon: 'document-text-outline', title: 'Privacy Policy', onPress: () => navigation.navigate('PrivacyPolicyScreen') },
    { icon: 'log-out-outline', title: 'Logout', color: '#FF3B30', onPress: () => setLogoutVisible(true) }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image source={require('../../../assets/logo.png')} style={styles.logo} />
              <Text style={styles.headerTitle}>Profile</Text>
            </View>
            <TouchableOpacity>
              <Icon name="ellipsis-vertical" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile Row (foto kiri, teks kanan) */}
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../../../assets/ranggis.jpg')}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => navigation.navigate('EditProfileScreen')}>
                <Icon name="pencil" size={12} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.textSection}>
              <Text style={styles.userName}>M Ranggis Refaldi</Text>
              <Text style={styles.userEmail}>ranggis@gmail.com</Text>
            </View>
          </View>

          {/* Premium Card */}
          <TouchableOpacity
            style={styles.premiumCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PremiumScreen')}>
            <IconFA name="crown" size={36} color="#00C853" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.premiumTitle}>Join Premium!</Text>
              <Text style={styles.premiumDesc}>
                Enjoy watching Full-HD animes, without restrictions and without ads
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#00C853" />
          </TouchableOpacity>

          {/* Menu List */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuRow}
                activeOpacity={0.7}
                onPress={item.switch ? undefined : item.onPress}>
                <View style={styles.menuLeft}>
                  <Icon name={item.icon} size={20} color={item.color || '#fff'} />
                  <Text
                    style={[
                      styles.menuTitle,
                      item.color ? { color: item.color, fontWeight: '600' } : null,
                    ]}>
                    {item.title}
                  </Text>
                </View>

                {item.switch ? (
                  <Switch
                    value={isDarkMode}
                    onValueChange={setIsDarkMode}
                    thumbColor={isDarkMode ? '#00C853' : '#ccc'}
                    trackColor={{ true: '#004d1f', false: '#333' }}
                  />
                ) : item.value ? (
                  <Text style={styles.menuValue}>{item.value}</Text>
                ) : item.title === 'Logout' ? null : (
                  <Icon name="chevron-forward" size={18} color="#888" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Logout Modal */}
        <LogoutModal
          visible={logoutVisible}
          onCancel={() => setLogoutVisible(false)}
          onConfirm={() => {
            setLogoutVisible(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0E0E',
  },
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    tintColor: '#00C853',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    backgroundColor: '#00C853',
    padding: 4,
    borderRadius: 10,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  userEmail: {
    color: '#999',
    fontSize: 13,
    marginTop: 4,
  },
  premiumCard: {
    backgroundColor: '#121212',
    borderColor: '#00C853',
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 25,
  },
  premiumTitle: {
    color: '#00C853',
    fontSize: 16,
    fontWeight: '700',
  },
  premiumDesc: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  menuContainer: {
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 15,
  },
  menuValue: {
    color: '#888',
    fontSize: 14,
  },
});
