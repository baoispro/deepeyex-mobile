import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'home',
  onTabChange,
}) => {
  const navigation = useNavigation();

  const handleTabPress = (tab: string, screenName: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    (navigation as any).navigate(screenName);
  };

  const bottomNavItems = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: 'home',
      screenName: 'Home',
    },
    {
      id: 'chat',
      label: 'Trò chuyện',
      icon: 'chatbubble',
      screenName: 'Chat', // Có thể thay đổi tên screen khi có
    },
    {
      id: 'profile',
      label: 'Cá nhân',
      icon: 'person',
      screenName: 'Profile',
    },
    {
      id: 'calendar',
      label: 'Đặt khám',
      icon: 'calendar',
      screenName: 'BookAppointment',
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {bottomNavItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.bottomNavItem}
          onPress={() => handleTabPress(item.id, item.screenName)}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={activeTab === item.id ? '#1250dc' : '#a6a6a6'}
          />
          <Text
            style={[
              styles.bottomNavLabel,
              activeTab === item.id && styles.activeLabel,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomNavLabel: {
    fontSize: 12,
    color: '#a6a6a6',
    marginTop: 4,
  },
  activeLabel: {
    color: '#1250dc',
    fontWeight: 'bold',
  },
});

export default BottomNavigation;
