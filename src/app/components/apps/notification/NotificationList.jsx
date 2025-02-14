import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import Scrollbar from '../../custom-scroll/Scrollbar';
import notificationService from '@/services/notificationService';
import NotificationListItem from './NotificationListItem';

const NotificationList = ({ showRightSidebar, onNotificationSelect, filters }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeNotificationId, setActiveNotificationId] = useState(null);

  const fetchNotifications = async (appliedFilters = {}) => {
    try {
      const data = await notificationService.getAllNotifications(appliedFilters);
      console.log("Notificações recebidas:", data.results);
      setNotifications(data.results);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  useEffect(() => {
    fetchNotifications(filters);
  }, [filters]);

  const handleNotificationClick = (notification) => {
    setActiveNotificationId(notification.id);
    if (onNotificationSelect) onNotificationSelect(notification);
    if (showRightSidebar) showRightSidebar();
  };

  return (
    <List>
      <Scrollbar sx={{ height: { lg: 'calc(100vh - 100px)', md: '100vh' }, maxHeight: '800px' }}>
        {notifications.map((notification) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
            onClick={() => handleNotificationClick(notification)}
            isSelected={notification.id === activeNotificationId}
          />
        ))}
      </Scrollbar>
    </List>
  );
};

export default NotificationList;
