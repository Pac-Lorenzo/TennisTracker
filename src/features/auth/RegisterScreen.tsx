import React from 'react';
import { View, Text, Button } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Register Screen</Text>
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
}
