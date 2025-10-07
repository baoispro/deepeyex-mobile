import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DiagnosisResponse } from '../../types/predict';
import { PredictApi } from '../../api/predictApi';

type PredictParams = {
  formData: FormData;
  topK?: number;
};

type Options = Omit<
  UseMutationOptions<DiagnosisResponse, Error, PredictParams>,
  'mutationFn'
>;

function usePredictMutation(options?: Options) {
  return useMutation({
    mutationFn: ({ formData, topK = 3 }: PredictParams) =>
      PredictApi.predict(formData, topK),
    ...options,
  });
}

export { usePredictMutation };
