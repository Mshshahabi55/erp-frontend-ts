import { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  TextField,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Typography,
  Skeleton,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  People,
  Inventory,
  LocalShipping,
  ShoppingCart,
  PointOfSale,
  ReceiptLong,
  Badge,
  Category,
  Storage,
  ManageAccounts,
} from '@mui/icons-material';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { globalSearchService } from '../../services/globalSearchService';
import type { SearchableEntity, SearchResultItem } from '../../types/search.types';

const ENTITY_ICONS: Record<SearchableEntity, React.ReactNode> = {
  customer: <People fontSize="small" />,
  product: <Inventory fontSize="small" />,
  supplier: <LocalShipping fontSize="small" />,
  order: <ShoppingCart fontSize="small" />,
  sale: <PointOfSale fontSize="small" />,
  purchase: <ReceiptLong fontSize="small" />,
  employee: <Badge fontSize="small" />,
  category: <Category fontSize="small" />,
  warehouse: <Storage fontSize="small" />,
  user: <ManageAccounts fontSize="small" />,
};

const ENTITY_FILTER_OPTIONS = globalSearchService.getEntityLabels();
const LISTBOX_ID = 'global-search-results';
const optionId = (index: number): string => `global-search-option-${index}`;

interface GlobalSearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export const GlobalSearchDialog = ({ open, onClose }: GlobalSearchDialogProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeEntities, setActiveEntities] = useState<SearchableEntity[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const { data, isLoading, error, isSearchable } = useGlobalSearch(
    query,
    activeEntities.length > 0 ? activeEntities : undefined
  );
  const results = data ?? [];

  // Reset the highlight whenever the query changes - whatever was
  // highlighted for the previous search term isn't meaningful anymore.
  // Adjusting state during render (rather than in an effect) avoids an
  // extra render pass for what's ultimately a derived reset.
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setHighlightedIndex(0);
  }

  const handleClose = () => {
    setQuery('');
    setActiveEntities([]);
    setHighlightedIndex(0);
    onClose();
  };

  const handleSelect = (item: SearchResultItem) => {
    navigate(item.path);
    handleClose();
  };

  const toggleEntityFilter = (entity: SearchableEntity) => {
    setActiveEntities((prev) =>
      prev.includes(entity) ? prev.filter((e) => e !== entity) : [...prev, entity]
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = results[highlightedIndex];
      if (selected) handleSelect(selected);
    } else if (event.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { position: 'fixed', top: 80, m: 0 } } }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search customers, products, orders, and more..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
            htmlInput: {
              role: 'combobox',
              'aria-expanded': results.length > 0,
              'aria-controls': LISTBOX_ID,
              'aria-activedescendant': results.length > 0 ? optionId(highlightedIndex) : undefined,
              'aria-autocomplete': 'list',
              'aria-label': 'Global search',
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          {ENTITY_FILTER_OPTIONS.map(({ entity, label }) => (
            <Chip
              key={entity}
              label={label}
              size="small"
              color={activeEntities.includes(entity) ? 'primary' : 'default'}
              variant={activeEntities.includes(entity) ? 'filled' : 'outlined'}
              onClick={() => toggleEntityFilter(entity)}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
        {!isSearchable ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
            Type at least 2 characters to search.
          </Typography>
        ) : isLoading ? (
          <Box sx={{ p: 2 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="text" height={48} />
            ))}
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">Search failed. Try again.</Alert>
          </Box>
        ) : results.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
            No results for &quot;{query}&quot;.
          </Typography>
        ) : (
          <List disablePadding role="listbox" id={LISTBOX_ID} aria-label="Search results">
            {results.map((result, index) => (
              <ListItemButton
                key={`${result.entity}-${result.id}`}
                id={optionId(index)}
                role="option"
                aria-selected={index === highlightedIndex}
                selected={index === highlightedIndex}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{ENTITY_ICONS[result.entity]}</ListItemIcon>
                <ListItemText primary={result.title} secondary={result.subtitle} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Dialog>
  );
};
