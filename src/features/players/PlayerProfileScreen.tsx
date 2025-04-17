import React, { useEffect, useState } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { TextInput, Button, Text, Title, Card, useTheme, ActivityIndicator, Menu } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../../services/database/firebaseConfig';
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp, orderBy, getDoc } from 'firebase/firestore';
import { auth } from '../../services/database/firebaseConfig';
import { useUserStore } from '../../store/useUserStore';

// Nationalities
const nationalities = [
  { label: '🇺🇸 USA', value: 'USA' },
  { label: '🇪🇸 Spain', value: 'Spain' },
  { label: '🇨🇭 Switzerland', value: 'Switzerland' },
  { label: '🇫🇷 France', value: 'France' },
  { label: '🇯🇵 Japan', value: 'Japan' },
];  

export default function PlayerProfileScreen() {
  const theme = useTheme();
  const { setUser } = useUserStore();

  // Form state
  const [name, setName] = useState('');
  const [ranking, setRanking] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const [nationality, setNationality] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const [notes, setNotes] = useState('');

  // Profile list
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Save new profile to Firestore
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      alert('Name is required.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const profileData = {
        userId: user.uid,
        name,
        ranking,
        dob: dob ? dob.toISOString() : null,
        nationality,
        notes,
        createdAt: serverTimestamp(),
      };
      
      // Save to Firestore using user's UID as document ID
      await setDoc(doc(db, 'players', user.uid), profileData);
      
      // Update Zustand store with the profile data
      useUserStore.getState().setUser({ ...user, ...profileData });
      
      // Reset form
      setName('');
      setRanking('');
      setDob(null);
      setNationality('');
      setNotes('');
      fetchProfiles(); // reload list
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile.');
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dobString: string) => {
    const birthDate = new Date(dobString);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch profiles from Firestore
  const fetchProfiles = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // First check if user has a profile
      const docRef = doc(db, 'players', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profileData = { id: docSnap.id, ...docSnap.data() };
        setProfiles([profileData]);
      } else {
        setProfiles([]);
      }
    } catch (err) {
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFlagEmoji = (country: string) => {
    const match = nationalities.find((n) => n.value === country);
    return match ? match.label.split(' ')[0] : '';
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Title style={{ textAlign: 'center', marginBottom: 16 }}>New Player Profile</Title>

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

        {/* Date of Birth Picker */}
        <Pressable onPress={() => setShowDobPicker(true)} style={{ marginBottom: 12 }}>
          <TextInput
            label="Date of Birth"
            value={dob ? formatDate(dob) : ''}
            mode="outlined"
            editable={false}
            pointerEvents="none" // Fix tap issue on iOS
          />
        </Pressable>

        {showDobPicker && Platform.OS === 'ios' && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
          }}  
        >
        <View
          style={{
            backgroundColor: theme.colors.surface,
            padding: 16,
            borderRadius: 12,
            width: '90%',
          }}
        >
        <DateTimePicker
          value={dob || new Date()}
          mode="date"
          display="spinner"
          textColor="#fff"
          onChange={(event, selectedDate) => {
            if (selectedDate) setDob(selectedDate);
          }}
        />
            <Button style={{ marginTop: 12 }} onPress={() => setShowDobPicker(false)}>
              Done
            </Button>
          </View>
        </View>
        )}

        {showDobPicker && Platform.OS !== 'ios' && (
          <DateTimePicker
            value={dob || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
            setShowDobPicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
        )}

        {/* Nationality Dropdown */}
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

        <Button mode="contained" onPress={handleSaveProfile}>
          Save Profile
        </Button>

        <Title style={{ marginTop: 30, marginBottom: 10, textAlign: 'center' }}>
          Saved Players
        </Title>

        {loading ? (
          <ActivityIndicator animating={true} size="large" />
        ) : profiles.length === 0 ? (
          <Text style={{ textAlign: 'center' }}>No profiles yet.</Text>
        ) : (
          profiles.map((player) => (
            <Card key={player.id} style={{ marginBottom: 12 }}>
              <Card.Content>
                <Title>
                  {getFlagEmoji(player.nationality)} {player.name}
                </Title>
                {player.ranking && <Text>Ranking: {player.ranking}</Text>}
                {player.dob && (<Text>Age: {calculateAge(player.dob)}</Text>)}

                {player.nationality && <Text>Nationality: {player.nationality}</Text>}
                {player.notes && <Text>Notes: {player.notes}</Text>}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
