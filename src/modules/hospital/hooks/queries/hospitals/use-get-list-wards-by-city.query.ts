import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { HospitalApi } from "../../../apis/hospital/hospitalApi";
import { QueryKeyEnum } from "@/app/shares/enums/queryKey";
import { ListWardsByCityResponse } from "../../../types/response";

type Options = Omit<
  UseQueryOptions<ListWardsByCityResponse, Error, ListWardsByCityResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetWardsbyCityQuery(city: string, options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Hospital, "wards_by_city"],
    queryFn: () => HospitalApi.listWardsByCity(city),
    ...options,
  });
}
