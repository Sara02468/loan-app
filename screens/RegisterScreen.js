import axios from 'axios';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const API_URL = 'http://10.100.232.148:8080/api/auth/register';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await axios.post(API_URL, {
      firstName,
      lastName,
      email,
      phone,
      password
});


      Alert.alert('Success', 'Registration successful');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Registration Failed', 'Try a different email or check the backend');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register as a Client</Text>

      <TextInput
      style={styles.input}
      placeholder="First Name"
      value={firstName}
      onChangeText={setFirstName}
      />

      <TextInput
      style={styles.input}
      placeholder="Last Name"
      value={lastName}
      onChangeText={setLastName}
      />

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
        placeholder="Phone Number"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffffff' // Clean white background
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#b50018' // BKT red
  },
  input: {
    borderWidth: 1,
    borderColor: '#b50018',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    color: '#000' // black text
  },
  link: {
    marginTop: 16,
    color: '#b50018',
    textAlign: 'center',
    fontWeight: '500'
  },
  button: {
  backgroundColor: '#b50018',
  paddingVertical: 12,
  borderRadius: 6,
  alignItems: 'center'
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600'
}

});
