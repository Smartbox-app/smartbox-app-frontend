import { FieldAndEventFunction } from 'itf_formbuilder_react';
import React, { MouseEvent } from 'react';

import { Button } from 'src/components/Branded/Button';
import { StyledFieldContainer } from 'src/components/Common/input-styled';
import { ButtonsContainer } from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';

import 'src/components/Common/FileInput/FileInput.scss';

interface FileFieldInput {
  name?: string;
  id?: string;
  value?: unknown;
  onChange?(value: unknown): void;
  onFocus?: FieldAndEventFunction;
  onBlur?: FieldAndEventFunction;
}

interface Props {
  input: FileFieldInput;
  error?: string;
  meta?: { error?: string | null; touched?: boolean };
  touched?: boolean;
  placeholder?: string;
  label?: string;
  value?: unknown;
  options?: { value?: string; name?: string }[];
  readonly?: boolean;
  nomargin?: boolean;
  max?: boolean;
  hasImage?: string;
  onChange?: (value: string) => void;
  isNotImage?: boolean;
  accept?: string;
  multiple?: boolean;
}

interface State {
  currentImg: string | ArrayBuffer | null;
  imgFileName: string;
  dragging: boolean;
  cantRender: boolean;
  loadedFiles: File[];
  loadedType: 'image' | 'pdf' | null;
}

const errorClass = (error: boolean, touched: boolean) =>
  error && touched ? 'is-invalid' : '';

const adaptFileEventToValue =
  (delegate: FieldAndEventFunction) =>
  (event: React.ChangeEvent<HTMLInputElement>) =>
    (delegate as (value: unknown) => void)(event.target.files?.[0] ?? event);

