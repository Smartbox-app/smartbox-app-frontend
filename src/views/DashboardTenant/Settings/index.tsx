import React from 'react';
import { FormContainer, PageHeader, Section } from '../../../components/Layout';
import { ManageTenantLogo } from '../../../views/DashboardCommon/ClientManagement/Logo';
import { ManageTenantIcon } from '../../../views/DashboardCommon/ClientManagement/Icon';
import { ManageTenantBackground } from '../../../views/DashboardCommon/ClientManagement/Background';
import { ManageTenantData } from '../../../views/DashboardCommon/ClientManagement/TenantData';
import { ManageTenantSlides } from '../../../views/DashboardCommon/ClientManagement/Slides';
import { ManageTenantFonts } from '../../DashboardCommon/ClientManagement/Fonts';
import { ManageTenantRules } from '../../../views/DashboardCommon/ClientManagement/Rules';
import { ManageTenantPrivacy } from '../../../views/DashboardCommon/ClientManagement/Privacy';
import { ManageTenantAgreement } from '../../../views/DashboardCommon/ClientManagement/Agreement';

const Settings = () => {
    return (
        <Section full>
            <PageHeader title="application.editYourTenantData" />
            <FormContainer highlight>
                <ManageTenantLogo />
                <ManageTenantIcon />
                <ManageTenantBackground />
                <ManageTenantFonts />
                <ManageTenantSlides />
                <ManageTenantData />
                <ManageTenantRules />
                <ManageTenantPrivacy />
                <ManageTenantAgreement />
            </FormContainer>
        </Section>
    );
};

export { Settings }