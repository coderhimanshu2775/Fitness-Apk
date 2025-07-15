import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProgressChart() {
  const [stepGoal, setStepGoal] = useState(8000);   // Default fallback
  const [waterGoal, setWaterGoal] = useState(8);
  const [currentSteps, setCurrentSteps] = useState(4500);  // Placeholder
  const [currentWater, setCurrentWater] = useState(4);      // Placeholder

  useEffect(() => {
    const loadData = async () => {
      const storedSteps = await AsyncStorage.getItem('@step_goal');
      const storedWater = await AsyncStorage.getItem('@water_goal');
      if (storedSteps) setStepGoal(Number(storedSteps));
      if (storedWater) setWaterGoal(Number(storedWater));

      // TODO: Replace with actual tracked values from AsyncStorage
      const storedCurrentSteps = await AsyncStorage.getItem('@current_steps');
      const storedCurrentWater = await AsyncStorage.getItem('@water_intake');
      if (storedCurrentSteps) setCurrentSteps(Number(storedCurrentSteps));
      if (storedCurrentWater) setCurrentWater(Number(storedCurrentWater));
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Progress Chart</Text>
      <BarChart
        data={{
          labels: ['Steps', 'Water'],
          datasets: [
            {
              data: [currentSteps, currentWater],
              colors: [(opacity = 1) => `rgba(0, 150, 136, ${opacity})`, (opacity = 1) => `rgba(33, 150, 243, ${opacity})`]
            },
            {
              data: [stepGoal, waterGoal],
              colors: [(opacity = 1) => `rgba(200, 200, 200, ${opacity})`, (opacity = 1) => `rgba(200, 200, 200, ${opacity})`]
            },
          ],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisSuffix=""
        fromZero
        showValuesOnTopOfBars
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#e3f2fd',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withInnerLines={false}
        verticalLabelRotation={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fce4ec',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
