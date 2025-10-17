import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Province, District, Ward } from '../apis/address/addressApi';

interface DeliveryAddressComponentProps {
  // Address data
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  selectedProvince: Province | null;
  selectedDistrict: District | null;
  selectedWard: Ward | null;
  specificAddress: string;
  note: string;

  // Modal states
  showProvinceModal: boolean;
  showDistrictModal: boolean;
  showWardModal: boolean;

  // Handlers
  onProvinceSelect: (province: Province) => void;
  onDistrictSelect: (district: District) => void;
  onWardSelect: (ward: Ward) => void;
  onSpecificAddressChange: (text: string) => void;
  onNoteChange: (text: string) => void;
  onShowProvinceModal: (show: boolean) => void;
  onShowDistrictModal: (show: boolean) => void;
  onShowWardModal: (show: boolean) => void;

  colors: {
    primaryBlue: string;
    textGray: string;
    textDark: string;
  };
}

const DeliveryAddressComponent: React.FC<DeliveryAddressComponentProps> = ({
  provinces,
  districts,
  wards,
  selectedProvince,
  selectedDistrict,
  selectedWard,
  specificAddress,
  note,
  showProvinceModal,
  showDistrictModal,
  showWardModal,
  onProvinceSelect,
  onDistrictSelect,
  onWardSelect,
  onSpecificAddressChange,
  onNoteChange,
  onShowProvinceModal,
  onShowDistrictModal,
  onShowWardModal,
  colors,
}) => {
  // Render address modal
  const renderAddressModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    data: Array<Province | District | Ward>,
    onSelect: (item: any) => void,
  ) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textDark} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalList}>
            {data.map((item: any) => (
              <TouchableOpacity
                key={item.code}
                style={styles.modalItem}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.modalItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons
            name="location-outline"
            size={22}
            color={colors.primaryBlue}
          />
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Tỉnh/Thành phố <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => onShowProvinceModal(true)}
          >
            <Text
              style={
                selectedProvince ? styles.selectText : styles.placeholderText
              }
            >
              {selectedProvince?.name || 'Chọn tỉnh/thành phố'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Quận/Huyện <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.selectInput,
              !selectedProvince && styles.disabledInput,
            ]}
            onPress={() => selectedProvince && onShowDistrictModal(true)}
            disabled={!selectedProvince}
          >
            <Text
              style={
                selectedDistrict ? styles.selectText : styles.placeholderText
              }
            >
              {selectedDistrict?.name || 'Chọn quận/huyện'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Phường/Xã <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.selectInput,
              !selectedDistrict && styles.disabledInput,
            ]}
            onPress={() => selectedDistrict && onShowWardModal(true)}
            disabled={!selectedDistrict}
          >
            <Text
              style={selectedWard ? styles.selectText : styles.placeholderText}
            >
              {selectedWard?.name || 'Chọn phường/xã'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Địa chỉ cụ thể <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={specificAddress}
            onChangeText={onSpecificAddressChange}
            placeholder="Số nhà, tên đường..."
            multiline
            numberOfLines={2}
            placeholderTextColor={colors.textGray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={note}
            onChangeText={onNoteChange}
            placeholder="Ghi chú thêm (tùy chọn)"
            multiline
            numberOfLines={2}
            placeholderTextColor={colors.textGray}
          />
        </View>
      </View>

      {/* Address Modals */}
      {renderAddressModal(
        showProvinceModal,
        () => onShowProvinceModal(false),
        'Chọn Tỉnh/Thành phố',
        provinces,
        onProvinceSelect,
      )}
      {renderAddressModal(
        showDistrictModal,
        () => onShowDistrictModal(false),
        'Chọn Quận/Huyện',
        districts,
        onDistrictSelect,
      )}
      {renderAddressModal(
        showWardModal,
        () => onShowWardModal(false),
        'Chọn Phường/Xã',
        wards,
        onWardSelect,
      )}
    </>
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectText: {
    fontSize: 15,
    color: '#1E1E1E',
  },
  placeholderText: {
    fontSize: 15,
    color: '#999',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 15,
    color: '#1E1E1E',
  },
});

export default DeliveryAddressComponent;
