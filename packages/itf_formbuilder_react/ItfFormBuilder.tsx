import * as React from 'react';
import { SyntheticEvent } from 'react';
import { FormErrors, FormFieldType, TranslatableObject } from 'itf_formbuilder';
import format from './utils/format';
import { NumberInput } from './fields/NumberInput';
import { TextInput } from './fields/TextInput';
import { CheckboxInput } from './fields/CheckboxInput';
import { DateTimeInput } from './fields/DateTimeInput';
import { Textarea } from './fields/Textarea';
import { StaticSelectBasedOnHtmlSelect } from './fields/StaticSelectBasedOnHtmlSelect';
import { FlatpickrFn } from 'flatpickr/dist/types/instance';
import SelectBase from 'react-select/lib/Select';
import { StaticSelectBasedOnReactSelect } from './fields/StaticSelectBasedOnReactSelect';
import { Wysywig } from './fields/Wysywig';
import {
  registerGlobalForm,
  unregisterGlobalForm,
  updateGlobalFormValues,
} from './utils/globalForms';
import FileDragDrop from './fields/FileDragDrop';

export interface FormFieldToRender {
  id: string;
  type: FormFieldType | string;
  title: string;
  required: boolean;
  readOnly: boolean;
  descr: string;
  placeholder: string;
  value: any;
  options?: any; // Shared between front-end and back-end.
  visibilityAndActivity?: string;
  valueOnInactivity?: any; // null otherwise
}

export type ChangeFunction = (currentValue: any) => void;
export type FieldAndEventFunction = (
  field: FormFieldToRender,
  ev: SyntheticEvent
) => void;

type Constructor<T> = Function & { prototype: T };

export interface ThirdPartyComponents {
  flatpickr?: FlatpickrFn;
  ReactSelect?: Constructor<SelectBase<any>>;
  ReactCreatableSelect?: Constructor<SelectBase<any>>;
  CKEditor?: any; // CKEditor has no types lol
  CKEditorEditorBuild?: any; // CKEditor has no types lol
}

export interface ItfFormBuilderProps {
  /*
    Id of form, each form need it.
     */
  formId: string;

  /*
    Form schema data from back-end.
     */
  formSchema: FormFieldToRender[];

  /*
    All values will be passed into fieldVals. Higher component should send it to backend. When errors are returned, `errors` prop should be filled with it.
     */
  onFormSubmit: (fieldVals: any | FormData) => Promise<void> | void;

  /*
    Submit button component/element can be passed here.
     */
  submitButton?: any;

  /*
    Loading info component/element can be passed here.
     */
  loadingInfo?: any;

  /*
    Loading info component/element will be shown above content, not replacing.
     */
  loadingInfoAboveContent?: boolean;

  /*
    If there were any error during sending - they should be passed here.
     */
  errors?: FormErrors;
  requiredIndicator?: string | React.ReactNode;

  /*
    This function will be called when some non-standard (for this library) input type should be rendered. You should use all the parameters. Use `currentValue` param as current value, not `field.value`!
     */
  onRenderCustomFieldByType?: (
    field: FormFieldToRender,
    fieldHtmlId: string,
    currentValue: any,
    onChange: ChangeFunction,
    onFocus: FieldAndEventFunction,
    onBlur: FieldAndEventFunction
  ) => any;

  /*
    You can pass function here that will be called for each field before. Return TranslatableObject or string to show validation error and prevent sending. Return something else to skip check and/or mark field as correct.
     */
  onValidateField?: (
    field: FormFieldToRender
  ) => TranslatableObject | string | never;

  /*
    You can pass any callback to when field is beeing edited.
     */
  onTouch?: (field: FormFieldToRender, currentValue: any) => any;

  /*
    You can pass any callback to when field is focused.
     */
  onFocus?: (field: FormFieldToRender, ev: SyntheticEvent) => any;

  /*
    You can pass any callback to when field is blurred.
     */
  onBlur?: (field: FormFieldToRender, ev: SyntheticEvent) => any;

  /*
    If you pass function here you will be responsible for rendering of this field, including title, description, input etc. Return something falsy (false, null, undefined) to use default renderer.
     */
  onRenderFullField?: (
    field: FormFieldToRender,
    errors: TranslatableObject[],
    fieldHtmlId: string,
    currentValue: any,
    onChange: ChangeFunction,
    onFocus: FieldAndEventFunction,
    onBlur: FieldAndEventFunction
  ) => any;

  /*
    Pass function here - as param you will get English string - you may translate and return new ones. Return something falsy (false, null, undefined) to use original text.
     */
  onTranslateString?: (s: string) => string;

