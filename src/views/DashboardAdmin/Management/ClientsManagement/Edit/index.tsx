import React from 'react';
import { FormContainer, FormHeader } from '../../../../../components/Layout';
import { ManageTenantLogo } from '../../../../../views/DashboardCommon/ClientManagement/Logo';
import { ManageTenantBackground } from '../../../../../views/DashboardCommon/ClientManagement/Background';
import { ManageTenantSlides } from '../../../../../views/DashboardCommon/ClientManagement/Slides';
import { ManageTenantFonts } from '../../../../DashboardCommon/ClientManagement/Fonts';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../reducers';
import { ManageTenantAdminData } from '../TenantAdminData';
import { ManageTenantRules } from '../../../../../views/DashboardCommon/ClientManagement/Rules';
import { ManageTenantPrivacy } from '../../../../../views/DashboardCommon/ClientManagement/Privacy';
import { ManageTenantAgreement } from '../../../../../views/DashboardCommon/ClientManagement/Agreement';

interface Props {
    userId: string;
}

const TenantEdit = ({ userId }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details!);

    return (
        <FormContainer>
            <FormHeader title="application.editTenantData" />
            <ManageTenantLogo userId={userId} />
            <ManageTenantBackground userId={userId} />
            <ManageTenantFonts userId={userId} />
            <ManageTenantSlides userId={userId} />
            <ManageTenantAdminData userId={userId} />
            <ManageTenantRules userId={userId} />
            <ManageTenantPrivacy userId={userId} />
            <ManageTenantAgreement userId={userId} />
        </FormContainer>
    );
};

export { TenantEdit }