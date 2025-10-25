import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { NotificationApi, Notification } from "../../../apis/notification/notificationApi";
import { ApiResponse } from "../../../../../shared/types/response";
import { QueryKeyEnum } from "../../../../../shared/enums/queryKey";

type Options = Omit<
  UseQueryOptions<ApiResponse<Notification[]>, Error, ApiResponse<Notification[]>, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetNotificationsByUserQuery(userId: string, options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Notification, userId],
    queryFn: () => NotificationApi.getAll(userId),
    // enabled: !!userId,
    ...options,
  });
}
