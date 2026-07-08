import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { CloudUpload, CheckCircle, Error as ErrorIcon, Close } from '@mui/icons-material';
import { useFileUpload } from '../../hooks/useFileUpload';
import { formatBytes } from '../../utils/fileValidation';
import type { FileValidationRule } from '../../types/upload.types';

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  validation: FileValidationRule;
  onPersist: (dataUrl: string, file: File) => Promise<void>;
  onSuccess?: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  validating: 'Checking file...',
  reading: 'Reading file...',
  uploading: 'Saving...',
};

export const FileUploadDialog = ({ open, onClose, title, validation, onPersist, onSuccess }: FileUploadDialogProps) => {
  const { state, selectFile, retry, cancel, reset } = useFileUpload({ validation, onPersist });
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isBusy = state.status === 'validating' || state.status === 'reading' || state.status === 'uploading';

  const handleClose = () => {
    cancel();
    onClose();
  };

  const handleFilesSelected = (files: FileList | null) => {
    const file = files?.[0];
    if (file) selectFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (!isBusy) handleFilesSelected(event.dataTransfer.files);
  };

  const handleDropZoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleChooseAnother = () => {
    reset();
    inputRef.current?.click();
  };

  const acceptAttr = validation.acceptedTypes.join(',');
  const isImage = state.file?.type.startsWith('image/');

  return (
    <Dialog open={open} onClose={isBusy ? undefined : handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          hidden
          onChange={(event) => handleFilesSelected(event.target.files)}
        />

        {/* Announces status changes for screen reader users without needing focus to move. */}
        <Box role="status" aria-live="polite" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          {state.status === 'error' ? `Error: ${state.error}` : state.status === 'success' ? 'Upload complete' : STATUS_LABELS[state.status] ?? ''}
        </Box>

        {state.status === 'idle' && (
          <Box
            role="button"
            tabIndex={0}
            aria-label="Choose a file to upload, or drag and drop it here"
            onClick={() => inputRef.current?.click()}
            onKeyDown={handleDropZoneKeyDown}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed',
              borderColor: isDragOver ? 'primary.main' : 'divider',
              bgcolor: isDragOver ? 'action.hover' : 'transparent',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
            }}
          >
            <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2">Click to choose a file or drag and drop it here</Typography>
            <Typography variant="caption" color="text.secondary">
              Up to {formatBytes(validation.maxSizeBytes)}
            </Typography>
          </Box>
        )}

        {isBusy && (
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {STATUS_LABELS[state.status]}
            </Typography>
            <LinearProgress
              variant={state.status === 'reading' ? 'determinate' : 'indeterminate'}
              value={state.progress}
            />
          </Box>
        )}

        {state.status === 'error' && (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <ErrorIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2" color="error">
              {state.error}
            </Typography>
          </Box>
        )}

        {state.status === 'success' && (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            {isImage && state.dataUrl ? (
              <Avatar src={state.dataUrl} variant="rounded" sx={{ width: 96, height: 96, mx: 'auto', mb: 2 }} />
            ) : (
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
            )}
            <Typography variant="body2">{state.file?.name} uploaded successfully.</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {isBusy && (
          <Button onClick={cancel} startIcon={<Close />}>
            Cancel
          </Button>
        )}
        {state.status === 'error' && (
          <>
            <Button onClick={handleChooseAnother}>Choose a different file</Button>
            {state.hasPassedValidation && (
              <Button variant="contained" onClick={retry}>
                Retry
              </Button>
            )}
          </>
        )}
        {state.status === 'success' && (
          <Button
            variant="contained"
            onClick={() => {
              onSuccess?.();
              handleClose();
            }}
          >
            Done
          </Button>
        )}
        {state.status === 'idle' && <Button onClick={handleClose}>Cancel</Button>}
      </DialogActions>
    </Dialog>
  );
};
