import { useState } from "react";
import Layout from "@/react-app/components/Layout";
import { useAuth } from "@getmocha/users-service/react";
import { User, Download, Trash2, CreditCard, Shield } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    dividends: true,
    priceAlerts: false
  });

  const currencies = [
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' }
  ];

  const timezones = [
    { value: 'Asia/Kolkata', name: 'India Standard Time (IST)' },
    { value: 'America/New_York', name: 'Eastern Time (ET)' },
    { value: 'America/Los_Angeles', name: 'Pacific Time (PT)' },
    { value: 'Europe/London', name: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Berlin', name: 'Central European Time (CET)' }
  ];

  const handleSaveSettings = () => {
    // Implement settings save
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    // Implement data export
    alert('Data export started. You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion
      alert('Account deletion request submitted.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your account preferences and data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={user?.google_user_data.picture || ""}
                    alt={user?.google_user_data.name || "User"}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-slate-900">{user?.google_user_data.name}</h3>
                    <p className="text-slate-500">{user?.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Base Currency
                    </label>
                    <select
                      value={baseCurrency}
                      onChange={(e) => setBaseCurrency(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Notification Preferences
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                  { key: 'dividends', label: 'Dividend Alerts', description: 'Notify when dividends are received' },
                  { key: 'priceAlerts', label: 'Price Alerts', description: 'Notify on significant price changes' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{item.label}</h4>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications(prev => ({
                          ...prev,
                          [item.key]: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Data Management
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">Export Data</h4>
                    <p className="text-sm text-slate-500">Download all your portfolio data</p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div>
                    <h4 className="font-medium text-red-600">Delete Account</h4>
                    <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Current Plan
                </h2>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600 mb-4">
                    Free Plan
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Free</h3>
                  <p className="text-slate-600 text-sm mb-6">
                    Basic portfolio tracking with limited features
                  </p>
                  
                  <div className="space-y-2 text-sm text-left mb-6">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Manual entries
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      1 statement upload/month
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Track up to 20 instruments
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      P&L Explorer
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      Broker connections
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700">
                    Upgrade to Plus
                  </button>
                  
                  <p className="text-xs text-slate-500 mt-3">
                    ₹599/month or $8/month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </Layout>
  );
}
