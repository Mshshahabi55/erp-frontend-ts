import { Button } from '@mui/material';
import { Print } from '@mui/icons-material';

export const ReportPrintButton = () => {
  return (
    <Button className="no-print" variant="outlined" startIcon={<Print />} onClick={() => window.print()}>
      Print
    </Button>
  );
};
