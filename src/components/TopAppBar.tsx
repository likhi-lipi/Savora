import React, { useState, useEffect, useRef } from 'react';
import { useSavoraState } from '../context/SavoraContext';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  ChevronDown, 
  User, 
  Shield, 
  Layers, 
  Utensils, 
  CheckCircle, 
  AlertTriangle,
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';

export const TopAppBar: React.FC = () => {
  const { 
    user, 
    login, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    theme, 
    setTheme 
  } = useSavoraState();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isFirebaseUser = !!(user && (user as any).email);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectRole = (role: string, name: string) => {
    login(role, name);
    setShowProfileDropdown(false);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-success" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-warning animate-pulse" />;
      case 'error':
        return <AlertTriangle size={16} className="text-danger animate-bounce" />;
      default:
        return <Bell size={16} className="text-primary" />;
    }
  };

  return (
    <header className="h-16 border-b border-border-custom bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6 fixed top-0 right-0 z-40 transition-all duration-300 w-full md:w-[calc(100%-16rem)] has-[+aside]:md:w-[calc(100%-18px)]">
      {/* Global Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative flex items-center bg-background/50 border border-border-custom rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all group">
          <Search size={18} className="text-text-muted mr-2" />
          <input
            id="global-search"
            type="text"
            placeholder="Search orders, tables, menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm w-full outline-none focus:ring-0 placeholder:text-text-muted/70 text-text-primary"
          />
          <span className="text-[10px] font-bold text-text-muted border border-border-custom rounded px-1.5 py-0.5 group-focus-within:hidden select-none">
            Ctrl K
          </span>
        </div>
      </div>

      {/* Mobile Title */}
      <div className="sm:hidden flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
          S
        </div>
        <span className="font-bold text-primary">Savora</span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        
        {/* Active late orders flash on header if KDS warning exists */}
        {notifications.some(n => !n.read && n.type === 'error') && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-danger/10 border border-danger/20 text-danger rounded-full animate-pulse text-xs font-bold">
            <AlertTriangle size={14} />
            <span>CRITICAL STATE</span>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-background rounded-full transition-all text-text-muted hover:text-text-primary"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications Hub */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 hover:bg-background rounded-full transition-all text-text-muted hover:text-text-primary relative"
            aria-label="View Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-surface animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-surface border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden entrance-anim">
              <div className="p-4 border-b border-border-custom/50 flex justify-between items-center bg-background/30">
                <span className="font-semibold text-sm">System Alerts</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto custom-scroll divide-y divide-border-custom/35">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-text-muted text-xs">
                    No new alerts
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 text-left transition-colors cursor-pointer hover:bg-background/40 flex gap-3 ${
                        !notif.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">{notif.title}</p>
                        <p className="text-[11px] text-text-muted mt-0.5 leading-tight">{notif.message}</p>
                        <span className="text-[9px] text-text-muted/70 mt-1 block">
                          {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-border-custom/60" />

        {/* User Profile / Testing Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity p-1.5 rounded-xl hover:bg-background/60"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border-custom bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
              {user ? user.name[0] : 'U'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-sm font-semibold text-text-primary leading-none">{user?.name || 'Guest'}</span>
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider mt-1">{user?.role || 'Guest'}</span>
            </div>
            <ChevronDown size={14} className="text-text-muted" />
          </button>

          {/* Profile & Role Switcher Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-surface border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden entrance-anim">
              <div className="p-3 border-b border-border-custom/50 bg-background/20 text-left">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Active User</p>
                <p className="text-sm font-semibold text-text-primary mt-1">{user?.name}</p>
                <p className="text-xs text-text-muted mt-0.5 capitalize">{user?.role} Role</p>
              </div>

              {/* Dev Helper - Dynamic Role Switcher */}
              {!isFirebaseUser ? (
                <div className="p-2 border-b border-border-custom/50">
                  <p className="text-[10px] font-bold text-text-muted uppercase px-2 py-1 select-none">
                    Simulate Role (TestPOS)
                  </p>
                  <button
                    onClick={() => selectRole('admin', 'Marc Jenkins')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left rounded-xl hover:bg-background ${
                      user?.role === 'admin' ? 'bg-primary/10 text-primary font-semibold' : 'text-text-primary'
                    }`}
                  >
                    <Shield size={14} />
                    <span>Admin / Owner</span>
                  </button>
                  <button
                    onClick={() => selectRole('manager', 'Marcus Vance')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left rounded-xl hover:bg-background ${
                      user?.role === 'manager' ? 'bg-primary/10 text-primary font-semibold' : 'text-text-primary'
                    }`}
                  >
                    <UserCheck size={14} />
                    <span>Floor Manager</span>
                  </button>
                  <button
                    onClick={() => selectRole('waiter', 'Sarah Jenkins')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left rounded-xl hover:bg-background ${
                      user?.role === 'waiter' ? 'bg-primary/10 text-primary font-semibold' : 'text-text-primary'
                    }`}
                  >
                    <Layers size={14} />
                    <span>Waiter / Server</span>
                  </button>
                  <button
                    onClick={() => selectRole('chef', 'Pierre Dubois')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left rounded-xl hover:bg-background ${
                      user?.role === 'chef' ? 'bg-primary/10 text-primary font-semibold' : 'text-text-primary'
                    }`}
                  >
                    <Utensils size={14} />
                    <span>Kitchen Staff (Chef)</span>
                  </button>
                  <button
                    onClick={() => selectRole('cashier', 'Elena Rostova')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left rounded-xl hover:bg-background ${
                      user?.role === 'cashier' ? 'bg-primary/10 text-primary font-semibold' : 'text-text-primary'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Cashier</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 border-b border-border-custom/50 text-left bg-primary/5">
                  <p className="text-[10px] font-extrabold text-primary uppercase select-none">
                    Connected to Firebase
                  </p>
                  <p className="text-[10px] text-text-muted mt-1 leading-normal">
                    You are signed in with a secure database account. To simulate mock developer roles, please log out first.
                  </p>
                </div>
              )}

              <div className="p-1">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    window.location.href = '/app/profile';
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left rounded-xl hover:bg-background text-text-primary"
                >
                  <User size={14} />
                  <span>View Account Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
