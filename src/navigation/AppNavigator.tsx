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
import MedicineListScreen from '../modules/home/screens/MedicineListScreen';
import EyeDiagnosisScreen from '../modules/home/screens/EyeDiagnosisScreen';
import BookAppointmentScreen from '../modules/home/screens/BookAppointmentScreen';
import ProfileScreen from '../modules/profile/screens/ProfileScreen';
import ProfileInfoScreen from '../modules/profile/screens/ProfileInfoScreen';
import SettingsScreen from '../modules/profile/screens/SettingsScreen';
import CartScreen from '../modules/hospital/screens/CartScreen';
import CheckoutScreen from '../modules/hospital/screens/CheckoutScreen';
import { ChatBox } from '../modules/home/screens/ChatBotScreen';

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
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
        />
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
        />
        <Stack.Screen name="MedicineList" component={MedicineListScreen} />
        <Stack.Screen
          name="EyeDiagnosis"
          component={EyeDiagnosisScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="chat" component={ChatBox} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ProfileInfo" component={ProfileInfoScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
