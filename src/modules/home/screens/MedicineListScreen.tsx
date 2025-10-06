import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetAllDrugsQuery } from '../../hospital/hooks/queries/drugs/use-get-list-drug.query';
import { Drug } from '../../hospital/types/drug';

const MedicineListScreen = () => {
  const [selectedMedicine, setSelectedMedicine] = useState<Drug | null>(null);
  const navigation = useNavigation();

  // Sử dụng hook để lấy dữ liệu thuốc từ API
  const { data: drugsResponse, isLoading, error } = useGetAllDrugsQuery();

  // Lấy danh sách thuốc từ response
  const medicines = drugsResponse?.data || [];

  const Colors = {
    primaryBlue: '#3366FF',
    backgroundWhite: '#fff',
    textDark: '#333',
    textGray: '#666',
  };
  const renderHeader = (title: string, onBack?: () => void) => (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 24 }} /> {/* giữ khoảng */}
    </View>
  );

  // Hiển thị loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {renderHeader('Danh sách thuốc')}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
          <Text style={styles.loadingText}>Đang tải danh sách thuốc...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {renderHeader('Danh sách thuốc')}
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>Không thể tải danh sách thuốc</Text>
          <Text style={styles.errorSubText}>Vui lòng thử lại sau</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedMedicine) {
    // Chi tiết thuốc
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {renderHeader('Chi tiết thuốc', () => setSelectedMedicine(null))}
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Image
            source={{
              uri:
                selectedMedicine.image ||
                'https://cdn-icons-png.flaticon.com/512/2533/2533459.png',
            }}
            style={styles.medicineImage}
          />
          <Text style={styles.medicineName}>{selectedMedicine.name}</Text>
          <View style={styles.medicinePriceContainer}>
            <Text style={styles.medicinePrice}>
              {(
                selectedMedicine.price -
                (selectedMedicine.price * selectedMedicine.discount_percent) /
                  100
              ).toLocaleString('vi-VN')}
              đ
            </Text>
            {selectedMedicine.discount_percent > 0 && (
              <Text style={styles.discountText}>
                {selectedMedicine.price.toLocaleString('vi-VN')} VNĐ
              </Text>
            )}
            {selectedMedicine.discount_percent > 0 && (
              <View style={styles.medicineDiscountBadge}>
                <Text style={styles.medicineDiscountText}>
                  -{selectedMedicine.discount_percent}%
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.medicineDescription}>
            Mô tả: {selectedMedicine.description || 'Không có mô tả chi tiết'}
          </Text>
          <View style={styles.stockInfo}>
            <Text style={styles.stockText}>
              Còn lại: {selectedMedicine.stock_quantity} sản phẩm
            </Text>
          </View>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Thêm vào giỏ
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Danh sách thuốc
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {renderHeader('Danh sách thuốc')}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medical" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Không có thuốc nào</Text>
          </View>
        ) : (
          medicines.map(med => (
            <TouchableOpacity
              key={med.drug_id}
              style={styles.medicineCard}
              onPress={() => setSelectedMedicine(med)}
            >
              <Image
                source={{
                  uri:
                    med.image ||
                    'https://cdn-icons-png.flaticon.com/512/2533/2533459.png',
                }}
                style={styles.medicineThumb}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.medicineName}>{med.name}</Text>
                <Text style={styles.medicinePrice}>
                  {med.price.toLocaleString('vi-VN')} VNĐ
                </Text>
                {med.discount_percent > 0 && (
                  <Text style={styles.discountBadge}>
                    -{med.discount_percent}%
                  </Text>
                )}
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.primaryBlue}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicineListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#3366FF' },
  medicineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medicineThumb: { width: 60, height: 60, borderRadius: 10 },
  medicineName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  medicinePrice: { fontSize: 16, color: '#1250DC', marginTop: 4 },
  medicineImage: {
    width: '100%',
    height: 300,
    objectFit: 'contain',
    borderRadius: 15,
    marginBottom: 20,
  },
  medicineDescription: { fontSize: 14, color: '#555', marginVertical: 15 },
  addToCartButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  stockInfo: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  stockText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
  },
  discountText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
    marginTop: 5,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: 'bold',
    backgroundColor: '#ffe6e6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  medicinePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  medicineDiscountText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  medicineDiscountBadge: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    backgroundColor: '#dc3545',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
