import { Typography, Chip, IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components';
import type { User, UserRole, UserSortField } from '../../types/user.types';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: UserSortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: UserSortField) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isDeleting: boolean;
}

const roleColors: Record<UserRole, 'error' | 'primary' | 'default'> = {
  admin: 'error',
  manager: 'primary',
  staff: 'default',
};

export const UserTable = ({
  users,
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
  onEdit,
  onDelete,
  isDeleting,
}: UserTableProps) => {
  const columns: Column<User>[] = [
    {
      key: 'fullName',
      label: 'Name',
      sortable: true,
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'roles',
      label: 'Roles',
      render: (value: UserRole[]) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {value.map((role) => (
            <Chip key={role} label={role} color={roleColors[role]} size="small" />
          ))}
        </Box>
      ),
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
      data={users}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No users found. Create your first user!"
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as UserSortField)}
    />
  );
};
