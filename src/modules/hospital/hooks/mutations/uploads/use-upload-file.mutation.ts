import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UploadApi } from "../../../apis/upload/uploadApi";
import { UploadFileResponse } from "../../../types/response";

type UploadFileOptions = Omit<
  UseMutationOptions<UploadFileResponse, AxiosError, File>,
  "mutationFn"
>;

function useUploadFileMutation(options?: UploadFileOptions) {
  return useMutation<UploadFileResponse, AxiosError, File>({
    mutationFn: (file) => UploadApi.uploadFile(file),
    ...options,
  });
}

export { useUploadFileMutation };
