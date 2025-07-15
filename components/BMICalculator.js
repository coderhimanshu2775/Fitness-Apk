import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { DashboardRefreshContext } from '../App';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const { refreshDashboard } = useContext(DashboardRefreshContext);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return;
    const bmiValue = w / (h * h);
    setBmi(bmiValue.toFixed(1));
    if (bmiValue < 18.5) setCategory('Underweight');
    else if (bmiValue < 25) setCategory('Normal');
    else if (bmiValue < 30) setCategory('Overweight');
    else setCategory('Obese');
    refreshDashboard();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>BMI Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        placeholderTextColor="rgba(255,255,255,0.7)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        placeholderTextColor="rgba(255,255,255,0.7)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>
      {bmi && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>BMI: <Text style={styles.bmiValue}>{bmi}</Text></Text>
          <Text style={styles.resultText}>Category: <Text style={styles.bmiValue}>{category}</Text></Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 18,
    borderRadius: 22,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    color: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F8EF7',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  resultBox: {
    marginTop: 14,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 2,
  },
  bmiValue: {
    color: '#4F8EF7',
    fontWeight: 'bold',
  },
}); 