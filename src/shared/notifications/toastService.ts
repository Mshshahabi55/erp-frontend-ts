import toast, { type Toast } from 'react-hot-toast';
import { getErrorMessage } from '@/shared/utils';

const WARNING_STYLE = { border: '1px solid #ed6c02', color: '#ed6c02' };
const INFO_STYLE = { border: '1px solid #0288d1', color: '#0288d1' };

/**
 * The one place that calls react-hot-toast directly. Previously every
 * feature's mutation hooks imported `toast` and `getErrorMessage` separately
 * and repeated `toast.error(getErrorMessage(error, '...'))` themselves (75
 * call sites across 17 files) - that pairing is now baked into notify.error,
 * and warning/info get a consistent look since react-hot-toast has no
 * built-in variant for either.
 */
export const notify = {
  success: (message: string): string => toast.success(message),

  error: (error: unknown, fallbackMessage: string): string =>
    toast.error(getErrorMessage(error, fallbackMessage)),

  warning: (message: string): string => toast(message, { icon: '⚠️', style: WARNING_STYLE }),

  info: (message: string): string => toast(message, { icon: 'ℹ️', style: INFO_STYLE }),

  loading: (message: string): string => toast.loading(message),

  dismiss: (toastId?: string): void => toast.dismiss(toastId),

  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ): Promise<T> => toast.promise(promise, messages),
};

export type { Toast };
