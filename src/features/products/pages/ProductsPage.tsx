import { useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { Add } from '@mui/icons-material';
import { SearchBar } from '@/shared/components';
import { useDebounce } from '@/shared/hooks';
import { ProductTable } from '../components/ProductTable/ProductTable';
import { ProductFormDialog } from '../components/ProductFormDialog/ProductFormDialog';
import { ProductDeleteDialog } from '../components/ProductDeleteDialog/ProductDeleteDialog';
import { useProducts } from '../hooks/useProducts';
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProductMutations';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { Product, ProductSortField } from '../types/product.types';
import type { ProductFormData } from '../types/product.schema';

const ALL_CATEGORIES = 'all';

export const ProductsPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [sortBy, setSortBy] = useState<ProductSortField>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: categoriesResponse } = useCategories({ isActive: true, limit: 100 });
  const categories = categoriesResponse?.data ?? [];

  const { data: response, isLoading, error, refetch } = useProducts({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    category: categoryFilter === ALL_CATEGORIES ? undefined : categoryFilter,
    sortBy,
    sortDirection,
  });

  const products = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleSortChange = (field: ProductSortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    if (selectedProduct) {
      await updateMutation.mutateAsync({ id: selectedProduct.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await deleteMutation.mutateAsync(selectedProduct.id);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Product
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1, minWidth: 240 }}>
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onClear={() => setSearchInput('')}
            placeholder="Search by name or SKU..."
          />
        </Box>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="product-category-filter-label">Category</InputLabel>
          <Select
            labelId="product-category-filter-label"
            label="Category"
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
          >
            <MenuItem value={ALL_CATEGORIES}>All categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <ProductTable
        products={products}
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

      <ProductFormDialog
        open={isFormOpen}
        product={selectedProduct}
        categories={categories}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <ProductDeleteDialog
        open={isDeleteOpen}
        product={selectedProduct}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default ProductsPage;
