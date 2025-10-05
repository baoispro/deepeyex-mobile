import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { HospitalApi } from "../../../apis/hospital/hospitalApi";
import { QueryKeyEnum } from "@/app/shares/enums/queryKey";
import { ListCitiesResponse } from "../../../types/response";

type Options = Omit<
  UseQueryOptions<ListCitiesResponse, Error, ListCitiesResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetAllCitiesQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Hospital, "cities"],
    queryFn: () => HospitalApi.listCities(),
    ...options,
  });
}
