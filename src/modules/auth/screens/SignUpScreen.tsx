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

interface SignUpScreenProps {
  navigation: any;
}

const Colors = {
  primaryBlue: '#3366FF',
  lightBlue: '#E6EEFF',
  textDark: '#1E1E1E',
  textGray: '#5C5C5C',
  backgroundWhite: '#FFFFFF',
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    // if (!username || !email || !password || !confirmPassword) {
    //   Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    //   return;
    // }
    // if (password !== confirmPassword) {
    //   Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
    //   return;
    // }
    // Alert.alert('Đăng ký', `Tạo tài khoản cho ${username} - ${email}`);
    navigation.navigate("CompleteProfile");
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
        <Text style={styles.headerTitle}>Sign Up</Text>
      </View>

      {/* Welcome */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Create Account</Text>
        <Text style={styles.welcomeSubtitle}>
          Đăng ký để bắt đầu sử dụng ứng dụng của chúng tôi.
        </Text>
      </View>

      {/* Username */}
      <Text style={styles.inputLabel}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên của bạn"
        placeholderTextColor={Colors.textGray}
        value={username}
        onChangeText={setUsername}
      />

      {/* Email */}
      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        placeholderTextColor={Colors.textGray}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}
      <Text style={styles.inputLabel}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          placeholder="***********"
          placeholderTextColor={Colors.textGray}
          value={password}
          onChangeText={setPassword}
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

      {/* Confirm Password */}
      <Text style={styles.inputLabel}>Confirm Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showConfirmPassword}
          placeholder="***********"
          placeholderTextColor={Colors.textGray}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={24}
            color={Colors.textGray}
          />
        </TouchableOpacity>
      </View>

      {/* Sign Up button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={!username || !email || !password || !confirmPassword}
      >
        <Text style={styles.signUpButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Already have account */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Log In</Text>
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
  signUpButton: {
    height: 50,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginTop: 30,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: Colors.backgroundWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  loginText: { color: Colors.textGray, fontSize: 14, marginRight: 5 },
  loginLink: { color: Colors.primaryBlue, fontSize: 14, fontWeight: 'bold' },
});

export default SignUpScreen;
