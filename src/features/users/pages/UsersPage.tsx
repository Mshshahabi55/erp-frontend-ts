import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDebounce } from '@/shared/hooks';
import { UserFilters, ALL_USER_ROLES, ALL_USER_STATUSES, type UserRoleFilter, type UserStatusFilter } from '../components/UserFilters/UserFilters';
import { UserTable } from '../components/UserTable/UserTable';
import { UserFormDialog } from '../components/UserFormDialog/UserFormDialog';
import { UserDeleteDialog } from '../components/UserDeleteDialog/UserDeleteDialog';
import { useUsers } from '../hooks/useUsers';
import { useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUserMutations';
import type { User, UserSortField } from '../types/user.types';
import type { CreateUserFormData, UpdateUserFormData } from '../types/user.schema';

export const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>(ALL_USER_ROLES);
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>(ALL_USER_STATUSES);
  const [sortBy, setSortBy] = useState<UserSortField>('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: response, isLoading, error, refetch } = useUsers({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    role: roleFilter === ALL_USER_ROLES ? undefined : roleFilter,
    isActive: statusFilter === ALL_USER_STATUSES ? undefined : statusFilter === 'active',
    sortBy,
    sortDirection,
  });

  const users = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSortChange = (field: UserSortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleRoleFilterChange = (value: UserRoleFilter) => {
    setRoleFilter(value);
    setPage(0);
  };

  const handleStatusFilterChange = (value: UserStatusFilter) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleCreateSubmit = async (data: CreateUserFormData) => {
    await createMutation.mutateAsync(data);
    setIsFormOpen(false);
  };

  const handleUpdateSubmit = async (data: UpdateUserFormData) => {
    if (selectedUser) {
      await updateMutation.mutateAsync({ id: selectedUser.id, data });
      setIsFormOpen(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      await deleteMutation.mutateAsync(selectedUser.id);
      setIsDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Users
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add User
        </Button>
      </Box>

      <UserFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchClear={() => setSearchInput('')}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <UserTable
        users={users}
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      <UserFormDialog
        open={isFormOpen}
        user={selectedUser}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onCreate={handleCreateSubmit}
        onUpdate={handleUpdateSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <UserDeleteDialog
        open={isDeleteOpen}
        user={selectedUser}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default UsersPage;
