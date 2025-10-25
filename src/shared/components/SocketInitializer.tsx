import { useEffect } from "react";
import { useAppSelector } from "../stores";
import { closeSocket, initPatientSocket } from "../configs/socket";

export const SocketInitializer = () => {
  const patientId = useAppSelector((state) => state.auth.patient?.patientId);

  useEffect(() => {
    if (patientId) {
      console.log("[InitSocket] Opening WS for", patientId);
      initPatientSocket(patientId);
    }
    return () => {
      console.log("[InitSocket] Closing WS");
      closeSocket();
    };
  }, [patientId]);

  return null;
};
