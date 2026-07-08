export const DEPARTMENTS = [
  'Sales',
  'Warehouse',
  'Procurement',
  'Finance',
  'IT',
  'HR',
  'Customer Support',
  'Operations',
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  department: Department;
  position: string;
  isActive: boolean;
  hireDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  department: Department;
  position: string;
  isActive: boolean;
  hireDate: string;
}

export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  department?: Department;
  position?: string;
  isActive?: boolean;
  hireDate?: string;
}

export type EmployeeSortField = 'fullName' | 'department' | 'position' | 'hireDate';

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: Department;
  isActive?: boolean;
  sortBy?: EmployeeSortField;
  sortDirection?: 'asc' | 'desc';
}
