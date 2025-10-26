import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
// @ts-ignore
import { StringeeVideoView, StringeeCall } from 'stringee-react-native-v2';
import { callEventEmitter } from '../../../shared/utils/callEvents';
import {
  hangupCall,
  makeVideoCall,
  muteCall,
} from '../../../shared/utils/stringee';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

interface VideoCallProps {
  userId?: string;
  userSenderId?: string;
}

export default function VideoCall({ userId, userSenderId }: VideoCallProps) {
  const [openModal, setOpenModal] = useState(false);
  const [mute, setMute] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [localStreamId, setLocalStreamId] = useState<string | null>(null);
  const [remoteStreamId, setRemoteStreamId] = useState<string | null>(null);
  const callRef = useRef<StringeeCall | null>(null);

  // Hàm xin quyền
  async function requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('✅ Camera & Mic permissions granted');
          return true;
        } else {
          console.log('❌ Permissions denied');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  // Listen incoming call
  useEffect(() => {
    const incomingHandler = (call: any) => {
      console.log('📞 Incoming call!', call);
      setCallId(call.callId);
      setOpenModal(true);
    };

    const onLocalStream = (stream: any) => {
      console.log('🎥 Local stream available', stream);
      setLocalStream(stream);
      setLocalStreamId(stream.uuid); // ✅ dùng stream.streamId
    };

    const onRemoteStream = (stream: any) => {
      console.log('🌎 Remote stream available', stream);
      console.log('remoteStream:', JSON.stringify(stream, null, 2));
      setRemoteStream(stream);
      setRemoteStreamId(stream.uuid); // ✅ dùng stream.streamId
    };

    callEventEmitter.on('incoming-call', incomingHandler);
    callEventEmitter.on('local-stream', onLocalStream);
    callEventEmitter.on('remote-stream', onRemoteStream);

    return () => {
      callEventEmitter.off('incoming-call', incomingHandler);
      callEventEmitter.off('local-stream', onLocalStream);
      callEventEmitter.off('remote-stream', onRemoteStream);
    };
  }, []);

  const handleCall = async (isVideoCall: boolean) => {
    if (!userId || !userSenderId) return;
    const ok = await requestPermissions();
    if (!ok) {
      Alert.alert(
        'Cần cấp quyền',
        'Vui lòng cấp quyền camera và micro để gọi video.',
      );
      return;
    }
    try {
      const newCallId = await makeVideoCall(userId, userSenderId, isVideoCall);
      callRef.current = newCallId;
      setOpenModal(true);
    } catch (err) {
      console.error('❌ Error making call:', err);
    }
  };

  const hangup = () => {
    if (callId) hangupCall(callId);
    setOpenModal(false);
    setLocalStream(null);
    setRemoteStream(null);
    setCallId(null);
    setLocalStreamId(null);
    setRemoteStreamId(null);
  };

  const toggleMute = () => {
    if (callId) muteCall(callId, !mute);
    setMute(!mute);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Nút gọi */}
      <TouchableOpacity
        onPress={() => handleCall(true)}
        style={styles.callButton}
      >
        <Text style={{ color: 'white' }}>🎥 Call Video</Text>
      </TouchableOpacity>

      {/* Modal Video Call */}
      <Modal visible={openModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Video Call</Text>

            <View style={styles.videosContainer}>
              {remoteStreamId ? (
                <StringeeVideoView
                  uuid={remoteStreamId}
                  style={styles.remoteVideo}
                  local={false}
                />
              ) : (
                <Text style={{ color: 'white' }}>Waiting remote stream...</Text>
              )}

              {localStreamId ? (
                <StringeeVideoView
                  uuid={localStreamId}
                  style={styles.localVideo}
                  local={true}
                />
              ) : (
                <Text style={{ color: 'white' }}>Waiting local stream...</Text>
              )}
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.hangupBtn} onPress={hangup}>
                <Text style={{ color: 'white' }}>📴 Hangup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.muteBtn} onPress={toggleMute}>
                <Text style={{ color: 'white' }}>
                  {mute ? '🔇 Mute' : '🔊 Unmute'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  callButton: {
    backgroundColor: '#1250dc',
    padding: 12,
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  videosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  remoteVideo: {
    flex: 1, // ✅ dùng flex thay vì '100%'
    alignSelf: 'stretch',
    backgroundColor: 'black',
    borderRadius: 8,
  },

  localVideo: {
    width: 120,
    height: 160,
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  hangupBtn: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
  },
  muteBtn: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
  },
});
