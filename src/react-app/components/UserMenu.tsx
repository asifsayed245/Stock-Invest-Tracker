import { useState, useRef, useEffect } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { ChevronDown, User, Settings, CreditCard, LogOut, Crown, Zap } from "lucide-react";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [accountType] = useState<'free' | 'plus' | 'pro'>('free'); // TODO: Get from user data
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getAccountBadge = () => {
    switch (accountType) {
      case 'pro':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
            <Crown className="w-3 h-3 mr-1" />
            Pro
          </span>
        );
      case 'plus':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            Plus
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Free
          </span>
        );
    }
  };

  const getAccountDescription = () => {
    switch (accountType) {
      case 'pro':
        return "Advanced analytics, real-time data, unlimited portfolios";
      case 'plus':
        return "Enhanced features, priority support, portfolio insights";
      default:
        return "Basic portfolio tracking, limited features";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <img
          src={user?.google_user_data.picture || ""}
          alt={user?.google_user_data.name || "User"}
          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
        />
        <div className="hidden md:flex items-center space-x-2">
          <div className="text-left">
            <div className="text-sm font-medium text-slate-700">
              {user?.google_user_data.given_name || user?.email}
            </div>
            <div className="flex items-center space-x-1">
              {getAccountBadge()}
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <img
                src={user?.google_user_data.picture || ""}
                alt={user?.google_user_data.name || "User"}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {user?.google_user_data.name || user?.email}
                </div>
                <div className="text-sm text-slate-500 truncate">
                  {user?.email}
                </div>
                <div className="mt-1">
                  {getAccountBadge()}
                </div>
              </div>
            </div>
          </div>

          {/* Account Type Info */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              Current Plan
            </div>
            <div className="text-sm text-slate-700">
              {getAccountDescription()}
            </div>
            {accountType === 'free' && (
              <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
                Upgrade to Plus →
              </button>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button 
              onClick={() => { navigate("/settings"); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4 mr-3 text-slate-400" />
              Profile Settings
            </button>
            
            <button 
              onClick={() => { navigate("/settings"); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3 text-slate-400" />
              Account Settings
            </button>
            
            <button 
              onClick={() => { navigate("/settings"); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <CreditCard className="w-4 h-4 mr-3 text-slate-400" />
              Billing & Subscription
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
