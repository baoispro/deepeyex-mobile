import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';

import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../shared/stores';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../../shared/hooks/useCart';

const { width } = Dimensions.get('window');

// Dữ liệu mẫu cho các ngày trong tuần
const weekDays = [
  { day: 9, weekday: 'MON' },
  { day: 10, weekday: 'TUE' },
  { day: 11, weekday: 'WED' }, // Ngày hiện tại
  { day: 12, weekday: 'THU' },
  { day: 13, weekday: 'FRI' },
  { day: 14, weekday: 'SAT' },
];

// Component riêng cho phần Lịch
const CalendarSection = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(2);

  const appointmentDetails = {
    date: '11 Wednesday - Today',
    doctor: 'Dr. Olivia Turner, M.D.',
    description: 'Treatment and prevention of skin and photodermatitis.',
  };

  return (
    <View style={styles.calendarContainer}>
      {/* Date Picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datePickerScroll}
      >
        {weekDays.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateItem,
              index === selectedDateIndex && styles.dateItemActive,
            ]}
            onPress={() => setSelectedDateIndex(index)}
          >
            <Text
              style={[
                styles.dateDay,
                index === selectedDateIndex && styles.dateDayActive,
              ]}
            >
              {item.day}
            </Text>
            <Text
              style={[
                styles.dateWeekday,
                index === selectedDateIndex && styles.dateWeekdayActive,
              ]}
            >
              {item.weekday}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Appointment Detail Card */}
      {selectedDateIndex === 2 && (
        <View style={styles.appointmentTimeLine}>
          <Text style={styles.appointmentHeader}>
            {appointmentDetails.date}
          </Text>

          {/* Timeline slots */}
          <View style={styles.timeSlot}>
            <Text style={styles.timeText}>9 AM</Text>
            <View style={styles.timeLine} />
          </View>

          <View style={styles.timeSlotActive}>
            <Text style={styles.timeTextActive}>10 AM</Text>
            <View style={styles.timeLineActive}>
              <View style={styles.appointmentCard}>
                <View>
                  <Text style={styles.appointmentDoctor}>
                    {appointmentDetails.doctor}
                  </Text>
                  <Text style={styles.appointmentDescription}>
                    {appointmentDetails.description}
                  </Text>
                </View>
                <TouchableOpacity style={styles.checkIcon}>
                  <Text style={{ fontSize: 18, color: '#fff' }}>✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.timeSlot}>
            <Text style={styles.timeText}>11 AM</Text>
            <View style={styles.timeLine} />
          </View>
          <View style={styles.timeSlot}>
            <Text style={styles.timeText}>12 AM</Text>
            <View style={styles.timeLine} />
          </View>
        </View>
      )}
    </View>
  );
};

