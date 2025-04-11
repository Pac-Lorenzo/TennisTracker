import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/database/firebaseConfig';
import { useAuth } from '../../hooks/useAuths';
import { useUserStore } from '../../store/useUserStore';

export default function RegisterScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { register, loading, error } = useAuth();

    const { setUser } = useUserStore();

    const handleRegister = async () => {
        await register(email, password);
        const user = auth.currentUser;
        if (user) {
            setUser(user); // Store user globally
            navigation.replace('Home');
        }
    }
    return (
        <View style={{ padding: 20 }}>
            <Text>Email</Text>
            <TextInput
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                onChangeText={setEmail}
                value={email}
            />
            <Text>Password</Text>
            <TextInput
                placeholder="Enter your password"
                secureTextEntry
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                onChangeText={setPassword}
                value={password}
            />

            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            
            <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister}/>
            <Button title="Back to Login" onPress={() => navigation.goBack()} />
        </View>
     );
}

//OLD REGISTERSCREEN
{/* <Text>Email</Text>
            <TextInput
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                onChangeText={setEmail}
                value={email}
            />
            <Text>Password</Text>
            <TextInput
                placeholder="Enter your password"
                secureTextEntry
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                onChangeText={setPassword}
                value={password}
            />

            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            
            <Button title={loading ? "Registering..." : "Register"} onPress={() => register(email, password)}/>
            <Button title="Back to Login" onPress={() => navigation.goBack()} /> */}