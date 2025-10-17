import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { CreatePaymentRequest, VnpayApi } from '../../../apis/vnpay/vnpayApi';
import { ApiResponse } from '../../../../../shared/types/response';

interface CreatePaymentResponse {
  paymentUrl: string;
}

export const useCreateVnpayPaymentMutation = (
  options?: UseMutationOptions<
    ApiResponse<CreatePaymentResponse>,
    Error,
    CreatePaymentRequest
  >,
) => {
  return useMutation<
    ApiResponse<CreatePaymentResponse>,
    Error,
    CreatePaymentRequest
  >({
    mutationFn: (data: CreatePaymentRequest) => VnpayApi.createPaymentURL(data),
    ...options,
  });
};
