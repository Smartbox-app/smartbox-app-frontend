import React from 'react';
import { FormContainer, FormHeader } from '../../../../../components/Layout';
import { ManageTenantLogo } from '../../../../../views/DashboardCommon/ClientManagement/Logo';
import { ManageTenantBackground } from '../../../../../views/DashboardCommon/ClientManagement/Background';
import { ManageTenantData } from '../../../../../views/DashboardCommon/ClientManagement/TenantData';
import { ManageTenantSlides } from '../../../../../views/DashboardCommon/ClientManagement/Slides';
import { ManageTenantFonts } from '../../../../DashboardCommon/ClientManagement/Fonts';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../reducers';
import { UserRole } from '../../../../../../../smartbox-back/types';
import { ManageTenantAdminData } from '../TenantAdminData';

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
        </FormContainer>
    );
};

export { TenantEdit }