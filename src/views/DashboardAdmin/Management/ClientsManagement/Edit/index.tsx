import React from 'react';
import {  FormContainer, FormHeader } from '../../../../../components/Layout';
import { ManageTenantLogo } from '../../../../../views/DashboardCommon/ClientManagement/Logo';
import { ManageTenantBackground } from '../../../../../views/DashboardCommon/ClientManagement/Background';
import { ManagaTenantData } from '../../../../../views/DashboardCommon/ClientManagement/TenantData';
import { ManageTenantSlides } from '../../../../../views/DashboardCommon/ClientManagement/Slides';
import { ManageTenantFonts } from '../../../../DashboardCommon/ClientManagement/Fonts';

interface Props {
    userId: string;
}

const TenantEdit = ({ userId }: Props) => {
    return (
        <FormContainer>
            <FormHeader title="application.editTenantData" />
            <ManageTenantLogo userId={userId} />
            <ManageTenantBackground userId={userId} />
            <ManageTenantFonts userId={userId} />
            <ManageTenantSlides userId={userId} />
            <ManagaTenantData userId={userId} />
        </FormContainer>
    );
};

export { TenantEdit }