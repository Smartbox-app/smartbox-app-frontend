import React from 'react';
import { FormContainer, FormHeader, PageHeader, Section } from '../../../components/Layout';
import { ManageTenantLogo } from '../../../views/DashboardCommon/ClientManagement/Logo';
import { ManageTenantBackground } from '../../../views/DashboardCommon/ClientManagement/Background';
import { ManagaTenantData } from '../../../views/DashboardCommon/ClientManagement/TenantData';
import { ManageTenantSlides } from '../../../views/DashboardCommon/ClientManagement/Slides';

const Settings = () => {
    return (
        <Section full>
            <PageHeader title="application.editYourTenantData" />
            <FormContainer>
                <ManageTenantLogo />
                <ManageTenantBackground />
                <ManageTenantSlides />
                <ManagaTenantData />
            </FormContainer>
        </Section>
    );
};

export { Settings }