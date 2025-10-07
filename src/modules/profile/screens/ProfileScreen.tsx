import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { persistor, RootState } from '../../../shared/stores';
import { clearTokens } from '../../../shared/stores/authSlice';
import BottomNavigation from '../../../shared/components/BottomNavigation';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { patient, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );
  const isLoggedIn = !!accessToken;

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          dispatch(clearTokens());
          persistor.flush();
        },
      },
    ]);
  };

  const profileOptions = [
    {
      id: 'profile-info',
      title: 'Thông tin cá nhân',
      subtitle: 'Xem và chỉnh sửa thông tin',
      icon: 'person-outline',
      onPress: () => (navigation as any).navigate('ProfileInfo'),
    },
    {
      id: 'settings',
      title: 'Cài đặt',
      subtitle: 'Mật khẩu, ngôn ngữ và khác',
      icon: 'settings-outline',
      onPress: () => (navigation as any).navigate('Settings'),
    },
    {
      id: 'logout',
      title: 'Đăng xuất',
      subtitle: 'Thoát khỏi tài khoản',
      icon: 'log-out-outline',
      onPress: handleLogout,
      isDestructive: true,
    },
  ];

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.loginPromptContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#1250dc" />
            <Text style={styles.loginPromptTitle}>Chưa đăng nhập</Text>
            <Text style={styles.loginPromptSubtitle}>
              Vui lòng đăng nhập để xem thông tin cá nhân
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => (navigation as any).navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
        <BottomNavigation activeTab="profile" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {patient?.image ? (
                <Image source={{ uri: patient.image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#1250dc" />
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {patient?.fullName || 'Người dùng'}
              </Text>
              <Text style={styles.userEmail}>
                {patient?.email || 'Chưa cập nhật email'}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                option.isDestructive && styles.destructiveOption,
              ]}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIconContainer,
                    option.isDestructive && styles.destructiveIconContainer,
                  ]}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={option.isDestructive ? '#ff4444' : '#1250dc'}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionTitle,
                      option.isDestructive && styles.destructiveText,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation activeTab="profile" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e6e9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  optionsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  destructiveOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#e6e9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  destructiveIconContainer: {
    backgroundColor: '#ffe6e6',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  destructiveText: {
    color: '#ff4444',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  loginPromptSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#1250dc',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
