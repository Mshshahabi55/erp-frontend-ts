import { Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { SearchBar, DateRangeFields } from '@/shared/components';
import type { DateRange } from '@/shared/types';
import { AUDIT_ACTIONS, AUDIT_RESOURCES, type AuditAction, type AuditResource } from '../../types/auditLog.types';
import { getAuditActionLabel } from '../../utils/auditActionStyles';

export type AuditActionFilter = AuditAction | 'all';
export type AuditResourceFilter = AuditResource | 'all';

// Not annotated with the wide filter types - that would stop the
// `x === ALL_AUDIT_ACTIONS ? undefined : x` ternaries from narrowing 'all' out.
export const ALL_AUDIT_ACTIONS = 'all';
export const ALL_AUDIT_RESOURCES = 'all';

interface AuditLogFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  actionFilter: AuditActionFilter;
  onActionFilterChange: (value: AuditActionFilter) => void;
  resourceFilter: AuditResourceFilter;
  onResourceFilterChange: (value: AuditResourceFilter) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const AuditLogFilters = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  actionFilter,
  onActionFilterChange,
  resourceFilter,
  onResourceFilterChange,
  dateRange,
  onDateRangeChange,
}: AuditLogFiltersProps) => {
  const handleActionChange = (event: SelectChangeEvent<AuditActionFilter>) => {
    onActionFilterChange(event.target.value as AuditActionFilter);
  };

  const handleResourceChange = (event: SelectChangeEvent<AuditResourceFilter>) => {
    onResourceFilterChange(event.target.value as AuditResourceFilter);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flexGrow: 1, minWidth: 240 }}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search by user or description..."
        />
      </Box>

      <DateRangeFields value={dateRange} onChange={onDateRangeChange} />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="audit-action-filter-label">Action</InputLabel>
        <Select labelId="audit-action-filter-label" label="Action" value={actionFilter} onChange={handleActionChange}>
          <MenuItem value={ALL_AUDIT_ACTIONS}>All actions</MenuItem>
          {AUDIT_ACTIONS.map((action) => (
            <MenuItem key={action} value={action}>
              {getAuditActionLabel(action)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="audit-resource-filter-label">Resource</InputLabel>
        <Select labelId="audit-resource-filter-label" label="Resource" value={resourceFilter} onChange={handleResourceChange}>
          <MenuItem value={ALL_AUDIT_RESOURCES}>All resources</MenuItem>
          {AUDIT_RESOURCES.map((resource) => (
            <MenuItem key={resource} value={resource}>
              {resource}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
