import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Lock, User, LogOut, Building } from "lucide-react";
import { useUser, useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";

const navItems = [
  { id: "/", label: "Home", requiresAuth: false },
  { id: "/About", label: "About", requiresAuth: true },
  { id: "/Contact", label: "Contact", requiresAuth: true },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path, requiresAuth) => {
    if (requiresAuth && !user) {
      navigate("/login");
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-4">
        {/* Logo */}
        <div
          onClick={() => {
            navigate("/");
            setIsOpen(false);
          }}
          className="flex items-center space-x-2 cursor-pointer hover:text-blue-300 transition duration-300 select-none"
          aria-label="Go to home page"
        >
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-md">
            <Building className="w-6 h-6 text-blue-700" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Virtual Tour</h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(({ id, label, requiresAuth }) => {
            const active = location.pathname === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick(id, requiresAuth)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-600/50 hover:text-white text-blue-200"
                } ${requiresAuth && !user ? "opacity-60 cursor-not-allowed" : ""}`}
                disabled={requiresAuth && !user}
                title={requiresAuth && !user ? "Login required" : undefined}
                aria-current={active ? "page" : undefined}
              >
                <span>{label}</span>
                {requiresAuth && !user && <Lock className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>

        {/* User Actions Desktop */}
        <div className="hidden md:flex items-center space-x-6 border-l border-blue-600 pl-6">
          <SignedIn>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-blue-600/70 rounded-lg px-4 py-2 shadow hover:bg-blue-600 transition">
                <User className="w-5 h-5 text-blue-300" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{user?.fullName}</p>
                  <p className="text-xs text-blue-300">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-md font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Sign Up
              </button>
            </div>
          </SignedOut>
        </div>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700 shadow-lg">
          <nav className="px-4 py-5 space-y-3">
            {navItems.map(({ id, label, requiresAuth }) => {
              const active = location.pathname === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id, requiresAuth)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    active ? "bg-blue-600 text-white" : "hover:bg-blue-600/70 text-blue-200"
                  } ${requiresAuth && !user ? "opacity-60 cursor-not-allowed" : ""}`}
                  disabled={requiresAuth && !user}
                  title={requiresAuth && !user ? "Login required" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{label}</span>
                  {requiresAuth && !user && <Lock className="w-5 h-5" />}
                </button>
              );
            })}

            <div className="pt-4 border-t border-blue-700 space-y-3">
              <SignedIn>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3 bg-blue-600/60 rounded-lg px-4 py-3 shadow">
                    <User className="w-5 h-5 text-blue-300" />
                    <div>
                      <p className="text-sm font-semibold">{user?.fullName}</p>
                      <p className="text-xs text-blue-300">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex justify-center items-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </SignedIn>
              <SignedOut>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setIsOpen(false);
                    }}
                    className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Sign Up
                  </button>
                </div>
              </SignedOut>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
