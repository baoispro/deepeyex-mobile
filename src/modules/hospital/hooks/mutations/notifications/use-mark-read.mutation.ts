import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationApi } from "../../../apis/notification/notificationApi";
import { QueryKeyEnum } from "../../../../../shared/enums/queryKey";

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NotificationApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Notification], exact: false });
    },
  });
};
