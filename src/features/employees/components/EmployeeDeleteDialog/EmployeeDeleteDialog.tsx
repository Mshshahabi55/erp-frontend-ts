import { ConfirmDialog } from '@/shared/components';
import type { Employee } from '../../types/employee.types';

interface EmployeeDeleteDialogProps {
  open: boolean;
  employee: Employee | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const EmployeeDeleteDialog = ({ open, employee, isDeleting, onConfirm, onCancel }: EmployeeDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Employee"
      message={`Are you sure you want to delete "${employee?.fullName}"?`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
