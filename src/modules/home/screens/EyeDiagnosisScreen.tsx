import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

const EyeDiagnosisScreen = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation();

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Lỗi', response.errorMessage || 'Không thể chọn ảnh');
        } else if (response.assets && response.assets.length > 0) {
          setSelectedImage(response.assets[0].uri);
        }
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với icon quay lại */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#3366FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Chẩn đoán bệnh mắt</Text>
        <View style={{ width: 24 }} /> {/* giữ khoảng cho cân bằng */}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
          <Text style={styles.pickButtonText}>
            {selectedImage ? 'Chọn lại ảnh' : 'Chọn ảnh mắt'}
          </Text>
        </TouchableOpacity>

        {selectedImage && (
          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Ảnh đã chọn:</Text>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={styles.removeImageButton}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xóa ảnh</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EyeDiagnosisScreen;

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
  pickButton: {
    backgroundColor: '#80a6feff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    elevation: 3,
    marginTop: 20,
  },
  pickButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  selectedImage: { width: 250, height: 250, borderRadius: 15 },
  removeImageButton: {
    marginTop: 10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
