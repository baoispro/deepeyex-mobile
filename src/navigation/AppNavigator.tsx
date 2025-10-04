import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../modules/splash/SplashScreen';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import HomeScreen from '../modules/home/screens/HomeScreen';
import SignUpScreen from '../modules/auth/screens/SignUpScreen';
import ForgotPasswordScreen from '../modules/auth/screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../modules/auth/screens/ResetPasswordScreen';
import CompleteProfileScreen from '../modules/auth/screens/CompleteProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
