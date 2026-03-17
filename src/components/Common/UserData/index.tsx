import React from 'react';
import { UserRole } from 'smartbox-types';
import {
  ButtonsContainer,
  Section,
  SectionHeader,
} from '../../../components/Layout';
import { Row } from '../../../components/Common';
import { useGetMyDetailsQuery } from '../../../queries';
import { Button } from 'src/components/Branded';
import { useDispatch } from 'react-redux';
import { showModal } from 'src/actions/modal';
import UpdatePass from 'src/views/DashboardCommon/Profile/Detail/UpdatePass';
import { UpdateBasic } from 'src/views/DashboardCommon/Profile/Detail/UpdateBasic';
import { UpdateContact } from 'src/views/DashboardCommon/Profile/Detail/UpdateContact';
import { UpdateCompany } from 'src/views/DashboardCommon/Profile/Detail/UpdateCompany';
import { DeleteAccountConfirmation } from 'src/views/DashboardCommon/Profile/Detail/DeleteAccountConfirmation/DeleteAccountConfirmation';

const UserData = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  if (!user) return null;
  const { role } = user;
  return (
    <>
      <Section highlight>
        <SectionHeader title="application.userData" />
        <Row label="application.firstName" content={user.firstName} />
        <Row label="application.lastName" content={user.lastName} />
        <Row label="application.userRole" content={user.role} />
        <ButtonsContainer>
          {/* USER CANT CHANGE HIS BASIC DATA */}
          {/* <Button
            text="application.edit"
            primary
            click={() => dispatch(showModal(<UpdateBasic />))}
          /> */}
          <Button
            text="application.changPassword"
            primary
            click={() => dispatch(showModal(<UpdatePass />))}
          />
          <Button
            text="application.deleteAccount"
            danger
            click={() => dispatch(showModal(<DeleteAccountConfirmation />))}
          />
        </ButtonsContainer>
      </Section>
      <Section highlight>
        <SectionHeader title="application.contactData" />
        <Row label="application.mail" content={user.email} />
        <Row label="application.phone" content={user.phone} />
        {role === UserRole.user && (
          <>
            <Row label="application.country" content={user.country} />
            <Row label="application.city" content={user.city} />
            <Row label="application.street" content={user.street} />
            <Row label="application.postCode" content={user.postCode} />
          </>
        )}
          {/* USER CANT CHANGE HIS CONTACT DATA */}
         {/* <ButtonsContainer>
          <Button
            text="application.edit"
            primary
            click={() => dispatch(showModal(<UpdateContact />))}
          />
        </ButtonsContainer> */}
      </Section>
      {role === UserRole.user && (
        <Section highlight>
          <SectionHeader title="application.contactCompanyData" />
          <Row
            label="application.companyName"
            content={user.companyData.companyName}
          />
          <Row label="application.nip" content={user.companyData.nip} />
          <Row
            label="application.country"
            content={user.companyData.companyCountry}
          />
          <Row
            label="application.city"
            content={user.companyData.companyCity}
          />
          <Row
            label="application.street"
            content={user.companyData.companyStreet}
          />
          <Row
            label="application.postCode"
            content={user.companyData.companyPostCode}
          />
            {/* USER CANT CHANGE HIS COMPANY DATA */}
            {/* <ButtonsContainer>
          <Button
            text="application.edit"
            primary
            click={() => dispatch(showModal(<UpdateCompany />))}
          />
        </ButtonsContainer> */}
        </Section>
      )}
    </>
  );
};

export default UserData;
