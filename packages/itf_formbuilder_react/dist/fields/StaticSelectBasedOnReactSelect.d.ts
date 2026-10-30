/// <reference types="react" />
import { FormFieldToRender, ThirdPartyComponents } from '../ItfFormBuilder';
interface Props {
    onChange: (currentValue: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    currentValue: null | string | number | string[] | number[] | boolean | boolean[];
    fieldHtmlId: string;
    field: FormFieldToRender;
    transPlainStr: (s: string) => string;
    thirdPartyComponents: ThirdPartyComponents;
}
export declare function StaticSelectBasedOnReactSelect(props: Props): JSX.Element;
export {};
