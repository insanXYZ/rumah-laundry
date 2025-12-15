import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "./axios";
import { ResponseSchema } from "@/app/dto/dto";
import { AxiosError } from "axios";
import { ToastError, ToastSuccess } from "./toast";

export const useQueryData = (keys: any[], url: string) => {
  return useQuery({
    queryKey: keys,
    queryFn: async () => {
      const res = await API.get(url);
      return res.data;
    },
  });
};

export enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}

interface Mutate {
  url: string;
  body: any;
  method: HttpMethod;
}

export function Mutation<T = any>(
  mutationKey: any[],
  useToast: boolean = false
) {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseSchema<T>,
    AxiosError<ResponseSchema, any>,
    Mutate
  >({
    mutationFn: async ({ url, body, method }: Mutate) => {
      const res = await API({
        url: url,
        data: body,
        method: method,
      });

      return res.data;
    },
    mutationKey,
    onSuccess: (data: ResponseSchema) => {
      if (data.message && useToast) {
        ToastSuccess(data.message);
      }

      return queryClient.invalidateQueries({ queryKey: mutationKey });
    },
    onError: (err: any) => {
      if (err.response?.data && useToast) {
        ToastError(err.response.data.message);
      }
    },
  });
}
