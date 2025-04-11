import React, { useEffect, useState } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, Card, useTheme, ActivityIndicator,} from 'react-native-paper';
import { db } from '../../services/database/firebaseConfig';
import { collection, addDoc, getDocs, query, where, serverTimestamp, orderBy,} from 'firebase/firestore';
import { auth } from '../../services/database/firebaseConfig';

export default function PlayerProfileScreen() {
  const theme = useTheme();

  // Form state
  const [name, setName] = useState('');
  const [ranking, setRanking] = useState('');
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
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

      await addDoc(collection(db, 'players'), {
        userId: user.uid,
        name,
        ranking,
        age: age ? parseInt(age) : null,
        nationality,
        notes,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setName('');
      setRanking('');
      setAge('');
      setNationality('');
      setNotes('');
      fetchProfiles(); // reload list
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile.');
    }
  };

  // Fetch profiles from Firestore
  const fetchProfiles = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'players'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProfiles(data);
    } catch (err) {
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

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

        <TextInput
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Nationality"
          value={nationality}
          onChangeText={setNationality}
          mode="outlined"
          style={{ marginBottom: 12 }}
        />

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
                <Title>{player.name}</Title>
                {player.ranking && <Text>Ranking: {player.ranking}</Text>}
                {player.age && <Text>Age: {player.age}</Text>}
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
