import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, useTheme, Text, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/database/firebaseConfig';
import { useAuth } from '../../hooks/useAuths';
import { useUserStore } from '../../store/useUserStore';

export default function RegisterScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { register, loading, error } = useAuth();
    const theme = useTheme();
    const { setUser } = useUserStore();

    const handleRegister = async () => {
        await register(email, password);
        const user = auth.currentUser;
        if (user) {
            setUser(user); // Store user globally
            navigation.replace('ProfileSetUpScreen'); // Redirect to profile setup
        }
    }
    return (
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.colors.background,}}
    >
      <View>
        <Title style={{ textAlign: 'center', marginBottom: 16 }}>Register</Title>

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

        <Button mode="contained" loading={loading} onPress={handleRegister}>
          Register
        </Button>

        {error && (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{error}</Text>
        )}

        <Button mode="text" onPress={() => navigation.goBack()}>
          Already have an account? Login
        </Button>
      </View>
    </KeyboardAvoidingView>
     );
}

//OLD REGISTERSCREEN

{/* <View style={{ padding: 20 }}>
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
        </View> */}


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