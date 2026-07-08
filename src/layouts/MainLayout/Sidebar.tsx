import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { navigationConfig, type NavItem, type NavLeafItem, type NavGroupItem } from '@/config/navigation.config';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const isPathActive = (pathname: string, path: string): boolean =>
  pathname === path || pathname.startsWith(`${path}/`);

/** The group whose child route is currently active, if any - used both to auto-expand on navigation and to seed initial state. */
const findActiveGroupLabel = (pathname: string): string | null => {
  for (const item of navigationConfig) {
    if (item.type === 'group' && item.children.some((child) => isPathActive(pathname, child.path))) {
      return item.label;
    }
  }
  return null;
};

const groupPanelId = (label: string): string => `nav-group-panel-${label.toLowerCase().replace(/\s+/g, '-')}`;

export const Sidebar = ({ drawerWidth, mobileOpen, onDrawerToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();

  // Accordion behavior: exactly one group open at a time, so "collapse
  // inactive groups" holds by construction rather than needing separate
  // per-group bookkeeping.
  const [expandedGroup, setExpandedGroup] = useState<string | null>(() => findActiveGroupLabel(location.pathname));

  // Re-derive the expanded group when the route changes, without an effect
  // (which would cause an extra render pass) - this is React's documented
  // pattern for adjusting state during render in response to a prop change:
  // track the previous trigger value, and if it differs, update state right
  // here rather than after the fact in useEffect.
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    const activeGroup = findActiveGroupLabel(location.pathname);
    if (activeGroup) {
      setExpandedGroup(activeGroup);
    }
  }

  const isLeafVisible = (item: NavLeafItem): boolean =>
    !item.requiredPermission || hasPermission(item.requiredPermission);

  const visibleItems: NavItem[] = navigationConfig.reduce<NavItem[]>((acc, item) => {
    if (item.type === 'divider') {
      acc.push(item);
      return acc;
    }
    if (item.type === 'link') {
      if (isLeafVisible(item)) acc.push(item);
      return acc;
    }
    // group
    const visibleChildren = item.children.filter(isLeafVisible);
    if (visibleChildren.length > 0) {
      acc.push({ ...item, children: visibleChildren });
    }
    return acc;
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      onDrawerToggle();
    }
  };

  const handleGroupToggle = (label: string) => {
    setExpandedGroup((prev) => (prev === label ? null : label));
  };

  const renderLeaf = (item: NavLeafItem, indent: boolean) => {
    const active = isPathActive(location.pathname, item.path);
    return (
      <ListItemButton
        key={item.path}
        onClick={() => handleNavigate(item.path)}
        selected={active}
        aria-current={active ? 'page' : undefined}
        sx={indent ? { pl: 4 } : undefined}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    );
  };

  const renderGroup = (item: NavGroupItem) => {
    const isExpanded = expandedGroup === item.label;
    const panelId = groupPanelId(item.label);

    return (
      <Box key={item.label}>
        <ListItemButton
          onClick={() => handleGroupToggle(item.label)}
          aria-expanded={isExpanded}
          aria-controls={panelId}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding id={panelId} aria-label={`${item.label} pages`}>
            {item.children.map((child) => renderLeaf(child, true))}
          </List>
        </Collapse>
      </Box>
    );
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          ERP System
        </Typography>
      </Toolbar>
      <Divider />
      <List component="nav" aria-label="Main navigation">
        {visibleItems.map((item, index) => {
          if (item.type === 'divider') {
            return <Divider key={`divider-${index}`} sx={{ my: 1 }} />;
          }
          if (item.type === 'group') {
            return renderGroup(item);
          }
          return renderLeaf(item, false);
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      className="no-print"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
