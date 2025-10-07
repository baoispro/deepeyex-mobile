import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { HospitalApi } from "../../../apis/hospital/hospitalApi";
import { SearchByAddressResponse } from "../../../types/response";
import { QueryKeyEnum } from "../../../../../shared/enums/queryKey";

type Options = Omit<
  UseQueryOptions<SearchByAddressResponse, Error, SearchByAddressResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetHospitalbyAddressQuery(keyword: string, options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Hospital, "address"],
    queryFn: () => HospitalApi.searchByAddress(keyword),
    ...options,
  });
}
