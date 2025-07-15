import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WORKOUTS = [
  'Push-ups',
  'Squats',
  'Plank',
  'Jumping Jacks',
  'Lunges',
  'Burpees',
  'Mountain Climbers',
  'Crunches',
  'Yoga',
  'Running',
  'Cycling',
];

function getTodayKey() {
  const d = new Date();
  return `@workout_today_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function WorkoutRecommendation() {
  const [recommended, setRecommended] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    recommendWorkout();
  }, []);

  const recommendWorkout = async () => {
    // Get today's workout if already done
    const todayKey = getTodayKey();
    const todayWorkout = await AsyncStorage.getItem(todayKey);
    if (todayWorkout) {
      setRecommended(todayWorkout);
      setDone(true);
      return;
    }
    // Get recent workouts from log
    const log = await AsyncStorage.getItem('@workouts');
    let recent = [];
    if (log) {
      try {
        recent = JSON.parse(log).map(w => w.type);
      } catch {}
    }
    // Recommend a workout not done most recently
    let rec = WORKOUTS.find(w => !recent.includes(w));
    if (!rec) rec = WORKOUTS[Math.floor(Math.random() * WORKOUTS.length)];
    setRecommended(rec);
    setDone(false);
  };

  const markAsDone = async () => {
    const todayKey = getTodayKey();
    await AsyncStorage.setItem(todayKey, recommended);
    // Optionally, add to workout log
    const log = await AsyncStorage.getItem('@workouts');
    let workouts = log ? JSON.parse(log) : [];
    workouts.unshift({ type: recommended, duration: '15', date: new Date().toLocaleString() });
    await AsyncStorage.setItem('@workouts', JSON.stringify(workouts));
    setDone(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today's Workout Recommendation</Text>
      <Text style={styles.recommendText}>{recommended ? recommended : 'Loading...'}</Text>
      {!done && recommended && (
        <TouchableOpacity style={styles.button} onPress={markAsDone}>
          <Text style={styles.buttonText}>Mark as Done</Text>
        </TouchableOpacity>
      )}
      {done && <Text style={styles.doneText}>✅ Done for today!</Text>}
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
  recommendText: {
    color: '#4F8EF7',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
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
  doneText: {
    color: '#00e676',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
}); 