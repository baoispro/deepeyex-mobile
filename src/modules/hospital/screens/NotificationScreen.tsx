import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal, // 👈 Thêm import này
} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useAppSelector } from '../../../shared/stores';
import { useGetNotificationsByUserQuery } from '../hooks/queries/notification/use-get-all-notification.query';
import { useMarkAllNotificationsReadMutation } from '../hooks/mutations/notifications/use-mark-all-read.mutation';
import { useMarkNotificationReadMutation } from '../hooks/mutations/notifications/use-mark-read.mutation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const auth = useAppSelector(state => state.auth);
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [modalVisible, setModalVisible] = useState(false); // 👈 State cho modal

  const { data, isLoading } = useGetNotificationsByUserQuery(
    auth.patient?.patientId || '',
  );
  const markAllMutation = useMarkAllNotificationsReadMutation();
  const markSingleMutation = useMarkNotificationReadMutation();

  const notifications = Array.isArray(data?.data) ? data.data : [];

  const filteredNotifications = useMemo(() => {
    return tab === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications;
  }, [tab, notifications]);

  const grouped = useMemo(() => {
    const today = dayjs().startOf('day');
    const groups = { today: [], earlier: [] };
    filteredNotifications.forEach(n => {
      if (dayjs(n.createdAt).isAfter(today)) groups.today.push(n);
      else groups.earlier.push(n);
    });
    return groups;
  }, [filteredNotifications]);

  const handleMarkAllRead = () => {
    const patientId = auth.patient?.patientId;
    if (patientId) {
      markAllMutation.mutate(patientId);
      setModalVisible(false); // đóng modal sau khi bấm
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin bệnh nhân');
    }
  };

  const handleClickNotification = (id: string, read?: boolean) => {
    if (!read) {
      markSingleMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Thông báo</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <MaterialIcons name="more-horiz" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'all' && styles.activeTab]}
            onPress={() => setTab('all')}
          >
            <Text
              style={[styles.tabText, tab === 'all' && styles.activeTabText]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'unread' && styles.activeTab]}
            onPress={() => setTab('unread')}
          >
            <Text
              style={[styles.tabText, tab === 'unread' && styles.activeTabText]}
            >
              Chưa đọc
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {filteredNotifications.length === 0 ? (
          <View style={styles.center}>
            <Text style={{ color: '#888' }}>Không có thông báo nào</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {grouped.today.length > 0 && (
              <>
                <Text style={styles.groupLabel}>Hôm nay</Text>
                {grouped.today.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleClickNotification(item.id, item.read)}
                    style={[
                      styles.notificationItem,
                      !item.read && styles.unreadItem,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemMessage}>{item.message}</Text>
                      <Text style={styles.itemTime}>
                        {dayjs(item.createdAt).fromNow()}
                      </Text>
                    </View>
                    {!item.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                ))}
              </>
            )}

            {grouped.earlier.length > 0 && (
              <>
                <Text style={styles.groupLabel}>Trước đó</Text>
                {grouped.earlier.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleClickNotification(item.id, item.read)}
                    style={[
                      styles.notificationItem,
                      !item.read && styles.unreadItem,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemMessage}>{item.message}</Text>
                      <Text style={styles.itemTime}>
                        {dayjs(item.createdAt).fromNow()}
                      </Text>
                    </View>
                    {!item.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* ✅ Modal xác nhận */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Đánh dấu tất cả là đã đọc?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
              >
                <Text style={{ color: '#333' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleMarkAllRead}
                style={[styles.modalButton, { backgroundColor: '#1250dc' }]}
              >
                <Text style={{ color: '#fff' }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1250dc',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1250dc',
  },
  activeTabText: {
    color: '#1250dc',
    fontWeight: 'bold',
  },
  list: {
    gap: 10,
  },
  groupLabel: {
    fontWeight: '600',
    marginVertical: 6,
    color: '#333',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fb',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  unreadItem: {
    backgroundColor: '#eaf1ff',
    borderColor: '#c3d9ff',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  itemMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  itemTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: '#1250dc',
    borderRadius: 4,
    marginTop: 4,
    marginLeft: 6,
  },
  backButton: { padding: 5 },

  // 👇 Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});
