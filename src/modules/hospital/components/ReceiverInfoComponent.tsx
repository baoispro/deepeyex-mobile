import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface ReceiverInfoComponentProps {
  fullName: string;
  phone: string;
  email: string;
  onFullNameChange: (text: string) => void;
  onPhoneChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  colors: {
    primaryBlue: string;
    textGray: string;
  };
}

const ReceiverInfoComponent: React.FC<ReceiverInfoComponentProps> = ({
  fullName,
  phone,
  email,
  onFullNameChange,
  onPhoneChange,
  onEmailChange,
  colors,
}) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="person-outline" size={22} color={colors.primaryBlue} />
        <Text style={styles.sectionTitle}>Thông tin người nhận</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Họ và tên <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={onFullNameChange}
          placeholder="Nhập họ và tên"
          placeholderTextColor={colors.textGray}
        />
      </View>

      <View style={styles.rowInputs}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>
            Số điện thoại <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={onPhoneChange}
            placeholder="Nhập SĐT"
            keyboardType="phone-pad"
            placeholderTextColor={colors.textGray}
          />
        </View>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={onEmailChange}
            placeholder="Nhập email"
            keyboardType="email-address"
            placeholderTextColor={colors.textGray}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  required: {
    color: '#dc3545',
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    color: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rowInputs: {
    flexDirection: 'column',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
});

export default ReceiverInfoComponent;
