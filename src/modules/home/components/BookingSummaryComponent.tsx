import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BookingSummaryItem {
  label: string;
  value: string | number;
}

interface BookingSummaryComponentProps {
  items: BookingSummaryItem[];
  colors: {
    textDark: string;
  };
}

const BookingSummaryComponent: React.FC<BookingSummaryComponentProps> = ({
  items,
  colors,
}) => {
  return (
    <View style={styles.confirmationCard}>
      <Text style={[styles.confirmationTitle, { color: colors.textDark }]}>
        Thông tin đặt lịch
      </Text>

      {items.map((item, index) => (
        <View key={index} style={styles.confirmationItem}>
          <Text style={styles.confirmationLabel}>{item.label}:</Text>
          <Text style={[styles.confirmationValue, { color: colors.textDark }]}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  confirmationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  confirmationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  confirmationLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  confirmationValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
});

export default BookingSummaryComponent;
