import { SuccessResponse } from "@/app/modules/auth/apis/authApi";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Patient } from "../../../types/patient";
import { UpdatePatientRequest, PatientApi } from "../../../apis/patient/patientApi";

// Định nghĩa type cho options, loại bỏ mutationFn để custom được từ bên ngoài
type UpdatePatientOptions = Omit<
  UseMutationOptions<SuccessResponse<Patient>, Error, { patientId: string } & UpdatePatientRequest>,
  "mutationFn"
>;

function useUpdatePatientMutation(options?: UpdatePatientOptions) {
  return useMutation<SuccessResponse<Patient>, Error, { patientId: string } & UpdatePatientRequest>(
    {
      mutationFn: async (request: { patientId: string } & UpdatePatientRequest) => {
        const { patientId, ...body } = request;

        if (!patientId) {
          throw new Error("patient_id is required to update patient");
        }

        return PatientApi.update(patientId, body);
      },
      ...options,
    },
  );
}

export { useUpdatePatientMutation };
