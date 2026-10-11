import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wardrobe from "./pages/Wardrobe";
import AddClothing from "./pages/AddClothing";
import OutfitBuilder from "./pages/OutfitBuilder";
import Profile from "./pages/Profile";

/**
 * Route table. Login stands alone; every other screen is nested inside
 * Layout and therefore gets the sidebar automatically.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/add-clothing" element={<AddClothing />} />
          <Route path="/outfit-builder" element={<OutfitBuilder />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
