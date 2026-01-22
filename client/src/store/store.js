import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import postReducer from "./slices/postSlice";
import profileReducer from "./slices/profileSlice";
import searchReducer from "./slices/searchSlice";
import messageReducer from "./slices/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    posts: postReducer,
    profile: profileReducer,
    search: searchReducer,
    messages: messageReducer,
  },
});