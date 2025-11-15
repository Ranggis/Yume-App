import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import SplashScreen from '../screens/main/SplashScreen';
import StartScreen from '../screens/main/StartScreen';
import StartedLogin from '../screens/main/StartedLogin';
import SignUpScreen from '../screens/main/SignUpScreen';
import LoginScreen from '../screens/main/LoginScreen';
import ChooseInterestScreen from '../screens/account_setup/ChooseInterestScreen';
import FillProfileScreen from '../screens/account_setup/FillProfileScreen';
import CreatePinScreen from '../screens/account_setup/CreatePinScreen';
import SetFingerprintScreen from '../screens/account_setup/SetFingerprintScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetVerificationScreen from '../screens/auth/ResetVerificationScreen';
import ResetNewPasswordScreen from '../screens/auth/ResetNewPasswordScreen';
import IdentifyAccountScreen from '../screens/auth/IdentifyAccountScreen';

import AddCardScreen from '../screens/profil/AddCardScreen';
import AnimeDetailScreen from '../screens/anime_details/AnimeDetailScreen';

import DownloadSettingsScreen from '../screens/profil/DownloadSettingsScreen';
import EditProfileScreen from '../screens/profil/EditProfileScreen';
import FilterScreen from '../screens/home/FilterScreen';
import HelpCenterScreen from '../screens/profil/HelpCenterScreen';
import LanguageSettingsScreen from '../screens/profil/LanguageSettingsScreen';
import NewEpisodesScreen from '../screens/home/NewEpisodesScreen';
import NotificationScreen from '../screens/home/NotificationScreen';
import NotificationSettingsScreen from '../screens/profil/NotificationSettingsScreen';
import PaymentScreen from '../screens/profil/PaymentScreen';
import PremiumScreen from '../screens/profil/PremiumScreen';
import PrivacyPolicyScreen from '../screens/profil/PrivacyPolicyScreen';
import ReviewSummaryScreen from '../screens/profil/ReviewSummaryScreen';
import SearchScreen from '../screens/home/SearchScreen';
import SecuritySettingsScreen from '../screens/profil/SecuritySettingsScreen';
import TopHitsScreen from '../screens/home/TopHitsScreen';
import CommentsScreen from '../screens/comments/CommentsScreen';
import VideoPlayerScreen from '../screens/video/VideoPlayerScreen';
import MainTabs from './MainTabs';

// ROUTE TYPE DEFINITIONS 
export type RootStackParamList = {
  SplashScreen: undefined;
  StartScreen: undefined;
  StartedLogin: undefined;
  SignUpScreen: undefined;
  LoginScreen: undefined;
  ChooseInterestScreen: undefined;
  FillProfileScreen: undefined;
  CreatePinScreen: undefined;
  SetFingerprintScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetVerificationScreen: undefined;
  ResetNewPasswordScreen: undefined;
  IdentifyAccountScreen: undefined;
  AddCardScreen: undefined;
  // FIX: AnimeDetail menerima animeId
  AnimeDetailScreen: { animeId: number };
  DownloadSettingsScreen: undefined;
  EditProfileScreen: undefined;
  // Search menerima filters jika dikirim dari FilterScreen
  SearchScreen: { filters?: any } | undefined;
  FilterScreen: undefined;
  HelpCenterScreen: undefined;
  LanguageSettingsScreen: undefined;
  NewEpisodesScreen: undefined;
  NotificationScreen: undefined;
  NotificationSettingsScreen: undefined;
  PaymentScreen: undefined;
  PremiumScreen: undefined;
  PrivacyPolicyScreen: undefined;
  ReviewSummaryScreen: undefined;
  SecuritySettingsScreen: undefined;
  TopHitsScreen: undefined;
  CommentsScreen: undefined;
  VideoPlayerScreen: { animeId: number; animeTitle: string };
  MainTabs: undefined;
};


// NAVIGATOR
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="StartedLogin" component={StartedLogin} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ChooseInterestScreen" component={ChooseInterestScreen} />
      <Stack.Screen name="FillProfileScreen" component={FillProfileScreen} />
      <Stack.Screen name="CreatePinScreen" component={CreatePinScreen} />
      <Stack.Screen name="SetFingerprintScreen" component={SetFingerprintScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetVerificationScreen" component={ResetVerificationScreen} />
      <Stack.Screen name="ResetNewPasswordScreen" component={ResetNewPasswordScreen} />
      <Stack.Screen name="IdentifyAccountScreen" component={IdentifyAccountScreen} />
      <Stack.Screen name="AddCardScreen" component={AddCardScreen} />
      <Stack.Screen name="AnimeDetailScreen" component={AnimeDetailScreen} />
      <Stack.Screen name="DownloadSettingsScreen" component={DownloadSettingsScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} />
      <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
      <Stack.Screen name="LanguageSettingsScreen" component={LanguageSettingsScreen} />
      <Stack.Screen name="NewEpisodesScreen" component={NewEpisodesScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="PremiumScreen" component={PremiumScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="ReviewSummaryScreen" component={ReviewSummaryScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SecuritySettingsScreen" component={SecuritySettingsScreen} />
      <Stack.Screen name="TopHitsScreen" component={TopHitsScreen} />
      <Stack.Screen name="CommentsScreen" component={CommentsScreen} />
      <Stack.Screen name="VideoPlayerScreen" component={VideoPlayerScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
