import React from 'react';
import { useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/database/firebaseConfig';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, useTheme, Title } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/database/firebaseConfig';
import { useAuth } from '../../hooks/useAuths';
import { useUserStore } from '../../store/useUserStore';


export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error} = useAuth();
    const theme = useTheme();
    const { setUser } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user){
                // Check if user has a profile
                const profileRef = doc(db, 'players', user.uid);
                const profileDoc = await getDoc(profileRef);
                
                if (profileDoc.exists()) {
                    const profile = profileDoc.data();
                    useUserStore.getState().setUser({ ...user, ...profile });
                    navigation.replace('Home');
                } else {
                    useUserStore.getState().setUser(user);
                    navigation.replace('ProfileSetUpScreen');
                }
            }
        });
        return unsubscribe;
    }, []);

    const handleLogin = async () => {
        await login(email, password);
        const user = auth.currentUser;
        if (user) {
          const ref = doc(db, 'players', user.uid);
          const profileDoc = await getDoc(ref);
          if (profileDoc.exists()) {
            const profile = profileDoc.data();
            useUserStore.getState().setUser({ ...user, ...profile });
            navigation.replace('Home');
          } else {
            useUserStore.getState().setUser(user);
            navigation.replace('ProfileSetUpScreen');
          }
        }
    }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.colors.background, }}
    >
      <View style={{ flex:1 }}>
        <Title style={{ textAlign: 'center', marginBottom: 16 }}>Login</Title>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ marginBottom: 12 }}
        />

        <Button mode="contained" loading={loading} onPress={handleLogin}>
          Login
        </Button>

        {error && (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{error}</Text>
        )}

        <Button mode="text" onPress={() => navigation.navigate('Register')}>
          Don't have an account? Register
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}



//OLD LOGIN SCREEN CODE
{/* <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        onChangeText={setEmail}
        value={email}
        />
      <TextInput 
        placeholder="Enter your password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        onChangeText={setPassword}
        value={password}
        />
      {error && <Text style={{ color:'red' }}>{error}</Text>}
      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin}/>
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />

        
    </View> */}

//OLD LOGIN SCREEN CODE
{/* <Text>Email</Text>
      <TextInput
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8}}
        onChangeText={setEmail}
        value={email}
      />
      <Text>Password</Text>
        <TextInput
            placeholder="Enter your password"
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 10, padding: 8}}
            onChangeText={setPassword}
            value={password}
        />

      {error && <Text style={{ color:'red' }}>{error}</Text>}

      <Button title={loading ? "Logging in..." : "Login"} onPress={() => login(email, password)}/>
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} /> */}