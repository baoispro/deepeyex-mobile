import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Avatar, Card, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
// import ChatHeader from '../components/VideoCallRoom'; // cần chuyển VideoCallRoom sang RN
import { db } from '../../../shared/configs/firebase';
import ChatBox from '../components/ChatBox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

interface Conversation {
  id: string;
  participants: string[];
  doctorInfo: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  patientInfo: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  lastAppointmentId?: string;
  lastMessage?: string;
  createdAt?: { seconds: number; nanoseconds: number };
  updatedAt?: { seconds: number; nanoseconds: number };
}

export default function Consultation() {
  const navigation = useNavigation();

  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'online' | 'history'>('online');
  const [showInfo, setShowInfo] = useState(false);

  const auth = useSelector((state: any) => state.auth);
  const patient_id = auth.patient?.patientId;

  // 🔥 Lấy danh sách hội thoại từ Firestore
  useEffect(() => {
    if (!patient_id) return;

    const unsubscribe = db()
      .collection('conversations')
      .where('participants', 'array-contains', patient_id)
      .onSnapshot(
        snapshot => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Conversation[];
          setConversations(data);
          setLoading(false);
        },
        error => {
          console.error('❌ Lỗi khi lấy hội thoại:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [patient_id]);

  const handleJoinRoom = (item: Conversation) => {
    const isPatient = auth?.role === 'patient';
    const other = isPatient ? item.doctorInfo : item.patientInfo;
    setSelectedChat(item);
    setShowInfo(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tư vấn trực tuyến</Text>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'online' && styles.tabActive]}
            onPress={() => setActiveTab('online')}
          >
            <Text style={styles.tabText}>Trực tuyến</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === 'history' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={styles.tabText}>Tin nhắn</Text>
          </TouchableOpacity>
        </View>

        {/* Nội dung tab */}
        {activeTab === 'online' ? (
          <ScrollView contentContainerStyle={styles.content}>
            <Card style={styles.card}>
              <Card.Title title="Phòng tư vấn trực tuyến" />
              <Card.Content>
                <Text style={styles.grayText}>
                  Hiện chưa có API danh sách lịch tư vấn online trong bản RN
                </Text>
                <Button
                  mode="contained"
                  onPress={() => Alert.alert('Chức năng demo')}
                >
                  Kiểm tra micro
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>
        ) : (
          <View style={styles.historyContainer}>
            {/* Danh sách hội thoại */}
            {!selectedChat && (
              <View style={styles.sidebar}>
                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color="#007AFF"
                    style={{ marginTop: 30 }}
                  />
                ) : conversations.length > 0 ? (
                  <FlatList
                    data={conversations}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                      const isPatient = auth?.role === 'patient';
                      const other = isPatient
                        ? item.doctorInfo
                        : item.patientInfo;
                      const isActive = selectedChat?.id === item.id;

                      return (
                        <TouchableOpacity
                          style={[
                            styles.chatItem,
                            isActive && styles.chatItemActive,
                          ]}
                          onPress={() => handleJoinRoom(item)}
                        >
                          <View style={styles.chatRow}>
                            <Avatar.Image
                              size={48}
                              source={{
                                uri:
                                  other.avatar ||
                                  `https://api.dicebear.com/7.x/initials/svg?seed=${other.name}`,
                              }}
                            />
                            <View style={{ marginLeft: 10, width: '80%' }}>
                              <Text style={styles.chatName}>{other.name}</Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Text style={styles.chatMsg} numberOfLines={1}>
                                  {item.lastMessage || 'Chưa có tin nhắn'}
                                </Text>
                                <Text style={{ fontSize: 12, color: '#777' }}>
                                  {item.updatedAt
                                    ? new Date(
                                        item.updatedAt.seconds * 1000,
                                      ).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : 'Chưa có hoạt động'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : (
                  <Text style={styles.emptyText}>
                    Không có cuộc hội thoại nào
                  </Text>
                )}
              </View>
            )}

            {/* Khu vực chat */}
            <View style={styles.chatContainer}>
              {selectedChat && (
                <>
                  <View style={styles.chatHeader}>
                    <TouchableOpacity
                      onPress={() => setSelectedChat(null)}
                      style={{ marginRight: 10 }}
                    >
                      <Ionicons name="arrow-back" size={28} color="#000" />
                    </TouchableOpacity>

                    <Avatar.Image
                      size={48}
                      source={{
                        uri:
                          auth?.role === 'patient'
                            ? selectedChat.doctorInfo.avatar
                            : selectedChat.patientInfo.avatar,
                      }}
                    />
                    <Text style={styles.chatTitle}>
                      {auth?.role === 'patient'
                        ? selectedChat.doctorInfo.name
                        : selectedChat.patientInfo.name}
                    </Text>
                    <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
                      <Ionicons name="information-circle" size={30} />
                    </TouchableOpacity>
                  </View>

                  {/* ChatBox */}
                  <View style={{ flex: 1 }}>
                    <ChatBox
                      conversationId={selectedChat.id}
                      otherUser={
                        patient_id === selectedChat.doctorInfo.id
                          ? selectedChat.patientInfo
                          : selectedChat.doctorInfo
                      }
                    />
                  </View>

                  {/* Hiển thị thông tin chi tiết */}
                  {showInfo && (
                    <View style={styles.infoBox}>
                      <Text style={styles.infoTitle}>Thông tin hội thoại</Text>
                      <Text>
                        Mã cuộc hẹn cuối:{' '}
                        {selectedChat.lastAppointmentId || 'Không có'}
                      </Text>
                      <Text>
                        Tin nhắn cuối: {selectedChat.lastMessage || 'Không có'}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#007AFF',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  grayText: {
    textAlign: 'center',
    color: '#6c757d',
    marginVertical: 10,
  },
  historyContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    // flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    // borderRightWidth: 1,
    // borderColor: '#e5e5e5',
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    // borderBottomWidth: 1,
    // borderColor: '#eee',
  },
  chatItemActive: {
    backgroundColor: '#e8f0ff',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatName: {
    fontWeight: '600',
  },
  chatMsg: {
    color: '#888',
    fontSize: 13,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    gap: 8,
  },
  chatTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  backButton: { padding: 5 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    flex: 1,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
});
