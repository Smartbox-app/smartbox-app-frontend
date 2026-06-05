import React from 'react';
import { Modal } from 'src/components/ui';
import { __ } from '../../../../../helpers/i18n';
import { ManageTenantLogo } from '../../../../../views/DashboardCommon/ClientManagement/Logo';
import { ManageTenantIcon } from '../../../../../views/DashboardCommon/ClientManagement/Icon';
import { ManageTenantBackground } from '../../../../../views/DashboardCommon/ClientManagement/Background';
import { ManageTenantSlides } from '../../../../../views/DashboardCommon/ClientManagement/Slides';
import { ManageTenantFonts } from '../../../../DashboardCommon/ClientManagement/Fonts';
import { ManageTenantAdminData } from '../TenantAdminData';
import { ManageTenantRules } from '../../../../../views/DashboardCommon/ClientManagement/Rules';
import { ManageTenantPrivacy } from '../../../../../views/DashboardCommon/ClientManagement/Privacy';
import { ManageTenantAgreement } from '../../../../../views/DashboardCommon/ClientManagement/Agreement';
import { ManageTenantSmtp } from '../../../../../views/DashboardCommon/ClientManagement/TenantSmtp';

interface Props {
  userId: string;
}

const TenantEdit = ({ userId }: Props) => {
  return (
    <>
      <Modal.Header title={__('application.editTenantData')} />
      <Modal.Content>
        <ManageTenantLogo userId={userId} />
        <ManageTenantIcon userId={userId} />
        <ManageTenantBackground userId={userId} />
        <ManageTenantFonts userId={userId} />
        <ManageTenantSlides userId={userId} />
        <ManageTenantAdminData userId={userId} />
        <ManageTenantSmtp userId={userId} />
        <ManageTenantRules userId={userId} />
        <ManageTenantPrivacy userId={userId} />
        <ManageTenantAgreement userId={userId} />
      </Modal.Content>
    </>
  );
};

export { TenantEdit };
