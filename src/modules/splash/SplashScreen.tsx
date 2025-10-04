// SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = ({ navigation }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(30)).current; // Text bắt đầu cách vị trí 30px

  useEffect(() => {
    // Animation logo
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      // Text fade + slide lên
      Animated.sequence([
        Animated.delay(500), // delay trước khi text xuất hiện
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(textTranslate, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    // Chuyển sang màn Home sau 2.5s
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={['#1250dc', '#4facfe']} style={styles.container}>
      <Animated.Image
        source={require('../../assets/imgs/logoDeepEyeX.png')}
        style={[
          styles.logo,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[
          styles.text,
          { opacity: textOpacity, transform: [{ translateY: textTranslate }] },
        ]}
      >
        DeepEyeX
      </Animated.Text>
      <Animated.Text
        style={[
          styles.tagline,
          { opacity: textOpacity, transform: [{ translateY: textTranslate }] },
        ]}
      >
        Your Eye, Our Care
      </Animated.Text>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    elevation: 5,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
});
