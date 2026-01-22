import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { toggleTheme } from "../../store/slices/themeSlice";
import {
  AiFillHome,
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineMessage,
  AiFillMessage,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlinePlusSquare,
  AiFillPlusSquare,
} from "react-icons/ai";
import { BsSun, BsMoon } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import { fetchNotifications } from "../../store/slices/notificationSlice";
import "./Sidebar.css";
import { useEffect } from "react";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        <h2 className="sidebar-brand">Sync</h2>

        <nav className="sidebar-nav">
          <NavLink to="/" className="sidebar-link">
            {({ isActive }) => (
              <>
                {isActive ? (
                  <AiFillHome size={28} />
                ) : (
                  <AiOutlineHome size={28} />
                )}
                <span className="link-text">Home</span>
              </>
            )}
          </NavLink>

          <NavLink to="/search" className="sidebar-link">
            <AiOutlineSearch size={28} />
            <span className="link-text">Search</span>
          </NavLink>

          <NavLink to="/messages" className="sidebar-link">
            {({ isActive }) => (
              <>
                {isActive ? (
                  <AiFillMessage size={28} />
                ) : (
                  <AiOutlineMessage size={28} />
                )}
                <span className="link-text">Messages</span>
              </>
            )}
          </NavLink>

          <NavLink to="/notifications" className="sidebar-link">
            {({ isActive }) => (
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isActive ? (
                  <AiFillHeart size={28} />
                ) : (
                  <AiOutlineHeart size={28} />
                )}
                <span className="link-text ms-3">Notifications</span>
                {unreadCount > 0 && (
                  <span className="badge-count">{unreadCount}</span>
                )}
              </div>
            )}
          </NavLink>

          <NavLink to="/create" className="sidebar-link">
            {({ isActive }) => (
              <>
                {isActive ? (
                  <AiFillPlusSquare size={28} />
                ) : (
                  <AiOutlinePlusSquare size={28} />
                )}
                <span className="link-text">Create</span>
              </>
            )}
          </NavLink>

          <NavLink to={`/profile/${user?._id}`} className="sidebar-link">
            <CgProfile size={28} />
            <span className="link-text">Profile</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div
            className="sidebar-link"
            onClick={() => dispatch(toggleTheme())}
            style={{ cursor: "pointer" }}
          >
            {mode === "light" ? <BsMoon size={26} /> : <BsSun size={26} />}
            <span className="link-text">Switch Appearance</span>
          </div>

          <div
            className="sidebar-link logout-btn"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <BiLogOut size={28} />
            <span className="link-text">Log out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
