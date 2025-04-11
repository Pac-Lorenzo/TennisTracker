import React from 'react';
import { View } from 'react-native';
import { Button, Text, Title, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../store/useUserStore';
import { auth } from '../../services/database/firebaseConfig';

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { user, logout } = useUserStore();
  console.log(useUserStore.getState());
  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
      navigation.replace('Login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20, justifyContent: 'center' }}>
      <Title style={{ textAlign: 'center', marginBottom: 20 }}>
        Welcome{user?.email ? `, ${user.email}` : ''}!
      </Title>

      <Button mode="contained" onPress={() => navigation.navigate('NewMatch')} style={{ marginBottom: 12 }}>
        Start New Match
      </Button>

      <Button mode="outlined" onPress={() => navigation.navigate('MatchHistory')} style={{ marginBottom: 12 }}>
        View Match History
      </Button>

      <Button mode="text" onPress={handleLogout}>
        Logout
      </Button>
    </View>
  );
}
