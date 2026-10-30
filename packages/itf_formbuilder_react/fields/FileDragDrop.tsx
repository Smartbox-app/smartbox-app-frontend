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

// const adaptFileEventToValue = (delegate: any) => (e: any) => delegate((e && e.target && e.target.files) ? e.target.files[0] : e);

const EMPTY_IMG_SRC = "data:image/gif;base64,R0lGODlhAQABAAAAADs=";

class FileDragDrop extends React.Component<Props, State> {
  fileReader: FileReader;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentImg: null,
      imgFileName: "",
      imgStatus: false,
      dragging: false
    };
    this.fileReader = new FileReader();
  }

  private onChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onChange(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      this.setState({
        imgFileName: e.target.files[0].name
      });
      this.fileReader.onload = (e: any) => {
        this.setState({
          currentImg: e.target.result,
          imgStatus: true
        });
      };
      this.fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  private onDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files[0]) {
      this.setState({
        imgFileName: e.dataTransfer.files[0].name,
        dragging: false
      });
      this.props.onBlur && this.props.onBlur();
      this.fileReader.onload = (e: any) => {
        this.setState({
          currentImg: e.target.result,
          imgStatus: true
        });
      };
    }
    this.fileReader.readAsDataURL(e.dataTransfer.files[0]);
    this.props.onChange(e.dataTransfer.files[0]);
  };

  private onDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragging: true
    });
    this.props.onFocus && this.props.onFocus();
  };

  private onDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragging: false
    });
    this.props.onBlur && this.props.onBlur();
  };

  private hasImage = () => {
    return this.props.currentValue || this.props.field.options.previewUrl;
  };

  private getImgPreviewSrc() {
    if (typeof this.state.currentImg === "string") {
      return this.state.currentImg;
    }

    if (typeof this.props.currentValue === "string") {
      return this.props.currentValue;
    }

    if (typeof this.props.field.options.previewUrl === "string") {
      return this.props.field.options.previewUrl + "?_t=" + +new Date();
    }

    return EMPTY_IMG_SRC;
  }

  render() {
    const { transPlainStr } = this.props;

    const imgPreview = (
      <div className="img-preview-wrapper">
        <p className="file-name">{this.state.imgFileName}</p>
        <img className="img-preview" src={this.getImgPreviewSrc()} alt="" />
      </div>
    );
    return (
      <>
        <label className="input-container">
          <div
            onDrop={this.onDrop}
            onDragEnter={this.onDragEnter}
            onDragOver={this.onDragEnter}
            onDragLeave={this.onDragLeave}
            className={`file-container ${
              this.state.dragging ? "dragging" : ""
            }`}
          >
            <div
              className={`file-wrapper ${this.hasImage() ? "has-image" : ""}`}
            >
              {this.hasImage() ? (
                imgPreview
              ) : (
                <span>
                  {transPlainStr("Drag & drop or click here to select file.")}
                </span>
              )}
              <input
                {...(this.props.field.options.isNotImage !== true
                  ? { accept: this.props.field.options.accept || "image/*" }
                  : { accept: this.props.field.options.accept || "*" })}
                className="input input-file"
                id={this.props.fieldHtmlId}
                type="file"
                onChange={this.onChange}
              />{" "}
            </div>
          </div>
        </label>
      </>
    );
  }
}

export default FileDragDrop;
