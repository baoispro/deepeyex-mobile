import { Alert } from 'react-native';
import { QueryKeyEnum } from '../enums/queryKey';
import { queryClient } from './queryClient';

export const handleSocketEvent = (data: any) => {
  switch (data.type) {
    case 'NEW_APPOINTMENT':
      Alert.alert(
        '📅 Lịch hẹn mới',
        data.payload?.message || 'Bạn có lịch hẹn mới',
      );

      // ✅ Refresh lại danh sách lịch khám (React Query tự refetch)
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.Appointment],
        exact: false,
      });
      break;

    // có thể thêm các event khác ở đây
    case 'CANCEL_APPOINTMENT':
      Alert.alert(
        '⚠️ Lịch hẹn bị hủy',
        data.payload?.message || 'Bệnh nhân đã hủy lịch hẹn.',
      );
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      break;

    case 'NEW_NOTIFICATION':
      Alert.alert(
        '🔔 Thông báo mới',
        data.payload?.notification?.message || 'Bạn có thông báo mới.',
      );
      console.log('Có notification mới:', data.payload?.notification);

      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.Notification],
        exact: false,
      });
      break;

    default:
      console.log('[WS] Unknown event:', data);
  }
};
