import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiResponse } from '../../../../../shared/types/response';
import {
  CreateOrderRequest,
  Order,
  OrderApi,
} from '../../../apis/order/orderApi';

type Options = Omit<
  UseMutationOptions<ApiResponse<Order>, Error, CreateOrderRequest>,
  'mutationFn'
>;

const useCreateOrderMutation = (options?: Options) => {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => OrderApi.createOrder(data),
    ...options,
  });
};

export { useCreateOrderMutation };
