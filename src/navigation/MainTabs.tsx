import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/home/HomeScreen';
import ReleaseCalendarScreen from '../screens/realase_calender/ReleaseCalendarScreen';
import MyListScreen from '../screens/mylist/MyListScreen';
import DownloadScreen from '../screens/download/DownloadScreen';
import ProfileScreen from '../screens/profil/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: 'rgba(255,255,255,0.1)',
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarActiveTintColor: '#00C853',
        tabBarInactiveTintColor: '#999',
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Release':
              iconName = 'calendar-outline';
              break;
            case 'My List':
              iconName = 'heart-outline';
              break;
            case 'Download':
              iconName = 'download-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
          }

          return <Icon name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Release" component={ReleaseCalendarScreen} />
      <Tab.Screen name="My List" component={MyListScreen} />
      <Tab.Screen name="Download" component={DownloadScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
