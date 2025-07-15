import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Pedometer } from 'expo-sensors';
import { ProgressBar } from 'react-native-paper';

import Signup from './components/Signup';
import Login from './components/Login';
import WaterTracker from './components/WaterTracker';
import StepCounter from './components/StepCounter';
import WorkoutLogger from './components/WorkoutLogger';
import GoalTracker from './components/GoalTracker';
import BMICalculator from './components/BMICalculator';
import CaloriesBurnedEstimator from './components/CaloriesBurnedEstimator';
import WorkoutRecommendation from './components/WorkoutRecommendation';
import Loader from './components/Loader';

export const DashboardRefreshContext = createContext({ refreshDashboard: () => {}, dashboardRefreshKey: 0 });

const screenWidth = Dimensions.get('window').width;

function getTodayKey(base) {
  const d = new Date();
  return `${base}_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

function TodayProgressCard({ user }) {
  const [steps, setSteps] = useState(null);
  const [water, setWater] = useState(null);
  const [calories, setCalories] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [stepGoal, setStepGoal] = useState(null);
  const [waterGoal, setWaterGoal] = useState(null);
  const [calGoal, setCalGoal] = useState(null);
  const [sleepGoal, setSleepGoal] = useState(null);
  const { dashboardRefreshKey } = useContext(DashboardRefreshContext);

  useEffect(() => {
    const fetchData = async () => {
      const stepKey = getTodayKey('@step_count');
      const waterKey = getTodayKey('@water_count');
      const calKey = getTodayKey('@calories');
      const sleepKey = getTodayKey('@sleep');
      const [s, w, c, sl, sg, wg, cg, sg2] = await Promise.all([
        AsyncStorage.getItem(stepKey),
        AsyncStorage.getItem(waterKey),
        AsyncStorage.getItem(calKey),
        AsyncStorage.getItem(sleepKey),
        AsyncStorage.getItem('@step_goal'),
        AsyncStorage.getItem('@water_goal'),
        AsyncStorage.getItem('@cal_goal'),
        AsyncStorage.getItem('@sleep_goal'),
      ]);
      setSteps(s ? parseInt(s) : 0);
      setWater(w ? parseInt(w) : 0);
      setCalories(c ? parseInt(c) : 0);
      setSleep(sl ? parseFloat(sl) : 0);
      setStepGoal(sg ? parseInt(sg) : null);
      setWaterGoal(wg ? parseInt(wg) : null);
      setCalGoal(cg ? parseInt(cg) : null);
      setSleepGoal(sg2 ? parseFloat(sg2) : null);

      // Fetch today's steps from midnight to now
      let todaySteps = 0;
      try {
        const start = getMidnight();
        const end = new Date();
        const result = await Pedometer.getStepCountAsync(start, end);
        todaySteps = result.steps;
      } catch (e) {}
      setSteps(todaySteps);
    };
    fetchData();
  }, [dashboardRefreshKey]);

  const stepProgress = stepGoal ? Math.min(steps / stepGoal, 1) : 0;
  const waterProgress = waterGoal ? Math.min(water / waterGoal, 1) : 0;
  const calProgress = calGoal ? Math.min(calories / calGoal, 1) : 0;
  const sleepProgress = sleepGoal ? Math.min(sleep / sleepGoal, 1) : 0;

  return (
    <View style={styles.progressCard}>
      <Text style={styles.progressTitle}>Today’s Progress</Text>
      <View style={styles.progressRow}>
        <View style={styles.progressItem}>
          <Text style={styles.progressStat}>🚶‍♂️ {steps === null ? '...' : steps}{stepGoal ? ` / ${stepGoal}` : ''}</Text>
          <Text style={styles.progressLabel}>Steps</Text>
          {stepGoal && (
            <ProgressBar progress={stepProgress} color="#4F8EF7" style={styles.progressBarSummary} />
          )}
          {stepGoal && (
            <Text style={styles.progressPercent}>{Math.round(stepProgress * 100)}%</Text>
          )}
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressStat}>💧 {water === null ? '...' : water}{waterGoal ? ` / ${waterGoal}` : ''}</Text>
          <Text style={styles.progressLabel}>Water</Text>
          {waterGoal && (
            <ProgressBar progress={waterProgress} color="#00e676" style={styles.progressBarSummary} />
          )}
          {waterGoal && (
            <Text style={styles.progressPercent}>{Math.round(waterProgress * 100)}%</Text>
          )}
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressStat}>🔥 {calories === null ? '...' : calories}{calGoal ? ` / ${calGoal}` : ''}</Text>
          <Text style={styles.progressLabel}>Calories</Text>
          {calGoal && (
            <ProgressBar progress={calProgress} color="#ff9800" style={styles.progressBarSummary} />
          )}
          {calGoal && (
            <Text style={styles.progressPercent}>{Math.round(calProgress * 100)}%</Text>
          )}
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressStat}>😴 {sleep === null ? '...' : sleep}{sleepGoal ? ` / ${sleepGoal}` : ''}</Text>
          <Text style={styles.progressLabel}>Sleep</Text>
          {sleepGoal && (
            <ProgressBar progress={sleepProgress} color="#ffd600" style={styles.progressBarSummary} />
          )}
          {sleepGoal && (
            <Text style={styles.progressPercent}>{Math.round(sleepProgress * 100)}%</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);

  const refreshDashboard = () => setDashboardRefreshKey(k => k + 1);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Show loader for 5 seconds
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [loading]);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return showLogin ? (
      <Login onLoggedIn={() => setShowLogin(false)} />
    ) : (
      <Signup onSignedUp={() => setShowLogin(true)} onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <DashboardRefreshContext.Provider value={{ refreshDashboard, dashboardRefreshKey }}>
      <ImageBackground
        source={require('./assets/login-bg.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(16,24,42,0.7)", "rgba(16,24,42,0.95)"]}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>🏋️‍♂️ Fitness Tracker</Text>
          <Text style={styles.subHeader}>Welcome, {user.email}</Text>
          <TodayProgressCard user={user} />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>LOG OUT</Text>
          </TouchableOpacity>
          <SectionHeader icon="📊" title="Trackers" />
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.card}><WaterTracker /></View>
            <View style={styles.card}><StepCounter /></View>
          </Animated.View>
          <SectionHeader icon="📝" title="Logs & Goals" />
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.card}><WorkoutLogger /></View>
            <View style={styles.card}><GoalTracker /></View>
          </Animated.View>
          <SectionHeader icon="🛠️" title="Tools & Recommendations" />
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.card}><BMICalculator /></View>
            <View style={styles.card}><CaloriesBurnedEstimator /></View>
            <View style={styles.card}><WorkoutRecommendation /></View>
          </Animated.View>
          <View style={{ height: 32 }} />
        </ScrollView>
      </ImageBackground>
    </DashboardRefreshContext.Provider>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{icon} {title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#10182a',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 4,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  subHeader: {
    fontSize: 17,
    marginBottom: 12,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  logoutButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(79,142,247,0.12)',
    alignSelf: 'flex-start',
  },
  sectionHeaderText: {
    color: '#4F8EF7',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  progressCard: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  progressTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressStat: {
    color: '#4F8EF7',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
  },
  progressLabel: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.85,
  },
  progressBarSummary: {
    height: 7,
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  progressPercent: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
    opacity: 0.85,
  },
});