  /*
    Additional third-party components
     */
  thirdPartyComponents?: ThirdPartyComponents;

  /*
    Register as global form. You will be able to use public component API like in Redux - globally. Defaults to false.
     */
  registerAsGlobalForm?: boolean;

  /*
    Global form will include values field which will be updated live and also callback may be called. Defaults to registerAsGlobalForm.
     */
  enableLiveValuesOfGlobalForm?: boolean;

  /*
    Will return FormData to sender onFormSubmit instead of plain JS object
     */
  useFormDataInsteadOfPlainObject?: boolean;

  sendDelay?: number;

  /*
    Flag determining if form should not be remounted after success
    */
  noRefreshAfterSuccess?: boolean;

  /*
    Will be called once form is globally registered, if registerAsGlobalForm was set
     */
  onFormGloballyRegistered?: (api: PublicItfFormBuilderComponentApi) => any;
}

interface State {
  values: {
    [id: string]: any;
  };
  errors: FormErrors;
  loading: boolean;
  inactiveFields: string[];
}

export interface PublicItfFormBuilderComponentApi {
  send(): Promise<void>;

  resetAll(): void;

  resetValues(): void;

  resetInternalErrors(): void;

  focusField(fieldId: string): void;

  setValue(fieldId: string, value: string | number | boolean): void;
}

export interface RefToItfFormBuilderComponent {
  api: PublicItfFormBuilderComponentApi;
}

