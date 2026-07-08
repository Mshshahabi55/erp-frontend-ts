import { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh, Save, RestartAlt } from '@mui/icons-material';
import { LoadingSpinner } from '@/shared/components';
import type { RolePermissionMap } from '@/shared/rbac';
import { RolePermissionMatrix } from '../components/RolePermissionMatrix/RolePermissionMatrix';
import { useRolePermissions } from '../hooks/useRolePermissions';
import { useUpdateRolePermissions } from '../hooks/useUpdateRolePermissions';

interface RolePermissionEditorProps {
  initialData: RolePermissionMap;
}

// Only ever mounted once initialData is loaded (see below), so draft's
// useState initializer already has real data - no effect needed to sync it
// in after the fact.
const RolePermissionEditor = ({ initialData }: RolePermissionEditorProps) => {
  const [draft, setDraft] = useState<RolePermissionMap>(initialData);
  const updateMutation = useUpdateRolePermissions();

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(draft);

  const handleSave = () => {
    updateMutation.mutate(draft);
  };

  const handleReset = () => {
    setDraft(initialData);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Roles &amp; Permissions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<RestartAlt />}
            onClick={handleReset}
            disabled={!isDirty || updateMutation.isPending}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose what each role can see and do. Changes apply immediately once saved.
      </Typography>

      <RolePermissionMatrix value={draft} onChange={setDraft} disabled={updateMutation.isPending} />
    </Box>
  );
};

export const RolesPermissionsPage = () => {
  const { data, isLoading, error, refetch } = useRolePermissions();

  if (isLoading) {
    return <LoadingSpinner message="Loading role permissions..." />;
  }

  if (error || !data) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()} startIcon={<Refresh />}>
            Retry
          </Button>
        }
      >
        Failed to load role permissions.
      </Alert>
    );
  }

  return <RolePermissionEditor initialData={data} />;
};

export default RolesPermissionsPage;
