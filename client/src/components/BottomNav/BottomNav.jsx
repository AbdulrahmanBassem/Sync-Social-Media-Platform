import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AiFillHome,
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlinePlusSquare,
  AiFillPlusSquare,
  AiOutlineMessage,
  AiFillMessage,
  AiOutlineHeart, 
  AiFillHeart
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { fetchNotifications } from "../../store/slices/notificationSlice";
import { useEffect } from "react";
import "./BottomNav.css";

const BottomNav = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  return (
    <div className="bottom-nav-container">
      <NavLink to="/" className="bottom-nav-link">
        {({ isActive }) =>
          isActive ? <AiFillHome size={26} /> : <AiOutlineHome size={26} />
        }
      </NavLink>

      <NavLink to="/search" className="bottom-nav-link">
        <AiOutlineSearch size={26} />
      </NavLink>

      <NavLink to="/create" className="bottom-nav-link">
        {({ isActive }) =>
          isActive ? (
            <AiFillPlusSquare size={26} />
          ) : (
            <AiOutlinePlusSquare size={26} />
          )
        }
      </NavLink>

      <NavLink to="/messages" className="bottom-nav-link">
        {({ isActive }) =>
          isActive ? (
            <AiFillMessage size={26} />
          ) : (
            <AiOutlineMessage size={26} />
          )
        }
      </NavLink>
      <NavLink to="/notifications" className="bottom-nav-link" style={{ position: "relative" }}>
        {({ isActive }) => (
          <>
            {isActive ? <AiFillHeart size={26} /> : <AiOutlineHeart size={26} />}
            {unreadCount > 0 && <span className="badge-count-mobile">{unreadCount}</span>}
          </>
        )}
      </NavLink>

      <NavLink to={`/profile/${user?._id}`} className="bottom-nav-link">
        <CgProfile size={26} />
      </NavLink>
    </div>
  );
};

export default BottomNav;
