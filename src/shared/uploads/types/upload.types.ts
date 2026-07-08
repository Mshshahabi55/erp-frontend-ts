export type UploadStatus = 'idle' | 'validating' | 'reading' | 'uploading' | 'success' | 'error';

export interface FileValidationRule {
  maxSizeBytes: number;
  acceptedTypes: string[];
}

export interface UploadState {
  status: UploadStatus;
  /** 0-100. Real progress while reading the file (FileReader.onprogress); indeterminate (kept at 100) during the persist step, which has no byte-level progress to report. */
  progress: number;
  error: string | null;
  file: File | null;
  /** The file's data URL once read - used both as the value handed to the caller's persist function and for an image preview. */
  dataUrl: string | null;
  /** True once this file has passed validation - distinguishes "retry-able" read/persist failures from a validation failure, which retrying can't fix (the file itself is the problem). */
  hasPassedValidation: boolean;
}

export const INITIAL_UPLOAD_STATE: UploadState = {
  status: 'idle',
  progress: 0,
  error: null,
  file: null,
  dataUrl: null,
  hasPassedValidation: false,
};
