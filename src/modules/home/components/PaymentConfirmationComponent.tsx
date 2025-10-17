import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

interface PaymentConfirmationComponentProps {
  requestEInvoice: boolean;
  selectedPaymentMethod: string;
  onToggleEInvoice: () => void;
  onSelectPaymentMethod: (method: string) => void;
  colors: {
    primaryBlue: string;
    lightBlue: string;
    textDark: string;
    textGray: string;
    backgroundWhite: string;
  };
}

const PaymentConfirmationComponent: React.FC<
  PaymentConfirmationComponentProps
> = ({
  requestEInvoice,
  selectedPaymentMethod,
  onToggleEInvoice,
  onSelectPaymentMethod,
  colors,
}) => {
  return (
    <View style={styles.paymentMethodCard}>
      <Text style={[styles.paymentMethodTitle, { color: colors.primaryBlue }]}>
        Phương thức thanh toán
      </Text>

      {/* Xuất hóa đơn điện tử */}
      <View style={styles.invoiceSection}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={onToggleEInvoice}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: colors.primaryBlue },
              requestEInvoice && [
                styles.checkboxChecked,
                { backgroundColor: colors.primaryBlue },
              ],
            ]}
          >
            {requestEInvoice && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={[styles.checkboxLabel, { color: colors.textDark }]}>
            Yêu cầu xuất hóa đơn điện tử
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chọn phương thức thanh toán */}
      <View style={styles.paymentMethodsSection}>
        <Text style={[styles.paymentMethodsTitle, { color: colors.textDark }]}>
          Chọn phương thức thanh toán:
        </Text>

        {/* Thanh toán tiền mặt */}
        <TouchableOpacity
          style={[
            styles.paymentMethodOption,
            selectedPaymentMethod === 'cash' && [
              styles.paymentMethodSelected,
              {
                backgroundColor: colors.lightBlue,
                borderColor: colors.primaryBlue,
              },
            ],
          ]}
          onPress={() => onSelectPaymentMethod('cash')}
        >
          <View style={styles.paymentMethodContent}>
            <Ionicons
              name="cash-outline"
              size={24}
              color={
                selectedPaymentMethod === 'cash'
                  ? colors.primaryBlue
                  : colors.textGray
              }
            />
            <View style={styles.paymentMethodInfo}>
              <Text
                style={[
                  styles.paymentMethodName,
                  { color: colors.textDark },
                  selectedPaymentMethod === 'cash' && {
                    color: colors.primaryBlue,
                  },
                ]}
              >
                Thanh toán tiền mặt khi nhận hàng
              </Text>
              <Text
                style={[
                  styles.paymentMethodDescription,
                  { color: colors.textGray },
                ]}
              >
                Thanh toán bằng tiền mặt khi đến khám
              </Text>
            </View>
          </View>
          {selectedPaymentMethod === 'cash' && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.primaryBlue}
            />
          )}
        </TouchableOpacity>

        {/* Thanh toán ATM/VNPay */}
        <TouchableOpacity
          style={[
            styles.paymentMethodOption,
            selectedPaymentMethod === 'bank' && [
              styles.paymentMethodSelected,
              {
                backgroundColor: colors.lightBlue,
                borderColor: colors.primaryBlue,
              },
            ],
          ]}
          onPress={() => onSelectPaymentMethod('bank')}
        >
          <View style={styles.paymentMethodContent}>
            <Ionicons
              name="card-outline"
              size={24}
              color={
                selectedPaymentMethod === 'bank'
                  ? colors.primaryBlue
                  : colors.textGray
              }
            />
            <View style={styles.paymentMethodInfo}>
              <Text
                style={[
                  styles.paymentMethodName,
                  { color: colors.textDark },
                  selectedPaymentMethod === 'bank' && {
                    color: colors.primaryBlue,
                  },
                ]}
              >
                Thanh toán bằng thẻ ATM nội địa và tài khoản ngân hàng
              </Text>
              <Text
                style={[
                  styles.paymentMethodDescription,
                  { color: colors.textGray },
                ]}
              >
                Thanh toán trực tuyến qua thẻ ATM hoặc chuyển khoản ngân hàng
              </Text>
            </View>
          </View>
          {selectedPaymentMethod === 'bank' && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.primaryBlue}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentMethodCard: {
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  invoiceSection: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {},
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  paymentMethodsSection: {
    gap: 12,
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  paymentMethodOption: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodSelected: {},
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export default PaymentConfirmationComponent;
