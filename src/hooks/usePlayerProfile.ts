import { useEffect, useState } from 'react';
import { auth, db } from '../services/database/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export function usePlayerProfile() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, 'players', user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setProfile({ id: snapshot.id, ...snapshot.data() });
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
