import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DashboardRefreshContext } from '../App';

const ACTIVITIES = [
  { label: 'Running', value: 'running', met: 9.8 },
  { label: 'Walking', value: 'walking', met: 3.8 },
  { label: 'Cycling', value: 'cycling', met: 7.5 },
  { label: 'Yoga', value: 'yoga', met: 2.5 },
  { label: 'Swimming', value: 'swimming', met: 8.0 },
  { label: 'Strength Training', value: 'strength', met: 6.0 },
];

function getTodayKey() {
  const d = new Date();
  return `@calories_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function CaloriesBurnedEstimator() {
  const [activity, setActivity] = useState('running');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const { refreshDashboard } = useContext(DashboardRefreshContext);

  useEffect(() => {
    loadTodayCalories();
  }, []);

  const loadTodayCalories = async () => {
    const key = getTodayKey();
    const stored = await AsyncStorage.getItem(key);
    setTodayTotal(stored ? parseInt(stored) : 0);
  };

  const estimateCalories = async () => {
    const act = ACTIVITIES.find(a => a.value === activity);
    const w = parseFloat(weight);
    const t = parseFloat(duration);
    if (!act || !w || !t) return;
    // Calories = MET * weight (kg) * duration (hr)
    const cals = act.met * w * (t / 60);
    setCalories(cals.toFixed(0));
    // Save to today's total
    const key = getTodayKey();
    const prev = await AsyncStorage.getItem(key);
    const newTotal = (prev ? parseInt(prev) : 0) + Math.round(cals);
    await AsyncStorage.setItem(key, newTotal.toString());
    setTodayTotal(newTotal);
    refreshDashboard();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Calories Burned Estimator</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Activity:</Text>
        <Picker
          selectedValue={activity}
          style={styles.picker}
          onValueChange={setActivity}
          mode="dropdown"
        >
          {ACTIVITIES.map(a => (
            <Picker.Item key={a.value} label={a.label} value={a.value} />
          ))}
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Duration (min)"
        placeholderTextColor="rgba(255,255,255,0.7)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        placeholderTextColor="rgba(255,255,255,0.7)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TouchableOpacity style={styles.button} onPress={estimateCalories}>
        <Text style={styles.buttonText}>Estimate Calories</Text>
      </TouchableOpacity>
      {calories > 0 && (
        <Text style={styles.resultText}>Estimated: <Text style={styles.calsValue}>{calories}</Text> kcal</Text>
      )}
      <Text style={styles.todayText}>Today's Total: <Text style={styles.calsValue}>{todayTotal}</Text> kcal</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
    flex: 1,
  },
  picker: {
    flex: 2,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 8,
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
  resultText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  calsValue: {
    color: '#4F8EF7',
    fontWeight: 'bold',
  },
  todayText: {
    color: '#fff',
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
  },
}); 