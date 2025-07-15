import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Loader() {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/signup-bg.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <LottieView
          ref={animation}
          source={require('../assets/loader.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.title}>FitnessTrackerApp</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  lottie: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
}); 