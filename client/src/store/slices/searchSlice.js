import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../apis/api";

// Search Users
export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/users/search?q=${query}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

// Search Posts
export const searchPosts = createAsyncThunk(
  "search/searchPosts",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/posts/search?q=${query}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    userResults: [],
    postResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.userResults = [];
      state.postResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.userResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Posts
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.postResults = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;