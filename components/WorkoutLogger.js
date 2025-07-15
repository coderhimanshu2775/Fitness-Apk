import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DashboardRefreshContext } from '../App';

export default function WorkoutLogger() {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const { refreshDashboard } = useContext(DashboardRefreshContext);

  const saveWorkout = async () => {
    if (!type || !duration) return;
    const newWorkout = { type, duration, date: new Date().toLocaleString() };
    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    await AsyncStorage.setItem('@workouts', JSON.stringify(updated));
    setType('');
    setDuration('');
    refreshDashboard();
  };

  const loadWorkouts = async () => {
    const data = await AsyncStorage.getItem('@workouts');
    if (data) setWorkouts(JSON.parse(data));
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Workout Logger</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout Type (e.g., Running)"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (mins)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <Button title="Save Workout" onPress={saveWorkout} />
      <Text style={styles.subheading}>History</Text>
      <View style={styles.historyList}>
        {workouts.length === 0 && <Text style={styles.item}>No workouts yet.</Text>}
        {workouts.map((item, index) => (
          <Text style={styles.item} key={index}>
            {item.type} - {item.duration} min ({item.date})
          </Text>
        ))}
      </View>
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
  },
  subheading: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#fff',
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
  item: {
    marginVertical: 4,
    fontSize: 14,
    color: '#fff',
  },
  historyList: {
    maxHeight: 150,
  },
});
