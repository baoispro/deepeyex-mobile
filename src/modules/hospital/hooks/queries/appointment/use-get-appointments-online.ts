import { useQuery } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../../shared/enums/queryKey";
import { AppointmentApi } from "../../../apis/appointment/appointmentApi";


type OnlineAppointmentParams = {
  book_user_id?: string;
  doctorId?: string;
};

export const useGetAppointmentsOnline = (params: OnlineAppointmentParams) => {
  return useQuery({
    queryKey: [QueryKeyEnum.Appointment, params],
    queryFn: () => AppointmentApi.getOnlineAppointments(params!),
    enabled: !!(params.book_user_id || params.doctorId),
  });
};
