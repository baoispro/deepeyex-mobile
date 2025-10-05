import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "@/app/shares/enums/queryKey";
import { ListTimeSlotsByDateResponse } from "../../../types/response";
import { TimeSlotApi } from "../../../apis/appointment/timeslotApi";

type Options = Omit<
  UseQueryOptions<ListTimeSlotsByDateResponse, Error, ListTimeSlotsByDateResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetTimeSlotsByDoctorAndDateQuery(
  doctorId: string,
  date: string,
  options?: Options,
) {
  return useQuery({
    queryKey: [QueryKeyEnum.TimeSlot, doctorId, "date", date],
    queryFn: () => TimeSlotApi.getByDoctorAndDate(doctorId, date),
    enabled: !!doctorId && !!date,
    ...options,
  });
}
