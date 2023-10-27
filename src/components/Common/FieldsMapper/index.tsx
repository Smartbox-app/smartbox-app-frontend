import React, { useCallback } from 'react';
import { FieldAndEventFunction, FormFieldToRender } from 'itf_formbuilder_react';
import { CheckBox, Input, InputPhone, InputSelect } from '..';
import { formOnTranslateString } from '../../../utils/trans-form';
import { TranslatableObject, translateErrors } from '../../../utils/errors-trans';
import { __ } from '../../../helpers/i18n';
import FileInput from '../FileInput';
import ApiService from '../../../services/api-service';
import { SelectOption } from '../../../types/select';

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

const FieldsMapper = ({ field, fieldHtmlId, currentValue, errors, big, onFocus, onBlur, onChange }: Props) => {
    const getProperType = useCallback((field: FormFieldToRender) => {
        if (field.type === 'variablePlaceholder') return field.id;
        if (!field.options.type) return field.type;

        switch (field.options.type) {
            case 'phone': return 'phone'
        }

        return field.type;
    }, [])

    console.log('INPUT', field.options)

    const getCustomCheckboxLabel = useCallback((field: FormFieldToRender) => {
        if (field.options?.type === 'checkboxRules') return <small>
            {__('application.readTheProvisions')}{' '}
            <a target="_blank" href="/assets/2022_02_01_Regulamin_aplikacji_SmartBox.pdf">
                <u>{__('application.statutes')}</u>
            </a>{' '}
            i{' '}
            <a target="_blank" href="/assets/2022_01_01_Polityka_Prywatnosci_SmartBox.pdf">
                <u>{__('application.privacyPolices')}</u>
            </a>{' '}
            {__('application.acceptContent')}
        </small>

        return field.title;
    }, [])

    const type = getProperType(field);

    switch (type) {
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
