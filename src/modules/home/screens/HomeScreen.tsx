import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Dữ liệu giả định cho các ngày trong tuần
const days = [
  { id: '1', day: '9', dayOfWeek: 'MON' },
  { id: '2', day: '10', dayOfWeek: 'TUE' },
  { id: '3', day: '11', dayOfWeek: 'WED' },
  { id: '4', day: '12', dayOfWeek: 'THU' },
  { id: '5', day: '13', dayOfWeek: 'FRI' },
  { id: '6', day: '14', dayOfWeek: 'SAT' },
];

// Dữ liệu giả định cho danh sách bác sĩ
const doctors = [
  {
    id: '1',
    name: 'Dr. Olivia Turner, M.D.',
    specialty: 'Dermato-Endocrinology',
    rating: 5,
    reviews: 60,
    image: 'https://placehold.co/100x100/A0E7E5/000000?text=Olivia',
  },
  {
    id: '2',
    name: 'Dr. Alexander Bennett, Ph.D.',
    specialty: 'Dermato-Genetics',
    rating: 4.5,
    reviews: 40,
    image: 'https://placehold.co/100x100/FFD8BE/000000?text=Alexander',
  },
  {
    id: '3',
    name: 'Dr. Sophia Martinez, Ph.D.',
    specialty: 'Cosmetic Bioengineering',
    rating: 5,
    reviews: 150,
    image: 'https://placehold.co/100x100/FFACAC/000000?text=Sophia',
  },
  {
    id: '4',
    name: 'Dr. Michael Davidson, M.D.',
    specialty: 'Nano-Dermatology',
    rating: 4.8,
    reviews: 90,
    image: 'https://placehold.co/100x100/C6E7F4/000000?text=Michael',
  },
];

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [activeBottomTab, setActiveBottomTab] = useState('home');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: 'https://placehold.co/60x60/87CEFA/000000?text=JD' }}
              style={styles.profileImage}
            />
            <View style={styles.profileText}>
              <Text style={styles.welcomeText}>Hi, WelcomeBack</Text>
              <Text style={styles.userName}>John Doe</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Tabs Section */}
        <View style={styles.searchContainer}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'doctors' && styles.activeTab]}
              onPress={() => setActiveTab('doctors')}
            >
              <Text style={[styles.tabText, activeTab === 'doctors' && styles.activeTabText]}>Doctors</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'favorite' && styles.activeTab]}
              onPress={() => setActiveTab('favorite')}
            >
              <Text style={[styles.tabText, activeTab === 'favorite' && styles.activeTabText]}>Favorite</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput style={styles.searchInput} placeholder="Tìm kiếm" />
          </View>
        </View>

        {/* Date Selector Section */}
        <View style={styles.datesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {days.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dateItem,
                  index === 2 && styles.activeDateItem, // '11 WED' is active
                ]}
              >
                <Text style={[styles.dateDay, index === 2 && styles.activeDateDay]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateDayOfWeek, index === 2 && styles.activeDateDayOfWeek]}>
                  {item.dayOfWeek}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Today's Appointment Section */}
        <View style={styles.todayAppointmentsContainer}>
          <Text style={styles.todayAppointmentsTitle}>11 Wednesday - Today</Text>
          <View style={styles.appointmentCard}>
            <View style={styles.timeSection}>
              <Text style={styles.timeText}>9 AM</Text>
              <Text style={styles.timeText}>10 AM</Text>
              <Text style={styles.timeText}>11 AM</Text>
              <Text style={styles.timeText}>12 PM</Text>
            </View>
            <View style={styles.appointmentDetail}>
              <Text style={styles.appointmentTime}>10 AM</Text>
              <Text style={styles.appointmentDoctorName}>Dr. Olivia Turner, M.D.</Text>
              <Text style={styles.appointmentDescription}>
                Treatment and prevention of skin and photodermatitis.
              </Text>
            </View>
          </View>
        </View>

        {/* Doctor List Section */}
        <View style={styles.doctorListContainer}>
          {doctors.map((item) => (
            <View key={item.id} style={styles.doctorCard}>
              <Image source={{ uri: item.image }} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                <View style={styles.doctorStats}>
                  <Text style={styles.doctorStatText}>⭐️ {item.rating}</Text>
                  <Text style={styles.doctorStatText}>💬 {item.reviews}</Text>
                </View>
              </View>
              <View style={styles.doctorActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>❓</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>❤️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setActiveBottomTab('home')}
        >
          <Text style={styles.bottomNavIcon}>🏠</Text>
          <Text style={styles.bottomNavLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setActiveBottomTab('chat')}
        >
          <Text style={styles.bottomNavIcon}>💬</Text>
          <Text style={styles.bottomNavLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setActiveBottomTab('profile')}
        >
          <Text style={styles.bottomNavIcon}>👤</Text>
          <Text style={styles.bottomNavLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setActiveBottomTab('calendar')}
        >
          <Text style={styles.bottomNavIcon}>📅</Text>
          <Text style={styles.bottomNavLabel}>Calendar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e3f2fd',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileText: {},
  welcomeText: {
    fontSize: 14,
    color: '#333',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  iconText: {
    fontSize: 24,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#e3f2fd',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#c1d4e6',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: '#3498db',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  datesContainer: {
    paddingVertical: 10,
    backgroundColor: '#e3f2fd',
  },
  dateItem: {
    width: 60,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#d1e6f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  activeDateItem: {
    backgroundColor: '#fff',
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  activeDateDay: {
    color: '#3498db',
  },
  dateDayOfWeek: {
    fontSize: 12,
    color: '#999',
  },
  activeDateDayOfWeek: {
    color: '#3498db',
  },
  todayAppointmentsContainer: {
    padding: 16,
  },
  todayAppointmentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#d1e6f7',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  timeSection: {
    width: 60,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  appointmentDetail: {
    flex: 1,
    marginLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#3498db',
    paddingLeft: 10,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentDoctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginTop: 5,
  },
  appointmentDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  doctorListContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  doctorStats: {
    flexDirection: 'row',
    marginTop: 5,
  },
  doctorStatText: {
    fontSize: 12,
    color: '#333',
    marginRight: 10,
  },
  doctorActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
  },
  actionIcon: {
    fontSize: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e3f2fd',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#d1e6f7',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNavItem: {
    alignItems: 'center',
  },
  bottomNavIcon: {
    fontSize: 24,
  },
  bottomNavLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;
