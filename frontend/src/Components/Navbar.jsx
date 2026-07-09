import { useState } from "react";
import logo from "../assets/logo.png";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard-admin";
    if (user.role === "professional") return "/dashboard-professional";
    return "/dashboard-user";
  };

  // Determine if the current page has a luxury dark aesthetic
  const isDarkPage = [
    "/signup",
    "/login",
    "/dashboard-user",
    "/dashboard-professional",
    "/dashboard-admin",
  ].some((path) => location.pathname.startsWith(path));

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/stylists", label: "Stylists" },
    { path: "/book-appointment", label: "Book Appointment" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header 
      className="sticky top-0 z-50 transition-all duration-300 w-full"
      style={{
        background: isDarkPage ? "rgba(11, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: isDarkPage ? "1px solid rgba(200, 142, 129, 0.2)" : "1px solid #F2EDE4",
        boxShadow: isDarkPage ? "0 4px 20px rgba(0,0,0,0.4)" : "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
          <img
            className="logo_img h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            src={logo}
            alt="logo"
            style={{ filter: isDarkPage ? "brightness(1.1) contrast(1.1)" : "none" }}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul
            className="flex gap-8 font-semibold text-sm"
            style={{ color: isDarkPage ? "#E5E7EB" : "#374151" }}
          >
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#C88E81] border-b-2 border-[#C88E81] pb-1"
                      : `hover:text-[#C88E81] transition duration-300 ${
                          isDarkPage ? "text-gray-300" : "text-gray-700"
                        }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <Link to={getDashboardPath()}>
                <button
                  className="font-bold border border-[#C88E81] rounded-xl px-5 py-2.5 bg-gradient-to-r from-[#C88E81] to-[#d69f93] text-white hover:from-[#d69f93] hover:to-[#C88E81] hover:scale-105 transition duration-300 cursor-pointer shadow-md text-xs uppercase tracking-wider"
                  style={{ padding: "10px 20px" }}
                >
                  Dashboard
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="font-bold border rounded-xl px-5 py-2.5 hover:scale-105 transition duration-300 cursor-pointer text-xs uppercase tracking-wider"
                style={{
                  background: isDarkPage ? "rgba(255,255,255,0.05)" : "transparent",
                  borderColor: isDarkPage ? "rgba(255,255,255,0.15)" : "#D1D5DB",
                  color: isDarkPage ? "#D1D5DB" : "#374151",
                  padding: "10px 20px",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button
                className="font-bold border border-[#C88E81] rounded-xl px-6 py-2.5 bg-gradient-to-r from-[#C88E81] to-[#d69f93] text-white hover:from-[#d69f93] hover:to-[#C88E81] hover:scale-105 transition duration-300 cursor-pointer shadow-md text-xs uppercase tracking-wider"
                style={{ padding: "10px 22px" }}
              >
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg transition duration-200"
            style={{ color: isDarkPage ? "#E5E7EB" : "#374151" }}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Responsive Drawer) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden absolute top-20 left-0 w-full border-b transition-all duration-300 py-6 px-6 space-y-4"
          style={{
            background: isDarkPage ? "rgba(11, 10, 15, 0.96)" : "rgba(255, 255, 255, 0.98)",
            borderColor: isDarkPage ? "rgba(200, 142, 129, 0.2)" : "#F2EDE4",
            backdropFilter: "blur(20px)",
          }}
        >
          <ul className="flex flex-col gap-4 font-semibold text-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#C88E81] font-bold text-lg block py-2"
                      : `text-sm block py-2 hover:text-[#C88E81] transition duration-200 ${
                          isDarkPage ? "text-gray-300" : "text-gray-700"
                        }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-800/20 dark:border-white/10 flex flex-col gap-3">
            {user ? (
              <>
                <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <button className="w-full font-bold border border-[#C88E81] rounded-xl py-3 bg-gradient-to-r from-[#C88E81] to-[#d69f93] text-white text-xs uppercase tracking-wider shadow">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full font-bold border rounded-xl py-3 text-xs uppercase tracking-wider text-center"
                  style={{
                    background: isDarkPage ? "rgba(255,255,255,0.05)" : "transparent",
                    borderColor: isDarkPage ? "rgba(255,255,255,0.15)" : "#D1D5DB",
                    color: isDarkPage ? "#D1D5DB" : "#374151",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <button className="w-full font-bold border border-[#C88E81] rounded-xl py-3 bg-gradient-to-r from-[#C88E81] to-[#d69f93] text-white text-xs uppercase tracking-wider shadow">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;