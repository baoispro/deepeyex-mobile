import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAppSelector } from '../../../shared/stores';
import { useGetNotificationsByUserQuery } from '../../hospital/hooks/queries/notification/use-get-all-notification.query';
import { useMarkAllNotificationsReadMutation } from '../../hospital/hooks/mutations/notifications/use-mark-all-read.mutation';
import { useMarkNotificationReadMutation } from '../../hospital/hooks/mutations/notifications/use-mark-read.mutation';
import { useNavigation } from '@react-navigation/native';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export default function NotificationPopover() {
  const navigate = useNavigation();
  const [visible, setVisible] = useState(false);
  const auth = useAppSelector(state => state.auth);

  const { data, isLoading } = useGetNotificationsByUserQuery(
    auth.patient?.patientId || '',
  );
  const markAllMutation = useMarkAllNotificationsReadMutation();
  const markSingleMutation = useMarkNotificationReadMutation();

  const notifications = Array.isArray(data?.data) ? data.data : [];
  const unreadCount = notifications.filter(n => !n.read).length;
  const MAX_VISIBLE_NOTIFICATIONS = 3;

  const handleMarkAll = () => {
    const patientId = auth.patient?.patientId;
    if (patientId) markAllMutation.mutate(patientId);
    else Alert.alert('Lỗi', 'Không tìm thấy thông tin bệnh nhân');
  };

  const handleClickNotification = (id: string, read?: boolean) => {
    if (!read) {
      markSingleMutation.mutate(id);
    }
  };

  return (
    <>
      {/* Nút chuông thông báo */}
      <TouchableOpacity
        style={styles.headerIcon}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="notifications-outline" size={24} color="#000" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Popover (hiển thị khi bấm vào chuông) */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.popoverContainer}>
            <View style={styles.popoverHeader}>
              <Text style={styles.popoverTitle}>Thông báo</Text>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={handleMarkAll}>
                  <Text style={styles.markAllText}>Đánh dấu đã đọc</Text>
                </TouchableOpacity>
              )}
            </View>

            {isLoading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" />
              </View>
            ) : (
              <>
                {notifications.length === 0 ? (
                  <Text style={styles.emptyText}>Không có thông báo</Text>
                ) : (
                  <ScrollView style={styles.list}>
                    {notifications
                      .slice(0, MAX_VISIBLE_NOTIFICATIONS)
                      .map(item => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() =>
                            handleClickNotification(item.id, item.read)
                          }
                          style={[
                            styles.notificationItem,
                            !item.read && styles.unreadItem,
                          ]}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemMessage}>
                              {item.message}
                            </Text>
                            <Text style={styles.itemTime}>
                              {dayjs(item.createdAt).fromNow()}
                            </Text>
                          </View>
                          {!item.read && <View style={styles.unreadDot} />}
                        </TouchableOpacity>
                      ))}

                    {notifications.length > MAX_VISIBLE_NOTIFICATIONS && (
                      <TouchableOpacity
                        style={styles.viewAllButton}
                        onPress={() => {
                          setVisible(false);
                          // TODO: navigate to NotificationScreen
                          navigate.navigate('Notification');
                        }}
                      >
                        <Text style={styles.viewAllText}>
                          Xem tất cả thông báo
                        </Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                )}
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    padding: 6,
    position: 'relative',
    marginLeft: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#e11d48',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  popoverContainer: {
    marginTop: 60,
    marginRight: 10,
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  popoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  popoverTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  markAllText: {
    color: '#1250dc',
    fontSize: 13,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#777',
    textAlign: 'center',
    paddingVertical: 12,
  },
  list: {
    maxHeight: 280,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fb',
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  unreadItem: {
    backgroundColor: '#eaf1ff',
    borderColor: '#c3d9ff',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  itemMessage: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  itemTime: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: '#1250dc',
    borderRadius: 4,
    marginLeft: 6,
    marginTop: 4,
  },
  viewAllButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  viewAllText: {
    color: '#1250dc',
    fontSize: 13,
  },
});
