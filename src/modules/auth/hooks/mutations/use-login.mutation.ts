import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  AuthApi,
  LoginRequest,
  SuccessResponse,
  TokenResponse,
  ErrorResponse,
} from "../../apis/authApi";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { setTokens } from "../../../../shared/stores/authSlice";


type LoginOptions = Omit<
  UseMutationOptions<SuccessResponse<TokenResponse>, AxiosError<ErrorResponse>, LoginRequest>,
  "mutationFn"
>;

export function useLoginMutation(options?: LoginOptions) {
  const dispatch = useDispatch();

  return useMutation<SuccessResponse<TokenResponse>, AxiosError<ErrorResponse>, LoginRequest>({
    mutationFn: async (form: LoginRequest) => {
      return await AuthApi.login(form);
    },
    onSuccess: (res, variables, context, mutation) => {
      dispatch(
        setTokens({
          accessToken: res.data?.access_token || "",
          refreshToken: res.data?.refresh_token || "",
          userId: res.data?.user_id || "",
          role: res.data?.role || "",
        }),
      );
      options?.onSuccess?.(res, variables, context, mutation);
    },
    onError: (err, variables, context, mutation) => {
      options?.onError?.(err, variables, context, mutation);
    },
  });
}
