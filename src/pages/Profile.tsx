import React from 'react';
import { useSavoraState } from '../context/SavoraContext';
import { User, Shield, Calendar, Clock, LogOut, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockLogs = [
  { id: 'l-1', action: 'Order ORD-1042 fired to KDS (Table 04)', time: 'Today, 12:04' },
  { id: 'l-2', action: 'Bill check settled for ORD-4921 ($182.50)', time: 'Today, 11:32' },
  { id: 'l-3', action: 'Marked Table 06 as Sanitized / Clean', time: 'Today, 10:45' },
  { id: 'l-4', action: 'Checked in for duty (Double Shift)', time: 'Today, 08:30' }
];

export const Profile: React.FC = () => {
  const { user, logout } = useSavoraState();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="space-y-6 text-left entrance-anim">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">User Profile</h2>
        <p className="text-text-muted text-sm mt-1">Review active shift duties and operation logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="md:col-span-1 bg-surface border border-border-custom/50 rounded-2xl p-6 premium-shadow flex flex-col justify-between">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
              {user ? user.name[0] : 'U'}
            </div>
            
            <div>
              <h3 className="font-extrabold text-base text-text-primary">{user?.name}</h3>
              <p className="text-xs text-primary uppercase font-bold tracking-wider mt-1">{user?.role} Role</p>
            </div>

            <div className="pt-4 border-t border-border-custom/45 space-y-2 text-xs text-text-muted">
              <div className="flex items-center gap-2 justify-center"><Shield size={12} className="text-primary" /> Authority: System {user?.role}</div>
              <div className="flex items-center gap-2 justify-center"><Calendar size={12} className="text-primary" /> Shift: Evening duty roster</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-danger/10 hover:bg-danger text-danger hover:text-white py-3 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 mt-8 shadow-sm"
          >
            <LogOut size={14} /> End shift / Sign Out
          </button>
        </div>

        {/* Operation logs */}
        <div className="md:col-span-2 bg-surface border border-border-custom/50 rounded-2xl p-6 premium-shadow text-left">
          <h3 className="font-bold text-sm text-text-primary border-b border-border-custom/40 pb-3 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-primary" /> Shift Activity Logs
          </h3>

          <div className="space-y-4">
            {mockLogs.map(log => (
              <div key={log.id} className="flex gap-3 items-start hover:bg-background/20 p-2.5 rounded-xl transition-all">
                <CheckCircle size={14} className="text-success mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-text-primary leading-tight">{log.action}</p>
                  <span className="text-[10px] text-text-muted mt-1 block">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
