import React from 'react';
import { Header, Section } from 'src/components/ui';
import { SingleTemplate } from './SingleTemplate';
import { TemplateType } from 'smartbox-types';
import { Spinner } from '../../../../components/Branded';
import { __ } from 'src/helpers/i18n';
import { useTemplatesQuery } from 'src/queries';

const emailTemplates = [
  TemplateType.INVITE_USER_EMAIL,
  TemplateType.ACCOUNT_ACTIVATED_EMAIL,
  TemplateType.USER_BLOCKED_EMAIL,
  TemplateType.USER_UNBLOCKED_EMAIL,
  TemplateType.RENTAL_EXTENDED_MAIL,
  TemplateType.NEW_RENTAL_MAIL,
  TemplateType.RENT_ENDED_MAIL,
  TemplateType.NO_PAYMENT_EMAIL,
  TemplateType.BOX_CHANGED_EMAIL,
  TemplateType.AUTO_PAYMENT_FAILED_EMAIL,
  TemplateType.EXTEND_RENTAL_EMAIL,
  TemplateType.RENTAL_ENDS_IN_3_DAYS_EMAIL,
  TemplateType.RENTAL_ENDS_TODAY_EMAIL,
  TemplateType.PERIOD_PAYMENT_EMAIL,
  TemplateType.RENTAL_PERIOD_PAID_MAIL,
  TemplateType.NEW_RENTAL_ADMIN_NOTIFICATION_MAIL,
  TemplateType.RENT_ENDED_ADMIN_NOTIFICATION_MAIL,
  TemplateType.RENTAL_EXTENDED_ADMIN_NOTIFICATION_MAIL,
  TemplateType.RENTAL_PERIOD_PAID_ADMIN_NOTIFICATION_MAIL,
  TemplateType.NO_PERIOD_PAYMENT_EMAIL,
  TemplateType.PERIOD_PAYMENT_ENDS_EMAIL,
  TemplateType.BOX_GROUP_FREE_EMAIL,
  TemplateType.ACCESS_CODE_EMAIL,
  TemplateType.GATE_ACCESS_CODE_EMAIL,
];

const smsTemplates = [
  TemplateType.USER_BLOCKED_SMS,
  TemplateType.USER_UNBLOCKED_SMS,
  TemplateType.NEW_RENTAL_SMS,
  TemplateType.RENT_ENDED_SMS,
  TemplateType.RENTAL_EXTENDED_SMS,
  TemplateType.NO_PAYMENT_SMS,
  TemplateType.BOX_CHANGED_SMS,
  TemplateType.AUTO_PAYMENT_FAILED_SMS,
  TemplateType.EXTEND_RENTAL_SMS,
  TemplateType.RENTAL_ENDS_IN_3_DAYS_SMS,
  TemplateType.RENTAL_ENDS_TODAY_SMS,
  TemplateType.PERIOD_PAYMENT_SMS,
  TemplateType.RENTAL_PERIOD_PAID_SMS,
  TemplateType.NO_PERIOD_PAYMENT_SMS,
  TemplateType.PERIOD_PAYMENT_ENDS_SMS,
  TemplateType.BOX_GROUP_FREE_SMS,
  TemplateType.ACCESS_CODE_SMS,
  TemplateType.GATE_ACCESS_CODE_SMS,
];

export const List = ({
  basePath,
  tenantId,
}: {
  basePath: string;
  tenantId?: string;
}) => {
  const { data: allTemplates = [], isPending } = useTemplatesQuery(tenantId);

  const isSet = (templateToCheck: TemplateType) => {
    const found = allTemplates.find(
      (template) => template.type === templateToCheck,
    );
    if (!found) return false;
    return !!found.content;
  };

  return (
    <Section>
      <Header variant="h2">{__('application.templatesList')}</Header>
      {isPending && <Spinner overlay />}
      {!isPending && (
        <>
          <ul>
            {emailTemplates.map((template, index) => (
              <SingleTemplate
                index={index}
                key={template}
                type="email"
                template={template}
                isSet={isSet(template)}
                manageTo={`${basePath}/manage/email/${template}`}
              />
            ))}
          </ul>
          <ul>
            {smsTemplates.map((template, index) => (
              <SingleTemplate
                index={index}
                key={template}
                type="sms"
                template={template}
                isSet={isSet(template)}
                manageTo={`${basePath}/manage/sms/${template}`}
              />
            ))}
          </ul>
        </>
      )}
    </Section>
  );
};
