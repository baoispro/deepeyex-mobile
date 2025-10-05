import { SuccessResponse } from "@/app/modules/auth/apis/authApi";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Patient } from "../../../types/patient";
import { CreatePatientRequest, PatientApi } from "../../../apis/patient/patientApi";

type CreatePatientOptions = Omit<
  UseMutationOptions<SuccessResponse<Patient>, Error, CreatePatientRequest>,
  "mutationFn"
>;

function useCreatePatientMutation(options?: CreatePatientOptions) {
  return useMutation<SuccessResponse<Patient>, Error, CreatePatientRequest>({
    mutationFn: (form) => PatientApi.create(form),
    ...options,
  });
}

export { useCreatePatientMutation };
