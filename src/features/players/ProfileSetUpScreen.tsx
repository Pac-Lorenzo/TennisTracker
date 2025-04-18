import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { TextInput, Button, Text, Title, useTheme, Menu, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../services/database/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';
import { useUserStore } from '../../store/useUserStore';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

const nationalities = [
  { label: '🇺🇸 USA', value: 'USA' },
  { label: '🇪🇸 Spain', value: 'Spain' },
  { label: '🇨🇭 Switzerland', value: 'Switzerland' },
  { label: '🇫🇷 France', value: 'France' },
  { label: '🇯🇵 Japan', value: 'Japan' },
];

const avatarOptions = [
  require('../../assets/avatars/racket.png'),
  require('../../assets/avatars/tplayer.png'),
  require('../../assets/avatars/tennis-court-icon.png'),
];

export default function PlayerSetUpScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { profile, loading } = usePlayerProfile();

  const [image, setImage] = useState<string | null>(null);


  const [name, setName] = useState('');
  const [ranking, setRanking] = useState('');
  const [nationality, setNationality] = useState('');
  const [notes, setNotes] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // If profile already exists, prefill fields
    if (profile) {
      if (profile.avatar) {
        setImage(profile.avatar);
      }
      setName(profile.name || '');
      setRanking(profile.ranking || '');
      setNationality(profile.nationality || '');
      setNotes(profile.notes || '');
    }
  }, [profile])
  ;


  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      const ref = doc(db, 'players', user.uid);
      const profile = {
        userId: user.uid,
        name,
        ranking,
        nationality,
        notes,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'players', user.uid), {
        userId: user.uid,
        name,
        ranking,
        nationality,
        notes,
        avatar: image || null,
        updatedAt: new Date().toISOString(),
      });

      // Update Zustand store with the profile data
      useUserStore.getState().setUser({ ...user, ...profile });

      navigation.replace('Home');
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Title style={{ textAlign: 'center', marginBottom: 24 }}>
          {profile ? 'Edit Your Profile' : 'Set Up Your Player Profile'}
        </Title>

        <Button
          mode="outlined"
          icon="camera"
          onPress={pickImage}
          style={{ marginBottom: 12 }}
        >
        {image ? 'Change Photo' : 'Pick Profile Picture'}
        </Button>

        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 16 }}
          />
        )}

        <Text style={{ marginBottom: 8 }}>Or choose a preset avatar:</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
            {avatarOptions.map((avatar, index) => (
              <Pressable key={index} onPress={() => setImage(Image.resolveAssetSource(avatar).uri)}>
                <Image
                  source={avatar}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    borderWidth: image === Image.resolveAssetSource(avatar).uri ? 2 : 0,
                    borderColor: theme.colors.primary,
                  }}
                />
              </Pressable>
            ))}
          </View>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Ranking"
          value={ranking}
          onChangeText={setRanking}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 12 }}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={{ marginBottom: 12 }}
            >
              {nationality || 'Select Nationality'}
            </Button>
          }
        >
          {nationalities.map((n) => (
            <Menu.Item
              key={n.value}
              title={n.label}
              onPress={() => {
                setNationality(n.value);
                setMenuVisible(false);
              }}
            />
          ))}
        </Menu>

        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          style={{ marginBottom: 20 }}
        />

        <Button mode="contained" onPress={handleSaveProfile} loading={saving}>
          {profile ? 'Update Profile' : 'Save Profile'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
