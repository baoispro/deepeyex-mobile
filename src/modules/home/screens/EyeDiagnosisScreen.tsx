import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePredictMutation } from '../../../shared/hooks/mutations/use-predict.mutation';
import {
  DiagnosisResponse,
  EyeDiseaseLabel,
} from '../../../shared/types/predict';
import Svg, { Circle } from 'react-native-svg';

function convertLabelToVietnamese(label: EyeDiseaseLabel): string {
  const map: Record<EyeDiseaseLabel, string> = {
    conjunctivitis: 'Viêm kết mạc (Đau mắt đỏ)',
    eyelidedema: 'Phù nề mí mắt',
    healthy_eye: 'Mắt bình thường',
    hordeolum: 'Chắp / Lẹo',
    keratitiswithulcer: 'Viêm giác mạc có loét',
    subconjunctival_hemorrhage: 'Xuất huyết dưới kết mạc',
  };

  return map[label] || label;
}

const EyeDiagnosisScreen = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResponse | null>(null);
  const navigation = useNavigation();

  const predictMutation = usePredictMutation({
    onSuccess: data => {
      setDiagnosisResult(data);
      Alert.alert(
        'Kết quả chẩn đoán',
        `Bệnh có khả năng cao nhất: ${data.top1.label}\nĐộ tin cậy: ${(
          data.top1.probability * 100
        ).toFixed(2)}%`,
      );
    },
    onError: error => {
      Alert.alert('Lỗi', 'Không thể chẩn đoán ảnh. Vui lòng thử lại.');
      console.error('Prediction error:', error);
    },
  });

  console.log(diagnosisResult, 'diagnosisResult');
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
          const uri = response.assets[0].uri;
          if (uri) {
            setSelectedImage(uri);
            setDiagnosisResult(null); // Reset kết quả cũ
          }
        }
      },
    );
  };

  const createFormDataFromUri = (uri: string, fileName: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: fileName,
    } as any);
    return formData;
  };

  const handleDiagnose = async () => {
    if (!selectedImage) {
      Alert.alert('Thông báo', 'Vui lòng chọn ảnh trước khi chẩn đoán');
      return;
    }

    try {
      const formData = createFormDataFromUri(selectedImage, 'eye_image.jpg');
      predictMutation.mutate({ formData, topK: 3 });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xử lý ảnh. Vui lòng thử lại.');
      console.error('FormData creation error:', error);
    }
  };

  const renderTop3 = () => {
    if (!diagnosisResult?.predictions) return null;

    const displayOrder = [1, 0, 2]; // #2 - #1 - #3

    return (
      <View style={styles.top3Container}>
        {displayOrder.map((pos, idx) => {
          const d = diagnosisResult.predictions[pos];
          const radius = pos === 0 ? 50 : 40;
          const strokeWidth = 8;
          const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
          const progress = circumference * (1 - d.probability);

          return (
            <View key={idx} style={styles.circleWrapper}>
              <View>
                <Svg width={radius * 2} height={radius * 2}>
                  <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    stroke="#3366FF"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                    rotation="-90"
                    originX={radius}
                    originY={radius}
                  />
                </Svg>

                {/* 👉 số % nằm chính giữa vòng tròn */}
                <View style={styles.percentCenter}>
                  <Text style={styles.probText}>
                    {(d.probability * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>

              <Text style={styles.diseaseName}>
                {convertLabelToVietnamese(d.label)}
              </Text>
              <Text
                style={[
                  styles.rankText,
                  pos === 0 ? { color: '#ca8a04' } : { color: '#6b7280' },
                ]}
              >
                #{pos + 1}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header với icon quay lại */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#3366FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Chẩn đoán bệnh mắt</Text>
        <View style={styles.headerSpacer} /> {/* giữ khoảng cho cân bằng */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
          <Text style={styles.pickButtonText}>
            {selectedImage ? 'Chọn lại ảnh' : 'Chọn ảnh mắt'}
          </Text>
        </TouchableOpacity>

        {selectedImage && (
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Ảnh đã chọn:</Text>
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(null);
                setDiagnosisResult(null);
              }}
              style={styles.removeImageButton}
            >
              <Text style={styles.removeButtonText}>Xóa ảnh</Text>
            </TouchableOpacity>

            {/* Nút chẩn đoán */}
            <TouchableOpacity
              onPress={handleDiagnose}
              style={[
                styles.diagnoseButton,
                predictMutation.isPending && styles.diagnoseButtonDisabled,
              ]}
              disabled={predictMutation.isPending}
            >
              {predictMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.diagnoseButtonText}>Chẩn đoán</Text>
              )}
            </TouchableOpacity>

            {/* Hiển thị kết quả chẩn đoán */}

            {diagnosisResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Kết quả chẩn đoán:</Text>
                {renderTop3()}
              </View>
            )}
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
  headerSpacer: { width: 24 },
  scrollContent: { padding: 20, alignItems: 'center' },
  imageContainer: { marginTop: 30, alignItems: 'center' },
  imageLabel: { marginBottom: 10, fontWeight: 'bold' },
  removeButtonText: { color: '#fff', fontWeight: 'bold' },
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
  diagnoseButton: {
    backgroundColor: '#3366FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    elevation: 3,
    marginTop: 20,
    marginBottom: 10,
  },
  diagnoseButtonDisabled: {
    backgroundColor: '#ccc',
  },
  diagnoseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3366FF',
    textTransform: 'capitalize',
  },

  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginTop: 25,
    width: '100%',
    elevation: 2,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3366FF',
    marginBottom: 20,
  },

  // Hiển thị 3 vòng tròn kết quả
  top3Container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
  },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '33.33%', // 👈 tương đương Tailwind w-1/3
  },
  percentCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  probText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3366FF',
  },
  diseaseName: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
