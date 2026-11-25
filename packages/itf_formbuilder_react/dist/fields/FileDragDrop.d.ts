import * as React from "react";
import { FormFieldToRender } from "../ItfFormBuilder";
interface Props {
    onChange: (currentValue: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    currentValue: any;
    fieldHtmlId: string;
    field: FormFieldToRender;
    transPlainStr: (s: string) => string;
}
interface State {
    currentImg: any;
    imgFileName: string;
    imgStatus: boolean;
    dragging: boolean;
}
declare class FileDragDrop extends React.Component<Props, State> {
    fileReader: FileReader;
    constructor(props: Props);
    private onChange;
    private onDrop;
    private onDragEnter;
    private onDragLeave;
    private hasImage;
    private getImgPreviewSrc;
    render(): JSX.Element;
}
export default FileDragDrop;
