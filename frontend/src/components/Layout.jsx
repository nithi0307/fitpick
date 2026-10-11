import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

/**
 * Shell shared by every signed-in screen. Pages render through <Outlet />,
 * so the shell never imports a page and pages never import the sidebar.
 */
export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
