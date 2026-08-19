import { Outlet } from "react-router-dom";
import Footer from "../components/site/Footer";
import Navbar from "../components/site/Navbar";
import AIChatbot from "../components/site/AIChatbot";

function SiteLayout() {
  return (
    <div className="d-flex min-vh-100 flex-column">
      <Navbar />

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}

export default SiteLayout;
