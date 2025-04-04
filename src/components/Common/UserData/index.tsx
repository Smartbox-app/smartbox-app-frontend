import React from 'react';
import { UserRole } from 'smartbox-types';
import { Section, SectionHeader } from '../../../components/Layout';
import { Row } from '../../../components/Common';
import { useGetMyDetailsQuery } from '../../../queries';


const UserData = () => {
  const { data: user } = useGetMyDetailsQuery();
    if (!user) return null;
    const { role } = user;
    return (
        <div className="content-wrapper">
            <Section highlight>
                <SectionHeader title='application.userData' />
                <Row label='application.firstName' content={user.firstName} />
                <Row label='application.lastName' content={user.lastName} />
                <Row label='application.userRole' content={user.role} />
            </Section>
            <Section highlight>
                <SectionHeader title='application.contactData' />
                <Row label='application.mail' content={user.email} />
                <Row label='application.phone' content={user.phone} />
                {role === UserRole.user && (
                    <>
                        <Row label='application.city' content={user.city} />
                        <Row label='application.street' content={user.street} />
                        <Row label='application.postCode' content={user.postCode} />
                    </>
                )}
            </Section>
            {role === UserRole.user && (
                <Section highlight>
                    <SectionHeader title='application.contactCompanyData' />
                    <Row label='application.companyName' content={user.companyData.companyName} />
                    <Row label='application.nip' content={user.companyData.nip} />
                    <Row label='application.city' content={user.companyData.companyCity} />
                    <Row label='application.street' content={user.companyData.companyStreet} />
                    <Row label='application.postCode' content={user.companyData.companyPostCode} />
                </Section>
            )}
        </div>
    );
};


export default UserData;
