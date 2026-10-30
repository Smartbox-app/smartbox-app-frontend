import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { UserRole } from 'smartbox-types';
import { Button } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { Header, HeaderWithActions, Section, Tabs } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

import { ManageTenantFonts } from '../ClientManagement/Fonts';
import { ManageTenantSlides } from '../ClientManagement/Slides';
import { ManageTenantData } from '../ClientManagement/TenantData';
import { ManageTenantSmtp } from '../ClientManagement/TenantSmtp';
import { AgreementsSettings } from './sections/AgreementsSettings';
import { AnalyticsSettings } from './sections/AnalyticsSettings';
import { AppearanceSettings } from './sections/AppearanceSettings';
import { CommunicationsSettings } from './sections/CommunicationsSettings';
import { DocumentsSettings } from './sections/DocumentsSettings';
import { IntegrationsSettings } from './sections/IntegrationsSettings';
import { MobileAppsSettings } from './sections/MobileAppsSettings';
import { TemplatesSettings } from './sections/TemplatesSettings';
import {
  TENANT_SETTINGS_DEFAULT_SEGMENT,
  useTenantSettingsTabs,
} from './settingsTabs';
import { TenantSettingsContext } from './TenantSettingsContext';

type TenantSettingsProps = {
  userId?: string;
  tenantId?: string;
  basePath?: string;
  backTo?: string;
};

export const TenantSettings = ({
  userId,
  tenantId,
  basePath: basePathOverride,
  backTo,
}: TenantSettingsProps) => {
  const { data: user } = useGetMyDetailsQuery();
  const { basePath, tabs } = useTenantSettingsTabs(basePathOverride);
  const slug = UserService.getSlugByRole(user?.role as UserRole);

  return (
    <TenantSettingsContext.Provider value={{ userId, tenantId, basePath }}>
      <Section>
        {backTo ? (
          <HeaderWithActions
            actions={
              <ButtonsContainer>
                <Button to={backTo} text="application.back" primary />
              </ButtonsContainer>
            }
          >
            {__('application.settings')}
          </HeaderWithActions>
        ) : (
          <Header variant="h2">{__('application.settings')}</Header>
        )}
        <Tabs tabs={tabs} />
      </Section>
      <Switch>
        <Route
          exact
          path={basePath}
          render={() => (
            <Redirect to={`${basePath}/${TENANT_SETTINGS_DEFAULT_SEGMENT}`} />
          )}
        />
        <Route path={`${basePath}/appearance`} component={AppearanceSettings} />
        <Route
          path={`${basePath}/fonts`}
          render={() => <ManageTenantFonts userId={userId} />}
        />
        <Route
          path={`${basePath}/slides`}
          render={() => <ManageTenantSlides userId={userId} />}
        />
        <Route
          path={`${basePath}/data`}
          render={() => <ManageTenantData userId={userId} />}
        />
        <Route path={`${basePath}/agreements`} component={AgreementsSettings} />
        <Route
          path={`${basePath}/communications`}
          component={CommunicationsSettings}
        />
        <Route
          path={`${basePath}/integrations`}
          component={IntegrationsSettings}
        />
        <Route
          path={`${basePath}/messaging`}
          render={() => <Redirect to={`${basePath}/communications`} />}
        />
        <Route path={`${basePath}/mobile-apps`} component={MobileAppsSettings} />
        <Route path={`${basePath}/analytics`} component={AnalyticsSettings} />
        <Route
          path={`${basePath}/smtp`}
          render={() => <ManageTenantSmtp userId={userId} />}
        />
        <Route path={`${basePath}/documents`} component={DocumentsSettings} />
        <Route path={`${basePath}/templates`} component={TemplatesSettings} />
        <Route
          path={`${basePath}/settlements`}
          render={() =>
            slug ? <Redirect to={`/${slug}/management/settlements`} /> : null
          }
        />
      </Switch>
    </TenantSettingsContext.Provider>
  );
};
