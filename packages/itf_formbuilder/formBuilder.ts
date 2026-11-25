import {
  TranslatableError,
  TranslatableObject,
} from './components/utils/translatableError';
// To cheat Webpack. No, I cannot use dynamic require, as this will funckin' load .d.ts file...
import * as checkboxFile from './components/fields/checkbox';
import * as dateTimeFile from './components/fields/dateTime';
import * as numberFile from './components/fields/number';
import * as staticSelectFile from './components/fields/staticSelect';
import * as textareaFile from './components/fields/textarea';
import * as variablePlaceholderFile from './components/fields/variablePlaceholder';
import * as wysywigFile from './components/fields/wysywig';
import * as fileDragDropFile from './components/fields/fileDragDrop';
import * as groupStartFile from './components/fields/groupStart';
import * as groupEndFile from './components/fields/groupEnd';
import * as heaaderFile from './components/fields/header';
import * as custom from './components/fields/custom';

export enum FormFieldType {
  Text = 'text',
  Number = 'number',
  Textarea = 'textarea',
  Wysywig = 'wysywig',
  Checkbox = 'checkbox',
  StaticSelect = 'staticSelect',
  DateTime = 'dateTime',
  Entity = 'entity',
  VariablePlaceholder = 'variablePlaceholder',
  FileDragDrop = 'fileDragDrop',
  GroupStart = 'groupStart',
  GroupEnd = 'groupEnd',
  Header = 'header',
  Custom = 'custom',
}

export type FormFieldAsyncOrSyncValidator = <T>(field: T) => any;
export type FormFieldAsyncOrSyncTransformer = <T>(field: T) => any;

export interface FormFieldBase {
  id: string;
  type: FormFieldType | string;
  title: string;
  required?: boolean;
  readOnly?: boolean;
  descr?: string;
  placeholder?: string;
  value?: any;
  options?: any; // Shared between front-end and back-end. All of the options are visible on front-end!
  settings?: any; // Only for back-end
  doNotAutoValidateOptions?: boolean;
  validators?: FormFieldAsyncOrSyncValidator[];
  transformer?: FormFieldAsyncOrSyncTransformer;
  visibilityAndActivity?: (allValues: any) => boolean | Promise<boolean>;
  valueOnInactivity?: any; // null otherwise
}

export interface FormErrors {
  [fieldId: string]: TranslatableObject[];
}

enum FormBuilderState {
  Building,
  Built,
  LoadedVals,
  Validated,
}

declare var require: any;

function getBestPossibleError(
  e: Error | TranslatableError
): TranslatableObject {
  if (e instanceof TranslatableError && e.getTranslatableObject) {
    return e.getTranslatableObject();
  } else {
    return {
      messageWithPlaceholders: e.message,
      messageCompiled: e.message,
      params: [],
    };
  }
}

export class FormBuilder {
  private state: FormBuilderState = FormBuilderState.Building;
  private fields: FormFieldBase[] = [];
  private errors: FormErrors = {};

  constructor() {}

  private makeSureFormIsInState(expectedState: FormBuilderState) {
    if (expectedState !== this.state) {
      throw new Error(
        `Cannot perform this action on FormBuilder - it is in invalid state (expected ${expectedState}, but it is ${this.state}).`
      );
    }
  }

  static dynamicLoadFieldFile(field: FormFieldBase): any {
    switch (field.type) {
      case FormFieldType.Text:
        return textareaFile;
      case FormFieldType.Number:
        return numberFile;
      case FormFieldType.Textarea:
        return textareaFile;
      case FormFieldType.Wysywig:
        return wysywigFile;
      case FormFieldType.Checkbox:
        return checkboxFile;
      case FormFieldType.StaticSelect:
        return staticSelectFile;
      case FormFieldType.DateTime:
        return dateTimeFile;
      case FormFieldType.VariablePlaceholder:
        return variablePlaceholderFile;
      case FormFieldType.FileDragDrop:
        return fileDragDropFile;
      case FormFieldType.GroupStart:
        return groupStartFile;
      case FormFieldType.GroupEnd:
        return groupEndFile;
      case FormFieldType.Header:
        return heaaderFile;
      case FormFieldType.Custom:
        return custom;

      default:
        throw new Error(
          'To enable another type of field one needs to fill itf_formbuilder.FormBuilder.dynamicLoadFieldFile() method. Because of Webpack this is required to be done manually.'
        );
    }
  }

  static getFieldEmptyVal(field: FormFieldBase): any {
    return FormBuilder.dynamicLoadFieldFile(field).defaultEmptyVal(field);
  }

