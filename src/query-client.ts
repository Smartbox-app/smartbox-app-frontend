import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // A second subscriber (and a focus event) was refetching each call immediately.
      staleTime: 30_000,
    },
  },
});