export class ItfFormBuilder
  extends React.Component<ItfFormBuilderProps, State>
  implements RefToItfFormBuilderComponent
{
  randNum: number;

  globalChange: (fields: {
    [fieldId: string]: string | number | boolean;
  }) => void;

  changeFunctions: {
    [id: string]: ChangeFunction;
  };

  blurFunctions: {
    [id: string]: ChangeFunction;
  };

  focusFunctions: {
    [id: string]: ChangeFunction;
  };

  activityCheckFunctions: {
    [id: string]: (allValues: any) => boolean | Promise<boolean>;
  };

  private groupActive = false;
  private groupCache: React.ReactNode[] = [];

  constructor(props: ItfFormBuilderProps) {
    super(props);

    this.state = {
      loading: false,
      inactiveFields: [],

      values: this.props.formSchema.reduce((prev, oneField) => {
        prev[oneField.id] = oneField.value;
        return prev;
      }, {} as any),
      errors: this.props.formSchema.reduce((prev, oneField) => {
        prev[oneField.id] = [];
        return prev;
      }, {} as any),
    };

    this.globalChange = (fields: {
      [fieldId: string]: string | number | boolean;
    }) => {
      this.setState(
        {
          values: {
            ...this.state.values,
            ...fields,
          },
        },
        () => {
          this.checkFieldsInactivity();

          const { registerAsGlobalForm, enableLiveValuesOfGlobalForm, formId } =
            this.props;
          const { values } = this.state;

          if (registerAsGlobalForm && enableLiveValuesOfGlobalForm !== false) {
            updateGlobalFormValues(formId, values);
          }
        }
      );
    };

    this.changeFunctions = this.props.formSchema.reduce((prev, oneField) => {
      prev[oneField.id] = (currentValue: any) => {
        if (typeof this.props.onTouch === 'function') {
          this.props.onTouch(oneField, currentValue);
        }

        this.setState(
          {
            values: {
              ...this.state.values,
              [oneField.id]: currentValue,
            },
          },
          () => {
            this.checkFieldsInactivity();

            const {
              registerAsGlobalForm,
              enableLiveValuesOfGlobalForm,
              formId,
            } = this.props;
            const { values } = this.state;

            if (
              registerAsGlobalForm &&
              enableLiveValuesOfGlobalForm !== false
            ) {
              updateGlobalFormValues(formId, values);
            }
          }
        );
      };
      return prev;
    }, {} as any);

    const { onFocus, onBlur } = this.props;

    this.activityCheckFunctions = this.props.formSchema.reduce(
      (prev, oneField) => {
        if (oneField.visibilityAndActivity) {
          prev[oneField.id] = new Function(
            'return ' + oneField.visibilityAndActivity
          )();
        }
        return prev;
      },
      {} as any
    );

    this.focusFunctions = this.props.formSchema.reduce((prev, oneField) => {
      prev[oneField.id] =
        typeof onFocus === 'function'
          ? (ev) => {
              if (typeof onFocus === 'function') {
                onFocus(oneField, ev);
              }
            }
          : undefined;
      return prev;
    }, {} as any);

    this.blurFunctions = this.props.formSchema.reduce((prev, oneField) => {
      prev[oneField.id] =
        typeof onBlur === 'function'
          ? (ev) => {
              if (typeof onBlur === 'function') {
                onBlur(oneField, ev);
              }
            }
          : undefined;
      return prev;
    }, {} as any);

    this.randNum = Math.ceil(Math.random() * 10000 + +new Date());
  }

  componentDidMount() {
    this.checkFieldsInactivity();
    if (this.props.registerAsGlobalForm) {
      registerGlobalForm(this.props.formId, this);

      if (typeof this.props.onFormGloballyRegistered === 'function') {
        this.props.onFormGloballyRegistered(this.api);
      }
    }
  }

  componentDidUpdate(prevProps: ItfFormBuilderProps) {
    const { noRefreshAfterSuccess, formSchema } = this.props;
    if (prevProps.formSchema !== formSchema) {
      if (!noRefreshAfterSuccess) {
        this.setState({
          values: formSchema.reduce((prev, oneField) => {
            prev[oneField.id] = oneField.value;
            return prev;
          }, {} as any),
        });
      }
    }
  }

  componentWillUnmount() {
    unregisterGlobalForm(this.props.formId);
  }

  public api = {
    send: () => this.handleFormSubmit(null),

    resetAll: () => {
      this.api.resetInternalErrors();
      this.api.resetValues();
    },

    resetValues: () => {
      const values = {
        ...this.state.values,
      };

      for (const key in values) {
        const field = this.props.formSchema.find((field) => field.id === key);
        if (field) {
          values[key] = field.value;
        }
      }

      this.setState({
        values,
      });
    },

    setValue: (field: string, value: string | number | boolean) => {
      this.changeFunctions[field](value);
    },

    setValues: (fields: { [fieldId: string]: string | number | boolean }) => {
      this.globalChange(fields);
    },

    getValue: (fieldId: string) => {
      return this.state.values[fieldId];
    },

    resetInternalErrors: () => {
      const errors = {
        ...this.state.errors,
      };

      for (const key in errors) {
        errors[key] = [];
      }

      this.setState({
        errors,
      });
    },

    focusField: (fieldId: string) => {
      const field = document.querySelector('#' + this.genFieldId(fieldId));
      if (field && (field as HTMLInputElement).focus) {
        (field as HTMLInputElement).focus();
      }
    },
  };

  private transAndFormat(obj: TranslatableObject): string {
    return format(
      this.transPlainStr(obj.messageWithPlaceholders),
      ...obj.params
    );
  }

  private transPlainStr = (s: string): string => {
    const { onTranslateString } = this.props;
    return typeof onTranslateString === 'function' ? onTranslateString(s) : s;
  };

  private renderErrors(errors: TranslatableObject[] | string[]): any {
    if (errors.length === 0) return null;

    const lis = (errors as any[]).map((translatableError, index) => (
      <li key={index}>
        {typeof translatableError === 'string'
          ? this.transPlainStr(translatableError)
          : this.transAndFormat(translatableError)}
      </li>
    ));

    return <ul className="form-field-errors">{lis}</ul>;
  }

  private genFieldId(fieldOrFieldId: FormFieldToRender | string): string {
    return `f_${
      typeof fieldOrFieldId === 'string' ? fieldOrFieldId : fieldOrFieldId.id
    }_${this.randNum}`;
  }

  private passDataToPropsOfStandardInput(
    Component: any,
    field: FormFieldToRender,
    fieldHtmlId: string,
    currentValue: any,
    onChange: ChangeFunction,
    onFocus: FieldAndEventFunction,
    onBlur: FieldAndEventFunction
  ): any {
    const { transPlainStr } = this;
    const { thirdPartyComponents } = this.props;
    return (
      <Component
        {...{
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur,
          transPlainStr,
          thirdPartyComponents,
        }}
      />
    );
  }

  private renderFieldBasedOnType(
    field: FormFieldToRender,
    fieldHtmlId: string,
    currentValue: any,
    onChange: ChangeFunction,
    onFocus: FieldAndEventFunction,
    onBlur: FieldAndEventFunction
  ) {
    const { onRenderCustomFieldByType } = this.props;

    switch (field.type) {
      case FormFieldType.Number:
        return this.passDataToPropsOfStandardInput(
          NumberInput,
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur
        );
      case FormFieldType.Text:
        return this.passDataToPropsOfStandardInput(
          TextInput,
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur
        );
      case FormFieldType.Checkbox:
        return this.passDataToPropsOfStandardInput(
          CheckboxInput,
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur
        );
      case FormFieldType.DateTime:
        return this.passDataToPropsOfStandardInput(
          DateTimeInput,
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur
        );
      case FormFieldType.Textarea:
        return this.passDataToPropsOfStandardInput(
          Textarea,
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur
        );
      case FormFieldType.StaticSelect:
        return this.passDataToPropsOfStandardInput(
          field.options && field.options.useReactSelectComponent === true
            ? StaticSelectBasedOnReactSelect
            : StaticSelectBasedOnHtmlSelect,
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur
        );
      case FormFieldType.Wysywig:
        return this.passDataToPropsOfStandardInput(
          Wysywig,
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur
        );
      case FormFieldType.FileDragDrop:
        return this.passDataToPropsOfStandardInput(
          FileDragDrop,
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur
        );
      case FormFieldType.VariablePlaceholder:
        return null; // We don't render it. Sender function should fill it.
      default:
        if (typeof onRenderCustomFieldByType === 'function') {
          return onRenderCustomFieldByType(
            field,
            fieldHtmlId,
            currentValue,
            onChange,
            onFocus,
            onBlur
          );
        } else {
          console.error(`Cannot render this (${field.type}) type of field!`);
          return (
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              ('Sorry, cannot render this form field type!')
            </p>
          );
        }
    }
  }

  private buildClassNameForContainer(
    field: FormFieldToRender,
    errors: TranslatableObject[]
  ) {
    return `form-field${errors.length > 0 ? ' error' : ''} field-type-${
      field.type
    } ${field.required ? 'field-required' : 'field-optional'}`;
  }

  private renderCheckboxField(
    field: FormFieldToRender,
    errors: TranslatableObject[],
    fieldHtmlId: string,
    currentValue: any,
    onChange: ChangeFunction,
    onFocus: FieldAndEventFunction,
    onBlur: FieldAndEventFunction
  ) {
    const { title, descr } = field;
    const { requiredIndicator } = this.props;
    return (
      <div
        className={this.buildClassNameForContainer(field, errors)}
        key={fieldHtmlId}
      >
        <div className="checkbox">
          {this.renderFieldBasedOnType(
            field,
            fieldHtmlId,
            currentValue,
            onChange,
            onFocus,
            onBlur
          )}
          <label htmlFor={fieldHtmlId}>
            <p className="form-field-title">
              {this.transPlainStr(title)}
              {field.required && requiredIndicator}
            </p>
          </label>
        </div>
        {descr && (
          <p className="form-field-description">{this.transPlainStr(descr)}</p>
        )}
        {this.renderErrors(errors)}
      </div>
    );
  }

  private renderSingleFullField = (
    field: FormFieldToRender,
    errors: TranslatableObject[]
  ): any => {
    let { onRenderFullField } = this.props;
    const { requiredIndicator } = this.props;
    const { descr, title, id, options } = field;

    if (this.state.inactiveFields.indexOf(id) > -1) {
      return null;
    }

    const onChange = this.changeFunctions[field.id];
    const onFocus = this.focusFunctions[field.id];
    const onBlur = this.blurFunctions[field.id];
    const currentValue = this.state.values[field.id];
    const fieldHtmlId = this.genFieldId(field);

    if (field.type === 'groupStart') {
      if (this.groupActive === false) {
        this.groupCache = [];
        this.groupActive = true;
      }

      return null;
    }

    if (field.type === 'groupEnd') {
      this.groupActive = false;
      return (
        <div
          className={`fields-group ${
            this.groupCache.length === 0 ? 'empty' : ''
          }`}
        >
          {this.groupCache}
        </div>
      );
    }

    if (typeof onRenderFullField === 'function') {
      const customFullField = onRenderFullField(
        field,
        errors,
        fieldHtmlId,
        currentValue,
        onChange,
        onFocus,
        onBlur
      );
      if (customFullField) {
        if (this.groupActive) {
          this.groupCache.push(customFullField);
          return null;
        } else return customFullField;
      }
    }

    if (field.type === FormFieldType.Checkbox) {
      return this.renderCheckboxField(
        field,
        errors,
        fieldHtmlId,
        currentValue,
        onChange,
        onFocus,
        onBlur
      );
    }

    return (
      <div
        className={this.buildClassNameForContainer(field, errors)}
        key={fieldHtmlId}
      >
        <label htmlFor={fieldHtmlId}>
          <p className="form-field-title">
            {this.transPlainStr(title)}
            {field.required && requiredIndicator}
          </p>
          {descr && (!options || !options.descriptionBelow) && (
            <p className="form-field-description">
              {this.transPlainStr(descr)}
            </p>
          )}
        </label>
        {this.renderFieldBasedOnType(
          field,
          fieldHtmlId,
          currentValue,
          onChange,
          onFocus,
          onBlur
        )}
        {descr && options && options.descriptionBelow && (
          <p className="form-field-description">{this.transPlainStr(descr)}</p>
        )}
        {this.renderErrors(errors)}
      </div>
    );
  };

  private plainObjectToFormData(obj: any): FormData {
    const fd = new FormData();
    for (const key in obj) {
      fd.append(key, obj[key]);
    }
    return fd;
  }

  private handleFormSubmit = async (e: any) => {
    if (e) {
      e.preventDefault();
    }

    const { values } = this.state;
    const {
      onFormSubmit,
      onValidateField,
      formSchema,
      useFormDataInsteadOfPlainObject,
      sendDelay,
    } = this.props;
    setTimeout(() => {
      this.setState(
        {
          loading: true,
        },
        async () => {
          try {
            // Validate
            let errors = { ...this.state.errors };
            let hasAnyError = false;

            // Custom front-end validation
            if (typeof onValidateField === 'function') {
              for (let field of formSchema) {
                const result = onValidateField({
                  ...field,
                  value: values[field.id],
                });
                if (typeof result === 'string') {
                  hasAnyError = true;
                  errors[field.id].push({
                    messageWithPlaceholders: result,
                    messageCompiled: result,
                    params: [],
                  });
                } else if (
                  result &&
                  result.messageWithPlaceholders &&
                  result.messageCompiled &&
                  result.params
                ) {
                  hasAnyError = true;
                  errors[field.id].push(result);
                }
              }
            }

            if (hasAnyError) {
              this.setState({
                errors,
              });
              return;
            }

            // Send
            await Promise.resolve(
              onFormSubmit(
                useFormDataInsteadOfPlainObject
                  ? this.plainObjectToFormData(values)
                  : values
              )
            );
          } finally {
            this.setState({
              loading: false,
            });
          }
        }
      );
    }, sendDelay || 0);
  };

  private deepErrorsCopy(
    internalErrors: FormErrors,
    customErrors: FormErrors
  ): FormErrors {
    const result: FormErrors = {};

    for (const key in internalErrors) {
      if (customErrors.hasOwnProperty(key)) {
        result[key] = [...internalErrors[key], ...customErrors[key]];
      } else {
        result[key] = internalErrors[key];
      }
    }

    for (const key in customErrors) {
      if (!internalErrors.hasOwnProperty(key)) {
        result[key] = customErrors[key];
      }
    }

    return result;
  }

  private async checkFieldsInactivity() {
    if (Object.keys(this.activityCheckFunctions).length === 0) return;

    const inactiveFields: string[] = [];

    for (const fieldId in this.activityCheckFunctions) {
      const ans = await Promise.resolve(
        this.activityCheckFunctions[fieldId](this.state.values)
      );
      if (
        !(await Promise.resolve(
          this.activityCheckFunctions[fieldId](this.state.values)
        ))
      ) {
        inactiveFields.push(fieldId);
      }
    }

    this.setState({
      inactiveFields,
    });
  }

  private getSubmitButton = () => {
    const { submitButton } = this.props;
    const { loading } = this.state;
    if (typeof submitButton === 'function') {
      return submitButton(loading);
    } else if (submitButton) {
      return submitButton;
    } else return <button type="submit">{this.transPlainStr('Accept')}</button>;
  };

  render() {
    const {
      formSchema,
      submitButton,
      loadingInfo,
      loadingInfoAboveContent,
      formId,
    } = this.props;
    const { errors: internalErrors, loading } = this.state;
    const { errors: customErrors } = this.props;

    const errors = this.deepErrorsCopy(internalErrors, customErrors || {});

    if (loading && loadingInfoAboveContent !== true) {
      return (
        loadingInfo || (
          <p className="loading-info">{this.transPlainStr('Loading')}</p>
        )
      );
    }

    return (
      <form action="#" onSubmit={this.handleFormSubmit} id={`form_${formId}`}>
        {loading &&
          loadingInfoAboveContent &&
          (loadingInfo || (
            <p className="loading-info">{this.transPlainStr('Loading')}</p>
          ))}
        {formSchema.map((oneField) =>
          this.renderSingleFullField(oneField, errors[oneField.id])
        )}
        <div className="form-buttons">{this.getSubmitButton()}</div>
      </form>
    );
  }
}
