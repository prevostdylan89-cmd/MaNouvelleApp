import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import CollectionScreen from './screens/CollectionScreen';
import EditionCardsScreen from './screens/EditionCardsScreen';
import BlocEditionsScreen from './screens/BlocEditionsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'Scanner' }} />
        <Stack.Screen name="Collection" component={CollectionScreen} options={{ title: 'Collections' }} />
        <Stack.Screen name="BlocEditions" component={BlocEditionsScreen} options={{ title: 'Éditions du bloc' }} />
        <Stack.Screen name="EditionCards" component={EditionCardsScreen} options={{ title: 'Cartes de l\'édition' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}