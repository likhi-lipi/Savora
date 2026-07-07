import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSavoraState } from '../context/SavoraContext';
import {
  LayoutDashboard,
  Calendar,
  Map,
  UtensilsCrossed,
  ChefHat,
  Receipt,
  Package,
  Users,
  UserCheck,
  TrendingUp,
  FileText,
  Sparkles,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager'] },
  { name: 'POS Terminal', path: '/app/pos', icon: Receipt, roles: ['admin', 'manager', 'waiter', 'cashier'] },
  { name: 'Kitchen KDS', path: '/app/kitchen', icon: ChefHat, roles: ['admin', 'manager', 'chef'] },
  { name: 'Floor Plan', path: '/app/tables', icon: Map, roles: ['admin', 'manager', 'waiter'] },
  { name: 'Reservations', path: '/app/reservations', icon: Calendar, roles: ['admin', 'manager', 'waiter'] },
  { name: 'Menu Catalog', path: '/app/menu', icon: UtensilsCrossed, roles: ['admin', 'manager'] },
  { name: 'Inventory', path: '/app/inventory', icon: Package, roles: ['admin', 'manager'] },
  { name: 'Customers (CRM)', path: '/app/customers', icon: Users, roles: ['admin', 'manager', 'cashier'] },
  { name: 'Employees', path: '/app/employees', icon: UserCheck, roles: ['admin', 'manager'] },
  { name: 'Analytics', path: '/app/analytics', icon: TrendingUp, roles: ['admin', 'manager'] },
  { name: 'Reports', path: '/app/reports', icon: FileText, roles: ['admin', 'manager'] },
  { name: 'AI Insights', path: '/app/ai-insights', icon: Sparkles, roles: ['admin', 'manager'] },
  { name: 'Settings', path: '/app/settings', icon: Settings, roles: ['admin'] },
  { name: 'Profile', path: '/app/profile', icon: User, roles: ['admin', 'manager', 'waiter', 'chef', 'cashier'] }
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useSavoraState();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredItems = sidebarItems.filter(item => 
    user && item.roles.includes(user.role.toLowerCase())
  );

  return (
    <aside 
      className={`h-screen bg-sidebar border-r border-border-custom flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="py-6 px-4 flex items-center justify-between border-b border-border-custom/50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
              <span className="font-bold text-xl font-mono">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-primary tracking-tight leading-none">Savora</h1>
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mt-1">Smart Dining</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm mx-auto">
            <span className="font-bold text-xl font-mono">S</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-border-custom/50 text-text-muted transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scroll">
        {filteredItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-muted hover:bg-border-custom/30 hover:text-text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-text-primary'}`} />
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                  
                  {/* Active side indicator */}
                  {isActive && !collapsed && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent rounded-r" />
                  )}

                  {/* Tooltip on collapse */}
                  {collapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-text-primary text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
                      {item.name}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-2 border-t border-border-custom/50 mt-auto space-y-1">
        <NavLink
          to="/app/support"
          className="flex items-center gap-3 py-2 px-3 rounded-xl text-text-muted hover:bg-border-custom/30 hover:text-text-primary group relative"
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Support</span>}
          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-text-primary text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
              Support & Help
            </div>
          )}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-danger hover:bg-danger/10 group relative transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-danger text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
