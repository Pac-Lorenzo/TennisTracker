import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, useTheme, Menu, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../services/database/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';
import { useUserStore } from '../../store/useUserStore';

const nationalities = [
  { label: '🇺🇸 USA', value: 'USA' },
  { label: '🇪🇸 Spain', value: 'Spain' },
  { label: '🇨🇭 Switzerland', value: 'Switzerland' },
  { label: '🇫🇷 France', value: 'France' },
  { label: '🇯🇵 Japan', value: 'Japan' },
];

export default function PlayerSetUpScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { profile, loading } = usePlayerProfile();

  const [name, setName] = useState('');
  const [ranking, setRanking] = useState('');
  const [nationality, setNationality] = useState('');
  const [notes, setNotes] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // If profile already exists, prefill fields
    if (profile) {
      setName(profile.name || '');
      setRanking(profile.ranking || '');
      setNationality(profile.nationality || '');
      setNotes(profile.notes || '');
    }
  }, [profile]);

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
      await setDoc(ref, profile);

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
