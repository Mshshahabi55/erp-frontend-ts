import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { employeeService } from '../services/employeeService';
import type { EmployeeQueryParams } from '../types/employee.types';

export const employeeKeys = createQueryKeyFactory<EmployeeQueryParams>('employees');

export const useEmployees = (params?: EmployeeQueryParams) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeeService.getAll(params),
  });
};
