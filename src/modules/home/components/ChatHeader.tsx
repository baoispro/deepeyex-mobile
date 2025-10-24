// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// import { RTCView, mediaDevices } from "react-native-webrtc";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { ImPhoneHangUp } from "react-icons/im";
// import { FaVolumeMute } from "react-icons/fa";
// import EventEmitter from "react-native-eventemitter";

// // 👉 Giả lập các hàm bạn có thể viết riêng theo SDK hoặc API của mình
// const makeVideoCall = async (fromId: string, toId: string, isVideo: boolean) => {
//   console.log(`🎥 Start ${isVideo ? "video" : "audio"} call from ${fromId} to ${toId}`);
// };

// const hangupCall = () => {
//   console.log("📞 Hang up call");
// };

// const muteCall = (mute: boolean) => {
//   console.log(mute ? "🔇 Mute" : "🔊 Unmute");
// };

// interface ChatHeaderProps {
//   userId?: string;
//   userSenderId?: string;
// }

// interface IncomingCall {
//   fromNumber: string;
//   toNumber: string;
//   callId: string;
//   isVideo: boolean;
// }

// const ChatHeader: React.FC<ChatHeaderProps> = ({ userId = "0", userSenderId = "me" }) => {
//   const [openModal, setOpenModal] = useState(false);
//   const [mute, setMute] = useState(false);
//   const [localStream, setLocalStream] = useState<any>(null);
//   const [remoteStream, setRemoteStream] = useState<any>(null);

//   useEffect(() => {
//     const handler = (incomingCall: IncomingCall) => {
//       console.log("📞 Received call in component!", incomingCall);
//       setOpenModal(true);
//     };

//     EventEmitter.on("incoming-call", handler);

//     return () => {
//       EventEmitter.off("incoming-call", handler);
//     };
//   }, []);

//   const handleCall = async (isVideo: boolean) => {
//     console.log(`user2: ${userId}, user1: ${userSenderId}`);
//     setOpenModal(true);

//     // Lấy camera/mic
//     const stream = await mediaDevices.getUserMedia({
//       audio: true,
//       video: isVideo,
//     });
//     setLocalStream(stream);

//     makeVideoCall(userSenderId, userId, isVideo);
//   };

//   const hangup = () => {
//     hangupCall();
//     setOpenModal(false);
//     localStream?.getTracks().forEach((t: any) => t.stop());
//     remoteStream?.getTracks().forEach((t: any) => t.stop());
//     setLocalStream(null);
//     setRemoteStream(null);
//   };

//   const toggleMute = () => {
//     const newMute = !mute;
//     setMute(newMute);
//     muteCall(newMute);
//     if (localStream) {
//       localStream.getAudioTracks().forEach((track: any) => (track.enabled = !newMute));
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.headerRow}>
//         <TouchableOpacity style={styles.callButton} onPress={() => handleCall(true)}>
//           <Icon name="video-camera" size={20} color="white" />
//           <Text style={styles.callText}> Tham gia cuộc gọi video</Text>
//         </TouchableOpacity>
//       </View>

//       <Modal visible={openModal} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Video Call</Text>

//             <View style={styles.videoContainer}>
//               {localStream ? (
//                 <RTCView
//                   streamURL={localStream.toURL()}
//                   style={styles.video}
//                   mirror
//                 />
//               ) : (
//                 <View style={[styles.video, styles.videoPlaceholder]}>
//                   <Text style={styles.placeholderText}>Local Video</Text>
//                 </View>
//               )}

//               {remoteStream ? (
//                 <RTCView streamURL={remoteStream.toURL()} style={styles.video} />
//               ) : (
//                 <View style={[styles.video, styles.videoPlaceholder]}>
//                   <Text style={styles.placeholderText}>Remote Video</Text>
//                 </View>
//               )}
//             </View>

//             <View style={styles.controlRow}>
//               <TouchableOpacity onPress={hangup} style={[styles.controlButton, styles.hangup]}>
//                 <Icon name="phone" size={20} color="#fff" />
//               </TouchableOpacity>

//               <TouchableOpacity onPress={toggleMute} style={[styles.controlButton, styles.mute]}>
//                 <Icon name={mute ? "microphone-slash" : "microphone"} size={20} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity onPress={() => setOpenModal(false)}>
//               <Text style={{ color: "#aaa", marginTop: 10 }}>Đóng</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default ChatHeader;

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     backgroundColor: "#f5f5f5",
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//   },
//   callButton: {
//     backgroundColor: "#1250dc",
//     borderRadius: 30,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//   },
//   callText: {
//     color: "white",
//     marginLeft: 5,
//     fontWeight: "600",
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "90%",
//     backgroundColor: "#1a1a1a",
//     padding: 20,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   modalTitle: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   videoContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   video: {
//     width: 150,
//     height: 120,
//     backgroundColor: "black",
//     borderRadius: 10,
//   },
//   videoPlaceholder: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   placeholderText: {
//     color: "#aaa",
//   },
//   controlRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 15,
//     gap: 20,
//   },
//   controlButton: {
//     padding: 15,
//     borderRadius: 50,
//   },
//   hangup: {
//     backgroundColor: "red",
//   },
//   mute: {
//     backgroundColor: "#333",
//   },
// });
