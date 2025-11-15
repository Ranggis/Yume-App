import 'react-native-gesture-handler'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CommentProvider } from "./src/Context/CommentContext";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'InteractionManager has been deprecated',
]);
const App = () => {
  return (
    <CommentProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </CommentProvider>
  );
};

export default App;
