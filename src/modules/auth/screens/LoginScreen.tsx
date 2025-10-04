import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

interface LoginScreenProps {
  navigation: any;
}

const Colors = {
  primaryBlue: '#3366FF',
  lightBlue: '#E6EEFF',
  textDark: '#1E1E1E',
  textGray: '#5C5C5C',
  backgroundWhite: '#FFFFFF',
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const handleLogin = () => {
    Alert.alert('Đăng nhập', `Đang cố gắng đăng nhập với: ${emailOrMobile}`);
    // navigation.navigate("Home");
  };

  const handleSocialLogin = (
    platform: 'google' | 'facebook' | 'fingerprint',
  ) => {
    Alert.alert('Đăng nhập Xã hội', `Đăng nhập bằng ${platform}`);
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log In</Text>
      </View>

      {/* Welcome */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.welcomeSubtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>

      {/* Email */}
      <Text style={styles.inputLabel}>Username</Text>
      <TextInput
        style={[styles.input, isFocusedEmail && styles.inputFocused]}
        placeholder="Nhập tên đăng nhập của bạn"
        placeholderTextColor={Colors.textGray}
        value={emailOrMobile}
        onChangeText={setEmailOrMobile}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setIsFocusedEmail(true)}
        onBlur={() => setIsFocusedEmail(false)}
      />

      {/* Password */}
      <Text style={styles.inputLabel}>Password</Text>
      <View
        style={[
          styles.passwordContainer,
          isFocusedPassword && styles.inputFocused,
        ]}
      >
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          placeholder="***********"
          placeholderTextColor={Colors.textGray}
          value={password}
          onChangeText={setPassword}
          onFocus={() => setIsFocusedPassword(true)}
          onBlur={() => setIsFocusedPassword(false)}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color={Colors.textGray}
          />
        </TouchableOpacity>
      </View>

      {/* Forgot password */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotPasswordButton}
      >
        <Text style={styles.forgotPasswordText}>Forget Password</Text>
      </TouchableOpacity>

      {/* Login button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={!emailOrMobile || !password}
      >
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.orSignInText}>or sign up with</Text>

      {/* Social buttons */}
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialLogin('google')}
        >
          <FontAwesome6 name="google" size={24} color={Colors.primaryBlue} iconStyle="brand"/>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialLogin('fingerprint')}
        >
          <Ionicons name="finger-print" size={28} color={Colors.primaryBlue} />
        </TouchableOpacity> */}
      </View>

      {/* Sign up */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  backButton: { position: 'absolute', left: 0, padding: 5 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.primaryBlue },
  welcomeSection: { marginTop: 20, marginBottom: 30 },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginBottom: 5,
  },
  welcomeSubtitle: { fontSize: 14, color: Colors.textGray, lineHeight: 20 },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: Colors.lightBlue,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.lightBlue,
    fontSize: 16,
    color: Colors.textDark,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: Colors.lightBlue,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.lightBlue,
    paddingHorizontal: 15,
  },
  passwordInput: { flex: 1, fontSize: 16, color: Colors.textDark },
  eyeIcon: { padding: 5 },
  inputFocused: { borderColor: Colors.primaryBlue, borderWidth: 1 },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: Colors.primaryBlue,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    height: 50,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    color: Colors.backgroundWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  orSignInText: {
    textAlign: 'center',
    color: Colors.textGray,
    fontSize: 14,
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  signUpText: { color: Colors.textGray, fontSize: 14, marginRight: 5 },
  signUpLink: { color: Colors.primaryBlue, fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;
