import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { QueryKeyEnum } from '../../../../../shared/enums/queryKey';
import { ListDrugsResponse } from '../../../types/response';
import { DrugApi } from '../../../apis/drug/drugApi';

type Options = Omit<
  UseQueryOptions<ListDrugsResponse, Error, ListDrugsResponse, QueryKey>,
  'queryKey' | 'queryFn'
>;

export function useGetAllDrugsQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Drug, 'all'],
    queryFn: () => DrugApi.getAll(),
    ...options,
  });
}
