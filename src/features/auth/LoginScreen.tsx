import React from 'react';
import { useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/database/firebaseConfig';
import { View, Text, TextInput, Alert, Button } from 'react-native';
import { useAuth } from '../../hooks/useAuths';
import { useUserStore } from '../../store/useUserStore';


export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error} = useAuth();

    const { setUser } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                navigation.replace('Home');
            }
        });
        return unsubscribe;
    }, []);

    const handleLogin = async () => {
        await login(email, password);
        const user = auth.currentUser;
        if (user) {
            setUser(user); // Store user globally
            navigation.replace('Home');
        }
    }


  return (
    <View style={{ padding: 20 }}>
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

        
    </View>
  );
}




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