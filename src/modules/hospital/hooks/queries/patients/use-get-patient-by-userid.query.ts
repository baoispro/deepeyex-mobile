import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../../shares/enums/queryKey";
import { PatientApi } from "../../../apis/patient/patientApi";
import { GetPatientResponse } from "../../../types/response";

type Options = Omit<
  UseQueryOptions<GetPatientResponse, Error, GetPatientResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function usePatientByUserIdQuery(userId: string, options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Patient, userId],
    queryFn: () => PatientApi.getByUserID(userId),
    enabled: !!userId, // chỉ chạy khi có userId
    ...options,
  });
}
