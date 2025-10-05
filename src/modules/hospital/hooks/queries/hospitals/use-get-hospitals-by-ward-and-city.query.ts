import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { HospitalApi } from "../../../apis/hospital/hospitalApi";
import { QueryKeyEnum } from "@/app/shares/enums/queryKey";
import { ListByCityAndWardResponse } from "../../../types/response";

type Options = Omit<
  UseQueryOptions<ListByCityAndWardResponse, Error, ListByCityAndWardResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetHospitalsbyWardAndCityQuery(city?: string, ward?: string, options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Hospital, "ward_and_city"],
    queryFn: () => HospitalApi.filter(city, ward),
    ...options,
  });
}
