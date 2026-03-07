import LeftNavbar from "../component/LeftNavbar";
import TopNavbar from "../component/Navbar";
import { Outlet } from "react-router-dom";
import "../styles/dashboardlayout.scss"

function DashboardLayout() {
  return (
    <div className="app-layout">

      <LeftNavbar />

      <div className="right-section">
        <TopNavbar />

        <div className="main-content">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default DashboardLayout;