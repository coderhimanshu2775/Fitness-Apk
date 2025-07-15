import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DashboardRefreshContext } from '../App';

function getTodayKey() {
  const d = new Date();
  return `@water_count_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function WaterTracker() {
  const [count, setCount] = useState(0);
  const [waterGoal, setWaterGoal] = useState(null);
  const scale = new Animated.Value(1);
  const { refreshDashboard } = useContext(DashboardRefreshContext);

  const storeCount = async (val) => {
    const key = getTodayKey();
    await AsyncStorage.setItem(key, JSON.stringify(val));
    await AsyncStorage.setItem('@water_count', JSON.stringify(val)); // legacy for backward compatibility
    refreshDashboard();
  };

  const loadCount = async () => {
    const key = getTodayKey();
    let stored = await AsyncStorage.getItem(key);
    if (!stored) {
      stored = await AsyncStorage.getItem('@water_count');
    }
    if (stored) setCount(JSON.parse(stored));
    else setCount(0);
    // Load water goal
    const wg = await AsyncStorage.getItem('@water_goal');
    setWaterGoal(wg ? parseInt(wg) : null);
  };

  const addWater = () => {
    const newCount = count + 1;
    setCount(newCount);
    storeCount(newCount);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    loadCount();
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Water Intake</Text>
      <Animated.Text style={[styles.count, { transform: [{ scale }] }]}>
        {count} {waterGoal ? `/ ${waterGoal}` : ''} Glasses
      </Animated.Text>
      <Button title="Add Water" onPress={addWater} />
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
  count: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#4F8EF7',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
