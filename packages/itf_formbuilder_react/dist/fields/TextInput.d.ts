/// <reference types="react" />
import { FormFieldToRender } from '../ItfFormBuilder';
interface Props {
    onChange: (currentValue: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    currentValue: any;
    fieldHtmlId: string;
    field: FormFieldToRender;
}
export declare function TextInput(props: Props): JSX.Element;
export {};
