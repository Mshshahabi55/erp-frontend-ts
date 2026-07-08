import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { Menu as MenuIcon, Logout, Person, Settings, Search } from '@mui/icons-material';
import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NotificationBell } from '@/features/notifications/components/NotificationBell/NotificationBell';
import { useGlobalSearchShortcut } from '@/features/search/hooks/useGlobalSearchShortcut';

// Lazy - GlobalSearchDialog pulls in every feature's service to power
// cross-entity search. Header renders on every authenticated page, so an
// eager import here would ship all of that in the app's main bundle even
// for users who never open search. Only fetched once the dialog is opened.
const GlobalSearchDialog = lazy(() =>
  import('@/features/search/components/GlobalSearchDialog/GlobalSearchDialog').then((module) => ({
    default: module.GlobalSearchDialog,
  }))
);

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
}

export const Header = ({ drawerWidth, onDrawerToggle }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Once true, GlobalSearchDialog stays mounted (so its close transition can
  // still play via the `open` prop) - but this only flips on the *first*
  // open, which is also the first moment its lazy chunk starts loading.
  const [hasOpenedSearch, setHasOpenedSearch] = useState(false);

  const openSearch = () => {
    setHasOpenedSearch(true);
    setIsSearchOpen(true);
  };

  useGlobalSearchShortcut(openSearch);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/settings');
  };

  return (
    <AppBar
      position="fixed"
      className="no-print"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          ERP Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {user?.fullName}
          </Typography>

          <Tooltip title="Search (Ctrl+K)">
            <IconButton onClick={openSearch} size="small" aria-label="Open global search">
              <Search />
            </IconButton>
          </Tooltip>

          <NotificationBell />

          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <Settings sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {hasOpenedSearch && (
        <Suspense fallback={null}>
          <GlobalSearchDialog open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </Suspense>
      )}
    </AppBar>
  );
};