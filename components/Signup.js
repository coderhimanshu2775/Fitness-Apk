// components/Signup.js
import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';

export default function Signup({ onSignedUp, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [buttonAnim] = useState(new Animated.Value(1));
  const formAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignedUp(); 
    } catch (e) {
      setError(e.message);
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require('../assets/signup-bg.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.centered}>
          <Animated.View
            style={{
              opacity: formAnim,
              transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join HealthSync today</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.input}
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.input}
              onChangeText={setPassword}
              value={password}
            />
            <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={handleSignup}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={onSwitchToLogin} style={styles.switchLink}>
              <Text style={styles.switchText}>Already have an account? <Text style={styles.switchTextBold}>Login</Text></Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 18,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  input: {
    width: 260,
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  button: {
    width: 180,
    height: 48,
    backgroundColor: '#4F8EF7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  error: {
    color: '#e74c3c',
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  switchLink: {
    marginTop: 18,
  },
  switchText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  switchTextBold: {
    color: '#4F8EF7',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
