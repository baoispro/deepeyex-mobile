import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../../shared/enums/queryKey";
import { ListTimeSlotsByMonthResponse } from "../../../types/response";
import { TimeSlotApi } from "../../../apis/appointment/timeslotApi";

type Options = Omit<
  UseQueryOptions<ListTimeSlotsByMonthResponse, Error, ListTimeSlotsByMonthResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetTimeSlotsByDoctorAndMonthQuery(
  doctorId: string,
  month: string,
  options?: Options,
) {
  return useQuery({
    queryKey: [QueryKeyEnum.TimeSlot, doctorId, "month", month],
    queryFn: () => TimeSlotApi.getByDoctorAndMonth(doctorId, month),
    enabled: !!doctorId && !!month,
    ...options,
  });
}
