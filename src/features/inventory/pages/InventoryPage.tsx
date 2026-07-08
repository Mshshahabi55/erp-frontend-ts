import { useState, SyntheticEvent } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { StockListView } from '../components/StockListView/StockListView';
import { StockMovementsView } from '../components/StockMovementsView/StockMovementsView';

type InventoryTab = 'stock-list' | 'stock-movements';

export const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('stock-list');

  const handleTabChange = (_event: SyntheticEvent, value: InventoryTab) => {
    setActiveTab(value);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Inventory
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }} aria-label="Inventory views">
        <Tab label="Stock List" value="stock-list" id="inventory-tab-stock-list" aria-controls="inventory-panel-stock-list" />
        <Tab
          label="Stock Movements"
          value="stock-movements"
          id="inventory-tab-stock-movements"
          aria-controls="inventory-panel-stock-movements"
        />
      </Tabs>

      <Box
        role="tabpanel"
        id="inventory-panel-stock-list"
        aria-labelledby="inventory-tab-stock-list"
        hidden={activeTab !== 'stock-list'}
      >
        {activeTab === 'stock-list' && <StockListView />}
      </Box>

      <Box
        role="tabpanel"
        id="inventory-panel-stock-movements"
        aria-labelledby="inventory-tab-stock-movements"
        hidden={activeTab !== 'stock-movements'}
      >
        {activeTab === 'stock-movements' && <StockMovementsView />}
      </Box>
    </Box>
  );
};

export default InventoryPage;
