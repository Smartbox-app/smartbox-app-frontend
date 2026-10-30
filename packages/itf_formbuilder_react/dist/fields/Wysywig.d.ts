/// <reference types="react" />
import { FormFieldToRender, ThirdPartyComponents } from "../ItfFormBuilder";
interface Props {
    onChange: (currentValue: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    currentValue: any;
    fieldHtmlId: string;
    field: FormFieldToRender;
    thirdPartyComponents: ThirdPartyComponents;
}
export declare function Wysywig(props: Props): JSX.Element;
export {};
