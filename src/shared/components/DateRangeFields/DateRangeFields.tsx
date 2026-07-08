import { TextField } from '@mui/material';
import type { DateRange } from '@/shared/types';

interface DateRangeFieldsProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  disabled?: boolean;
}

/** The paired "From"/"To" date inputs shared by any feature that filters a list by date range (Reports, Audit Logs). */
export const DateRangeFields = ({ value, onChange, disabled }: DateRangeFieldsProps) => (
  <>
    <TextField
      label="From"
      type="date"
      size="small"
      value={value.from}
      onChange={(event) => onChange({ ...value, from: event.target.value })}
      disabled={disabled}
      slotProps={{ inputLabel: { shrink: true } }}
    />
    <TextField
      label="To"
      type="date"
      size="small"
      value={value.to}
      onChange={(event) => onChange({ ...value, to: event.target.value })}
      disabled={disabled}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  </>
);
