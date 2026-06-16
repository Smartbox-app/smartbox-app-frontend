import React, {
  DragEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button } from '../../Branded/Button';
import { ButtonsContainer } from '../../Layout';
import { StyledFieldContainer } from '../input-styled';
import { __ } from '../../../helpers/i18n';
import '../FileInput/FileInput.scss';

interface LogoFileInputProps {
  label?: string;
  accept?: string;
  previewUrl?: string | null;
  value?: File | string | null;
  onChange?: (value: File | '' | null) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  error?: string | null;
  touched?: boolean;
  input?: {
    name?: string;
    id?: string;
    value?: File | string | null;
    onChange?: (value: File | '' | null) => void;
    onBlur?: (...args: unknown[]) => void;
  };
  meta?: {
    error?: string | null;
    touched?: boolean;
  };
}

const LogoFileInput = ({
  label,
  accept = '.jpg,.jpeg,.png',
  previewUrl,
  value,
  onChange,
  onBlur,
  name,
  id,
  error,
  touched,
  input,
  meta,
}: LogoFileInputProps) => {
  const generatedId = useId();
  const inputId = id ?? input?.id ?? name ?? input?.name ?? generatedId;
  const fieldValue = value ?? input?.value ?? null;
  const handleChange = onChange ?? input?.onChange;
  const handleBlur = onBlur ?? input?.onBlur;
  const fieldError = error ?? meta?.error;
  const fieldTouched = touched ?? meta?.touched ?? false;
  const [dragging, setDragging] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const releaseObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const setPreviewFromFile = useCallback(
    (file: File) => {
      releaseObjectUrl();
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      setLocalPreviewUrl(objectUrl);
    },
    [releaseObjectUrl],
  );

  useEffect(() => {
    if (fieldValue instanceof File) {
      setPreviewFromFile(fieldValue);
      return;
    }

    releaseObjectUrl();
    setLocalPreviewUrl(null);
  }, [fieldValue, releaseObjectUrl, setPreviewFromFile]);

  useEffect(() => () => releaseObjectUrl(), [releaseObjectUrl]);

  const resolvedPreviewUrl = useMemo(() => {
    if (localPreviewUrl) return localPreviewUrl;

    if (typeof fieldValue === 'string' && fieldValue) {
      return fieldValue;
    }

    return previewUrl ?? null;
  }, [fieldValue, localPreviewUrl, previewUrl]);

  const hasPreview = Boolean(resolvedPreviewUrl);

  const applyFile = (file?: File | null) => {
    if (!file || !handleChange) return;
    handleChange(file);
    setPreviewFromFile(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    applyFile(event.dataTransfer.files?.[0]);
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    releaseObjectUrl();
    setLocalPreviewUrl(null);
    handleChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <StyledFieldContainer>
      <label htmlFor={inputId}>
        {label ? <p className="form-field-title">{__(label)}</p> : null}
        <div className={`file-container ${dragging ? 'dragging' : ''}`}>
          <div
            className={`file-wrapper ${hasPreview ? 'has-image' : ''}`}
            onClick={openFilePicker}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            {hasPreview ? (
              <div className="img-preview-wrapper">
                <img
                  className="img-preview"
                  src={resolvedPreviewUrl ?? undefined}
                  alt=""
                />
              </div>
            ) : (
              <div>
                <span className="file-input-icon fa fa-plus" />
                <p>{__('application.selectOrDragFile')}</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              accept={accept}
              className="input-file"
              id={inputId}
              name={name ?? input?.name}
              type="file"
              onBlur={handleBlur}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </label>

      {hasPreview && fieldValue ? (
        <ButtonsContainer>
          <Button
            text="application.delete"
            danger
            type="button"
            click={handleDelete}
          />
        </ButtonsContainer>
      ) : null}

      {fieldError && fieldTouched ? (
        <small className="text-danger">{fieldError}</small>
      ) : null}
    </StyledFieldContainer>
  );
};

export { LogoFileInput };
