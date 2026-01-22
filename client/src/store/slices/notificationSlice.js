import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../apis/api";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/notifications");
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load notifications");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await API.put("/notifications/read-all");
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark read");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    incrementUnread: (state) => {
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.notifications.forEach(n => n.isRead = true);
      });
  },
});

export const { incrementUnread } = notificationSlice.actions;
export default notificationSlice.reducer;