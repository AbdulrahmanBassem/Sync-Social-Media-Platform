import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../apis/api";
import toast from "react-hot-toast";

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      // const response = await API.post("/posts", postData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      const response = await API.post("/posts", postData);
      toast.success("Post created successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create post");
    }
  }
);

export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await API.get(`/posts?page=${page}&limit=10`);
      return response.data; // { posts, currentPage, totalPages }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load feed");
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await API.put(`/posts/${postId}/like`);
      return { postId, likes: response.data.likes }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to like post");
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await API.delete(`/posts/${postId}`);
      toast.success("Post deleted successfully");
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete post");
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
    createSuccess: false,
    totalPages: 1,
    currentPage: 1,
  },
  reducers: {
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.posts.unshift(action.payload.post);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Feed
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts; 
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likes = likes;
        }
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      });
  },
});

export const { resetCreateSuccess } = postSlice.actions;
export default postSlice.reducer;