import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

// Mock data thuốc
const medicines = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    price: 5000,
    image: 'https://cdn-icons-png.flaticon.com/512/2533/2533459.png',
    description: 'Hỗ trợ hạ sốt, giảm đau đầu, đau cơ nhẹ.',
  },
  {
    id: '2',
    name: 'Vitamin C 1000mg',
    price: 12000,
    image: 'https://cdn-icons-png.flaticon.com/512/2533/2533506.png',
    description: 'Tăng sức đề kháng, bổ sung vitamin C hàng ngày.',
  },
  {
    id: '3',
    name: 'Amoxicillin 250mg',
    price: 20000,
    image: 'https://cdn-icons-png.flaticon.com/512/2533/2533514.png',
    description: 'Kháng sinh điều trị các nhiễm khuẩn nhẹ.',
  },
];

const MedicineListScreen = () => {
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const navigation = useNavigation();

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

  if (selectedMedicine) {
    // Chi tiết thuốc
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader('Chi tiết thuốc', () => setSelectedMedicine(null))}
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Image
            source={{ uri: selectedMedicine.image }}
            style={styles.medicineImage}
          />
          <Text style={styles.medicineName}>{selectedMedicine.name}</Text>
          <Text style={styles.medicinePrice}>{selectedMedicine.price} VNĐ</Text>
          <Text style={styles.medicineDescription}>
            {selectedMedicine.description}
          </Text>
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
    <SafeAreaView style={styles.container}>
      {renderHeader('Danh sách thuốc')}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {medicines.map(med => (
          <TouchableOpacity
            key={med.id}
            style={styles.medicineCard}
            onPress={() => setSelectedMedicine(med)}
          >
            <Image source={{ uri: med.image }} style={styles.medicineThumb} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.medicineName}>{med.name}</Text>
              <Text style={styles.medicinePrice}>{med.price} VNĐ</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.primaryBlue}
            />
          </TouchableOpacity>
        ))}
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
  medicinePrice: { fontSize: 14, color: '#666', marginTop: 4 },
  medicineImage: {
    width: '100%',
    height: 200,
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
});
