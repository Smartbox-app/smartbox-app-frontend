import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { hideModal, showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Modal, Tabs } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { PaymentForm } from 'src/views/DashboardCommon/UsersManagement/List/UserEdit/components/PaymentForm';
import { SectionForm } from 'src/views/DashboardCommon/UsersManagement/List/UserEdit/components/SectionForm';

type Section = 'basic' | 'company' | 'payment';

type UserEditProps = {
  userId: string;
  initialSection?: Section;
};

const UserEdit = ({ userId, initialSection = 'basic' }: UserEditProps) => {
  const dispatch = useDispatch();
  const [section, setSection] = useState<Section>(initialSection);

  const handleSaved = () => {
    dispatch(successNotification(__('application.changesSavedSuccess')));
    dispatch(refreshApiTableData());
    dispatch(hideModal());
  };

  const handleReturnToPayment = () => {
    dispatch(showModal(<UserEdit userId={userId} initialSection="payment" />));
  };

  return (
    <>
      <Modal.Header title={__('application.editUserData')} />
      <Modal.Content>
        <Tabs
          tabs={[
            {
              text: 'application.editUserBasicData',
              active: section === 'basic',
              onClick: () => setSection('basic'),
            },
            {
              text: 'application.editUserCompanyData',
              active: section === 'company',
              onClick: () => setSection('company'),
            },
            {
              text: 'application.editUserPaymentSettings',
              active: section === 'payment',
              onClick: () => setSection('payment'),
            },
          ]}
        />

        {section === 'basic' && (
          <SectionForm
            formId="editUserBasic"
            fetchUrl={`user/form/update-user/${userId}/basic`}
            sendUrl={`user/someone/${userId}/basic`}
            onSaved={handleSaved}
          />
        )}
        {section === 'company' && (
          <SectionForm
            formId="editUserCompany"
            fetchUrl={`user/form/update-user/${userId}/company`}
            sendUrl={`user/someone/${userId}/company`}
            onSaved={handleSaved}
          />
        )}

        {section === 'payment' && (
          <PaymentForm
            userId={userId}
            onSaved={handleSaved}
            onReturnToPayment={handleReturnToPayment}
          />
        )}
      </Modal.Content>
    </>
  );
};

export default UserEdit;
