type ChipColor = 'warning' | 'success' | 'info' | 'error' | 'default';

export const getStatusColor = (status: string): ChipColor => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'completed':
      return 'success';
    case 'shipped':
      return 'info';
    case 'cancelled':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'completed':
      return 'Completed';
    case 'shipped':
      return 'Shipped';
    case 'cancelled':
      return 'Cancelled';
    case 'warning':
      return 'Warning';
    default:
      return status;
  }
};
