import { useQuery } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../../shared/enums/queryKey";
import { AppointmentApi } from "../../../apis/appointment/appointmentApi";

interface AppointmentFilters {
  status?: string;
  date?: string;
  sort?: string;
}

export const useGetAppointmentsByPatientId = (
  patientId: string | undefined,
  filters?: AppointmentFilters,
) => {
  return useQuery({
    queryKey: [QueryKeyEnum.Appointment, patientId, filters],
    queryFn: () => AppointmentApi.getAppointmentsByPatientId(patientId!, filters),
    enabled: !!patientId,
  });
};
