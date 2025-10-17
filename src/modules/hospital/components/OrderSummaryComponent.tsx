import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { CartItem } from '../types/cart';
import { SHIPPING_CONFIG } from '../configs/shippingConfig';

interface OrderSummaryComponentProps {
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  colors: {
    primaryBlue: string;
  };
}

const OrderSummaryComponent: React.FC<OrderSummaryComponentProps> = ({
  items,
  totalAmount,
  shippingFee,
  colors,
}) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons
          name="document-text-outline"
          size={22}
          color={colors.primaryBlue}
        />
        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
      </View>

      <View style={styles.orderSummary}>
        {items.map(item => {
          const originalPrice = item.drug.price * item.quantity;
          const discountedPrice =
            item.drug.price * (1 - item.drug.discount_percent / 100);
          return (
            <View key={item.drug.drug_id} style={styles.orderItemRow}>
              <View style={styles.orderItemLeft}>
                <Text style={styles.orderItemName} numberOfLines={2}>
                  {item.drug.name}
                </Text>
                <Text style={styles.orderItemQuantity}>
                  x{item.quantity}
                  {item.drug.discount_percent > 0 && (
                    <Text style={styles.orderItemDiscount}>
                      {' '}
                      (-{item.drug.discount_percent}%)
                    </Text>
                  )}
                </Text>
              </View>
              <View style={styles.orderItemPriceContainer}>
                {item.drug.discount_percent > 0 && (
                  <Text style={styles.orderItemOriginalPrice}>
                    {originalPrice.toLocaleString('vi-VN')}đ
                  </Text>
                )}
                <Text style={styles.orderItemPrice}>
                  {(discountedPrice * item.quantity).toLocaleString('vi-VN')}đ
                </Text>
              </View>
            </View>
          );
        })}

        <View style={styles.divider} />

        {(() => {
          // Tính tổng giá gốc (chưa giảm)
          const originalTotal = items.reduce(
            (sum, item) => sum + item.drug.price * item.quantity,
            0,
          );
          // Tính tổng tiền được giảm
          const totalDiscount = originalTotal - totalAmount;

          return (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính:</Text>
                <Text style={styles.summaryValue}>
                  {originalTotal.toLocaleString('vi-VN')}đ
                </Text>
              </View>

              {totalDiscount > 0 && (
                <View style={styles.summaryRow}>
                  <View style={styles.discountLabelContainer}>
                    <Text style={styles.summaryLabel}>Giảm trực tiếp:</Text>
                  </View>
                  <Text style={styles.discountValue}>
                    -{totalDiscount.toLocaleString('vi-VN')}đ
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <View style={styles.shippingLabelContainer}>
                  <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                  {shippingFee === 0 &&
                    totalAmount >= SHIPPING_CONFIG.freeShippingThreshold && (
                      <View style={styles.freeShipBadge}>
                        <Text style={styles.freeShipText}>Miễn phí</Text>
                      </View>
                    )}
                </View>
                <Text
                  style={[
                    styles.summaryValue,
                    shippingFee === 0 && styles.freeShipValue,
                  ]}
                >
                  {shippingFee === 0 &&
                  totalAmount >= SHIPPING_CONFIG.freeShippingThreshold
                    ? '0đ'
                    : shippingFee > 0
                    ? `${shippingFee.toLocaleString('vi-VN')}đ`
                    : 'Chọn địa chỉ'}
                </Text>
              </View>
            </>
          );
        })()}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>
            {(totalAmount + shippingFee).toLocaleString('vi-VN')}đ
          </Text>
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
  orderSummary: {
    marginTop: 8,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  orderItemLeft: {
    flex: 1,
    marginRight: 16,
  },
  orderItemName: {
    fontSize: 14,
    color: '#1E1E1E',
    lineHeight: 20,
  },
  orderItemQuantity: {
    fontSize: 13,
    color: '#5C5C5C',
    marginTop: 4,
  },
  orderItemDiscount: {
    fontSize: 12,
    color: '#fb2c36',
    fontWeight: '600',
  },
  orderItemPriceContainer: {
    alignItems: 'flex-end',
  },
  orderItemOriginalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  orderItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1250DC',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  shippingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#5C5C5C',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  discountValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fb2c36',
  },
  freeShipBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  freeShipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  freeShipValue: {
    color: '#28a745',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1250DC',
  },
});

export default OrderSummaryComponent;
