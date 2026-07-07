import React, { useState, useEffect } from 'react';
import { useSavoraState } from '../context/SavoraContext';
import { User, Shield, Calendar, Clock, LogOut, CheckCircle, Save, Camera, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const mockLogs = [
  { id: 'l-1', action: 'Order ORD-1042 fired to KDS (Table 04)', time: 'Today, 12:04' },
  { id: 'l-2', action: 'Bill check settled for ORD-4921 (₹182.50)', time: 'Today, 11:32' },
  { id: 'l-3', action: 'Marked Table 06 as Sanitized / Clean', time: 'Today, 10:45' },
  { id: 'l-4', action: 'Checked in for duty (Double Shift)', time: 'Today, 08:30' }
];

export const Profile: React.FC = () => {
  const { user, logout, settings } = useSavoraState();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    restaurantName: settings.name || '',
    photoURL: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            name: data.name || user?.name || '',
            phone: data.phone || '',
            restaurantName: data.restaurantName || settings.name || '',
            photoURL: data.photoURL || ''
          }));
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, settings.name]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setSaving(true);
    setSuccessMsg('');
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        restaurantName: formData.restaurantName,
        photoURL: formData.photoURL,
        updatedAt: new Date().toISOString()
      });
      
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left entrance-anim">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">Account Profile</h2>
        <p className="text-text-muted text-sm mt-1">Manage your personal information and restaurant details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="md:col-span-1 bg-surface border border-border-custom/50 rounded-2xl p-6 premium-shadow flex flex-col justify-between">
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto group cursor-pointer">
              {formData.photoURL ? (
                <img src={formData.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-primary/20" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-4xl mx-auto shadow-sm border-2 border-primary/20">
                  {formData.name ? formData.name[0].toUpperCase() : (user?.name?.[0] || 'U')}
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-extrabold text-lg text-text-primary">{formData.name || user?.name}</h3>
              <p className="text-xs text-primary uppercase font-bold tracking-wider mt-1">{user?.role || 'Owner'} Role</p>
            </div>

            <div className="pt-4 border-t border-border-custom/45 space-y-2 text-xs text-text-muted">
              <div className="flex items-center gap-2 justify-center"><Shield size={12} className="text-primary" /> Authority: System {user?.role}</div>
              <div className="flex items-center gap-2 justify-center"><Calendar size={12} className="text-primary" /> Shift: Morning / Evening</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-danger/10 hover:bg-danger text-danger hover:text-white py-3 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 mt-8 shadow-sm"
          >
            <LogOut size={14} /> End shift / Sign Out
          </button>
        </div>

        {/* Edit Profile Form */}
        <div className="md:col-span-2 bg-surface border border-border-custom/50 rounded-2xl p-6 premium-shadow text-left">
          <div className="flex items-center justify-between border-b border-border-custom/40 pb-4 mb-5">
            <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
              <User size={18} className="text-primary" /> Personal Information
            </h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            ) : null}
          </div>

          {successMsg && (
            <div className="mb-4 p-3 bg-success/10 border border-success/20 text-success rounded-xl text-sm font-semibold flex items-center gap-2">
              <CheckCircle size={16} />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted ml-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-background border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted ml-1">Email Address</label>
                <input
                  type="email"
                  value={auth.currentUser?.email || user?.email || ''}
                  disabled={true}
                  className="w-full bg-background/50 border border-border-custom/50 rounded-xl px-4 py-2.5 text-sm text-text-muted outline-none cursor-not-allowed"
                  title="Email cannot be changed directly"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted ml-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-background border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted ml-1">Restaurant Name</label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={e => setFormData({...formData, restaurantName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-background border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Restaurant Name"
                />
              </div>
              
              {isEditing && (
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted ml-1">Profile Photo URL</label>
                  <input
                    type="url"
                    value={formData.photoURL}
                    onChange={e => setFormData({...formData, photoURL: e.target.value})}
                    className="w-full bg-background border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-custom/40 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-background transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-primary/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
          
        </div>
      </div>
    </div>
  );
};
