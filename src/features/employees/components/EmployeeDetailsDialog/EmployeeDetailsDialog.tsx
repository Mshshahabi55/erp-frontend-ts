import type { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Divider, Typography, Chip } from '@mui/material';
import { dateFormatter } from '@/shared/utils';
import type { Employee } from '../../types/employee.types';

interface EmployeeDetailsDialogProps {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <Stack direction="row" sx={{ justifyContent: 'space-between', py: 1 }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {value}
    </Typography>
  </Stack>
);

export const EmployeeDetailsDialog = ({ open, employee, onClose }: EmployeeDetailsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Employee Details</DialogTitle>
      <DialogContent>
        {employee && (
          <Stack divider={<Divider />}>
            <DetailRow label="Name" value={employee.fullName} />
            <DetailRow label="Email" value={employee.email} />
            <DetailRow label="Phone" value={employee.phone} />
            <DetailRow label="Department" value={employee.department} />
            <DetailRow label="Position" value={employee.position} />
            <DetailRow label="Hire Date" value={dateFormatter.short(employee.hireDate)} />
            <DetailRow
              label="Status"
              value={
                <Chip
                  label={employee.isActive ? 'Active' : 'Inactive'}
                  color={employee.isActive ? 'success' : 'default'}
                  size="small"
                />
              }
            />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
