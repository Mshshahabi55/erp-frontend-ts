import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDebounce } from '@/shared/hooks';
import {
  EmployeeFilters,
  ALL_EMPLOYEE_STATUSES,
  ALL_DEPARTMENTS,
  type EmployeeStatusFilter,
  type EmployeeDepartmentFilter,
} from '../components/EmployeeFilters/EmployeeFilters';
import { EmployeeTable } from '../components/EmployeeTable/EmployeeTable';
import { EmployeeFormDialog } from '../components/EmployeeFormDialog/EmployeeFormDialog';
import { EmployeeDetailsDialog } from '../components/EmployeeDetailsDialog/EmployeeDetailsDialog';
import { EmployeeDeleteDialog } from '../components/EmployeeDeleteDialog/EmployeeDeleteDialog';
import { useEmployees } from '../hooks/useEmployees';
import { useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../hooks/useEmployeeMutations';
import type { Employee, EmployeeSortField } from '../types/employee.types';
import type { EmployeeFormData } from '../types/employee.schema';

export const EmployeesPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<EmployeeDepartmentFilter>(ALL_DEPARTMENTS);
  const [statusFilter, setStatusFilter] = useState<EmployeeStatusFilter>(ALL_EMPLOYEE_STATUSES);
  const [sortBy, setSortBy] = useState<EmployeeSortField>('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: response, isLoading, error, refetch } = useEmployees({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    department: departmentFilter === ALL_DEPARTMENTS ? undefined : departmentFilter,
    isActive: statusFilter === ALL_EMPLOYEE_STATUSES ? undefined : statusFilter === 'active',
    sortBy,
    sortDirection,
  });

  const employees = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const handleSortChange = (field: EmployeeSortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleDepartmentFilterChange = (value: EmployeeDepartmentFilter) => {
    setDepartmentFilter(value);
    setPage(0);
  };

  const handleStatusFilterChange = (value: EmployeeStatusFilter) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleFormSubmit = async (data: EmployeeFormData) => {
    if (selectedEmployee) {
      await updateMutation.mutateAsync({ id: selectedEmployee.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee) {
      await deleteMutation.mutateAsync(selectedEmployee.id);
      setIsDeleteOpen(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Employees
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Employee
        </Button>
      </Box>

      <EmployeeFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchClear={() => setSearchInput('')}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={handleDepartmentFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRetry={refetch}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      <EmployeeFormDialog
        open={isFormOpen}
        employee={selectedEmployee}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <EmployeeDetailsDialog open={isDetailsOpen} employee={selectedEmployee} onClose={() => setIsDetailsOpen(false)} />

      <EmployeeDeleteDialog
        open={isDeleteOpen}
        employee={selectedEmployee}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default EmployeesPage;