class FileInput extends React.Component<Props, State> {
  fileReader: FileReader;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentImg: null,
      imgFileName: '',
      dragging: false,
      cantRender: false,
      loadedFiles: [],
      loadedType: null,
    };
    this.fileReader = new FileReader();
    this.fileReader.onload = (event: ProgressEvent<FileReader>) => {
      this.setState({
        currentImg: event.target?.result ?? null,
        cantRender: false,
      });
    };
  }

  async componentDidMount() {
    const { input, hasImage } = this.props;

    if (input.value) {
      this.fileReader.onload = (event: ProgressEvent<FileReader>) => {
        this.setState({
          currentImg: event.target?.result ?? null,
          cantRender: false,
        });
      };
      if (input.value instanceof Array) {
        this.setState({
          loadedFiles: input.value,
        });
      } else if (input.value instanceof Blob) {
        this.fileReader.readAsDataURL(input.value);
      } else {
        this.setState({ cantRender: true });
      }
    }
    if (hasImage) {
      this.fetchImage();
    }
  }

  private fetchImage = async () => {
    if (this.props.hasImage) {
      const res = await ApiService.simpleFetch('GET', this.props.hasImage);
      const body = await res.blob();
      const type = res.headers.get('Content-Type');
      if (type === 'application/pdf') {
        this.setState({
          loadedType: 'pdf',
        });
      } else {
        this.setState({
          loadedType: 'image',
        });
      }

      try {
        this.fileReader.readAsDataURL(body);
      } catch {
        // FileReader throws if a read is already in progress.
      }
    }
  };

  private hasImage = () => {
    const { hasImage, input } = this.props;
    if (!hasImage && Array.isArray(input.value) && input.value.length === 0)
      return false;
    return this.props.hasImage || this.props.input.value;
  };

  private onZoneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.currentTarget.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  };

  private onDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    this.setState({
      dragging: true,
    });
    event.stopPropagation();
  };

  private onDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    this.setState({
      dragging: false,
    });
    event.stopPropagation();
  };

  private onDrop = (event: React.DragEvent) => {
    const { multiple, input } = this.props;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files[0]) {
      const eventFiles = event.dataTransfer.files;
      this.setState(
        (prev) => ({
          imgFileName: eventFiles[0].name,
          loadedType: null,
          loadedFiles: [
            ...prev.loadedFiles,
            ...(Array.from(eventFiles) as File[]),
          ],
        }),
        () => {
          if (multiple) input.onChange?.(this.state.loadedFiles);
        },
      );
    }

    if (multiple) {
      this.fileReader.readAsDataURL(event.dataTransfer.files[0]);
      this.props.input.onChange?.(event.dataTransfer.files[0]);
    } else {
      this.fileReader.readAsDataURL(event.dataTransfer.files[0]);
      this.props.input.onChange?.(event.dataTransfer.files);
    }
  };

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { multiple, input } = this.props;

    event.preventDefault();
    event.stopPropagation();

    if (event.target.files?.[0]) {
      const eventFiles = event.target.files;
      this.setState(
        (prev) => ({
          imgFileName: eventFiles[0].name,
          loadedType: null,
          loadedFiles: [
            ...prev.loadedFiles,
            ...(Array.from(eventFiles) as File[]),
          ],
        }),
        () => {
          if (multiple) input.onChange?.(this.state.loadedFiles);
        },
      );
    }

    if (!multiple) input.onChange?.(event.target.files?.[0]);
  };

  private deleteSelectedFile = (event: React.MouseEvent, index: number) => {
    const { input } = this.props;
    event.preventDefault();
    this.setState(
      (prev) => ({
        loadedFiles: prev.loadedFiles.filter((_file, i) => i !== index),
      }),
      () => {
        if (this.state.loadedFiles.length === 0) {
          this.setState({
            currentImg: null,
            imgFileName: '',
            cantRender: false,
          });
        }
        input.onChange?.(this.state.loadedFiles);
      },
    );
  };

  private deleteFile = (event: React.MouseEvent) => {
    const { input } = this.props;
    event.preventDefault();
    this.setState(
      {
        currentImg: null,
        imgFileName: '',
        cantRender: false,
      },
      () => {
        input.onChange?.('');
      },
    );
  };

  render() {
    const { accept, multiple, input } = this.props;
    const { cantRender, loadedFiles, loadedType } = this.state;
    const { value: _value, ...inputCopy } = this.props.input;

    const imgPreview = (
      <div className="img-preview-wrapper">
        {loadedType === 'image' && typeof this.state.currentImg === 'string' && (
          <img className="img-preview" src={this.state.currentImg} alt="" />
        )}
        {loadedFiles.length === 0 && (
          <p className="file-name">{this.state.imgFileName}</p>
        )}
        {!cantRender &&
        Boolean(input.value) &&
        loadedType !== 'image' &&
        loadedFiles.length === 0 ? (
            <img
              className="img-preview"
              src={typeof this.props.input.value === 'string' ? this.props.input.value : undefined}
              alt=""
            />
          ) : null}
        {cantRender && typeof input.value === 'string' && input.value && (
          <p>{input.value}</p>
        )}
        {/* {((cantRender && !multiple) ||
                    (multiple &&
                        cantRender &&
                        loadedFiles.length === 0 &&
                        (currentImg || this.props.input.value || this.props.hasImage))) && (
                        <div>
                            <span className="file-input-icon fa fa-plus" />
                            <p>{__('application.cant_render_file')}</p>
                        </div>
                    )} */}
        {multiple && loadedFiles.length > 0 && (
          <div>
            <span className="file-input-icon fa fa-plus" />
            <p>{__('application.addNextFile')}</p>
          </div>
        )}
      </div>
    );
    return (
      <StyledFieldContainer $noMargin={this.props.nomargin}>
        <label>
          <p className="form-field-title">{__(this.props.label ?? '')}</p>
          <div
            className={`file-container ${this.state.dragging ? 'dragging' : ''} ${
              this.props.max ? 'input-max' : ''
            } ${this.props.nomargin ? 'nomargin' : ''            } ${errorClass(
              Boolean(this.props.meta?.error),
              Boolean(this.props.meta?.touched),
            )}`}
          >
            <span className="input-name">{this.props.placeholder} </span>
            <div
              className={`file-wrapper ${this.hasImage() ? 'has-image' : ''}`}
              role="button"
              tabIndex={0}
              onKeyDown={this.onZoneKeyDown}
              onDrop={this.onDrop}
              onDragEnter={this.onDragEnter}
              onDragOver={this.onDragEnter}
              onDragLeave={this.onDragLeave}
            >
              {this.hasImage() ? (
                imgPreview
              ) : (
                <div>
                  <span className="file-input-icon fa fa-plus" />
                  <p>{__('application.selectOrDragFile')}</p>
                </div>
              )}
              <input
                multiple={multiple}
                disabled={multiple && loadedFiles.length >= 10}
                // {...(this.props.isNotImage !== true ? { accept: accept || 'image/*' } : { accept: accept || '*' })}
                accept={accept}
                className="input-file"
                id={this.props.input.name}
                readOnly={this.props.readonly}
                placeholder={this.props.placeholder}
                type="file"
                {...(inputCopy as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
                onChange={this.onChange}
                onBlur={
                  inputCopy.onBlur
                    ? adaptFileEventToValue(inputCopy.onBlur)
                    : undefined
                }
                onDrop={this.onDrop}
                onDragEnter={this.onDragEnter}
                onDragOver={this.onDragEnter}
                onDragLeave={this.onDragLeave}
              />
            </div>
          </div>
        </label>
        {!multiple && loadedFiles.length === 0 && Boolean(input.value) ? (
          <ButtonsContainer>
            <Button
              text="application.delete"
              danger
              type="button"
              click={this.deleteFile}
            />
          </ButtonsContainer>
        ) : null}

        <ul>
          {loadedFiles.map((file, index) => (
            <li
              className="single-selected-file"
              key={
                typeof file === 'string'
                  ? file
                  : `${file.name}-${file.lastModified}-${file.size}`
              }
            >
              {typeof file === 'string' && (
                <img
                  className="single-selected-file-preview"
                  src={file}
                  alt=""
                />
              )}
              <span>{file.name}</span>

              <Button
                type="button"
                small
                danger
                text="application.delete"
                click={(e: MouseEvent<HTMLButtonElement>) =>
                  this.deleteSelectedFile(e, index)
                }
              />
            </li>
          ))}
        </ul>
        {this.props.meta?.error && this.props.meta.touched && (
          <small className="text-danger">{this.props.meta.error}</small>
        )}
      </StyledFieldContainer>
    );
  }
}
export default FileInput;
