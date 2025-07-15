import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';
import { DashboardRefreshContext } from '../App';

function getTodayKey() {
  const d = new Date();
  return `@step_count_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

export default function StepCounter() {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [stepGoal, setStepGoal] = useState(null);
  const progress = new Animated.Value(0);
  const { refreshDashboard } = useContext(DashboardRefreshContext);

  useEffect(() => {
    let subscription;
    Pedometer.isAvailableAsync().then(setIsAvailable);
    const subscribe = async () => {
      // Get today's steps from midnight to now
      const start = getMidnight();
      const end = new Date();
      const result = await Pedometer.getStepCountAsync(start, end);
      setSteps(result.steps);
      storeSteps(result.steps);
      // Subscribe to real-time updates
      subscription = Pedometer.watchStepCount(async ({ steps: liveSteps }) => {
        // Get new total from midnight to now
        const now = new Date();
        const todayResult = await Pedometer.getStepCountAsync(getMidnight(), now);
        setSteps(todayResult.steps);
        storeSteps(todayResult.steps);
      });
      // Load step goal
      const sg = await AsyncStorage.getItem('@step_goal');
      setStepGoal(sg ? parseInt(sg) : null);
    };
    subscribe();
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const storeSteps = async (val) => {
    const key = getTodayKey();
    await AsyncStorage.setItem(key, JSON.stringify(val));
    refreshDashboard();
  };

  useEffect(() => {
    Animated.timing(progress, {
      toValue: stepGoal ? steps / stepGoal : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [steps, stepGoal]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Step Count</Text>
      {!isAvailable && <Text style={styles.steps}>Step counter not available on this device.</Text>}
      {isAvailable && (
        <>
          <Text style={styles.steps}>{steps} {stepGoal ? `/ ${stepGoal}` : ''} steps</Text>
          <View style={styles.progressBackground}>
            <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
          </View>
        </>
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
  },
  steps: {
    fontSize: 18,
    marginVertical: 10,
    color: '#fff',
  },
  progressBackground: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#4F8EF7',
  },
});
