// StringeeService.ts
// ----------------------------
// ✅ Phiên bản đúng chuẩn SDK v2 (TypeScript friendly, sự kiện dạng listener)

import {
  StringeeClient,
  StringeeCall,
  StringeeClientListener,
  StringeeCallListener,
} from 'stringee-react-native-v2';
import { callEventEmitter } from './callEvents';

let client: StringeeClient | null = null;
let currentCall: StringeeCall | null = null;

/**
 * 🔌 Kết nối đến Stringee Server
 */
export function connectToStringee(token: string) {
  client = new StringeeClient();

  // 🔸 Tạo listener cho client
  const clientListener = new StringeeClientListener();

  // Khi client kết nối thành công
  clientListener.onConnect = (stringeeClient, userId) => {
    console.log('✅ Connected to Stringee Server as:', userId);
  };

  // Khi client bị ngắt kết nối
  clientListener.onDisConnect = () => {
    console.log('🔌 Disconnected from Stringee Server');
  };

  // Khi kết nối thất bại
  clientListener.onFailWithError = (_, code, message) => {
    console.error(`❌ Connect failed (${code}): ${message}`);
  };

  // Khi token hết hạn → cần yêu cầu token mới
  clientListener.onRequestAccessToken = () => {
    console.log('⚠️ Access token expired — please refresh');
  };

  // Khi có cuộc gọi đến
  clientListener.onIncomingCall = (_, incomingCall) => {
    console.log('📞 Incoming call:', JSON.stringify(incomingCall));
    currentCall = incomingCall;
    callEventEmitter.emit('incoming-call', incomingCall);
    setupCallEvents(incomingCall);
  };

  // Gán listener cho client
  client.setListener(clientListener);

  // Thực hiện kết nối
  client.connect(token);
}

/**
 * 🎥 Gọi video hoặc audio call
 */
export function makeVideoCall(
  fromUserId: string,
  toUserId: string,
  isVideoCall: boolean = true,
) {
  if (!client) {
    console.error('⚠️ Client not initialized!');
    return;
  }

  // Tạo cuộc gọi mới
  currentCall = new StringeeCall({
    stringeeClient: client,
    from: fromUserId,
    to: toUserId,
  });
  currentCall.isVideoCall = isVideoCall;

  console.log(`${isVideoCall ? '🎥' : '📞'} Calling ${toUserId}...`);

  // Gán các event cho cuộc gọi
  setupCallEvents(currentCall);

  // Thực hiện gọi
  currentCall
    .makeCall()
    .then(() => console.log('✅ Make call success'))
    .catch(err => console.error('❌ Make call failed:', err));
}

/**
 * 🎧 Gán sự kiện cho cuộc gọi
 */
function setupCallEvents(call: StringeeCall) {
  const callListener = new StringeeCallListener();

  callListener.onChangeSignalingState = (call, signalingState, reason) => {
    console.log('🔁 Signaling state changed:', signalingState, reason);
  };

  callListener.onChangeMediaState = (call, mediaState) => {
    console.log('📡 Media state changed:', mediaState);
  };

  callListener.onReceiveLocalStream = () => {
    console.log('🎥 Local stream ready');
    callEventEmitter.emit('local-stream', call);
  };

  callListener.onReceiveRemoteStream = () => {
    console.log('🌎 Remote stream ready');
    callEventEmitter.emit('remote-stream', call);
  };

  callListener.onReceiveCallInfo = (_, info) => {
    console.log('ℹ️ Call info:', info);
  };

  callListener.onHandleOnAnotherDevice = (_, signalingState) => {
    console.log('📱 Call handled on another device:', signalingState);
  };

  callListener.onAudioDeviceChange = (_, selectedDevice, availableDevices) => {
    console.log('🎧 Audio device changed:', selectedDevice, availableDevices);
  };

  call.setListener(callListener);
}

/**
 * 📴 Kết thúc cuộc gọi
 */
export function hangupCall() {
  if (currentCall) {
    currentCall
      .hangup()
      .then(() => console.log('📴 Call ended'))
      .catch(console.error);
  }
}

/**
 * 🔇 Bật/tắt micro
 */
export function muteCall(mute: boolean) {
  if (currentCall) {
    currentCall
      .mute(mute)
      .then(() => console.log(`🔇 Call ${mute ? 'muted' : 'unmuted'}`))
      .catch(console.error);
  }
}

/**
 * 🔁 Lấy instance client hiện tại
 */
export function getStringeeClient(): StringeeClient | null {
  return client;
}
