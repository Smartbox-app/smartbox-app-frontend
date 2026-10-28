/// <reference types="react" />
import { FormFieldToRender } from '../ItfFormBuilder';
interface Props {
    onChange: (currentValue: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    currentValue: null | string | number | string[] | number[] | boolean | boolean[];
    fieldHtmlId: string;
    field: FormFieldToRender;
    transPlainStr: (s: string) => string;
}
export declare function StaticSelectBasedOnHtmlSelect(props: Props): JSX.Element;
export {};
