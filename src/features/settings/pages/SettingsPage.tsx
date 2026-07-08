import { useState, SyntheticEvent } from 'react';
import { Box, Typography, Tabs, Tab, Alert, Button, Paper, Avatar } from '@mui/material';
import { Refresh, Business } from '@mui/icons-material';
import { LoadingSpinner } from '@/shared/components';
import { FileUploadDialog } from '@/shared/uploads/components/FileUploadDialog/FileUploadDialog';
import { CompanySettingsForm } from '../components/CompanySettingsForm/CompanySettingsForm';
import { ApplicationSettingsForm } from '../components/ApplicationSettingsForm/ApplicationSettingsForm';
import { UserPreferencesForm } from '../components/UserPreferencesForm/UserPreferencesForm';
import { useCompanySettings, useUpdateCompanySettings } from '../hooks/useCompanySettings';
import { useApplicationSettings, useUpdateApplicationSettings } from '../hooks/useApplicationSettings';

type SettingsTab = 'company' | 'application' | 'preferences';

const LOGO_UPLOAD_VALIDATION = {
  maxSizeBytes: 2 * 1024 * 1024,
  acceptedTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
};

const CompanySettingsPanel = () => {
  const { data, isLoading, error, refetch } = useCompanySettings();
  const updateMutation = useUpdateCompanySettings();
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false);

  if (isLoading) {
    return <LoadingSpinner message="Loading company settings..." />;
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
        Failed to load company settings.
      </Alert>
    );
  }

  return (
    <>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={data.logoUrl} variant="rounded" sx={{ width: 64, height: 64 }}>
          <Business />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Company Logo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            PNG, JPEG, SVG, or WebP, up to 2 MB.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => setIsLogoDialogOpen(true)}>
          {data.logoUrl ? 'Change Logo' : 'Upload Logo'}
        </Button>
      </Paper>

      <CompanySettingsForm
        defaultValues={data}
        onSubmit={(formData) => updateMutation.mutateAsync(formData).then(() => undefined)}
        isLoading={updateMutation.isPending}
      />

      <FileUploadDialog
        open={isLogoDialogOpen}
        onClose={() => setIsLogoDialogOpen(false)}
        title="Upload Company Logo"
        validation={LOGO_UPLOAD_VALIDATION}
        onPersist={(dataUrl) => updateMutation.mutateAsync({ logoUrl: dataUrl }).then(() => undefined)}
      />
    </>
  );
};

const ApplicationSettingsPanel = () => {
  const { data, isLoading, error, refetch } = useApplicationSettings();
  const updateMutation = useUpdateApplicationSettings();

  if (isLoading) {
    return <LoadingSpinner message="Loading application settings..." />;
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
        Failed to load application settings.
      </Alert>
    );
  }

  return (
    <ApplicationSettingsForm
      defaultValues={data}
      onSubmit={(formData) => updateMutation.mutateAsync(formData).then(() => undefined)}
      isLoading={updateMutation.isPending}
    />
  );
};

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');

  const handleTabChange = (_event: SyntheticEvent, value: SettingsTab) => {
    setActiveTab(value);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Settings
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }} aria-label="Settings sections">
        <Tab label="Company" value="company" id="settings-tab-company" aria-controls="settings-panel-company" />
        <Tab label="Application" value="application" id="settings-tab-application" aria-controls="settings-panel-application" />
        <Tab label="Preferences" value="preferences" id="settings-tab-preferences" aria-controls="settings-panel-preferences" />
      </Tabs>

      <Box role="tabpanel" id="settings-panel-company" aria-labelledby="settings-tab-company" hidden={activeTab !== 'company'}>
        {activeTab === 'company' && <CompanySettingsPanel />}
      </Box>

      <Box
        role="tabpanel"
        id="settings-panel-application"
        aria-labelledby="settings-tab-application"
        hidden={activeTab !== 'application'}
      >
        {activeTab === 'application' && <ApplicationSettingsPanel />}
      </Box>

      <Box
        role="tabpanel"
        id="settings-panel-preferences"
        aria-labelledby="settings-tab-preferences"
        hidden={activeTab !== 'preferences'}
      >
        {activeTab === 'preferences' && <UserPreferencesForm />}
      </Box>
    </Box>
  );
};

export default SettingsPage;
