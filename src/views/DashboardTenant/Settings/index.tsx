import React from 'react';
import { FormContainer, FormHeader, PageHeader, Section } from '../../../components/Layout';
import { ManageTenantLogo } from '../../../views/DashboardCommon/ClientManagement/Logo';
import { ManageTenantBackground } from '../../../views/DashboardCommon/ClientManagement/Background';
import { ManageTenantData } from '../../../views/DashboardCommon/ClientManagement/TenantData';
import { ManageTenantSlides } from '../../../views/DashboardCommon/ClientManagement/Slides';
import { ManageTenantFonts } from '../../DashboardCommon/ClientManagement/Fonts';

const Settings = () => {
    return (
        <Section full>
            <PageHeader title="application.editYourTenantData" />
            <FormContainer highlight>
                <ManageTenantLogo />
                <ManageTenantBackground />
                <ManageTenantFonts />
                <ManageTenantSlides />
                <ManageTenantData />
            </FormContainer>
        </Section>
    );
};

export { Settings }