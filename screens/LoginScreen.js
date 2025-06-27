import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://10.100.232.148:8080/api/auth/login';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { role } = route.params || {};

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(API_URL, { email, password, role });
      const { token, role: returnedRole } = response.data;
      await signIn(token, returnedRole);
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {role === 'EMPLOYEE' ? 'Punonjës Login' : 'Klient Login'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {role === 'CLIENT' && (
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#b50018'
  },
  input: {
    borderWidth: 1,
    borderColor: '#b50018',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    color: '#000'
  },
  button: {
    backgroundColor: '#b50018',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  link: {
    marginTop: 16,
    color: '#b50018',
    textAlign: 'center',
    fontWeight: '500'
  }
});
