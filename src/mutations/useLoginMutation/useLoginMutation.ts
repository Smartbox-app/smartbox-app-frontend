import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../../services/api-service";
import { LoginDto } from "../../dto/LoginDto";
import { AuthLoginResult } from "smartbox-types";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (dto: LoginDto) => {
      const response = await ApiService.callFetch<AuthLoginResult>(
        "post",
        "auth/login",
        null,
        null,
        dto
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-details"],
      });
    },
  });
};
