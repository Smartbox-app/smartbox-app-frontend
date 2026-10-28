import * as React from "react";
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
export declare class DateTimeInput extends React.Component<Props, {}> {
    private flatpickr;
    constructor(props: Props);
    private getMode;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
