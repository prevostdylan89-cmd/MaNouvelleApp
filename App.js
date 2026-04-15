import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import CameraScanScreen from './screens/CameraScanScreen';
import PriceDashboardScreen from './screens/PriceDashboardScreen';
import SearchHistoryScreen from './screens/SearchHistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'Recherche manuelle' }} />
        <Stack.Screen name="CameraScan" component={CameraScanScreen} options={{ title: 'Scan caméra' }} />
        <Stack.Screen name="PriceDashboard" component={PriceDashboardScreen} options={{ title: 'Analyse des prix' }} />
        <Stack.Screen name="SearchHistory" component={SearchHistoryScreen} options={{ title: 'Historique' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}