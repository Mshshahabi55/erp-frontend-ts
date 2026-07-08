import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { employeeService } from '../services/employeeService';
import { employeeKeys } from './useEmployees';
import type { EmployeeFormData } from '../types/employee.schema';

const toFullName = (data: Pick<EmployeeFormData, 'firstName' | 'lastName'>): string =>
  `${data.firstName} ${data.lastName}`;

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeFormData) =>
      employeeService.create({ ...data, fullName: toFullName(data) }),
    onSuccess: (employee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      notify.success(`Employee "${employee.fullName}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create employee');
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) =>
      employeeService.update(id, { ...data, fullName: toFullName(data) }),
    onSuccess: (employee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      notify.success(`Employee "${employee.fullName}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update employee');
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      notify.success('Employee deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete employee');
    },
  });
};
