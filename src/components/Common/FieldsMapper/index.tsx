import React, { useCallback } from 'react';
import { FieldAndEventFunction, FormFieldToRender } from 'itf_formbuilder_react';
import { CheckBox, DateInput, Input, InputPhone, InputSelect } from '..';
import { formOnTranslateString } from '../../../utils/trans-form';
import { TranslatableObject, translateErrors } from '../../../utils/errors-trans';
import { __ } from '../../../helpers/i18n';
import FileInput from '../FileInput';
import ApiService from '../../../services/api-service';
import { SelectOption } from '../../../types/select';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../reducers';
import { AcceptancesField } from '../AcceptancesField';
import { Link } from '../../ui';

interface Props {
    fieldHtmlId: string;
    field: FormFieldToRender;
    currentValue: any;
    errors: TranslatableObject[],
    onChange: (e: any) => void;
    onFocus: FieldAndEventFunction;
    onBlur: FieldAndEventFunction;
    big?: boolean;
}

const parseInputNumber = (value: unknown) => {
    return typeof value === 'undefined' || (!value && value !== 0) ? value : Number(value);
}

const FieldsMapper = ({ field, fieldHtmlId, currentValue, errors, big, onFocus, onBlur, onChange }: Props) => {
    const getProperType = useCallback((field: FormFieldToRender) => {
        if (field.type === 'variablePlaceholder') return field.id;
        if (!field.options.type) return field.type;

        switch (field.options.type) {
            case 'phone': return 'phone'
        }

        return field.type;
    }, [])

    const tenant = useSelector((state: ApplicationState) => state.tenant);

    const getCustomCheckboxLabel = useCallback((field: FormFieldToRender) => {
        if (field.options?.type === 'checkboxRules' && tenant) return <small>
            {__('application.readTheProvisions')}{' '}

            <Link target="_blank" href={`${ApiService.url}tenant/rules/${tenant.id}`} rel="noreferrer">
                <u>{__('application.statutes')}</u>
            </Link>{' '}
            i{' '}
            <Link target="_blank" href={`${ApiService.url}tenant/privacy/${tenant.id}`} rel="noreferrer">
                <u>{__('application.privacyPolices')}</u>
            </Link>{' '}
            {__('application.acceptContent')}
        </small>

        return field.title;
    }, [])

    const type = getProperType(field);
    

    switch (type) {
        // Handline Addon acceptances
        case 'acceptances': return <AcceptancesField value={currentValue} onChange={onChange} />
        case 'phone': return <InputPhone big={big} errors={translateErrors(errors)} label={field.title} name={fieldHtmlId} value={currentValue} onChange={onChange} />;
        case 'text': return <Input
            big={big}
            key={fieldHtmlId}
            className="register-input"
            type={field.options.type}
            help={field.descr}
            input={{
                label: formOnTranslateString(field.title),
                name: fieldHtmlId,
                id: fieldHtmlId,
                placeholder: formOnTranslateString(field.placeholder),
                errors: translateErrors(errors),
                value: currentValue,
                onChange: (e: any) => onChange(e.target.value),
                onFocus,
                onBlur,
            }}
        />
        case 'number': return <Input
            big={big}
            key={fieldHtmlId}
            className="register-input"
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
                onChange: (e: any) => onChange(parseInputNumber(e.target.value)),
                onFocus,
                onBlur,
            }}
        />
        case 'textarea': return <Input
            big={big}
            key={fieldHtmlId}
            className="register-input"
            type='textarea'
            help={field.descr}
            input={{
                label: formOnTranslateString(field.title),
                name: fieldHtmlId,
                id: fieldHtmlId,
                placeholder: formOnTranslateString(field.placeholder),
                errors: translateErrors(errors),
                value: currentValue,
                onChange: (e: any) => onChange(e.target.value),
                onFocus,
                onBlur,
            }}
        />
        case 'checkbox': return (
            <CheckBox
                key={fieldHtmlId}
                name={field.id}
                checked={currentValue}
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
                                    label: __(val.name),
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
                onChange={(e: any) => {
                    onChange(e);
                }}
                value={currentValue}
                placeholder={field.placeholder}
                errors={translateErrors(errors)}
            />
        )
        case 'dateTime': return (
            <DateInput
                label={field.title}
                required={field.required}
                value={currentValue}
                name={fieldHtmlId}
                inline={false}
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
                label={'application.slides'}
                input={{
                    name: fieldHtmlId,
                    id: fieldHtmlId,
                    value: (currentValue || []).map(slide => `${ApiService.url}tenant/slide/${slide}`),
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
