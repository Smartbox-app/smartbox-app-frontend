import * as React from 'react';
import { FormErrors, TranslatableObject } from 'itf_formbuilder';
import {
  FormFieldToRender,
  ItfFormBuilder,
  ItfFormBuilderProps,
  PublicItfFormBuilderComponentApi,
  RefToItfFormBuilderComponent,
} from './ItfFormBuilder';
import {
  cacheGetAndCleanupOnlyThisFormIfNeeded,
  cacheSetAndCleanupAllIfNeeded,
} from './utils/itfApiFormSchemaCache';
import format from './utils/format';
import { registerGlobalForm, unregisterGlobalForm } from './utils/globalForms';

export type GetSchemaFetcherFunction = (
  formId: string
) => Promise<FormFieldToRender[]> | FormFieldToRender[];
export type SendFormFetcherFunction = (
  formId: string,
  values: any | FormData
) => Promise<FormErrors> | FormErrors | Promise<void> | void;
export type LoadingStateChangeFunction = (
  isLoading: boolean
) => void | Promise<void>;

interface Props extends Partial<ItfFormBuilderProps> {
  /*
    Id of form, each form need it.
     */
  formId: string;

  /*
    If schema may be changed (for example some fields are shown when for only some paths) - set this to true. If nothing should change between requests - set to false.
     */
  schemaMayBeDynamic: boolean;

  /*
    Function to fetch schema.
     */
  schemaFetcher: GetSchemaFetcherFunction;

  /*
    Function to send data.
     */
  sendFetcher: SendFormFetcherFunction;

  /*
    Delay applied to sending form [ms]
    */
  sendDelay?: number;

  /*
    Event for loading.
     */
  onLoadingStateChange?: LoadingStateChangeFunction;

  /*
    Event for successful save.
     */
  onSavedSuccessfully?: Function;

  /*
    Event for unsuccessful answer while saving.
     */
  onErrorsWhileSaving?: Function;

  /*
    Should schema cache be enabled. Defaults to true.
     */
  schemaCacheEnabled?: boolean;

  /*
    Max time in seconds to hold schema in memory. Defaults to 360.
     */
  schemaCacheMaxTimeSeconds?: number;

  /*
    Maximum number of schemas to hold overall in browser tab. Defaults to 50 - WATCH OUT, THIS IS GLOBAL SETTING FOR EVERY FORM.
     */
  schemaGlobalCacheMaxElements?: number;

  /*
    Will return FormData to sendFetcher instead of plain JS object
     */
  useFormDataInsteadOfPlainObject?: boolean;

  /* 
    label or sign to indicate required field
    */
  requiredIndicator?: string | React.ReactNode;

  /*
    Flag determining if form should not be remounted after success
    */
  noRefreshAfterSuccess?: boolean;
}

interface State {
  schema: FormFieldToRender[];
  errors: FormErrors;
  loading: boolean;
}

