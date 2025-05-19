import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { Button, Spinner } from '../../../../components/Branded';
import {
  ButtonsContainer,
  FormContainer,
  FormHeader,
} from '../../../../components/Layout';
import { ItfApiForm } from 'itf_formbuilder_react';
import ApiService from '../../../../services/api-service';
import { mapFields } from '../../../../utils/fields-mapper';
import { successNotification } from '../../../../actions/notifications';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { hideModal } from '../../../../actions/modal';
import { TemplateType } from 'smartbox-types';
import { __ } from '../../../../helpers/i18n';
import { PageHeader, Section } from 'src/components/ui';

const allowedTags = {
  [TemplateType.INVITE_USER_EMAIL]: ['company'],
  [TemplateType.ACCOUNT_ACTIVATED_EMAIL]: ['name'],
  [TemplateType.USER_BLOCKED_EMAIL]: ['name', 'phone', 'email'],
  [TemplateType.USER_UNBLOCKED_EMAIL]: ['name', 'company'],
  [TemplateType.RENTAL_EXTENDED_MAIL]: ['name', 'number', 'rentUntil', 'cost'],
  [TemplateType.NEW_RENTAL_MAIL]: [
    'name',
    'number',
    'rentFrom',
    'rentUntil',
    'cost',
  ],
  [TemplateType.RENTAL_EXTENDED_ADMIN_NOTIFICATION_MAIL]: ['email', 'number', 'stock', 'rentUntil', 'cost'],
  [TemplateType.NEW_RENTAL_ADMIN_NOTIFICATION_MAIL]: [
    'email',
    'stock',
    'number',
    'rentFrom',
    'rentUntil',
    'cost',
  ],
  [TemplateType.NO_PAYMENT_EMAIL]: ['name', 'company'],
  [TemplateType.BOX_CHANGED_EMAIL]: ['name', 'oldNumber', 'newNumber'],
  [TemplateType.AUTO_PAYMENT_FAILED_EMAIL]: ['name', 'company'],
  [TemplateType.EXTEND_RENTAL_EMAIL]: [
    'name',
    'rentUntil',
    'number',
    'company',
  ],
  [TemplateType.RENTAL_ENDS_IN_3_DAYS_EMAIL]: [
    'name',
    'rentUntil',
    'number',
    'company',
  ],
  [TemplateType.RENTAL_ENDS_TODAY_EMAIL]: ['name', 'number', 'company'],
  [TemplateType.USER_BLOCKED_SMS]: ['name', 'phone', 'email'],
  [TemplateType.USER_UNBLOCKED_SMS]: ['name', 'company'],
  [TemplateType.NEW_RENTAL_SMS]: [
    'name',
    'number',
    'rentFrom',
    'rentUntil',
    'cost',
  ],
  [TemplateType.RENTAL_EXTENDED_SMS]: ['name', 'number', 'rentUntil', 'cost'],
  [TemplateType.NO_PAYMENT_SMS]: ['name', 'company'],
  [TemplateType.BOX_CHANGED_SMS]: ['name', 'oldNumber', 'newNumber'],
  [TemplateType.AUTO_PAYMENT_FAILED_SMS]: ['name', 'company'],
  [TemplateType.EXTEND_RENTAL_SMS]: ['name', 'rentUntil', 'number', 'company'],
  [TemplateType.RENTAL_ENDS_IN_3_DAYS_SMS]: [
    'name',
    'rentUntil',
    'number',
    'company',
  ],
  [TemplateType.RENTAL_ENDS_TODAY_SMS]: ['name', 'number', 'company'],
  [TemplateType.PERIOD_PAYMENT_EMAIL]: [
    'name',
    'number',
    'company',
    'cost',
    'paymentUntil',
  ],
  [TemplateType.PERIOD_PAYMENT_SMS]: [
    'name',
    'number',
    'company',
    'cost',
    'paymentUntil',
  ],
};

export const Manage = () => {
  const { type, template } = useParams<{
    type: 'email' | 'sms';
    template: TemplateType;
  }>();

  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `template/form-${type}/${template}`;
  const sendUrl = `template/${type}/${template}`;

  const tagsToUse = allowedTags[template];

  return (
    <>
      <PageHeader>{__('application.manageTemplate')}</PageHeader>
      <Section>
        <ul>
          {tagsToUse.map((tag) => (
            <li key={tag}>
              <strong>{`{{${tag}}}`}</strong> - {__(`templates.${tag}`)}
            </li>
          ))}
        </ul>
        <ItfApiForm
          formId="manageTemplate"
          schemaCacheEnabled={false}
          schemaMayBeDynamic={true}
          useFormDataInsteadOfPlainObject={type === 'email'}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values) => {
            return ApiService.sendForm(sendUrl, values, 'PATCH');
          }}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification('application.templateSaved'));
            dispatch(hideModal());
          }}
          onTranslateString={formOnTranslateString}
        />
      </Section>
    </>
  );
};
