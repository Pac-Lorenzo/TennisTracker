import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, Menu, useTheme,} from 'react-native-paper';
import { db } from '../../services/database/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../../services/database/firebaseConfig';


export default function NewMatchScreen() {
  const theme = useTheme();

  // Form state hooks
  const [opponent, setOpponent] = useState('');
  const [surface, setSurface] = useState('');
  const [matchType, setMatchType] = useState('');
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');

  const [menuSurfaceVisible, setMenuSurfaceVisible] = useState(false);
  const [menuMatchTypeVisible, setMenuMatchTypeVisible] = useState(false);

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
        date: new Date().toISOString(), // for now
        createdAt: serverTimestamp(), // Firestore timestamp
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
          label="Opponent Name"
          value={opponent}
          onChangeText={setOpponent}
          mode="outlined"
          style={{ marginBottom: 12 }}
        />

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
