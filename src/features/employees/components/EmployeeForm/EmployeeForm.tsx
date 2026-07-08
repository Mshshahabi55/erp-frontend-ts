import { CrudForm, CrudFieldOption } from '@/shared/components';
import { employeeFormSchema, EmployeeFormData } from '../../types/employee.schema';
import { DEPARTMENTS } from '../../types/employee.types';

const DEPARTMENT_OPTIONS: CrudFieldOption[] = DEPARTMENTS.map((department) => ({
  value: department,
  label: department,
}));

interface EmployeeFormProps {
  defaultValues?: Partial<EmployeeFormData>;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const EmployeeForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Save Employee',
  onCancel,
}: EmployeeFormProps) => {
  return (
    <CrudForm<EmployeeFormData>
      schema={employeeFormSchema}
      defaultValues={{ isActive: true, ...defaultValues }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText={submitText}
      title="Employee Information"
      fields={[
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          gridSize: 6,
          required: true,
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'department',
          label: 'Department',
          type: 'select',
          gridSize: 6,
          required: true,
          options: DEPARTMENT_OPTIONS,
        },
        {
          name: 'position',
          label: 'Position',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'hireDate',
          label: 'Hire Date',
          type: 'date',
          gridSize: 6,
          required: true,
        },
        {
          name: 'isActive',
          label: 'Active Employee',
          type: 'switch',
          gridSize: 12,
        },
      ]}
    />
  );
};
