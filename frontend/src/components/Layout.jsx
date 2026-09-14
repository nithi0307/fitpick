import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// Shared shell for every authenticated page. The page itself is
// rendered through <Outlet />, so pages never know about the sidebar
// or navbar and the shell never knows about page content.
export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
