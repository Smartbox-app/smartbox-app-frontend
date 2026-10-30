import { DEFAULT_API_TABLE_INSTANCE_ID } from 'src/constants/api-table-instances';
import { queryClient } from 'src/query-client';

export const refreshApiTableData =
  (instanceId = DEFAULT_API_TABLE_INSTANCE_ID) =>
  () => {
    void queryClient.invalidateQueries({ queryKey: ['api-table', instanceId] });
  };
