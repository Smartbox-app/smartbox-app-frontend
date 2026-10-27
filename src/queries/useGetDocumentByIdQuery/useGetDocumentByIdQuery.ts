import { useQuery } from "@tanstack/react-query";

import { DocumentRes } from "smartbox-types";
import ApiService from "src/services/api-service";

export const useGetDocumentByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const response = await ApiService.callFetch<DocumentRes>("get", `document/${id}`);

      if (response) return response;
      return null;
    },
    gcTime: 600000,
    retry: false
  });
};
