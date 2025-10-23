import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { geminiApi } from '../../../shared/api/chat';
import BottomNavigation from '../../../shared/components/BottomNavigation';

export function ChatBox() {
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'bot'; text: string }[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = inputValue;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const reply = await geminiApi.sendMessage(userMessage);
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Xin lỗi, đã xảy ra lỗi khi nhận phản hồi.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages, isLoading]);

  const renderMessage = (
    msg: { sender: 'user' | 'bot'; text: string },
    idx: number,
  ) => {
    const isUser = msg.sender === 'user';
    return (
      <View
        key={idx}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Markdown style={isUser ? markdownUser : markdownBot}>
          {msg.text}
        </Markdown>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafc' }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>🤖 Chatbot</Text>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messages}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.welcomeText}>
            👋 Xin chào! Tôi có thể giúp gì cho bạn?
          </Text>
          {chatMessages.map(renderMessage)}
          {isLoading && (
            <View style={[styles.messageContainer, styles.botMessage]}>
              <Text style={styles.typingText}>Đang gõ...</Text>
              <ActivityIndicator size="small" color="#555" />
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={isLoading ? 'Đang chờ...' : 'Nhập tin nhắn...'}
            editable={!isLoading}
            onSubmitEditing={() => !isLoading && handleSendMessage()}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (isLoading || inputValue.trim() === '') &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={isLoading || inputValue.trim() === ''}
          >
            <Text style={styles.sendButtonText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <BottomNavigation activeTab="chat" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafc',
  },
  header: {
    backgroundColor: '#1250dc',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  headerText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  messages: { flex: 1, paddingHorizontal: 14, paddingTop: 10 },
  welcomeText: { color: '#666', marginBottom: 8, fontSize: 14 },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 14,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#1250dc',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e4e6eb',
    alignSelf: 'flex-start',
  },
  typingText: {
    color: '#333',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#1250dc',
    paddingHorizontal: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#aaa' },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});

const markdownUser = {
  body: { color: '#fff', fontSize: 15 },
};

const markdownBot = {
  body: { color: '#111', fontSize: 15 },
};
