import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, List, Menu, useTheme,} from 'react-native-paper';
import { db } from '../../services/database/firebaseConfig';
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../../services/database/firebaseConfig';

type Player = {
  id: string;
  name: string;
  nationality?: string;
  ranking?: string;
  dob?: string;
  userId?: string;
};

export default function NewMatchScreen() {
  const theme = useTheme();

  // Form state hooks
  const [opponent, setOpponent] = useState('');
  const [opponentSuggestions, setOpponentSuggestions] = useState<any[]>([]);
  const [surface, setSurface] = useState('');
  const [matchType, setMatchType] = useState('');
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  const [menuSurfaceVisible, setMenuSurfaceVisible] = useState(false);
  const [menuMatchTypeVisible, setMenuMatchTypeVisible] = useState(false);


  // Fetch opponent suggestions from Firestore
  const fetchOpponentSuggestions = async (text: string) => {
    const user = auth.currentUser;
    if (!user || !text.trim()) {
      setOpponentSuggestions([]);
      return;
    }
  
    try {
      // Query all player profiles, not just the current user's
      const q = query(
        collection(db, 'players'),
        orderBy('name')
      );
  
      const snapshot = await getDocs(q);
      const filtered: Player[] = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Player))
        .filter((player) => 
          player.name.toLowerCase().includes(text.toLowerCase()) && 
          player.userId !== user.uid // Exclude the current user's profile
        );
  
      setOpponentSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
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

  // Placeholder — later this will submit to Firestore
  const handleSaveMatch = async () => {
    // Basic validation
    if (!opponent || !surface || !matchType || !score) {
      alert('Please fill in all required fields.');
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
  
      await addDoc(collection(db, 'matches'), {
        userId: user.uid,
        opponent,
        surface,
        matchType,
        score,
        notes,
        opponentProfile: selectedProfile ? {
          ranking: selectedProfile.ranking || null,
          nationality: selectedProfile.nationality || null,
          dob: selectedProfile.dob || null,
        } : null,
        date: new Date().toISOString(),
        createdAt: serverTimestamp(),
      });
  
      alert('Match saved successfully!');
      // Optional: reset form
      setOpponent('');
      setSurface('');
      setMatchType('');
      setScore('');
      setNotes('');
    } catch (error) {
      console.error('Error saving match:', error);
      alert('Error saving match. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          flexGrow: 1,
          justifyContent: 'center',
        }}
      >
        <Title style={{ textAlign: 'center', marginBottom: 24 }}>
          New Match
        </Title>

        {/* Opponent Field (smart player profiles will hook in later) */}
        <TextInput
          label="Opponent"
          value={opponent}
          onChangeText={(text) => {
            setOpponent(text);
            setSelectedProfile(null); // reset autofill
            fetchOpponentSuggestions(text);
          }}
          mode="outlined"
          style={{ marginBottom: 4 }}
        />
        {opponentSuggestions.map((player) => (
          <List.Item
            key={player.id}
            title={`${player.name} ${player.nationality || ''}`}
            description={`Ranking: ${player.ranking || 'N/A'}${player.dob ? ` • Age: ${calculateAge(player.dob)}` : ''}`}
            onPress={() => {
              setSelectedProfile(player);
              setOpponent(player.name);
              setOpponentSuggestions([]); // clear suggestions
            }}
          />
        ))}
        {selectedProfile && (
          <View style={{ marginBottom: 12 }}>
            <Text>Auto-filled:</Text>
            <Text>Ranking: {selectedProfile.ranking || 'N/A'}</Text>
            <Text>Nationality: {selectedProfile.nationality || 'N/A'}</Text>
            <Text>Age: {selectedProfile.dob ? calculateAge(selectedProfile.dob) : 'N/A'}</Text>
          </View>
        )}

        {/* Surface Picker (dropdown style menu) */}
        <Menu
          visible={menuSurfaceVisible}
          onDismiss={() => setMenuSurfaceVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuSurfaceVisible(true)}
              style={{ marginBottom: 12 }}
            >
              {surface || 'Select Surface'}
            </Button>
          }
        >
          {['Hard', 'Clay', 'Grass'].map((type) => (
            <Menu.Item
              key={type}
              onPress={() => {
                setSurface(type);
                setMenuSurfaceVisible(false);
              }}
              title={type}
            />
          ))}
        </Menu>

        {/* Match Type Picker */}
        <Menu
          visible={menuMatchTypeVisible}
          onDismiss={() => setMenuMatchTypeVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuMatchTypeVisible(true)}
              style={{ marginBottom: 12 }}
            >
              {matchType || 'Select Match Type'}
            </Button>
          }
        >
          {['Singles', 'Doubles', 'Practice', 'Tournament'].map((type) => (
            <Menu.Item
              key={type}
              onPress={() => {
                setMatchType(type);
                setMenuMatchTypeVisible(false);
              }}
              title={type}
            />
          ))}
        </Menu>

        {/* Score Input */}
        <TextInput
          label="Score (e.g. 6-4, 6-3)"
          value={score}
          onChangeText={setScore}
          mode="outlined"
          style={{ marginBottom: 12 }}
        />

        {/* Notes Input */}
        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          mode="outlined"
          style={{ marginBottom: 20 }}
        />

        {/* Save Button */}
        <Button mode="contained" onPress={handleSaveMatch}>
          Save Match
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
