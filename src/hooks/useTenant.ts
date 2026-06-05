import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import {
  AccountConfirmationMethod,
  DebtResolveType,
  NamingType,
  TenantForUsers,
} from 'smartbox-types';
import { setTenant as setTenantAction } from '../actions/tenant';
import ApiService from '../services/api-service';
import { ApplicationState } from 'src/reducers';
import { LocationSelectType } from 'src/smartbox-types/location';
import { getHostName } from 'src/utils/hostname';

interface UseTenant {
  tenant: TenantForUsers | null;
}

const useTenant = (): UseTenant => {
  const dispatch = useDispatch();
  const tenantData = useSelector((state: ApplicationState) => state.tenant);
  const [tenant, setTenant] = useState<TenantForUsers | null>(tenantData);

  useEffect(() => {
    if (!tenantData) fetchTenantData();
  }, []);

  useEffect(() => {
    if (tenantData) setTenant(tenantData);
  }, [tenantData]);

  const fetchTenantData = async () => {
    const clientId = getHostName();
    if (!clientId) {
      setDefaults();
      return;
    }

    await ApiService.callFetch(
      'GET',
      `tenant/${clientId}`,
      (tenantRes: TenantForUsers) => {
        setTenant(tenantRes);
        dispatch(setTenantAction(tenantRes));
      },
    );
  };

  const setDefaults = () => {
    setTenant({
      id: '',
      identifier: '',
      colorPrimary: '#0674bd',
      colorSecondary: '#ffca3c',
      logo: '/assets/images/Smartbox-logo-color.png',
      background: '/assets/images/bg.jpg',
      slides: [],
      name: 'SmartBox',
      contactEmail: '',
      contactPhone: '',
      fontBold: '',
      fontLight: '',
      fontNormal: '',
      additionalMailInfo: '',
      tax: '',

      privacy: '',
      agreement: '',
      rules: '',
      newRentNotification: false,
      rentExtendedNotification: false,
      smsAvailable: false,
      accountConfirmationMethodEffective:
        AccountConfirmationMethod.email_link,
      invoiceServiceDepartmentID: '',
      debtResolveType: DebtResolveType.DebtOnly,
      paymentDisclaimer: '',
      homeMessage: '',
      agreementDisclaimer: '',
      clientSourceField: false,
      allowAddonsToRent: false,
      links: [],
      icon: '',
      useProd: false,
      birthDateNecessary: false,
      locationSelectType: LocationSelectType.Tiles,
      namingType: NamingType.Stock,
    });
  };

  return {
    tenant,
  };
};

export { useTenant };
