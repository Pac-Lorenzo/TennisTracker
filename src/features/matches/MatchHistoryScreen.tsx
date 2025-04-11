import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Title, Card, ActivityIndicator, useTheme,} from 'react-native-paper';
import { db } from '../../services/database/firebaseConfig';
import { collection, query, where, orderBy, getDocs,} from 'firebase/firestore';
import { auth } from '../../services/database/firebaseConfig';

export default function MatchHistoryScreen() {
  const theme = useTheme();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'matches'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMatches(data);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}>
      <Title style={{ textAlign: 'center', marginBottom: 20 }}>Match History</Title>

      {loading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : matches.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>No matches yet.</Text>
      ) : (
        <ScrollView>
          {matches.map((match) => (
            <Card key={match.id} style={{ marginBottom: 12 }}>
              <Card.Content>
                <Title>{match.opponent}</Title>
                <Text>Score: {match.score}</Text>
                <Text>Surface: {match.surface}</Text>
                <Text>Type: {match.matchType}</Text>
                {match.notes && <Text>Notes: {match.notes}</Text>}
                <Text style={{ marginTop: 4, fontSize: 12, color: theme.colors.onSurfaceVariant }}>
                  {match.date ? `Date: ${new Date(match.date).toLocaleDateString()}` : 'Date unknown'}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
