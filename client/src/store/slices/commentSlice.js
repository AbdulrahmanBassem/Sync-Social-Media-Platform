import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../apis/api";
import toast from "react-hot-toast";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/comments/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load comments");
    }
  }
);

// Add Comment
export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const response = await API.post("/comments", { postId, text });
      toast.success("Comment added");
      return response.data.comment;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete Comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await API.delete(`/comments/${commentId}`);
      toast.success("Comment deleted");
      return commentId;
    } catch (error) {
      toast.error("Failed to delete comment");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload); 
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c._id !== action.payload);
      });
  },
});

export default commentSlice.reducer;