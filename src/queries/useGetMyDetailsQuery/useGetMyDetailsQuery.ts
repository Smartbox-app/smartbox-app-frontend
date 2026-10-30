import { useQuery } from "@tanstack/react-query";

import { UserRes } from "smartbox-types";
import ApiService from "src/services/api-service";

export const useGetMyDetailsQuery = () => {
  return useQuery({
    queryKey: ["my-details"],
    queryFn: async () => {
      const response = await ApiService.callFetch<UserRes>("get", "user/me");

      if (response) return response;
      return null;
    },
    gcTime: 600000,
    retry: false
  });
};
