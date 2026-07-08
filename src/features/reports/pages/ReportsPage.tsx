import { useState, SyntheticEvent } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { SalesReportView } from '../components/SalesReportView/SalesReportView';
import { PurchasesReportView } from '../components/PurchasesReportView/PurchasesReportView';
import { OrdersReportView } from '../components/OrdersReportView/OrdersReportView';

type ReportTab = 'sales' | 'purchases' | 'orders';

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('sales');

  const handleTabChange = (_event: SyntheticEvent, value: ReportTab) => {
    setActiveTab(value);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Reports
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }} className="no-print" aria-label="Report types">
        <Tab label="Sales Report" value="sales" id="report-tab-sales" aria-controls="report-panel-sales" />
        <Tab label="Purchases Report" value="purchases" id="report-tab-purchases" aria-controls="report-panel-purchases" />
        <Tab label="Orders Report" value="orders" id="report-tab-orders" aria-controls="report-panel-orders" />
      </Tabs>

      <Box role="tabpanel" id="report-panel-sales" aria-labelledby="report-tab-sales" hidden={activeTab !== 'sales'}>
        {activeTab === 'sales' && <SalesReportView />}
      </Box>

      <Box
        role="tabpanel"
        id="report-panel-purchases"
        aria-labelledby="report-tab-purchases"
        hidden={activeTab !== 'purchases'}
      >
        {activeTab === 'purchases' && <PurchasesReportView />}
      </Box>

      <Box role="tabpanel" id="report-panel-orders" aria-labelledby="report-tab-orders" hidden={activeTab !== 'orders'}>
        {activeTab === 'orders' && <OrdersReportView />}
      </Box>
    </Box>
  );
};

export default ReportsPage;
