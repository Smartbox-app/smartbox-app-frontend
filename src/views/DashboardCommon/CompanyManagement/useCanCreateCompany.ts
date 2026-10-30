import { UserRole } from 'smartbox-types';
import {
  useGetCompanyOptionsQuery,
  useGetMyDetailsQuery,
  useGetTenantQuery,
} from 'src/queries';

export const useCanCreateCompany = () => {
  const { data: user } = useGetMyDetailsQuery();
  const { data: tenant } = useGetTenantQuery();
  const isAdmin = user?.role === UserRole.admin;
  const { data: companies, isLoading: isLoadingCompanies } =
    useGetCompanyOptionsQuery(undefined, !!user && !isAdmin);

  if (!user) {
    return { canCreate: false, isLoading: true };
  }

  if (isAdmin || tenant?.allowMultipleCompanies) {
    return { canCreate: true, isLoading: false };
  }

  if (isLoadingCompanies) {
    return { canCreate: false, isLoading: true };
  }

  return {
    canCreate: (companies?.length ?? 0) === 0,
    isLoading: false,
  };
};
