import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';

const CompleteProfileScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [isGenderFocus, setIsGenderFocus] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const genderData = [
    { label: 'Nam', value: 'Nam' },
    { label: 'Nữ', value: 'Nữ' },
  ];

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 500,
      maxWidth: 500,
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri || null);
    }
  };

  const handleComplete = () => {
    console.log({
      email,
      fullName,
      dob,
      gender,
      phone,
      address,
      avatar,
    });
    navigation.navigate('Home' as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chỉ còn vài bước nữa thôi!</Text>
      <Text style={styles.subtitle}>
        Vui lòng điền thông tin bên dưới để hoàn tất hồ sơ và bắt đầu sử dụng dịch vụ.
      </Text>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Avatar */}
      <Text style={styles.label}>Ảnh đại diện</Text>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>Chưa chọn ảnh</Text>
          </View>
        )}
        <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Chọn ảnh</Text>
        </TouchableOpacity>
      </View>

      {/* Full Name */}
      <Text style={styles.label}>Họ và tên đầy đủ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Date of Birth */}
      <Text style={styles.label}>Ngày sinh</Text>
      <TextInput
        style={styles.input}
        placeholder="mm/dd/yyyy"
        value={dob}
        onChangeText={setDob}
      />

      {/* Gender */}
      <Text style={styles.label}>Giới tính</Text>
      <Dropdown
        style={[styles.dropdown, isGenderFocus && { borderColor: '#007AFF' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={genderData}
        labelField="label"
        valueField="value"
        placeholder={!isGenderFocus ? 'Chọn giới tính' : '...'}
        value={gender}
        onFocus={() => setIsGenderFocus(true)}
        onBlur={() => setIsGenderFocus(false)}
        onChange={item => {
          setGender(item.value);
          setIsGenderFocus(false);
        }}
      />

      {/* Phone */}
      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        placeholder="VD: 0912345678"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Address */}
      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        placeholder="VD: 123 Đường ABC, Quận 1, TP. HCM"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>Hoàn tất hồ sơ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CompleteProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#555',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  imageButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
