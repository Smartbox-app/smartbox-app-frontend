import React, { MouseEvent } from 'react';
import { Icon } from '..';
import ApiService from '../../../services/api-service';
import { Button } from '../../Branded/Button';
import './FileInput.scss';
import { __ } from '../../../helpers/i18n';

interface Props {
    input: any;
    error?: any;
    meta?: any;
    touched?: boolean;
    placeholder?: string;
    label?: string;
    value?: any;
    options?: any[];
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
    currentImg: any;
    imgFileName: string;
    dragging: boolean;
    cantRender: boolean;
    loadedFiles: File[];
    loadedType: 'image' | 'pdf' | null;
}

const errorClass = (error: boolean, touched: boolean) => (error && touched ? 'is-invalid' : '');

const adaptFileEventToValue = (delegate: any) => (e: any) =>
    delegate(e && e.target && e.target.files ? e.target.files[0] : e);

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
        this.fileReader.onload = (e: any) => {
            this.setState({
                currentImg: e.target.result,
                cantRender: false,
            });
        };
    }

    async componentDidMount() {
        const { input, multiple, hasImage } = this.props;

        console.log('VALUE', input.value);

        if (input.value) {
            this.fileReader.onload = (e: any) => {
                this.setState({
                    currentImg: e.target.result,
                    cantRender: false,
                });
            };
            if (input.value instanceof Array) {
                this.setState({
                    loadedFiles: input.value,
                });
            } else if(input.value instanceof Blob) {
                this.fileReader.readAsDataURL(input.value);
            } else {
                this.setState({ cantRender: true })
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

            this.fileReader.readAsDataURL(body);
        }
    };

    private hasImage = () => { 
        const {hasImage, input} = this.props;
        console.log(this.props.label, this.props.hasImage, this.props.input.value)
        if(!hasImage && Array.isArray(input.value) && input.value.length === 0) return false;
        return this.props.hasImage || this.props.input.value;
    }

    private onDragEnter = (e: any) => {
        e.preventDefault();
        this.setState({
            dragging: true,
        });
        e.stopPropagation();
    };

    private onDragLeave = (e: any) => {
        e.preventDefault();
        this.setState({
            dragging: false,
        });
        e.stopPropagation();
    };

    private onDrop = (e: any) => {
        const { multiple, input } = this.props;
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files[0]) {
            const eventFiles = e.dataTransfer.files;
            this.setState(
                (prev) => ({
                    imgFileName: eventFiles[0].name,
                    loadedType: null,
                    loadedFiles: [...prev.loadedFiles, ...(Array.from(eventFiles) as File[])],
                }),
                () => {
                    if (multiple) input.onChange(this.state.loadedFiles);
                },
            );
        }

        if (multiple) {
            this.fileReader.readAsDataURL(e.dataTransfer.files[0]);
            this.props.input.onChange(e.dataTransfer.files[0]);
        } else {
            this.fileReader.readAsDataURL(e.dataTransfer.files);
            this.props.input.onChange(e.dataTransfer.files);
        }
    };

    private onChange = (e: any) => {
        const { multiple, input } = this.props;

        e.preventDefault();
        e.stopPropagation();

        if (e.target.files[0] && e.target.files) {
            const eventFiles = e.target.files;
            this.setState(
                (prev) => ({
                    imgFileName: eventFiles[0].name,
                    loadedType: null,
                    loadedFiles: [...prev.loadedFiles, ...(Array.from(eventFiles) as File[])],
                }),
                () => {
                    if (multiple) input.onChange(this.state.loadedFiles);
                },
            );
        }

        if (!multiple) input.onChange(e.target.files[0]);
    };

    private deleteSelectedFile = (e: any, index: number) => {
        const { input } = this.props;
        e.preventDefault();
        this.setState(
            (prev) => ({
                loadedFiles: prev.loadedFiles.filter((f, i) => i !== index),
            }),
            () => {
                if (this.state.loadedFiles.length === 0) {
                    this.setState({
                        currentImg: null,
                        imgFileName: '',
                        cantRender: false,
                    });
                }
                input.onChange(null);
            },
        );
    };

    render() {
        const { accept, multiple, hasImage, input } = this.props;
        const { cantRender, loadedFiles, currentImg, loadedType } = this.state;
        const inputCopy = { ...this.props.input };

        delete inputCopy.value;

        const imgPreview = (
            <div className="img-preview-wrapper">
                {loadedType === 'image' && <img className="img-preview" src={this.state.currentImg} />}
                {loadedFiles.length === 0 && <p className="file-name">{this.state.imgFileName}</p>}
                {!cantRender && input.value && loadedFiles.length === 0 && (
                    <img className="img-preview" src={this.props.input.value} />
                )}
                {cantRender && input.value && <p>{input.value}</p>}
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
            <div className="input-container">
                <label>
                    <p className="form-field-title">{__(this.props.label)}</p>
                    <div
                        className={`file-container ${this.state.dragging ? 'dragging' : ''} ${this.props.max ? 'input-max' : ''
                            } ${this.props.nomargin ? 'nomargin' : ''} ${errorClass(
                                this.props.meta.error,
                                this.props.meta.touched,
                            )}`}
                    >
                        <span className="input-name">{this.props.placeholder} </span>
                        <div
                            className={`file-wrapper ${this.hasImage() ? 'has-image' : ''}`}
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
                                className={`input input-file ${this.props.max ? 'input-max' : ''} ${this.props.nomargin ? 'nomargin' : ''
                                    }`}
                                id={this.props.input.name}
                                readOnly={this.props.readonly}
                                placeholder={this.props.placeholder}
                                type="file"
                                {...inputCopy}
                                onChange={this.onChange}
                                onBlur={adaptFileEventToValue(inputCopy.onBlur)}
                                onDrop={this.onDrop}
                                onDragEnter={this.onDragEnter}
                                onDragOver={this.onDragEnter}
                                onDragLeave={this.onDragLeave}
                            />
                        </div>
                    </div>
                </label>

                <ul>
                    {loadedFiles.map((file, index) => (
                        <li className="single-selected-file">
                            {typeof file === 'string' && <img
                                className="single-selected-file-preview"
                                src={file}
                            />}
                            <span>{file.name}</span>

                            <Button
                                type="button"
                                small
                                danger
                                text="application.delete"
                                click={(e: MouseEvent<HTMLButtonElement>) => this.deleteSelectedFile(e, index)}
                            />
                        </li>
                    ))}
                </ul>
                {this.props.meta.error && this.props.meta.touched && (
                    <small className="text-danger">{this.props.meta.error}</small>
                )}

            </div>
        );
    }
}
export default FileInput;
