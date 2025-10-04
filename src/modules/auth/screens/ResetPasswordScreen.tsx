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

const Colors = {
  primaryBlue: '#3366FF',
  lightBlue: '#E6EEFF',
  textDark: '#1E1E1E',
  textGray: '#5C5C5C',
  backgroundWhite: '#FFFFFF',
};

interface ResetPasswordProps {
  navigation: any;
}

const ResetPasswordScreen: React.FC<ResetPasswordProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFocusedNew, setIsFocusedNew] = useState(false);
  const [isFocusedConfirm, setIsFocusedConfirm] = useState(false);

  const handleReset = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Passwords do not match!');
      return;
    }
    Alert.alert('Thành công', 'Password has been reset!');
    navigation.navigate('Login');
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
        <Text style={styles.headerTitle}>Reset Password</Text>
      </View>

      {/* New Password */}
      <Text style={styles.inputLabel}>New Password</Text>
      <TextInput
        style={[styles.input, isFocusedNew && styles.inputFocused]}
        placeholder="Enter new password"
        secureTextEntry
        placeholderTextColor={Colors.textGray}
        value={newPassword}
        onChangeText={setNewPassword}
        onFocus={() => setIsFocusedNew(true)}
        onBlur={() => setIsFocusedNew(false)}
      />

      {/* Confirm Password */}
      <Text style={styles.inputLabel}>Confirm Password</Text>
      <TextInput
        style={[styles.input, isFocusedConfirm && styles.inputFocused]}
        placeholder="Re-enter password"
        secureTextEntry
        placeholderTextColor={Colors.textGray}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onFocus={() => setIsFocusedConfirm(true)}
        onBlur={() => setIsFocusedConfirm(false)}
      />

      {/* Reset button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleReset}
        disabled={!newPassword || !confirmPassword}
      >
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </TouchableOpacity>

      {/* Remember password */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Remember password?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Sign In</Text>
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
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primaryBlue },
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
  inputFocused: { borderColor: Colors.primaryBlue },
  resetButton: {
    height: 50,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  resetButtonText: {
    color: Colors.backgroundWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 30,
  },
  footerText: { color: Colors.textGray, fontSize: 14, marginRight: 5 },
  footerLink: { color: Colors.primaryBlue, fontSize: 14, fontWeight: 'bold' },
});

export default ResetPasswordScreen;
