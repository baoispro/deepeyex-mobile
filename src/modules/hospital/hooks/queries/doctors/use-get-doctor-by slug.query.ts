import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "@/app/shares/enums/queryKey";
import { GetDoctorByUserIdResponse } from "../../../types/response";
import { DoctorApi } from "../../../apis/doctor/doctorApi";

type Options = Omit<
  UseQueryOptions<GetDoctorByUserIdResponse, Error, GetDoctorByUserIdResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetDoctorBySlugQuery(slug: string, options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Doctor, "slug"],
    queryFn: () => DoctorApi.getBySlug(slug),
    ...options,
  });
}
