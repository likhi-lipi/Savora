import React from 'react';
import { useSavoraState } from '../context/SavoraContext';
import { UserCheck, ShieldCheck, Mail, Calendar, Eye } from 'lucide-react';

export const Employees: React.FC = () => {
  const { employees, updateEmployeeStatus } = useSavoraState();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'break':
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-warning/10 text-warning border border-warning/20">On Break</span>;
      case 'off':
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-text-muted/10 text-text-muted border border-border-custom">Off Duty</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-success/15 text-primary border border-accent/25">Active</span>;
    }
  };

  return (
    <div className="space-y-6 entrance-anim">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">Staff & Shifts</h2>
        <p className="text-text-muted text-sm mt-1">Monitor roster assignments and check shift logs.</p>
      </div>

      {/* Employees grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {employees.map(emp => (
          <div 
            key={emp.id}
            className="bg-surface border border-border-custom/50 rounded-2xl p-5 premium-shadow flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {emp.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{emp.name}</h4>
                  <p className="text-[10px] text-primary uppercase font-bold tracking-wider mt-0.5">{emp.role}</p>
                </div>
              </div>
              {getStatusBadge(emp.status)}
            </div>

            <div className="my-5 border-t border-border-custom/40 pt-4 space-y-2 text-xs text-text-muted">
              <div className="flex items-center gap-2"><Mail size={12} /> {emp.email}</div>
              <div className="flex items-center gap-2"><Calendar size={12} /> Shift: <span className="font-semibold text-text-primary">{emp.shift}</span></div>
            </div>

            {/* Roster actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => updateEmployeeStatus(emp.id, 'active')}
                className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 ${
                  emp.status === 'active' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'bg-background hover:bg-border-custom border border-border-custom text-text-muted hover:text-text-primary'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => updateEmployeeStatus(emp.id, 'break')}
                className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 ${
                  emp.status === 'break' 
                    ? 'bg-warning text-white shadow-sm' 
                    : 'bg-background hover:bg-border-custom border border-border-custom text-text-muted hover:text-text-primary'
                }`}
              >
                Break
              </button>
              <button 
                onClick={() => updateEmployeeStatus(emp.id, 'off')}
                className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 ${
                  emp.status === 'off' 
                    ? 'bg-text-muted text-white shadow-sm' 
                    : 'bg-background hover:bg-border-custom border border-border-custom text-text-muted hover:text-text-primary'
                }`}
              >
                Off Duty
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
