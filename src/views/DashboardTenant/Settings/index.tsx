import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { ManageTenantData } from '../../../views/DashboardCommon/ClientManagement/TenantData';
import { ManageTenantSlides } from '../../../views/DashboardCommon/ClientManagement/Slides';
import { ManageTenantFonts } from '../../DashboardCommon/ClientManagement/Fonts';
import { ManageTenantSmtp } from '../../DashboardCommon/ClientManagement/TenantSmtp';
import { Header, Section, Tabs } from 'src/components/ui';
import { AppearanceSettings } from './sections/AppearanceSettings';
import { DocumentsSettings } from './sections/DocumentsSettings';
import {
  TENANT_SETTINGS_DEFAULT_SEGMENT,
  useTenantSettingsTabs,
} from './settingsTabs';
import { __ } from 'src/helpers/i18n';

const Settings = () => {
  const { basePath, tabs } = useTenantSettingsTabs();

  return (
    <>
      <Section>
        <Header variant="h2">{__('application.settings')}</Header>
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
        <Route path={`${basePath}/fonts`} component={ManageTenantFonts} />
        <Route path={`${basePath}/slides`} component={ManageTenantSlides} />
        <Route path={`${basePath}/data`} component={ManageTenantData} />
        <Route path={`${basePath}/smtp`} component={ManageTenantSmtp} />
        <Route path={`${basePath}/documents`} component={DocumentsSettings} />
      </Switch>
    </>
  );
};

export { Settings };
