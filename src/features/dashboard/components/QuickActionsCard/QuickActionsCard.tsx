import { Paper, Typography, Grid, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { quickActions } from '../../constants/quickActions';

export const QuickActionsCard = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={1}>
        {quickActions.map((action) => (
          <Grid size={{ xs: 6 }} key={action.path}>
            <ButtonBase
              onClick={() => navigate(action.path)}
              aria-label={action.label}
              sx={{
                width: '100%',
                borderRadius: 2,
                display: 'block',
              }}
            >
              <Paper
                sx={{
                  width: '100%',
                  p: 1.5,
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {action.label}
                </Typography>
              </Paper>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
