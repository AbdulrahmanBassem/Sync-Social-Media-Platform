import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../apis/api";
import toast from "react-hot-toast";
import { loadUser } from "./authSlice"; 

export const getUserProfile = createAsyncThunk(
  "profile/getUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load profile");
    }
  }
);

export const getUserPosts = createAsyncThunk(
  "profile/getUserPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/users/${userId}/posts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load posts");
    }
  }
);


export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await API.put("/users/profile", userData);
      toast.success("Profile updated!");
      dispatch(loadUser()); 
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "profile/updateProfilePicture",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await API.post("/users/profile/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile picture updated!");
      dispatch(loadUser()); 
      return response.data.profilePic;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null, 
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.posts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Posts
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Update Picture
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.profilePic = action.payload;
        }
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;