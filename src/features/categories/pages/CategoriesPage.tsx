import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDebounce } from '@/shared/hooks';
import { CategoryFilters, ALL_CATEGORY_STATUSES, type CategoryStatusFilter } from '../components/CategoryFilters/CategoryFilters';
import { CategoryTable } from '../components/CategoryTable/CategoryTable';
import { CategoryFormDialog } from '../components/CategoryFormDialog/CategoryFormDialog';
import { CategoryDeleteDialog } from '../components/CategoryDeleteDialog/CategoryDeleteDialog';
import { useCategories } from '../hooks/useCategories';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategoryMutations';
import type { Category, CategorySortField } from '../types/category.types';
import type { CategoryFormData } from '../types/category.schema';

export const CategoriesPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<CategoryStatusFilter>(ALL_CATEGORY_STATUSES);
  const [sortBy, setSortBy] = useState<CategorySortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: response, isLoading, error, refetch } = useCategories({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    isActive: statusFilter === ALL_CATEGORY_STATUSES ? undefined : statusFilter === 'active',
    sortBy,
    sortDirection,
  });

  const categories = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSortChange = (field: CategorySortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilterChange = (value: CategoryStatusFilter) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    if (selectedCategory) {
      await updateMutation.mutateAsync({ id: selectedCategory.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      await deleteMutation.mutateAsync(selectedCategory.id);
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Categories
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Category
        </Button>
      </Box>

      <CategoryFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchClear={() => setSearchInput('')}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <CategoryTable
        categories={categories}
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

      <CategoryFormDialog
        open={isFormOpen}
        category={selectedCategory}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <CategoryDeleteDialog
        open={isDeleteOpen}
        category={selectedCategory}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default CategoriesPage;
