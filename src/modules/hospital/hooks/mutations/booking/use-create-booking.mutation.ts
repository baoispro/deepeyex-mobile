import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  BookingApi,
  BookingRequest,
  BookingResponse,
} from '../../../apis/booking/bookingApi';

type Options = Omit<
  UseMutationOptions<BookingResponse, Error, BookingRequest>,
  'mutationFn'
>;

function useCreateBookingMutation(options?: Options) {
  return useMutation<BookingResponse, Error, BookingRequest>({
    mutationFn: (req: BookingRequest) => BookingApi.createBooking(req),
    ...options,
  });
}

export { useCreateBookingMutation };
