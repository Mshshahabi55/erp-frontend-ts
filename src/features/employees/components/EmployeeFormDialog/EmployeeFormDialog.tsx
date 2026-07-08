import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { EmployeeForm } from '../EmployeeForm/EmployeeForm';
import type { Employee } from '../../types/employee.types';
import type { EmployeeFormData } from '../../types/employee.schema';

interface EmployeeFormDialogProps {
  open: boolean;
  employee: Employee | null;
  isSubmitting: boolean;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onClose: () => void;
}

const toDefaultValues = (employee: Employee): Partial<EmployeeFormData> => ({
  firstName: employee.firstName,
  lastName: employee.lastName,
  email: employee.email,
  phone: employee.phone,
  department: employee.department,
  position: employee.position,
  hireDate: employee.hireDate.slice(0, 10),
  isActive: employee.isActive,
});

export const EmployeeFormDialog = ({ open, employee, isSubmitting, onSubmit, onClose }: EmployeeFormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
      <DialogContent>
        <EmployeeForm
          defaultValues={employee ? toDefaultValues(employee) : undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitText={employee ? 'Update Employee' : 'Save Employee'}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
