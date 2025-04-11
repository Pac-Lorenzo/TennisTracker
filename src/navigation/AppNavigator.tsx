import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import HomeScreen from '../features/matches/HomeScreen';
import NewMatchScreen from '../features/matches/NewMatchScreen';
import MatchHistoryScreen from '../features/matches/MatchHistoryScreen';
import PlayerProfileScreen from '../features/players/PlayerProfileScreen';


export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  NewMatch: undefined;
  MatchHistory: undefined;
  PlayerProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewMatch" component={NewMatchScreen} />
        <Stack.Screen name="MatchHistory" component={MatchHistoryScreen} />
        <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