export class ItfApiForm
  extends React.Component<Props, State>
  implements RefToItfFormBuilderComponent {
  private itfFormBuilderRef: RefToItfFormBuilderComponent = null as any;
  public api: PublicItfFormBuilderComponentApi = null as any;

  state = {
    schema: [],
    errors: {},
    loading: true,
  };

  private setApi() {
    if (!this.api && this.itfFormBuilderRef) {
      this.api = {
        ...this.itfFormBuilderRef.api,

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

          this.itfFormBuilderRef.api.resetInternalErrors();
        },

        resetAll: () => {
          this.api.resetInternalErrors();
          this.api.resetValues();
        },
      };

      if (this.props.registerAsGlobalForm) {
        registerGlobalForm(
          this.props.formId,
          this,
          (this.itfFormBuilderRef as any).state.values
        );

        if (typeof this.props.onFormGloballyRegistered === 'function') {
          this.props.onFormGloballyRegistered(this.api);
        }
      }
    }
  }

  componentDidUpdate() {
    this.setApi();
  }

  componentDidMount() {
    this.setApi();

    this.setLoading(true);
    this.fetchSchema().then((schema) => {
      this.setState({
        schema,
      });
      this.setLoading(false);
    });
  }

  componentWillUnmount() {
    unregisterGlobalForm(this.props.formId);
  }

  private setLoading = (loading: boolean) => {
    this.setState({
      loading,
    });
    if (typeof this.props.onLoadingStateChange === 'function') {
      this.props.onLoadingStateChange(loading);
    }
  };

  async fetchSchema(): Promise<FormFieldToRender[]> {
    const { formId, schemaFetcher, schemaMayBeDynamic } = this.props;
    const schemaCacheEnabled =
      typeof this.props.schemaCacheEnabled === 'boolean'
        ? this.props.schemaCacheEnabled
        : true;
    const schemaCacheMaxTimeSeconds =
      this.props.schemaCacheMaxTimeSeconds || 360;
    const schemaGlobalCacheMaxElements =
      this.props.schemaGlobalCacheMaxElements || 50;

    if (schemaCacheEnabled) {
      if (schemaMayBeDynamic) {
        console.warn(
          `Warning: formId ${formId} may have dynamic schema, but schemaCacheEnabled is enabled anyway! It may not download correct schema.`
        );
      }

      const schemaFromCache = cacheGetAndCleanupOnlyThisFormIfNeeded(
        formId,
        schemaCacheMaxTimeSeconds
      );
      if (schemaFromCache) {
        return schemaFromCache;
      }
    }

    const schema = await Promise.resolve(schemaFetcher(formId));

    if (!schema || !schema.push || schema.length === 0) {
      throw new Error(
        `Cannot fetch schema for formId ${formId}! Response is not FormFieldToRender[] or is empty!`
      );
    }

    if (schemaCacheEnabled) {
      cacheSetAndCleanupAllIfNeeded(
        formId,
        schema,
        schemaCacheMaxTimeSeconds,
        schemaGlobalCacheMaxElements
      );
    }

    return schema;
  }

  private transAndFormat(obj: TranslatableObject): string {
    return format(
      this.transPlainStr(obj.messageWithPlaceholders),
      ...obj.params
    );
  }

  private transPlainStr(s: string): string {
    const { onTranslateString } = this.props;
    return typeof onTranslateString === 'function' ? onTranslateString(s) : s;
  }

  isThereAnyError(formErrors: FormErrors): boolean {
    for (const key in formErrors) {
      if (formErrors[key].length > 0) return true;
    }

    return false;
  }

  handleFormSubmit = async (values: any) => {
    const {
      sendFetcher,
      formId,
      onSavedSuccessfully,
      onErrorsWhileSaving,
      noRefreshAfterSuccess,
      sendDelay,
    } = this.props;
    try {
      const ans = await Promise.resolve(sendFetcher(formId, values) as any);
      this.setState({
        errors:
          typeof ans === 'object' &&
          ans !== null &&
          typeof ans.form_errors === 'object'
            ? ans.form_errors
            : {},
      });

      if (
        typeof ans === 'object' &&
        ans !== null &&
        ans.form_errors &&
        this.isThereAnyError(ans.form_errors)
      ) {
        if (typeof onErrorsWhileSaving === 'function') {
          onErrorsWhileSaving(ans.formErrors, formId);
        }
      } else {
        if (typeof onSavedSuccessfully === 'function') {
          onSavedSuccessfully(ans, formId);
        }
        if (!noRefreshAfterSuccess) this.componentDidMount();
      }
    } catch (e) {}
  };

  handleAnyFieldTouch = (field, ev) => {
    if (typeof this.props.onTouch === 'function') {
      this.props.onTouch(field, ev);
    }

    this.setState({
      errors: {
        ...this.state.errors,
        [field.id]: [],
      },
    });
  };

  render() {
    const { loadingInfo, sendDelay, requiredIndicator } = this.props;
    const { loading, schema, errors } = this.state;

    if (!schema || schema.length === 0) {
      return (
        loadingInfo || (
          <p className="loading-info">{this.transPlainStr('Loading')}</p>
        )
      );
    }

    return (
      <ItfFormBuilder
        {...this.props}
        ref={(comp) =>
          (this.itfFormBuilderRef = (comp as any) as RefToItfFormBuilderComponent)
        }
        sendDelay={sendDelay}
        formSchema={schema}
        onFormSubmit={this.handleFormSubmit}
        errors={errors}
        onTouch={this.handleAnyFieldTouch}
        requiredIndicator={requiredIndicator}
        onFormGloballyRegistered={
          undefined /* Disable, this is handled internally */
        }
      />
    );
  }
}
