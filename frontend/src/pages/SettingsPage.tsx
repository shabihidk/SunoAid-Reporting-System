import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Lock, 
  Eye,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Camera
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showLocation: true,
    showRealName: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border-b border-gray-100">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-100 bg-gray-50/50">
              <nav className="p-6 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <h2 className="text-2xl font-bold mt-4 text-gray-900">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Full Name</span>
                        <div className="relative">
                          <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            defaultValue={user?.name}
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </div>
                      </label>
                      
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Email</span>
                        <div className="relative">
                          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            defaultValue={user?.email}
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </div>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Phone</span>
                        <div className="relative">
                          <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            defaultValue={user?.phone}
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </div>
                      </label>
                      
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Location</span>
                        <div className="relative">
                          <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            placeholder="Your location"
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Notification Preferences</h3>
                  
                  {Object.entries({
                    email: { label: 'Email Notifications', desc: 'Receive updates via email' },
                    push: { label: 'Push Notifications', desc: 'Browser and mobile notifications' },
                    sms: { label: 'SMS Notifications', desc: 'Text message alerts' }
                  }).map(([key, config]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">{config.label}</h4>
                        <p className="text-sm text-gray-600">{config.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleNotification(key as keyof typeof notifications)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          notifications[key as keyof typeof notifications] ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform duration-200 ${
                            notifications[key as keyof typeof notifications] ? 'transform translate-x-6' : 'transform translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Privacy Settings</h3>
                  
                  {Object.entries({
                    profileVisible: { label: 'Public Profile', desc: 'Make your profile visible to others' },
                    showLocation: { label: 'Show Location', desc: 'Display your location on reports' },
                    showRealName: { label: 'Show Real Name', desc: 'Use your real name instead of username' }
                  }).map(([key, config]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        {key === 'profileVisible' && <Eye className="w-5 h-5 text-gray-400 mr-3" />}
                        {key === 'showLocation' && <MapPin className="w-5 h-5 text-gray-400 mr-3" />}
                        {key === 'showRealName' && <User className="w-5 h-5 text-gray-400 mr-3" />}
                        <div>
                          <h4 className="font-medium text-gray-900">{config.label}</h4>
                          <p className="text-sm text-gray-600">{config.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => togglePrivacy(key as keyof typeof privacy)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          privacy[key as keyof typeof privacy] ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform duration-200 ${
                            privacy[key as keyof typeof privacy] ? 'transform translate-x-6' : 'transform translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <h4 className="font-medium text-yellow-800">Two-Factor Authentication</h4>
                      <p className="text-sm text-yellow-700 mt-1">Add an extra layer of security to your account</p>
                      <button className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <h4 className="font-medium text-red-800">Change Password</h4>
                      <p className="text-sm text-red-700 mt-1">Update your password regularly for better security</p>
                      <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