// Component chính
const HomeScreen = () => {
  const [activeBottomTab, setActiveBottomTab] = useState('home');
  const { accessToken, patient } = useSelector(
    (state: RootState) => state.auth,
  );
  const { totalItems } = useCart();
  const isLoggedIn = !!accessToken;
  const navigation = useNavigation();

  // Dữ liệu cho các Quick Actions
  const quickActions = [
    {
      name: 'AI Chẩn đoán',
      icon: '👁️',
      color: '#80a6feff',
      onPress: () => navigation.navigate('EyeDiagnosis'),
    }, // Chẩn đoán bệnh mắt
    {
      name: 'Tư vấn Bác sĩ',
      icon: '👨‍⚕️',
      color: '#80a6feff',
      onPress: () => navigation.navigate('Consultant'),
    }, // Tư vấn trực tiếp online
    {
      name: 'Đặt khám',
      icon: '📅',
      color: '#80a6feff',
      onPress: () => navigation.navigate('BookAppointment'),
    },
    {
      name: 'Thuốc',
      icon: '💊',
      color: '#80a6feff',
      onPress: () => navigation.navigate('MedicineList'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Đã thay thế `StatusBar` từ Expo bằng `StatusBar` của React Native */}
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isLoggedIn && patient?.image ? (
              <Image
                source={{ uri: patient.image }}
                style={styles.profileImage}
              />
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Ionicons
                  name="person-circle-outline"
                  size={40}
                  color="#1250dc"
                />
              </TouchableOpacity>
            )}

            <View style={{ marginLeft: 10 }}>
              {isLoggedIn ? (
                <>
                  <Text style={styles.welcomeText}>Hi., Welcome Back</Text>
                  <Text style={styles.userName}>
                    {patient?.fullName || 'Người dùng'}
                  </Text>
                </>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginPrompt}>Đăng nhập ngay</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={24} color="#000" />
              {totalItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CALENDAR SECTION - Lịch hẹn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch hẹn của bạn</Text>
          <CalendarSection />
        </View>

        {/* QUICK ACTIONS - Các tính năng chính */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tính năng nổi bật</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickAction, { backgroundColor: action.color }]}
                onPress={action.onPress}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionText}>{action.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section: Đề xuất Bác sĩ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đề xuất Bác sĩ</Text>
          {/* Ví dụ về một Doctor Card */}
          <View style={styles.doctorCard}>
            <View style={styles.doctorImagePlaceholder} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>
                Dr. Alexander Bennett, Ph.D.
              </Text>
              <Text style={styles.doctorSpecialty}>Dermato-Genetics</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.doctorIcon}>?</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.doctorIcon}>❤️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setActiveBottomTab('home')}
        >
          <Ionicons name="home" size={24} color="#1250dc" />

          <Text
            style={[
              styles.bottomNavLabel,
              activeBottomTab === 'home' && styles.activeLabel,
            ]}
          >
            Trang chủ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {
            setActiveBottomTab('chat');
            navigation.navigate('chat');
          }}
        >
          <Ionicons
            name="chatbubble" // hoặc "chatbubble-outline"
            size={24}
            color={activeBottomTab === 'chat' ? '#1250dc' : '#a6a6a6'}
          />

          <Text
            style={[
              styles.bottomNavLabel,
              activeBottomTab === 'chat' && styles.activeLabel,
            ]}
          >
            Trò chuyện
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {
            setActiveBottomTab('profile');
            navigation.navigate('Profile');
          }}
        >
          <Ionicons
            name="person"
            size={24}
            color={activeBottomTab === 'profile' ? '#1250dc' : '#a6a6a6'}
          />
          <Text
            style={[
              styles.bottomNavLabel,
              activeBottomTab === 'profile' && styles.activeLabel,
            ]}
          >
            Cá nhân
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setActiveBottomTab('calendar')}
        >
          <Ionicons
            name="calendar"
            size={24}
            color={activeBottomTab === 'calendar' ? '#1250dc' : '#a6a6a6'}
          />
          <Text
            style={[
              styles.bottomNavLabel,
              activeBottomTab === 'calendar' && styles.activeLabel,
            ]}
          >
            Đặt khám
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

// --- STYLESHEET ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },

  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: {
    marginLeft: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconText: { fontSize: 20, color: '#666' },
  profileImagePlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#A9A9A9',
  },
  welcomeText: { fontSize: 14, color: '#1250dc' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  // Quick Actions Styles
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: '#fff',
  },
  quickActionIcon: { fontSize: 40, marginBottom: 8 },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },

  // Calendar Section Styles
  calendarContainer: {
    backgroundColor: '#e6e9ff',
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  datePickerScroll: { paddingHorizontal: 5, paddingVertical: 10 },
  dateItem: {
    width: width * 0.12,
    marginHorizontal: 5,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  dateItemActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  dateDay: { fontSize: 24, fontWeight: 'bold', color: '#666' },
  dateDayActive: { fontSize: 24, fontWeight: 'bold', color: '#3b5998' },
  dateWeekday: { fontSize: 12, fontWeight: '500', color: '#666' },
  dateWeekdayActive: { fontSize: 12, fontWeight: '500', color: '#3b5998' },

  // Appointment Timeline & Card
  appointmentTimeLine: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  appointmentHeader: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#3b5998',
    marginBottom: 15,
  },
  timeSlot: { flexDirection: 'row', marginBottom: 5 },
  timeSlotActive: { flexDirection: 'row', marginBottom: 5 },
  timeText: {
    width: 50,
    fontSize: 12,
    color: '#888',
    paddingTop: 5,
    textAlign: 'right',
  },
  timeTextActive: {
    width: 50,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b5998',
    paddingTop: 5,
    textAlign: 'right',
  },
  timeLine: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#c9c9c9',
    marginLeft: 10,
    paddingLeft: 10,
    minHeight: 30,
  },
  timeLineActive: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#3b5998',
    marginLeft: 10,
    paddingLeft: 10,
    minHeight: 120,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: -5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appointmentDoctor: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  appointmentDescription: { fontSize: 12, color: '#666', marginTop: 3 },
  checkIcon: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#3b5998',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Doctor Card (Ví dụ)
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  doctorImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D3D3D3',
    marginRight: 10,
  },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  doctorSpecialty: { fontSize: 12, color: '#666' },
  doctorIcon: { fontSize: 20, marginHorizontal: 8, color: '#3b5998' },

  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  bottomNavItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  bottomNavLabel: { fontSize: 12, color: '#a6a6a6', marginTop: 4 }, // Màu mặc định cho label
  activeLabel: { color: '#1250dc', fontWeight: 'bold' }, // Màu active cho label
  loginPrompt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1250dc',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