  appendField(field: FormFieldBase): FormBuilder {
    this.makeSureFormIsInState(FormBuilderState.Building);

    const prev = this.fields.find((one) => one.id === field.id);

    if (prev) {
      throw new Error(
        `Cannot create form with two fields with the same ID! ${field.id} has been used again.`
      );
    }

    let {
      descr,
      placeholder,
      value,
      required,
      readOnly,
      options,
      settings,
      validators,
      valueOnInactivity,
      visibilityAndActivity,
    } = field;

    // Assign default values if none are found
    if (typeof descr === 'undefined') {
      descr = '';
    }

    if (typeof placeholder === 'undefined') {
      placeholder = '';
    }

    if (typeof required === 'undefined') {
      required = false;
    }

    if (typeof readOnly === 'undefined') {
      readOnly = false;
    }

    if (typeof value === 'undefined' || value === null) {
      value = FormBuilder.getFieldEmptyVal(field);
    }

    if (typeof options === 'undefined') {
      options = {};
    }

    if (typeof settings === 'undefined') {
      settings = {};
    }

    if (typeof validators === 'undefined') {
      validators = [];
    }

    if (typeof valueOnInactivity === 'undefined') {
      valueOnInactivity = null;
    }

    this.fields.push({
      ...field,
      descr,
      placeholder,
      value,
      required,
      readOnly,
      options,
      settings,
      validators,
      visibilityAndActivity,
      valueOnInactivity,
    });

    return this;
  }

  getJson(): string {
    this.makeSureFormIsInState(FormBuilderState.Built);

    return JSON.stringify(
      this.fields.map((field) => {
        const {
          id,
          title,
          type,
          descr,
          placeholder,
          value,
          options,
          required,
          readOnly,
          visibilityAndActivity,
          valueOnInactivity,
        } = field;
        return {
          descr,
          placeholder,
          id,
          title,
          type,
          value,
          options,
          required,
          readOnly,
          valueOnInactivity,
          visibilityAndActivity: visibilityAndActivity
            ? visibilityAndActivity.toString()
            : undefined,
        };
      })
    );
  }

  build(): FormBuilder {
    this.makeSureFormIsInState(FormBuilderState.Building);
    this.state = FormBuilderState.Built;

    this.fields = this.fields; //Lol, not doing anything at all right now

    return this;
  }

  loadValues(valuesObj: any, isFormData: boolean = false): FormBuilder {
    this.makeSureFormIsInState(FormBuilderState.Built);
    this.state = FormBuilderState.LoadedVals;

    for (let key in valuesObj) {
      const field = this.fields.find((oneField) => oneField.id === key);
      if (!field)
        throw new Error(
          'Error while loading form values. Values object has unknown key ' +
            key
        );
      field.value = isFormData
        ? this.formDataFieldToRealVal(valuesObj[key], field)
        : valuesObj[key];
    }

    return this;
  }

  getVal<T>(fieldId: string): Promise<T> {
    const field = this.fields.find((oneField) => oneField.id === fieldId);
    if (!field)
      throw new Error(
        'Error while getting value of field. Unknown field id ' + fieldId
      );
    return field.value;
  }

  getAllVals(): any {
    return this.fields.reduce((prev, oneField) => {
      prev[oneField.id] = oneField.value;
      return prev;
    }, {} as any);
  }

  addError(fieldId: string, error: TranslatableObject) {
    this.errors[fieldId] = this.errors[fieldId] || [];
    this.errors[fieldId].push(error);
  }

  async validateField(field: FormFieldBase) {
    if (field.doNotAutoValidateOptions !== true) {
      try {
        await Promise.resolve(
          FormBuilder.dynamicLoadFieldFile(field).defaultOptionsValidator(field)
        );
      } catch (e) {
        this.addError(field.id, getBestPossibleError(e));
      }
    }
    if (
      field.validators &&
      field.validators.length &&
      field.validators.length > 0 &&
      (!this.errors[field.id] || this.errors[field.id].length === 0) // Do not check if there is an error anyway in default validator
    ) {
      for (let validator of field.validators) {
        try {
          await Promise.resolve(validator(field));
        } catch (e) {
          this.addError(field.id, getBestPossibleError(e));
          break; // Only one
        }
      }
    }
  }

  async evalIsActive(field: FormFieldBase, allVals: any): Promise<boolean> {
    const { visibilityAndActivity } = field;

    if (!visibilityAndActivity) return true;

    return await Promise.resolve(visibilityAndActivity(allVals));
  }

  async validate(): Promise<boolean> {
    this.makeSureFormIsInState(FormBuilderState.LoadedVals);
    this.state = FormBuilderState.Validated;
    this.errors = {};

    for (const field of this.fields.filter(
      (one) => !one.visibilityAndActivity
    )) {
      await this.validateField(field);
    }

    const deactivableFields = this.fields.filter(
      (one) => !!one.visibilityAndActivity
    );
    if (deactivableFields.length > 0) {
      const vals = this.getAllVals();

      for (const field of deactivableFields) {
        const { valueOnInactivity } = field;

        if (await this.evalIsActive(field, vals)) {
          await this.validateField(field);
        } else {
          // Not the best place to do it, but the only async one, so that we know evalIsActive.
          field.value = valueOnInactivity;
        }
      }
    }

    return !this.hasAnyErrors();
  }

  hasAnyErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  getErrors(): FormErrors {
    this.makeSureFormIsInState(FormBuilderState.Validated);

    return this.errors;
  }

  private formDataFieldToRealVal(str: string, field: FormFieldBase) {
    return FormBuilder.dynamicLoadFieldFile(field).formDataStrToRealValue(
      str,
      field
    );
  }
}
