import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import { getValidNextStatuses } from '../../utils/orderStatusTransitions';
import { getOrderStatusLabel } from '../../utils/orderStatusStyles';
import type { Order, OrderStatus } from '../../types/order.types';

interface OrderStatusDialogProps {
  open: boolean;
  order: Order | null;
  isUpdating: boolean;
  onConfirm: (status: OrderStatus) => void;
  onCancel: () => void;
}

interface StatusPickerProps {
  order: Order;
  isUpdating: boolean;
  onConfirm: (status: OrderStatus) => void;
  onCancel: () => void;
}

// Only ever mounted while the dialog is open (see below), so its own
// selectedStatus state starts fresh on every open - no effect needed to
// reset it back to '' when the dialog reopens for a new selection.
const StatusPicker = ({ order, isUpdating, onConfirm, onCancel }: StatusPickerProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const validNextStatuses = getValidNextStatuses(order.status);

  return (
    <>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Order {order.orderNumber} is currently <strong>{getOrderStatusLabel(order.status)}</strong>.
        </Typography>

        {validNextStatuses.length === 0 ? (
          <Typography variant="body2">This order has no further status transitions available.</Typography>
        ) : (
          <RadioGroup value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as OrderStatus)}>
            {validNextStatuses.map((status) => (
              <FormControlLabel key={status} value={status} control={<Radio />} label={getOrderStatusLabel(status)} />
            ))}
          </RadioGroup>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isUpdating}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isUpdating || !selectedStatus}
          onClick={() => selectedStatus && onConfirm(selectedStatus)}
        >
          {isUpdating ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </>
  );
};

export const OrderStatusDialog = ({ open, order, isUpdating, onConfirm, onCancel }: OrderStatusDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Change Order Status</DialogTitle>
      {open && order && (
        <StatusPicker key={order.id} order={order} isUpdating={isUpdating} onConfirm={onConfirm} onCancel={onCancel} />
      )}
    </Dialog>
  );
};
