import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { User, Mail, Shield, Bell, Key, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    console.log('Starting profile update with data:', profileData);
    try {
      const res = await api.put('/user/update', profileData);
      console.log('Update API Response:', res.data);
      if (res.data) {
        updateUser(res.data);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update failed. Full error object:', error);
      console.error('Response Status:', error.response?.status);
      console.error('Response Data:', error.response?.data);
      alert(`Failed to update profile: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user/delete');
      logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Deletion failed:', error);
      alert('Failed to delete account.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Account Settings</h3>
        <p className="text-white/40 text-sm">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          {[
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'security', icon: Shield, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'billing', icon: CreditCard, label: 'Billing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <GlassCard className="space-y-6 border-white/5">
              <h4 className="text-lg font-bold text-white border-b border-white/10 pb-4">Personal Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40"><User size={16} /></div>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40"><Mail size={16} /></div>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button variant="primary" onClick={handleUpdateProfile} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'security' && (
            <GlassCard className="space-y-6 border-white/5">
              <h4 className="text-lg font-bold text-white border-b border-white/10 pb-4">Security Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div>
                    <p className="font-bold text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-white/40">Secure your account with an extra layer of protection.</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500/20 rounded-full relative cursor-pointer border border-emerald-500/30">
                    <div className="absolute left-1 top-1 bg-emerald-500 w-4 h-4 rounded-full"></div>
                  </div>
                </div>
                <Button variant="outline" className="w-full py-3">Change Security Password</Button>
              </div>
            </GlassCard>
          )}

          {activeTab === 'notifications' && (
            <GlassCard className="space-y-6 border-white/5">
              <h4 className="text-lg font-bold text-white border-b border-white/10 pb-4">Notifications</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/80 font-medium">Email Alerts for Transactions</p>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-0.5 bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/80 font-medium">Security & Fraud Alerts</p>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-0.5 bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'profile' && (
            <>
              <GlassCard className="space-y-6 border-white/5">
                <h4 className="text-lg font-bold text-white border-b border-white/10 pb-4">Theme Preferences</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                    <p className="text-xs text-white/40 text-wrap max-w-sm">Switch between immersive dark or high-visibility light theme.</p>
                  </div>
                  <div 
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="space-y-6 border-red-500/20 bg-red-500/5">
                <h4 className="text-lg font-bold text-red-400 border-b border-red-500/10 pb-4">Danger Zone</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Delete Account</p>
                    <p className="text-xs text-white/40">Permanently delete your identity and wipe all transaction history.</p>
                  </div>
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => setShowDeleteModal(true)}>Delete Data</Button>
                </div>
              </GlassCard>
            </>
          )}
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <GlassCard className="max-w-md w-full border-red-500/30 p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Are you absolutely sure?</h3>
                <p className="text-white/40 text-sm">This action cannot be undone. All your blockchain metadata and history will be permanently wiped.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleDeleteAccount}>Yes, Delete Everything</Button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
