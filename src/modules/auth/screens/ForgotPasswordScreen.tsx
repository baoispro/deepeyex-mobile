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

interface ForgotPasswordProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSendLink = () => {
    Alert.alert('Reset Password', `Link reset đã gửi tới: ${email}`);
    navigation.navigate('ResetPassword');
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
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>

      <Text style={styles.infoText}>
        Enter your email address below and we'll send you a reset link.
      </Text>

      {/* Email input */}
      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholder="Enter your email"
        placeholderTextColor={Colors.textGray}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Send link button */}
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSendLink}
        disabled={!email}
      >
        <Text style={styles.sendButtonText}>Send Reset Link</Text>
      </TouchableOpacity>

      {/* Remember password? */}
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
  infoText: {
    color: Colors.textGray,
    fontSize: 14,
    marginBottom: 20,
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
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
  sendButton: {
    height: 50,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  sendButtonText: {
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

export default ForgotPasswordScreen;
