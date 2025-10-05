import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { HospitalApi } from "../../../apis/hospital/hospitalApi";
import { QueryKeyEnum } from "@/app/shares/enums/queryKey";
import { GetHospitalByIdResponse } from "../../../types/response";

type Options = Omit<
  UseQueryOptions<GetHospitalByIdResponse, Error, GetHospitalByIdResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetHospitalbySlugQuery(slug: string, options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Hospital, "slug"],
    queryFn: () => HospitalApi.getBySlug(slug),
    ...options,
  });
}
