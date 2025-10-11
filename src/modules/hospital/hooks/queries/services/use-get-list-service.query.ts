import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ListServicesResponse } from '../../../types/response';
import { ServiceApi } from '../../../apis/service/serviceApi';
import { QueryKeyEnum } from '../../../../../shared/enums/queryKey';

type Options = Omit<
  UseQueryOptions<ListServicesResponse, Error, ListServicesResponse, QueryKey>,
  'queryKey' | 'queryFn'
>;

export function useGetAllServicesByDoctorIdQuery(
  doctorId: string,
  options?: Options,
) {
  return useQuery({
    queryKey: [QueryKeyEnum.Service, 'all', doctorId],
    queryFn: () => ServiceApi.getServicesByDoctorId(doctorId),
    ...options,
  });
}
