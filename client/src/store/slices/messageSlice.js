import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../apis/api";

export const getConversations = createAsyncThunk(
  "messages/getConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/messages/conversations");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load chats");
    }
  }
);

export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/messages/${conversationId}`);
      return { conversationId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ recipientId, text }, { rejectWithValue }) => {
    try {
      const response = await API.post("/messages", { recipientId, text });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    conversations: [],
    currentChatMessages: [], 
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentChat: (state) => {
      state.currentChatMessages = [];
    },
    addMessageToChat: (state, action) => {
      state.currentChatMessages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Conversations
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      
      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.loading = true; 
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChatMessages = action.payload.messages;
      })

      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const newMessage = action.payload;
        state.currentChatMessages.push(newMessage);
        
        const convIndex = state.conversations.findIndex(c => c._id === newMessage.conversationId);
        if (convIndex !== -1) {
             state.conversations[convIndex].lastMessage = {
                 text: newMessage.text,
                 createdAt: new Date().toISOString(),
                 seen: false
             };
             const conv = state.conversations.splice(convIndex, 1)[0];
             state.conversations.unshift(conv);
        }
      });
  },
});

export const { clearCurrentChat, addMessageToChat } = messageSlice.actions;
export default messageSlice.reducer;