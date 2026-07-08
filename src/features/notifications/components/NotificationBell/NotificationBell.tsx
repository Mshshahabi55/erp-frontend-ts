import { useState } from 'react';
import { IconButton, Badge, Popover } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { useUnreadNotificationCount } from '../../hooks/useNotifications';
import { NotificationPanel } from '../NotificationPanel/NotificationPanel';

export const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { data: unreadCount } = useUnreadNotificationCount();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleOpen} size="small" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
        <Badge badgeContent={unreadCount ?? 0} color="error" max={99}>
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        slotProps={{ paper: { sx: { width: 380, maxHeight: 480 } } }}
      >
        <NotificationPanel onNavigate={handleClose} />
      </Popover>
    </>
  );
};
