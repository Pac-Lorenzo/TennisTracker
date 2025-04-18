import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text, Title, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../store/useUserStore';
import { auth } from '../../services/database/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/database/firebaseConfig';
import { Image } from 'react-native';


export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { user, logout } = useUserStore();
  
  useEffect(() => {
    // If user is logged in but doesn't have profile data, fetch it
    const fetchProfileIfNeeded = async () => {
      if (user && !user.name && auth.currentUser) {
        const profileRef = doc(db, 'players', auth.currentUser.uid);
        const profileDoc = await getDoc(profileRef);
        
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          useUserStore.getState().setUser({ ...user, ...profileData });
        }
      }
    };
    
    fetchProfileIfNeeded();
  }, [user]);
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
      navigation.replace('Login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  const goToEditProfile = () => {
    navigation.navigate('ProfileSetUpScreen');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20, justifyContent: 'center' }}>
      <Title style={{ textAlign: 'center', marginBottom: 20 }}>
        Welcome{user?.name ? `, ${user.name}` : ''}!
      </Title>
      {user?.avatar && (
        <Image
          source={{ uri: user.avatar }}
          style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 16 }}
        />
      )}


      <Button mode="contained" onPress={() => navigation.navigate('NewMatch')} style={{ marginBottom: 12 }}>
        Start New Match
      </Button>

      <Button mode="outlined" onPress={() => navigation.navigate('MatchHistory')} style={{ marginBottom: 12 }}>
        View Match History
      </Button>

      <Button mode="outlined" onPress={() => navigation.navigate('PlayerProfile')} style={{ marginBottom: 12 }}>
        Manage Player Profiles
      </Button>
      
      <Button mode="outlined" onPress={goToEditProfile} style={{ marginBottom: 12 }}>
        Edit Your Profile
      </Button>

      <Button mode="text" onPress={handleLogout}>
        Logout
      </Button>
    </View>
  );
}
