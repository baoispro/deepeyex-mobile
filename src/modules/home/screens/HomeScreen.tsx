import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../shared/stores';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../../shared/hooks/useCart';
import NotificationPopover from '../components/NotificationPopover';
import { Appointment } from '../../hospital/types/appointment';
import { useGetAppointmentsByPatientId } from '../../hospital/hooks/queries/appointment/use-get-appointments.query';

const { width } = Dimensions.get('window');

// Helper: Tạo danh sách 14 ngày từ hôm nay
const generateWeekDays = () => {
  const days = [];
  const today = new Date();
  const weekdayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date,
      day: date.getDate(),
      weekday: weekdayNames[date.getDay()],
      fullDate: date.toISOString().split('T')[0], // YYYY-MM-DD
    });
  }
  return days;
};

// Helper: Format thời gian từ ISO string
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

// Helper: Format date header
const formatDateHeader = (date: Date) => {
  const weekdayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  return `${date.getDate()} ${weekdayNames[date.getDay()]}${
    isToday ? ' - Today' : ''
  }`;
};

// Component riêng cho phần Lịch
const CalendarSection = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const { patient } = useSelector((state: RootState) => state.auth);

  // Fetch appointments
  const {
    data: appointmentsData,
    isLoading,
    isError,
  } = useGetAppointmentsByPatientId(patient?.patientId || '');

  const weekDays = useMemo(() => {
    const days = generateWeekDays();

    return days;
  }, []);

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    if (!appointmentsData?.data) return {};

    const grouped: Record<string, Appointment[]> = {};

    appointmentsData.data.forEach(appointment => {
      if (
        appointment.time_slots &&
        appointment.time_slots.length > 0 &&
        appointment.status !== 'CANCELLED'
      ) {
        const slot = appointment.time_slots[0];
        const appointmentDate = new Date(slot.start_time)
          .toISOString()
          .split('T')[0];
        console.log(
          '📝 Processing appointment:',
          appointment.appointment_code,
          'Date:',
          appointmentDate,
        );
        if (!grouped[appointmentDate]) {
          grouped[appointmentDate] = [];
        }
        grouped[appointmentDate].push(appointment);
      } else {
        console.log(
          '⚠️ Skipped appointment:',
          appointment.appointment_code,
          'reason: no time_slots or cancelled',
        );
      }
    });

    return grouped;
  }, [appointmentsData]);

  const selectedDate = weekDays[selectedDateIndex];

  // Sort appointments by time
  const sortedAppointments = useMemo(() => {
    const selectedAppointments =
      appointmentsByDate[selectedDate.fullDate] || [];

    return [...selectedAppointments].sort((a, b) => {
      const timeA = new Date(a.time_slots[0].start_time).getTime();
      const timeB = new Date(b.time_slots[0].start_time).getTime();
      return timeA - timeB;
    });
  }, [appointmentsByDate, selectedDate.fullDate]);

  if (isLoading) {
    return (
      <View style={styles.calendarContainer}>
        <ActivityIndicator size="large" color="#3b5998" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.errorText}>
          Không thể tải lịch hẹn. Vui lòng thử lại.
        </Text>
      </View>
    );
  }

  if (!patient?.patientId) {
    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.errorText}>
          Vui lòng đăng nhập để xem lịch hẹn.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.calendarContainer}>
      {/* Date Picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datePickerScroll}
      >
        {weekDays.map((item, index) => {
          const hasAppointments = !!appointmentsByDate[item.fullDate];
          return (
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
              {hasAppointments && <View style={styles.appointmentDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Appointment Timeline */}
      {sortedAppointments.length > 0 ? (
        <View style={styles.appointmentTimeLine}>
          <Text style={styles.appointmentHeader}>
            {formatDateHeader(selectedDate.date)}
          </Text>

          {sortedAppointments.map(appointment => {
            const slot = appointment.time_slots[0];
            const startTime = formatTime(slot.start_time);
            const doctorName = slot.doctor?.full_name || 'Bác sĩ';
            const serviceName = appointment.service_name || 'Khám bệnh';

            return (
              <View
                key={appointment.appointment_id}
                style={styles.timeSlotActive}
              >
                <Text style={styles.timeTextActive}>{startTime}</Text>
                <View style={styles.timeLineActive}>
                  <View style={styles.appointmentCard}>
                    <View style={styles.appointmentCardContent}>
                      <Text style={styles.appointmentDoctor}>{doctorName}</Text>
                      <Text style={styles.appointmentDescription}>
                        {serviceName}
                      </Text>
                      {appointment.notes && (
                        <Text style={styles.appointmentNotes}>
                          {appointment.notes}
                        </Text>
                      )}
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        appointment.status === 'COMPLETED' &&
                          styles.statusCompleted,
                        appointment.status === 'PENDING' &&
                          styles.statusPending,
                        appointment.status === 'CONFIRMED' &&
                          styles.statusConfirmed,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {appointment.status === 'COMPLETED'
                          ? '✓'
                          : appointment.status === 'PENDING'
                          ? '⏱'
                          : '✓'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không có lịch hẹn nào trong ngày này
          </Text>
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
      onPress: () => navigation.navigate('EyeDiagnosis' as never),
    }, // Chẩn đoán bệnh mắt
    {
      name: 'Tư vấn Bác sĩ',
      icon: '👨‍⚕️',
      color: '#80a6feff',
      onPress: () => navigation.navigate('Consultant' as never),
    }, // Tư vấn trực tiếp online
    {
      name: 'Đặt khám',
      icon: '📅',
      color: '#80a6feff',
      onPress: () => navigation.navigate('BookAppointment' as never),
    },
    {
      name: 'Thuốc',
      icon: '💊',
      color: '#80a6feff',
      onPress: () => navigation.navigate('MedicineList' as never),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Đã thay thế `StatusBar` từ Expo bằng `StatusBar` của React Native */}
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            {isLoggedIn && patient?.image ? (
              <Image
                source={{ uri: patient.image }}
                style={styles.profileImage}
              />
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('Login' as never)}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={40}
                  color="#1250dc"
                />
              </TouchableOpacity>
            )}

            <View style={styles.userInfoContainer}>
              {isLoggedIn ? (
                <>
                  <Text style={styles.welcomeText}>Hi., Welcome Back</Text>
                  <Text style={styles.userName}>
                    {patient?.fullName || 'Người dùng'}
                  </Text>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login' as never)}
                >
                  <Text style={styles.loginPrompt}>Đăng nhập ngay</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Cart' as never)}
            >
              <Ionicons name="cart-outline" size={24} color="#000" />
              {totalItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>

            <NotificationPopover />

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
            navigation.navigate('chat' as never);
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
            navigation.navigate('Profile' as never);
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
  statusBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3b5998',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  appointmentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b5998',
    marginTop: 4,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
    paddingVertical: 20,
  },
  appointmentCardContent: {
    flex: 1,
  },
  appointmentNotes: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
    fontStyle: 'italic',
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FF9800',
  },
  statusConfirmed: {
    backgroundColor: '#2196F3',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    marginLeft: 10,
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
