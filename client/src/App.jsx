import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { loadUser } from "./store/slices/authSlice"; // Import loadUser
import { Spinner } from "react-bootstrap";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

// Placeholder Pages
const Search = () => <h1>Search</h1>;
const Messages = () => <h1>Messages</h1>;
const Notifications = () => <h1>Notifications</h1>;

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { user, token, authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, token, user]);

  if (authLoading && token) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" data-theme={mode} style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Spinner animation="border" variant={mode === 'dark' ? 'light' : 'primary'} />
      </div>
    );
  }

  return (
    <div className="app-container" data-theme={mode}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Protected Routes */}
        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;