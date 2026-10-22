import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { Button, Spinner } from '../../../../components/Branded';
import { ButtonsContainer } from '../../../../components/Layout';
import { ItfApiForm } from 'itf_formbuilder_react';
import ApiService from '../../../../services/api-service';
import { mapFields } from '../../../../utils/fields-mapper';
import { successNotification } from '../../../../actions/notifications';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { hideModal } from '../../../../actions/modal';
import {
  isStockScopedTemplate,
  templateLanguage,
  TemplateReq,
  TemplateType,
} from 'smartbox-types';
import { __ } from '../../../../helpers/i18n';
import { PageHeader, Section } from 'src/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import {
  templateListQueryKey,
  templatesQueryKey,
  useGetMyDetailsQuery,
} from 'src/queries';
import { history } from 'src/history';

const allowedTags = {
  [TemplateType.INVITE_USER_EMAIL]: ['company'],
  [TemplateType.ACCOUNT_ACTIVATED_EMAIL]: ['name'],
  [TemplateType.ACCOUNT_ACTIVATION_SMS]: ['name', 'company', 'code'],
  [TemplateType.USER_BLOCKED_EMAIL]: ['name', 'phone', 'email'],
  [TemplateType.USER_UNBLOCKED_EMAIL]: ['name', 'company'],
  [TemplateType.RENTAL_EXTENDED_MAIL]: ['name', 'number', 'rentUntil', 'cost', 'boxTypeNoun', 'boxTypeAccusative', 'boxTypeYourGenitive'],
  [TemplateType.NEW_RENTAL_MAIL]: [
    'name',
    'number',
    'rentFrom',
    'rentUntil',
    'cost',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.RENTAL_EXTENDED_ADMIN_NOTIFICATION_MAIL]: [
    'email',
    'number',
    'stock',
    'rentUntil',
    'cost',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.NEW_RENTAL_ADMIN_NOTIFICATION_MAIL]: [
    'email',
    'stock',
    'number',
    'rentFrom',
    'rentUntil',
    'cost',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.NO_PAYMENT_EMAIL]: ['name', 'company'],
  [TemplateType.BOX_CHANGED_EMAIL]: ['name', 'oldNumber', 'newNumber'],
  [TemplateType.AUTO_PAYMENT_FAILED_EMAIL]: ['name', 'company'],
  [TemplateType.EXTEND_RENTAL_EMAIL]: [
    'name',
    'rentUntil',
    'number',
    'company',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
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
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.RENTAL_EXTENDED_SMS]: [
    'name',
    'number',
    'rentUntil',
    'cost',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
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
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.RENTAL_PERIOD_PAID_SMS]: [
    'name',
    'number',
    'company',
    'cost',
    'periodFrom',
    'periodTo',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.RENTAL_PERIOD_PAID_ADMIN_NOTIFICATION_MAIL]: [
    'name',
    'number',
    'company',
    'cost',
    'rentFrom',
    'rentUntil',
    'periodFrom',
    'periodTo',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.RENTAL_PERIOD_PAID_MAIL]: [
    'name',
    'number',
    'company',
    'cost',
    'rentFrom',
    'rentUntil',
    'periodFrom',
    'periodTo',
  ],
  [TemplateType.BOX_GROUP_FREE_EMAIL]: ['name', 'size'],
  [TemplateType.BOX_GROUP_FREE_SMS]: ['name', 'size'],
  [TemplateType.PERIOD_PAYMENT_ENDS_EMAIL]: [
    'name',
    'company',
    'number',
    'paymentUntil',
  ],
  [TemplateType.PERIOD_PAYMENT_ENDS_SMS]: [
    'name',
    'company',
    'number',
    'paymentUntil',
  ],
  [TemplateType.NO_PERIOD_PAYMENT_EMAIL]: ['name', 'company', 'number'],
  [TemplateType.NO_PERIOD_PAYMENT_SMS]: ['name', 'company', 'number'],
  [TemplateType.OPEN_ENDED_NEW_RENTAL_MAIL]: [
    'name',
    'number',
    'rentFrom',
    'cost',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.OPEN_ENDED_NEW_RENTAL_SMS]: [
    'name',
    'number',
    'company',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.OPEN_ENDED_NEW_RENTAL_ADMIN_NOTIFICATION_MAIL]: [
    'email',
    'stock',
    'number',
    'rentFrom',
    'cost',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.OPEN_ENDED_PERIOD_PAYMENT_EMAIL]: [
    'name',
    'number',
    'company',
    'paymentUntil',
  ],
  [TemplateType.OPEN_ENDED_PERIOD_PAYMENT_SMS]: [
    'name',
    'number',
    'company',
    'paymentUntil',
  ],
  [TemplateType.OPEN_ENDED_RENTAL_PERIOD_PAID_MAIL]: [
    'name',
    'number',
    'company',
    'cost',
    'periodFrom',
    'periodTo',
    'boxTypeNoun',
  ],
  [TemplateType.OPEN_ENDED_RENTAL_PERIOD_PAID_SMS]: [
    'name',
    'number',
    'company',
    'periodFrom',
    'periodTo',
  ],
  [TemplateType.OPEN_ENDED_RENTAL_PERIOD_PAID_ADMIN_NOTIFICATION_MAIL]: [
    'email',
    'number',
    'company',
    'stock',
    'cost',
    'periodFrom',
    'periodTo',
    'boxTypeNoun',
  ],
  [TemplateType.OPEN_ENDED_NO_PERIOD_PAYMENT_EMAIL]: [
    'name',
    'company',
    'number',
    'daysToRecoverAccess',
  ],
  [TemplateType.OPEN_ENDED_NO_PERIOD_PAYMENT_SMS]: [
    'name',
    'company',
    'number',
    'daysToRecoverAccess',
  ],
  [TemplateType.OPEN_ENDED_PERIOD_PAYMENT_ENDS_EMAIL]: [
    'name',
    'company',
    'number',
    'paymentUntil',
  ],
  [TemplateType.OPEN_ENDED_PERIOD_PAYMENT_ENDS_SMS]: [
    'name',
    'company',
    'number',
    'paymentUntil',
  ],
  [TemplateType.OPEN_ENDED_PERIOD_PAYMENT_DUE_TODAY_EMAIL]: [
    'name',
    'company',
    'number',
    'paymentUntil',
  ],
  [TemplateType.OPEN_ENDED_PERIOD_PAYMENT_DUE_TODAY_SMS]: [
    'name',
    'company',
    'number',
    'paymentUntil',
  ],
  [TemplateType.OPEN_ENDED_PERIOD_PAYMENT_MID_WINDOW_EMAIL]: [
    'name',
    'company',
    'number',
    'paymentUntil',
  ],
  [TemplateType.OPEN_ENDED_PERIOD_PAYMENT_MID_WINDOW_SMS]: [
    'name',
    'company',
    'number',
    'paymentUntil',
  ],
  [TemplateType.OPEN_ENDED_RECOVER_ACCESS_ENDS_IN_2_DAYS_EMAIL]: [
    'name',
    'company',
    'number',
    'accessUntil',
    'daysToRecoverAccess',
  ],
  [TemplateType.OPEN_ENDED_RECOVER_ACCESS_ENDS_IN_2_DAYS_SMS]: [
    'name',
    'company',
    'number',
    'accessUntil',
    'daysToRecoverAccess',
  ],
  [TemplateType.OPEN_ENDED_RECOVER_ACCESS_ENDS_TODAY_EMAIL]: [
    'name',
    'company',
    'number',
    'accessUntil',
  ],
  [TemplateType.OPEN_ENDED_RECOVER_ACCESS_ENDS_TODAY_SMS]: [
    'name',
    'company',
    'number',
    'accessUntil',
  ],
  [TemplateType.OPEN_ENDED_AGREEMENT_ENDED_ADMIN_NOTIFICATION_MAIL]: [
    'email',
    'number',
    'company',
    'stock',
    'rentFrom',
    'rentUntil',
    'boxTypeNoun',
  ],
  [TemplateType.OPEN_ENDED_RENT_ENDED_MAIL]: [
    'name',
    'number',
    'company',
    'stock',
    'rentFrom',
    'rentUntil',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.OPEN_ENDED_RENT_ENDED_SMS]: [
    'name',
    'number',
    'company',
    'stock',
    'rentFrom',
    'rentUntil',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.OPEN_ENDED_RENT_ENDED_ADMIN_NOTIFICATION_MAIL]: [
    'email',
    'number',
    'company',
    'stock',
    'rentFrom',
    'rentUntil',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.OPEN_ENDED_RENT_ENDED_UNPAID_MAIL]: [
    'name',
    'number',
    'company',
    'stock',
    'boxTypeNoun',
  ],
  [TemplateType.OPEN_ENDED_RENT_ENDED_UNPAID_SMS]: [
    'name',
    'number',
    'company',
    'stock',
  ],
  [TemplateType.OPEN_ENDED_RENT_ENDED_UNPAID_ADMIN_NOTIFICATION_MAIL]: [
    'email',
    'number',
    'company',
    'stock',
    'boxTypeNoun',
  ],
  [TemplateType.ACCESS_CODE_EMAIL]: ['name', 'company', 'number', 'passcode'],
  [TemplateType.ACCESS_CODE_SMS]: ['name', 'company', 'number', 'passcode'],
  [TemplateType.GATE_ACCESS_CODE_EMAIL]: ['name', 'company', 'stock', 'passcode'],
  [TemplateType.GATE_ACCESS_CODE_SMS]: ['name', 'company', 'stock', 'passcode'],
  [TemplateType.RENT_ENDED_MAIL]: [
    'name',
    'number',
    'company',
    'rentFrom',
    'rentUntil',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.RENT_ENDED_SMS]: [
    'name',
    'number',
    'company',
    'rentFrom',
    'rentUntil',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
  [TemplateType.RENT_ENDED_ADMIN_NOTIFICATION_MAIL]: [
    'name',
    'number',
    'company',
    'rentFrom',
    'rentUntil',
    'boxTypeNoun',
    'boxTypeAccusative',
    'boxTypeYourGenitive',
  ],
};

function templateTitleKey(forStock: boolean, stockScoped: boolean) {
  if (forStock) return 'application.templateForStock';
  if (stockScoped) return 'application.templateGeneric';
  return 'application.manageTemplate';
}

export const Manage = ({
  basePath,
  tenantId: tenantIdOverride,
  forStock = false,
}: {
  basePath: string;
  tenantId?: string;
  forStock?: boolean;
}) => {
  const { type, template, id: templateId } = useParams<{
    type: 'email' | 'sms';
    template: TemplateType;
    id?: string;
  }>();
  const location = useLocation();
  const lockLang = Boolean(forStock && templateId);
  const lang = templateLanguage(new URLSearchParams(location.search).get('lang'));
  const stockScoped = isStockScopedTemplate(template);
  const { data: user } = useGetMyDetailsQuery();
  const tenantId = tenantIdOverride ?? user?.tenantId ?? undefined;
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button
        text="application.back"
        to={`${basePath}/list`}
      />
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const stockPath = forStock ? `/stock${templateId ? `/${templateId}` : ''}` : '';
  const fetchUrl = `${
    tenantIdOverride
      ? `template/admin/form-${type}/${tenantIdOverride}/${template}`
      : `template/form-${type}/${template}`
  }${stockPath}${lockLang ? '' : `?lang=${lang}`}`;
  const sendUrl = `${
    tenantIdOverride
      ? `template/admin/${type}/${tenantIdOverride}/${template}`
      : `template/${type}/${template}`
  }${stockPath}`;

  const tagsToUse = allowedTags[template] ?? [];

  return (
    <>
      <PageHeader>
        {__(templateTitleKey(forStock, stockScoped))}
      </PageHeader>
      <Section>
        <ul>
          {tagsToUse.map((tag) => (
            <li key={tag}>
              <strong>{`{{${tag}}}`}</strong> - {__(`templates.${tag}`)}
            </li>
          ))}
        </ul>
        <ItfApiForm
          key={lockLang ? templateId ?? 'stock' : `${forStock ? 'stock' : 'tenant'}-${lang}`}
          formId="manageTemplate"
          schemaCacheEnabled={false}
          schemaMayBeDynamic={true}
          useFormDataInsteadOfPlainObject={type === 'email'}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(_formId: string, values: FormData | TemplateReq) =>
            ApiService.sendForm(sendUrl, values, 'PATCH', (payload) => {
              const savedId = (payload as { id?: string } | null)?.id;
              if (forStock && savedId && savedId !== templateId) {
                history.push(
                  `${basePath}/manage/${type}/${template}/stock/${savedId}`,
                );
              }
            })
          }
          submitButton={submitButton}
          onRenderFullField={(
            field,
            errors,
            fieldHtmlId,
            currentValue,
            onChange,
            onFocus,
            onBlur,
          ) => {
            const onFieldChange = (next: Parameters<typeof onChange>[0]) => {
              if (field.id === 'lang' && !lockLang) {
                const language = templateLanguage(next);
                if (language === lang) return;
                const params = new URLSearchParams(location.search);
                params.set('lang', language);
                history.replace({
                  pathname: location.pathname,
                  search: `?${params.toString()}`,
                });
                return;
              }
              if (field.id === 'stockIds') {
                const list = Array.isArray(next) ? next : [];
                onChange(
                  list.map((item) =>
                    item && typeof item === 'object' && 'value' in item
                      ? (item as { value: string }).value
                      : item,
                  ),
                );
                return;
              }
              onChange(next);
            };
            return mapFields(
              field,
              errors,
              fieldHtmlId,
              currentValue,
              onFieldChange,
              onFocus,
              onBlur,
            );
          }}
          onSavedSuccessfully={() => {
            if (tenantId) {
              queryClient.invalidateQueries({
                queryKey: templatesQueryKey(tenantId),
              });
            }
            queryClient.invalidateQueries({
              queryKey: templateListQueryKey(tenantIdOverride),
            });
            dispatch(successNotification('application.templateSaved'));
            dispatch(hideModal());
          }}
          onTranslateString={formOnTranslateString}
        />
      </Section>
    </>
  );
};
