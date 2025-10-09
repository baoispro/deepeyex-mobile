import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { QueryKeyEnum } from '../../../../../shared/enums/queryKey';
import { ListTimeSlotsByDoctorIdResponse } from '../../../types/response';
import { TimeSlotApi } from '../../../apis/appointment/timeslotApi';

type Options = Omit<
  UseQueryOptions<
    ListTimeSlotsByDoctorIdResponse,
    Error,
    ListTimeSlotsByDoctorIdResponse,
    QueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useGetTimeSlotsByDoctorIdQuery(
  doctorId: string,
  options?: Options,
) {
  return useQuery({
    queryKey: [QueryKeyEnum.TimeSlot, doctorId],
    queryFn: () => TimeSlotApi.getByDoctorId(doctorId),
    enabled: !!doctorId,
    ...options,
  });
}
