import React, { useEffect, useState } from 'react';
import { PageHeader } from "../../../../components/Layout"
import { SingleTemplate } from './SingleTemplate';
import { TemplateEntity, TemplateType } from 'smartbox-types';
import ApiService from '../../../../services/api-service';
import { Spinner } from '../../../../components/Branded';

const emailTemplates = [
    TemplateType.INVITE_USER_EMAIL,
    TemplateType.ACCOUNT_ACTIVATED_EMAIL,
    TemplateType.USER_BLOCKED_EMAIL,
    TemplateType.USER_UNBLOCKED_EMAIL,
    TemplateType.RENTAL_EXTENDED_MAIL,
    TemplateType.NEW_RENTAL_MAIL,
    TemplateType.NO_PAYMENT_EMAIL,
    TemplateType.BOX_CHANGED_EMAIL,
    TemplateType.AUTO_PAYMENT_FAILED_EMAIL,
    TemplateType.EXTEND_RENTAL_EMAIL,
    TemplateType.RENTAL_ENDS_TODAY_EMAIL,
    TemplateType.PERIOD_PAYMENT_EMAIL
]

const smsTemplates = [
    TemplateType.USER_BLOCKED_SMS,
    TemplateType.USER_UNBLOCKED_SMS,
    TemplateType.NEW_RENTAL_SMS,
    TemplateType.RENTAL_EXTENDED_SMS,
    TemplateType.NO_PAYMENT_SMS,
    TemplateType.BOX_CHANGED_SMS,
    TemplateType.AUTO_PAYMENT_FAILED_SMS,
    TemplateType.EXTEND_RENTAL_SMS,
    TemplateType.RENTAL_ENDS_TODAY_SMS,
    TemplateType.PERIOD_PAYMENT_SMS
]

export const List = () => {
    const [allTemplates, setAllTemplates] = useState<TemplateEntity[]>([]);
    const [isLoading, setLoading] = useState(true);

    const getAllTemplates = async () => {
        await ApiService.callFetch('GET', 'template/all', (data: TemplateEntity[]) => {
            setAllTemplates(data);
        })
        setLoading(false);
    }

    const isSet = (templateToCheck: TemplateType) => {
        const found = allTemplates.find(template => template.type === templateToCheck);
        if (!found) return false;
        return !!found.content;
    }

    useEffect(() => {
        getAllTemplates()
    }, [])

    return (
        <>
            <PageHeader title='application.templatesList' />
            {isLoading && <Spinner overlay />}
            {!isLoading && <>
                <ul>
                    {emailTemplates.map(template => (
                        <SingleTemplate key={template} type='email' template={template} isSet={isSet(template)} />
                    ))}
                </ul>
                <ul>
                    {smsTemplates.map(template => (
                        <SingleTemplate key={template} type='sms' template={template} isSet={isSet(template)} />
                    ))}
                </ul>
            </>}
        </>
    )
}