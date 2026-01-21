import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import BottomNav from "../BottomNav/BottomNav";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      
      <main className="main-content">
        <Outlet /> 
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;