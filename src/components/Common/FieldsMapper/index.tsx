import React, { useCallback } from 'react';
import { FieldAndEventFunction, FormFieldToRender } from 'itf_formbuilder_react';
import { CheckBox, DateInput, Input, InputPhone, InputSelect } from '..';
import { formOnTranslateString } from '../../../utils/trans-form';
import { TranslatableObject, translateErrors } from '../../../utils/errors-trans';
import { __ } from '../../../helpers/i18n';
import FileInput from '../FileInput';
import ApiService from '../../../services/api-service';
import { SelectOption } from '../../../types/select';
import { AcceptancesField } from '../AcceptancesField';
import { Link } from '../../ui';
import { InputSize } from '../input-sizes';
import { I18nResourceKey, useI18n } from 'src/i18n';
import { useTenant } from 'src/hooks/useTenant';

interface Props {
    fieldHtmlId: string;
    field: FormFieldToRender;
    currentValue: unknown;
    errors: TranslatableObject[],
    onChange(value: unknown): void;
    onFocus: FieldAndEventFunction;
    onBlur: FieldAndEventFunction;
    size?: InputSize;
    /** @deprecated Use `size="large"` */
    big?: boolean;
}

const parseInputNumber = (value: unknown) => {
    return typeof value === 'undefined' || (!value && value !== 0) ? value : Number(value);
}

