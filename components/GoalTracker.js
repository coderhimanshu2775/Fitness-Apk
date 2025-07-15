import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { DashboardRefreshContext } from '../App';

const screenWidth = Dimensions.get('window').width - 56;

function getDateKey(base, date) {
  return `${base}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getTodayKey(base) {
  const d = new Date();
  return getDateKey(base, d);
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(new Date(d));
  }
  return days;
}

export default function GoalTracker() {
  const [stepGoal, setStepGoal] = useState('');
  const [waterGoal, setWaterGoal] = useState('');
  const [sleepGoal, setSleepGoal] = useState('');
  const [calGoal, setCalGoal] = useState('');
  const [sleep, setSleep] = useState('');
  const [calories, setCalories] = useState('');
  const [saved, setSaved] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const { refreshDashboard } = useContext(DashboardRefreshContext);

  const saveMicroGoal = async (base, value) => {
    const key = getTodayKey(base);
    await AsyncStorage.setItem(key, JSON.stringify(value));
    refreshDashboard();
  };

  const loadGraphData = async (stepGoalVal, waterGoalVal, sleepGoalVal, calGoalVal) => {
    const days = getLast7Days();
    const stepData = [];
    const waterData = [];
    const sleepData = [];
    const calData = [];
    for (let d of days) {
      const stepKey = getDateKey('@step_count', d);
      const waterKey = getDateKey('@water_count', d);
      const sleepKey = getDateKey('@sleep', d);
      const calKey = getDateKey('@calories', d);
      let steps = await AsyncStorage.getItem(stepKey);
      let water = await AsyncStorage.getItem(waterKey);
      let sleepV = await AsyncStorage.getItem(sleepKey);
      let calV = await AsyncStorage.getItem(calKey);
      steps = steps ? parseInt(steps) : 0;
      water = water ? parseInt(water) : 0;
      sleepV = sleepV ? parseFloat(sleepV) : 0;
      calV = calV ? parseInt(calV) : 0;
      stepData.push(stepGoalVal ? Math.min(steps / parseInt(stepGoalVal || 1), 1) : 0);
      waterData.push(waterGoalVal ? Math.min(water / parseInt(waterGoalVal || 1), 1) : 0);
      sleepData.push(sleepGoalVal ? Math.min(sleepV / parseFloat(sleepGoalVal || 1), 1) : 0);
      calData.push(calGoalVal ? Math.min(calV / parseInt(calGoalVal || 1), 1) : 0);
    }
    setGraphData({
      labels: days.map(d => d.toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [
        {
          data: stepData,
          color: (opacity = 1) => `rgba(79, 142, 247, ${opacity})`,
          strokeWidth: 3,
        },
        {
          data: waterData,
          color: (opacity = 1) => `rgba(0, 230, 118, ${opacity})`,
          strokeWidth: 3,
        },
        {
          data: sleepData,
          color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
          strokeWidth: 3,
        },
        {
          data: calData,
          color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
          strokeWidth: 3,
        },
      ],
      legend: ['Steps', 'Water', 'Sleep', 'Calories'],
    });
  };

  const saveGoals = async () => {
    await AsyncStorage.setItem('@step_goal', stepGoal);
    await AsyncStorage.setItem('@water_goal', waterGoal);
    await AsyncStorage.setItem('@sleep_goal', sleepGoal);
    await AsyncStorage.setItem('@cal_goal', calGoal);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    loadGraphData(stepGoal, waterGoal, sleepGoal, calGoal);
    refreshDashboard();
  };

  const loadGoals = async () => {
    const steps = await AsyncStorage.getItem('@step_goal');
    const water = await AsyncStorage.getItem('@water_goal');
    const sleepG = await AsyncStorage.getItem('@sleep_goal');
    const calG = await AsyncStorage.getItem('@cal_goal');
    if (steps) setStepGoal(steps);
    if (water) setWaterGoal(water);
    if (sleepG) setSleepGoal(sleepG);
    if (calG) setCalGoal(calG);
    if (steps && water && sleepG && calG) loadGraphData(steps, water, sleepG, calG);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // Save today's sleep and calories when changed
  useEffect(() => {
    if (sleep) saveMicroGoal('@sleep', sleep);
  }, [sleep]);
  useEffect(() => {
    if (calories) saveMicroGoal('@calories', calories);
  }, [calories]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎯 Daily Goals</Text>
      <TextInput
        style={styles.input}
        placeholder="Step Goal (e.g. 8000)"
        placeholderTextColor="rgba(255,255,255,0.7)"
        keyboardType="numeric"
        value={stepGoal}
        onChangeText={setStepGoal}
      />
      <TextInput
        style={styles.input}
        placeholder="Water Goal (glasses)"
        placeholderTextColor="rgba(255,255,255,0.7)"
        keyboardType="numeric"
        value={waterGoal}
        onChangeText={setWaterGoal}
      />
      <TextInput
        style={styles.input}
        placeholder="Sleep Goal (hours)"
        placeholderTextColor="rgba(255,255,255,0.7)"
        keyboardType="numeric"
        value={sleepGoal}
        onChangeText={setSleepGoal}
      />
      <TextInput
        style={styles.input}
        placeholder="Calories Burn Goal"
        placeholderTextColor="rgba(255,255,255,0.7)"
        keyboardType="numeric"
        value={calGoal}
        onChangeText={setCalGoal}
      />
      <Button title="Save Goals" onPress={saveGoals} color="#4F8EF7" />
      {saved && <Text style={styles.saved}>✅ Goals saved!</Text>}
      {graphData && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.graphTitle}>Weekly Goal Achievement</Text>
          <LineChart
            data={graphData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.graph}
          />
          <View style={styles.microGoalsContainer}>
            <Text style={styles.microTitle}>Micro-Goals</Text>
            <View style={styles.microRow}>
              <Text style={styles.microLabel}>Sleep (hrs):</Text>
              <TextInput
                style={styles.microInput}
                placeholder="e.g. 7"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                value={sleep}
                onChangeText={setSleep}
              />
              <Text style={styles.microProgress}>{sleepGoal ? `${sleep}/${sleepGoal}` : ''}</Text>
            </View>
            <View style={styles.microRow}>
              <Text style={styles.microLabel}>Calories Burned:</Text>
              <TextInput
                style={styles.microInput}
                placeholder="e.g. 500"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
              />
              <Text style={styles.microProgress}>{calGoal ? `${calories}/${calGoal}` : ''}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: 'rgba(0,0,0,0.7)',
  backgroundGradientTo: 'rgba(0,0,0,0.7)',
  color: (opacity = 1) => `rgba(79, 142, 247, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#fff',
  },
  propsForBackgroundLines: {
    stroke: 'rgba(255,255,255,0.1)',
  },
};

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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    color: '#fff',
    fontSize: 16,
  },
  saved: {
    marginTop: 10,
    color: '#4F8EF7',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  graphTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  graph: {
    borderRadius: 16,
    marginVertical: 8,
  },
  microGoalsContainer: {
    marginTop: 18,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 14,
    padding: 12,
  },
  microTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  microRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  microLabel: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  microInput: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 15,
    width: 60,
    marginHorizontal: 8,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    textAlign: 'center',
  },
  microProgress: {
    color: '#4F8EF7',
    fontWeight: 'bold',
    fontSize: 15,
    minWidth: 40,
    textAlign: 'right',
  },
});
