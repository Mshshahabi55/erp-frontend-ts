import { Typography, Chip, IconButton } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components';
import { dateFormatter } from '@/shared/utils';
import type { Employee, EmployeeSortField } from '../../types/employee.types';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: EmployeeSortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: EmployeeSortField) => void;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  isDeleting: boolean;
}

export const EmployeeTable = ({
  employees,
  isLoading,
  error,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRetry,
  sortBy,
  sortDirection,
  onSortChange,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: EmployeeTableProps) => {
  const columns: Column<Employee>[] = [
    {
      key: 'fullName',
      label: 'Name',
      sortable: true,
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'position', label: 'Position', sortable: true },
    {
      key: 'hireDate',
      label: 'Hire Date',
      sortable: true,
      render: (value: string) => dateFormatter.short(value),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Chip label={value ? 'Active' : 'Inactive'} color={value ? 'success' : 'default'} size="small" />
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <>
          <IconButton size="small" onClick={() => onView(row)} title="View" aria-label={`View ${row.fullName}`}>
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(row)}
            title="Edit"
            aria-label={`Edit ${row.fullName}`}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row)}
            disabled={isDeleting}
            title="Delete"
            aria-label={`Delete ${row.fullName}`}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={employees}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No employees found. Add your first employee!"
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as EmployeeSortField)}
    />
  );
};
