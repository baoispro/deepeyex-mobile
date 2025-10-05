import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { HospitalApi } from "../../../apis/hospital/hospitalApi";
import { QueryKeyEnum } from "@/app/shares/enums/queryKey";
import { ListHospitalsResponse } from "../../../types/response";

type Options = Omit<
  UseQueryOptions<ListHospitalsResponse, Error, ListHospitalsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetAllHospitalsQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Hospital, "all"],
    queryFn: () => HospitalApi.getAll(),
    ...options,
  });
}
