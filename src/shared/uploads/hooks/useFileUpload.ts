import { useCallback, useRef, useState } from 'react';
import { getErrorMessage } from '@/shared/utils';
import { uploadService } from '../services/uploadService';
import { validateFile } from '../utils/fileValidation';
import { INITIAL_UPLOAD_STATE, type FileValidationRule, type UploadState } from '../types/upload.types';

interface UseFileUploadOptions {
  validation: FileValidationRule;
  /** Persists the read file (e.g. PATCHing a settings record) - this is the step that can genuinely fail over the network and be retried. */
  onPersist: (dataUrl: string, file: File) => Promise<void>;
}

export const useFileUpload = ({ validation, onPersist }: UseFileUploadOptions) => {
  const [state, setState] = useState<UploadState>(INITIAL_UPLOAD_STATE);
  const cancelReadRef = useRef<(() => void) | null>(null);

  const persist = useCallback(
    async (dataUrl: string, file: File) => {
      setState((prev) => ({ ...prev, status: 'uploading', error: null }));
      try {
        await onPersist(dataUrl, file);
        setState((prev) => ({ ...prev, status: 'success' }));
      } catch (error) {
        setState((prev) => ({ ...prev, status: 'error', error: getErrorMessage(error, 'Failed to save the uploaded file.') }));
      }
    },
    [onPersist]
  );

  const readAndPersist = useCallback(
    async (file: File) => {
      setState((prev) => ({ ...prev, status: 'reading', progress: 0, error: null }));

      const { promise, cancel } = uploadService.readFileAsDataUrl(file, (percent) => {
        setState((prev) => ({ ...prev, progress: percent }));
      });
      cancelReadRef.current = cancel;

      let dataUrl: string;
      try {
        dataUrl = await promise;
      } catch (error) {
        setState((prev) => ({ ...prev, status: 'error', error: getErrorMessage(error, 'Failed to read file.') }));
        return;
      }

      setState((prev) => ({ ...prev, dataUrl }));
      await persist(dataUrl, file);
    },
    [persist]
  );

  const selectFile = useCallback(
    (file: File) => {
      setState({ ...INITIAL_UPLOAD_STATE, status: 'validating', file });

      const validationError = validateFile(file, validation);
      if (validationError) {
        setState((prev) => ({ ...prev, status: 'error', error: validationError }));
        return;
      }

      setState((prev) => ({ ...prev, hasPassedValidation: true }));
      readAndPersist(file);
    },
    [validation, readAndPersist]
  );

  // Only meaningful once validation has passed - a validation failure means
  // the file itself is the problem, which re-running the same read/persist
  // steps can't fix (and previously, retrying here skipped validation
  // entirely, risking silently persisting a file that failed size/type
  // checks). The caller should offer "choose a different file" instead.
  const retry = useCallback(() => {
    if (!state.file || !state.hasPassedValidation) return;
    if (state.dataUrl) {
      // Reading already succeeded last time - only the persist step failed.
      persist(state.dataUrl, state.file);
    } else {
      readAndPersist(state.file);
    }
  }, [state.file, state.hasPassedValidation, state.dataUrl, persist, readAndPersist]);

  const cancel = useCallback(() => {
    cancelReadRef.current?.();
    setState(INITIAL_UPLOAD_STATE);
  }, []);

  const reset = useCallback(() => setState(INITIAL_UPLOAD_STATE), []);

  return { state, selectFile, retry, cancel, reset };
};
