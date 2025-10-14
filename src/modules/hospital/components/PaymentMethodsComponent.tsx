import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface PaymentMethodsComponentProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  colors: {
    primaryBlue: string;
    textGray: string;
  };
}

const PaymentMethodsComponent: React.FC<PaymentMethodsComponentProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  colors,
}) => {
  const paymentMethods = [
    {
      id: 'COD',
      title: 'Thanh toán khi nhận hàng (COD)',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: 'cash-outline',
    },
    {
      id: 'ATM',
      title: 'Thanh toán ATM/VNPay',
      description: 'Thanh toán bằng thẻ ATM nội địa và tài khoản ngân hàng',
      icon: 'card',
    },
  ];

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="card-outline" size={22} color={colors.primaryBlue} />
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
      </View>

      {paymentMethods.map(method => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentMethodCard,
            paymentMethod === method.id && styles.paymentMethodSelected,
          ]}
          onPress={() => onPaymentMethodChange(method.id)}
          activeOpacity={0.7}
        >
          <View style={styles.paymentMethodContent}>
            <Ionicons
              name={method.icon as any}
              size={24}
              color={
                paymentMethod === method.id
                  ? colors.primaryBlue
                  : colors.textGray
              }
            />
            <View style={styles.paymentMethodInfo}>
              <Text
                style={[
                  styles.paymentMethodName,
                  paymentMethod === method.id &&
                    styles.paymentMethodNameSelected,
                ]}
              >
                {method.title}
              </Text>
              <Text style={styles.paymentMethodDescription}>
                {method.description}
              </Text>
            </View>
          </View>
          {paymentMethod === method.id && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.primaryBlue}
            />
          )}
        </TouchableOpacity>
      ))}
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
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  paymentMethodSelected: {
    borderColor: '#3366FF',
    backgroundColor: '#E6EEFF',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  paymentMethodNameSelected: {
    color: '#3366FF',
  },
  paymentMethodDescription: {
    fontSize: 13,
    color: '#5C5C5C',
  },
});

export default PaymentMethodsComponent;
