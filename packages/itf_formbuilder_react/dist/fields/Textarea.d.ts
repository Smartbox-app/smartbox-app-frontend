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
export declare function Textarea(props: Props): JSX.Element;
export {};
