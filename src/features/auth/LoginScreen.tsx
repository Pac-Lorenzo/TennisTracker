import React from 'react';
import { View, Text, Button } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Login Screen</Text>
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}