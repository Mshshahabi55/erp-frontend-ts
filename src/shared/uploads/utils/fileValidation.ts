import type { FileValidationRule } from '../types/upload.types';

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Returns an error message if the file fails validation, or null if it's acceptable. */
export const validateFile = (file: File, rule: FileValidationRule): string | null => {
  if (!rule.acceptedTypes.includes(file.type)) {
    return `"${file.name}" isn't a supported file type. Accepted: ${rule.acceptedTypes.join(', ')}.`;
  }

  if (file.size > rule.maxSizeBytes) {
    return `"${file.name}" is ${formatBytes(file.size)}, which exceeds the ${formatBytes(rule.maxSizeBytes)} limit.`;
  }

  return null;
};
