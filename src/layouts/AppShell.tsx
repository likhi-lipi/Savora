import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { useSavoraState } from '../context/SavoraContext';
import { Sidebar } from '../components/Sidebar';
import { TopAppBar } from '../components/TopAppBar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Layers, 
  UtensilsCrossed, 
  ChefHat,
  Receipt,
  User 
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const { user } = useSavoraState();
  const location = useLocation();
  const navigate = useNavigate();

  // Route-based role verification
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const path = location.pathname.toLowerCase();
    const role = user.role.toLowerCase();

    // Direct routing locks for specialized roles
    if (role === 'chef' && !path.includes('/app/kitchen') && !path.includes('/app/profile')) {
      navigate('/app/kitchen');
    }
    if (role === 'waiter' && (path.includes('/app/dashboard') || path.includes('/app/analytics') || path.includes('/app/reports') || path.includes('/app/settings'))) {
      navigate('/app/pos');
    }
    if (role === 'cashier' && (path.includes('/app/dashboard') || path.includes('/app/kitchen') || path.includes('/app/menu') || path.includes('/app/inventory') || path.includes('/app/settings'))) {
      navigate('/app/pos');
    }
  }, [user, location.pathname, navigate]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get active tab for mobile navigation
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/pos')) return 'pos';
    if (path.includes('/kitchen')) return 'kitchen';
    if (path.includes('/tables') || path.includes('/reservations')) return 'bookings';
    return 'more';
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        
        {/* Top App Bar Header */}
        <TopAppBar />

        {/* Viewport Canvas wrapper */}
        <main className="flex-1 pt-24 pb-24 md:pb-8 px-6 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile / Tablet views only) */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden bg-sidebar/95 backdrop-blur-xl border-t border-border-custom z-50 h-16 flex justify-around items-center px-4 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {user.role !== 'chef' && (
          <Link
            to={user.role === 'waiter' ? '/app/pos' : '/app/dashboard'}
            className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
              activeTab === 'dashboard' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Home size={20} />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">Home</span>
          </Link>
        )}

        {(user.role === 'admin' || user.role === 'manager' || user.role === 'waiter') && (
          <Link
            to="/app/tables"
            className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
              activeTab === 'bookings' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Calendar size={20} />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">Bookings</span>
          </Link>
        )}

        {(user.role === 'admin' || user.role === 'manager' || user.role === 'chef') && (
          <Link
            to="/app/kitchen"
            className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
              activeTab === 'kitchen' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <ChefHat size={20} />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">KDS</span>
          </Link>
        )}

        {(user.role === 'admin' || user.role === 'manager' || user.role === 'waiter' || user.role === 'cashier') && (
          <Link
            to="/app/pos"
            className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
              activeTab === 'pos' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Receipt size={20} />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">POS</span>
          </Link>
        )}

        <Link
          to="/app/profile"
          className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
            activeTab === 'more' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <User size={20} />
          <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">Profile</span>
        </Link>
      </nav>
    </div>
  );
};
