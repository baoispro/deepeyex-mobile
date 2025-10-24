import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import EmojiSelector from 'react-native-emoji-selector';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useAppSelector } from '../../../shared/stores';
import { useUploadFileMutation } from '../../hospital/hooks/mutations/uploads/use-upload-file.mutation';

interface Message {
  id: string;
  text?: string;
  sender: string;
  fileUrl?: string;
  fileType?: 'image' | 'video' | 'file' | 'text';
  timestamp?: any;
}

interface ChatBoxProps {
  conversationId: string;
  currentUserEmail: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
}

const ChatBox: React.FC<ChatBoxProps> = ({ conversationId, otherUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const auth = useAppSelector(state => state.auth);
  const email = auth.patient?.email;

  const uploadMutation = useUploadFileMutation({
    onError: err => {
      console.error('❌ Upload error:', err);
      console.error('Tải file thất bại!');
    },
    onSuccess: () => {
      console.log('Tải file thành công!');
    },
  });

  // 🟢 Lắng nghe tin nhắn realtime
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(msgs);
        setTimeout(
          () => scrollRef.current?.scrollToEnd({ animated: true }),
          300,
        );
      });

    return () => unsubscribe();
  }, [conversationId]);

  // 🟢 Gửi tin nhắn text
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed && !selectedImage) return;

    try {
      let fileUrl = null;
      let fileType: 'image' | 'video' | 'file' | 'text' = 'text';

      // 🟢 Nếu có ảnh thì upload
      if (selectedImage) {
        const file = {
          uri: selectedImage,
          type: 'image/jpeg',
          name: `photo-${Date.now()}.jpg`,
        };
        const resUpload = await uploadMutation.mutateAsync(file);
        fileUrl = resUpload?.data?.url;
        fileType = 'image';
      }

      // 🟢 Gửi message lên Firestore
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add({
          text: trimmed || '',
          sender: email,
          fileUrl,
          fileType,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });

      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .update({
          lastMessage: fileType === 'image' ? '📷 Hình ảnh' : trimmed,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      // 🔹 Reset lại input và preview
      setInput('');
      setSelectedImage(null);
    } catch (error) {
      console.error('❌ Lỗi khi gửi tin nhắn:', error);
    }
  };

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, res => {
      if (res.didCancel || !res.assets?.[0]) return;
      const asset = res.assets[0];
      setSelectedImage(asset.uri!); // chỉ preview
    });
  };

  // 🟢 Gửi hình ảnh/video
  const handleUpload = async () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, async res => {
      if (res.didCancel || !res.assets?.[0]) return;
      const asset = res.assets[0];
      const fileUri = asset.uri;
      setSelectedImage(fileUri); // 🟢 hiển thị ảnh tạm trong input

      try {
        // 🔹 1. Tạo đối tượng file từ URI
        const file = {
          uri: fileUri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'photo.jpg',
        };

        // 🔹 2. Upload file qua API hook có sẵn
        const resUpload = await uploadMutation.mutateAsync(file);

        // 🔹 3. Xác định loại file
        let fileType: 'image' | 'video' | 'file' = 'file';
        if (file.type.startsWith('image/')) fileType = 'image';
        else if (file.type.startsWith('video/')) fileType = 'video';

        // 🔹 4. Gửi message lên Firestore
        await firestore()
          .collection('conversations')
          .doc(conversationId)
          .collection('messages')
          .add({
            sender: email ?? 'Anonymous',
            fileUrl: resUpload?.data?.url,
            fileType,
            timestamp: firestore.FieldValue.serverTimestamp(),
          });

        setSelectedImage(null); // 🔹 Xóa preview sau khi gửi thành công
      } catch (error) {
        console.error('❌ Upload & send file error:', error);
        console.error('Gửi file thất bại!');
      }
    });
  };

  const renderMessage = (msg: Message) => {
    const isMe = msg.sender === email;
    const bubbleStyle = isMe ? styles.myBubble : styles.otherBubble;

    return (
      <View
        key={msg.id}
        style={[
          styles.messageContainer,
          isMe ? { alignItems: 'flex-end' } : {},
        ]}
      >
        {msg.fileType === 'image' && msg.fileUrl ? (
          <Image source={{ uri: msg.fileUrl }} style={styles.image} />
        ) : msg.text ? (
          <View style={bubbleStyle}>
            <Text style={{ color: isMe ? '#fff' : '#000' }}>{msg.text}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {showEmoji && (
        <View
          style={{
            position: 'absolute',
            bottom: 60, // cách input 1 đoạn
            left: 0,
            right: 0,
            height: 250,
            backgroundColor: '#fff',
            zIndex: 1000,
          }}
        >
          <EmojiSelector
            onEmojiSelected={emoji => setInput(prev => prev + emoji)}
            showSearchBar={false}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowEmoji(!showEmoji)}>
          <FontAwesome6 name="face-smile" size={24} color="#555" />
        </TouchableOpacity>

        <View style={styles.inputWithImage}>
          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={styles.removeImageButton}
              >
                <FontAwesome6
                  iconStyle="solid"
                  name="xmark"
                  size={14}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
          )}
          <TextInput
            style={styles.inputInside}
            placeholder="Nhập tin nhắn..."
            value={input}
            onChangeText={setInput}
            multiline
          />
        </View>

        {uploading ? (
          <ActivityIndicator size="small" color="#555" />
        ) : (
          <TouchableOpacity onPress={handleSelectImage}>
            <FontAwesome6 name="image" size={22} color="#007bff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={sendMessage}
          disabled={!input.trim() && !selectedImage}
        >
          <FontAwesome6 name="paper-plane" size={22} color="#007bff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  chatContainer: { padding: 10 },
  messageContainer: { marginVertical: 4 },
  myBubble: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
    maxWidth: '70%',
  },
  otherBubble: {
    backgroundColor: '#e5e5ea',
    borderRadius: 20,
    padding: 10,
    maxWidth: '70%',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    maxHeight: 100,
  },
  inputWithImage: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxHeight: 120,
  },

  imagePreviewContainer: {
    position: 'relative',
    marginRight: 6,
    marginBottom: 4,
  },

  imagePreview: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },

  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
    elevation: 2,
  },

  inputInside: {
    flex: 1,
    minHeight: 40,
    padding: 0,
  },
});
