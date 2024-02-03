import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Implement your login logic here
  };

  const navigateToRegistration = () => {
    navigation.navigate('Registration'); // Replace 'Registration' with your registration screen name
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        accessibilityLabel="Email Input"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        accessibilityLabel="Password Input"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        accessibilityLabel="Login Button"
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.socialLogin}>
        <Text style={styles.socialLoginText}>Or log in with</Text>
        <Icon
          name="facebook"
          type="font-awesome"
          size={40}
          onPress={() => console.log('Facebook login')}
          accessible={true}
          accessibilityLabel="Facebook Login Button"
        />
        <Icon
          name="google"
          type="font-awesome"
          size={40}
          onPress={() => console.log('Google login')}
          accessible={true}
          accessibilityLabel="Google Login Button"
        />
      </View>

      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={navigateToRegistration}
        accessibilityLabel="Create Account Button"
      >
        <Text style={styles.buttonText}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  forgotPassword: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  socialLogin: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialLoginText: {
    marginRight: 10,
  },
  createAccountButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
});

export default LoginScreen;