const FieldsMapper = ({ field, fieldHtmlId, currentValue, errors, size, big, onFocus, onBlur, onChange }: Props) => {
   const { t } = useI18n();
    const fieldSize = size ?? (big ? 'large' : 'medium');
    const getProperType = useCallback((field: FormFieldToRender) => {
        if (field.type === 'variablePlaceholder') return field.id;
        if (!field.options.type) return field.type;

        switch (field.options.type) {
            case 'phone': return 'phone'
        }

        return field.type;
    }, [])

    const { tenant } = useTenant();

    const getCustomCheckboxLabel = useCallback((field: FormFieldToRender) => {
        if (field.options?.type === 'checkboxRules' && tenant) return <small>
            {t('application.readTheProvisions')}{' '}

            <Link target="_blank" href='/rules' rel="noreferrer">
                <u>{t('application.statutes')}</u>
            </Link>{' '}
            i{' '}
            <Link target="_blank" href='/privacy-policy' rel="noreferrer">
                <u>{t('application.privacyPolices')}</u>
            </Link>{' '}
            {t('application.acceptContent')}
        </small>

        return t(field.title as unknown as I18nResourceKey);
    }, [])

    const type = getProperType(field);
    

    switch (type) {
        // Handline Addon acceptances
        case 'acceptances': return <AcceptancesField value={Array.isArray(currentValue) ? currentValue : []} onChange={onChange} />
        case 'phone': return <InputPhone size={fieldSize} errors={translateErrors(errors)} label={field.title} name={fieldHtmlId} value={typeof currentValue === 'string' ? currentValue : undefined} onChange={onChange} />;
        case 'text': return <Input
            size={fieldSize}
            key={fieldHtmlId}
            type={field.options.type}
            help={field.descr}
            input={{
                label: formOnTranslateString(field.title),
                name: fieldHtmlId,
                id: fieldHtmlId,
                placeholder: formOnTranslateString(field.placeholder),
                errors: translateErrors(errors),
                value: currentValue,
                onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    onChange(event.target.value),
                onFocus,
                onBlur,
            }}
        />
        case 'number': return <Input
            size={fieldSize}
            key={fieldHtmlId}
            type={field.type || field.options.type}
            help={field.descr}
            step={field.options.step}
            input={{
                label: formOnTranslateString(field.title),
                name: fieldHtmlId,
                id: fieldHtmlId,
                placeholder: formOnTranslateString(field.placeholder),
                errors: translateErrors(errors),
                value: currentValue,
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(parseInputNumber(event.target.value)),
                onFocus,
                onBlur,
            }}
        />
        case 'textarea': return <Input
            size={fieldSize}
            key={fieldHtmlId}
            type='textarea'
            help={field.descr}
            input={{
                label: formOnTranslateString(field.title),
                name: fieldHtmlId,
                id: fieldHtmlId,
                placeholder: formOnTranslateString(field.placeholder),
                errors: translateErrors(errors),
                value: currentValue,
                onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    onChange(event.target.value),
                onFocus,
                onBlur,
            }}
        />
        case 'checkbox': return (
            <CheckBox
                key={fieldHtmlId}
                name={field.id}
                checked={Boolean(currentValue)}
                handleChange={() => onChange(!currentValue)}
                errors={translateErrors(errors)}
                help={field.descr}
                label={getCustomCheckboxLabel(field)}
            />
        );
        case 'fileDragDrop': return (
            <FileInput
                accept={field.options.accept}
                hasImage={field.options.previewUrl}
                label={field.title}
                input={{
                    name: fieldHtmlId,
                    id: fieldHtmlId,
                    value: currentValue,
                    onChange,
                    onFocus,
                    onBlur,
                }}
                meta={{
                    touched: errors.length > 0,
                    error: errors.length
                        ? formOnTranslateString(errors[0].messageWithPlaceholders, errors[0].params)
                        : null,
                }}
            />)
        case 'staticSelect': return (
            <InputSelect
                label={field.title}
                name={fieldHtmlId}
                multiple={field.options && field.options.multipleChoices}
                help={field.descr}
                options={
                    field.options.possibleValues &&
                    field.options.possibleValues.map(
                        (
                            val: string | SelectOption,
                            index: number
                        ) => {
                            if (typeof val === 'object') {
                                return {
                                    label: __(String(val.name)),
                                    value: val.value,
                                };
                            }
                            return {
                                label: __(val),
                                value: index,
                            };
                        }
                    )
                }
                onChange={(val: string | number | null | (string | number)[]) => {
                    if (field.options?.multipleChoices) {
                        const values = Array.isArray(val) ? val : [];
                        onChange(
                            values.map((v) => ({
                                value: v,
                                label:
                                    field.options.possibleValues?.find(
                                        (opt: string | SelectOption) =>
                                            typeof opt === 'object'
                                                ? opt.value === v
                                                : false,
                                    )?.name ?? String(v),
                            })),
                        );
                        return;
                    }
                    onChange(val);
                }}
                value={
                    typeof currentValue === 'string' ||
                    typeof currentValue === 'number' ||
                    currentValue == null ||
                    Array.isArray(currentValue)
                        ? currentValue
                        : undefined
                }
                placeholder={field.placeholder}
                errors={translateErrors(errors)}
            />
        )
        case 'dateTime': return (
            <DateInput
                label={field.title}
                required={field.required}
                value={
                    currentValue instanceof Date || Array.isArray(currentValue)
                        ? currentValue
                        : undefined
                }
                name={fieldHtmlId}
                inline={false}
                size={fieldSize}
                errors={translateErrors(errors)}
                onChange={(val: Date[]) => {
                    onChange(val[0]);
                }}
            />
        )
        case 'slides': return (
            <FileInput
                multiple
                accept={field.options.accept}
                hasImage={field.options.previewUrl}
                label="application.slides"
                input={{
                    name: fieldHtmlId,
                    id: fieldHtmlId,
                    value: (Array.isArray(currentValue) ? currentValue : []).map(
                        (slide) => `${ApiService.url}tenant/slide/${String(slide)}`,
                    ),
                    onChange,
                    onFocus,
                    onBlur,
                }}
                meta={{
                    touched: errors.length > 0,
                    error: errors.length
                        ? formOnTranslateString(errors[0].messageWithPlaceholders, errors[0].params)
                        : null,
                }}
            />)
    }

    return null;
};

export { FieldsMapper };
