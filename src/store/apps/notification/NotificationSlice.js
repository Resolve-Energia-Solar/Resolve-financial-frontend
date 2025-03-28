import notificationService from '@/services/notificationService';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  selectedNotification: null,
  notificationSearch: '',
  currentFilter: 'Públicas',
};

export const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    getNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    searchNotification: (state, action) => {
      state.notificationSearch = action.payload;
    },
    selectNotification: (state, action) => {
      state.selectedNotification = action.payload;
    },
    starNotification: (state, action) => {
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload
          ? { ...notification, starred: !notification.starred }
          : notification,
      );
    },
    importantNotification: (state, action) => {
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload
          ? { ...notification, important: !notification.important }
          : notification,
      );
    },
    checkNotification: (state, action) => {
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload
          ? { ...notification, checked: !notification.checked }
          : notification,
      );
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload
          ? { ...notification, trash: !notification.trash }
          : notification,
      );
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
  },
});

export const {
  searchNotification,
  selectNotification,
  getNotifications,
  starNotification,
  importantNotification,
  setVisibilityFilter,
  deleteNotification,
  checkNotification,
} = NotificationSlice.actions;

export const fetchNotifications = () => async (dispatch) => {
  try {
    const data = await notificationService.index();
    dispatch(getNotifications(data.results));
  } catch (err) {
    throw new Error(err);
  }
};

export default NotificationSlice.reducer;
