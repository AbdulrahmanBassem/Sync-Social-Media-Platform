import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiFillHome, AiOutlineHome, AiOutlineSearch, AiOutlinePlusSquare, AiFillPlusSquare, AiOutlineMessage, AiFillMessage } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import "./BottomNav.css";

const BottomNav = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bottom-nav-container">
      <NavLink to="/" className="bottom-nav-link">
        {({ isActive }) => (isActive ? <AiFillHome size={26} /> : <AiOutlineHome size={26} />)}
      </NavLink>

      <NavLink to="/search" className="bottom-nav-link">
        <AiOutlineSearch size={26} />
      </NavLink>

      <NavLink to="/create" className="bottom-nav-link">
        {({ isActive }) => (isActive ? <AiFillPlusSquare size={26} /> : <AiOutlinePlusSquare size={26} />)}
      </NavLink>

      <NavLink to="/messages" className="bottom-nav-link">
        {({ isActive }) => (isActive ? <AiFillMessage size={26} /> : <AiOutlineMessage size={26} />)}
      </NavLink>

      <NavLink to={`/profile/${user?._id}`} className="bottom-nav-link">
        <CgProfile size={26} />
      </NavLink>
    </div>
  );
};

export default BottomNav;