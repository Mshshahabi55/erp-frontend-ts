import { Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { DateRangeFields } from '@/shared/components';
import type { DateRange } from '../../types/report.types';

interface StatusOption {
  value: string;
  label: string;
}

interface ReportDateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  statusOptions: StatusOption[];
}

const ALL_STATUSES = 'all';

export const ReportDateRangeFilter = ({
  dateRange,
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
}: ReportDateRangeFilterProps) => {
  const handleStatusChange = (event: SelectChangeEvent) => {
    onStatusFilterChange(event.target.value);
  };

  return (
    <Box className="no-print" sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <DateRangeFields value={dateRange} onChange={onDateRangeChange} />
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="report-status-filter-label">Status</InputLabel>
        <Select
          labelId="report-status-filter-label"
          label="Status"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <MenuItem value={ALL_STATUSES}>All statuses</MenuItem>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export { ALL_STATUSES as ALL_REPORT_STATUSES };
