import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
} from 'react-hook-form';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { currencyFormatter } from '@/shared/utils';
import { calculateLineTotal } from '../../utils/orderCalculations';
import type { OrderFormData } from '../../types/order.schema';
import type { Product } from '@/features/products/types/product.types';

interface OrderItemsEditorProps {
  control: Control<OrderFormData>;
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
  watch: UseFormWatch<OrderFormData>;
  setValue: UseFormSetValue<OrderFormData>;
  products: Product[];
  disabled?: boolean;
}

const EMPTY_ITEM = { productId: '', quantity: 1, unitPrice: 0 };

export const OrderItemsEditor = ({
  control,
  register,
  errors,
  watch,
  setValue,
  products,
  disabled,
}: OrderItemsEditorProps) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');

  const handleProductChange = (index: number, productId: string) => {
    setValue(`items.${index}.productId`, productId, { shouldValidate: true });
    const product = products.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.unitPrice`, product.price, { shouldValidate: true });
    }
  };

  const itemsError = errors.items;
  const rootItemsError = itemsError && !Array.isArray(itemsError) ? itemsError.message : undefined;

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Order Items
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right" sx={{ width: 120 }}>
                Quantity
              </TableCell>
              <TableCell align="right" sx={{ width: 140 }}>
                Unit Price
              </TableCell>
              <TableCell align="right" sx={{ width: 120 }}>
                Line Total
              </TableCell>
              <TableCell align="right" sx={{ width: 60 }}>
                <span className="sr-only">Remove</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, index) => {
              const rowValue = watchedItems?.[index];
              const lineTotal =
                rowValue && typeof rowValue.quantity === 'number' && typeof rowValue.unitPrice === 'number'
                  ? calculateLineTotal(rowValue.quantity, rowValue.unitPrice)
                  : 0;
              const rowErrors = Array.isArray(itemsError) ? itemsError[index] : undefined;

              return (
                <TableRow key={field.id}>
                  <TableCell>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      disabled={disabled}
                      value={rowValue?.productId ?? ''}
                      onChange={(event) => handleProductChange(index, event.target.value)}
                      error={!!rowErrors?.productId}
                      helperText={rowErrors?.productId?.message}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      disabled={disabled}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      error={!!rowErrors?.quantity}
                      helperText={rowErrors?.quantity?.message}
                      slotProps={{ htmlInput: { min: 1 } }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      disabled={disabled}
                      {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      error={!!rowErrors?.unitPrice}
                      helperText={rowErrors?.unitPrice?.message}
                      slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {currencyFormatter.usd(lineTotal)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      disabled={disabled || fields.length === 1}
                      onClick={() => remove(index)}
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {rootItemsError && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
          {rootItemsError}
        </Typography>
      )}

      <Button
        startIcon={<Add />}
        onClick={() => append(EMPTY_ITEM)}
        disabled={disabled}
        sx={{ mt: 2 }}
      >
        Add Item
      </Button>
    </Box>
  );
};
