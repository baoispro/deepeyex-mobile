import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { AuthApi, ErrorResponse, LoginFirebaseRequest, SuccessResponse, TokenResponse } from "../../apis/authApi";
import { setTokens } from "../../../../shared/stores/authSlice";

type LoginFirebaseOptions = Omit<
  UseMutationOptions<
    SuccessResponse<TokenResponse>,
    AxiosError<ErrorResponse>,
    LoginFirebaseRequest
  >,
  "mutationFn"
>;

export function useLoginFirebaseMutation(options?: LoginFirebaseOptions) {
  const dispatch = useDispatch();

  return useMutation<
    SuccessResponse<TokenResponse>,
    AxiosError<ErrorResponse>,
    LoginFirebaseRequest
  >({
    mutationFn: async (form: LoginFirebaseRequest) => {
      return await AuthApi.loginFirebase(form);
    },
     onSuccess: (res, variables, context, mutation) => { 
      dispatch(
        setTokens({
          accessToken: res.data?.access_token || "",
          refreshToken: "",
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
