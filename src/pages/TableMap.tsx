import React, { useState, useMemo } from 'react';
import { useSavoraState, Table } from '../context/SavoraContext';
import { 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle, 
  Trash, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TableMap: React.FC = () => {
  const { tables, setTableStatus, clearTable, orders } = useSavoraState();
  const navigate = useNavigate();
  
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedTableId, setSelectedTableId] = useState<string>('T-04');
  const [partySize, setPartySize] = useState(2);

  // Selected Table details
  const selectedTable = useMemo(() => {
    return tables.find(t => t.id === selectedTableId) || tables[0];
  }, [tables, selectedTableId]);

  // Active check on selected table
  const selectedTableOrder = useMemo(() => {
    if (!selectedTable || !selectedTable.currentOrderId) return null;
    return orders.find(o => o.id === selectedTable.currentOrderId && o.status !== 'completed') || null;
  }, [orders, selectedTable]);

  // Area filtering
  const filteredTables = useMemo(() => {
    if (selectedArea === 'all') return tables;
    return tables.filter(t => t.area.toLowerCase() === selectedArea.toLowerCase());
  }, [tables, selectedArea]);

  // Seating statistics calculations
  const stats = useMemo(() => {
    const total = tables.length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const reserved = tables.filter(t => t.status === 'reserved').length;
    const dirty = tables.filter(t => t.status === 'dirty').length;
    const available = total - occupied - reserved - dirty;

    return { total, occupied, reserved, dirty, available };
  }, [tables]);

  const handleSeatGuests = () => {
    setTableStatus(selectedTableId, 'occupied', partySize);
  };

  const handleGoToPOS = () => {
    navigate('/app/pos');
  };

  const getTableStatusBg = (status: Table['status'], isSelected: boolean) => {
    if (isSelected) return 'bg-primary border-primary text-white scale-[1.03] ring-2 ring-primary ring-offset-2';
    
    switch (status) {
      case 'occupied':
        return 'bg-[#EEF2EC] dark:bg-[#151815] border-primary/45 text-text-primary hover:border-primary';
      case 'reserved':
        return 'bg-surface border-danger/30 text-text-primary hover:border-danger';
      case 'dirty':
        return 'bg-warning/10 border-warning/40 text-warning hover:border-warning';
      default:
        return 'bg-white dark:bg-[#1A1D1A] border-border-custom text-text-muted hover:border-primary/50';
    }
  };

  return (
    <div className="space-y-6 pt-2 h-[calc(100vh-6rem)] flex flex-col overflow-hidden entrance-anim">
      
      {/* Floor Overview Stats row */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-4 flex-shrink-0">
        
        {/* Total Tables */}
        <div className="bg-surface p-4 rounded-xl border border-border-custom/50 premium-shadow">
          <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest block">Total Tables</span>
          <span className="text-xl font-extrabold text-text-primary font-mono mt-1 block">{stats.total}</span>
        </div>

        {/* Occupied */}
        <div className="bg-surface p-4 rounded-xl border border-border-custom/50 premium-shadow">
          <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest block">Seated / Seated %</span>
          <span className="text-xl font-extrabold text-primary font-mono mt-1 block">
            {stats.occupied} <span className="text-xs font-normal text-text-muted font-sans">({Math.round((stats.occupied / stats.total) * 100)}%)</span>
          </span>
        </div>

        {/* Available */}
        <div className="bg-surface p-4 rounded-xl border border-border-custom/50 premium-shadow">
          <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest block">Available</span>
          <span className="text-xl font-extrabold text-success font-mono mt-1 block">{stats.available}</span>
        </div>

        {/* Reserved */}
        <div className="bg-surface p-4 rounded-xl border border-border-custom/50 premium-shadow">
          <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest block">Reserved</span>
          <span className="text-xl font-extrabold text-text-primary font-mono mt-1 block">{stats.reserved}</span>
        </div>

        {/* Needs Cleaning */}
        <div className="bg-surface p-4 rounded-xl border border-border-custom/50 premium-shadow col-span-2 sm:col-span-1">
          <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest block">Dirty Logs</span>
          <span className="text-xl font-extrabold text-warning font-mono mt-1 block">{stats.dirty}</span>
        </div>

      </section>

      {/* Grid Canvas area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Floor Map Panel */}
        <div className="flex-1 bg-surface border border-border-custom/50 rounded-2xl p-6 flex flex-col overflow-hidden premium-shadow">
          
          {/* Area Selector Tabs */}
          <div className="flex justify-between items-center mb-6 flex-shrink-0 border-b border-border-custom/50 pb-4">
            <div className="flex bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl p-1 text-[11px] font-bold">
              <button 
                onClick={() => setSelectedArea('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedArea === 'all' ? 'bg-white dark:bg-[#1A1D1A] text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                All Mappings
              </button>
              <button 
                onClick={() => setSelectedArea('main hall')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedArea === 'main hall' ? 'bg-white dark:bg-[#1A1D1A] text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Main Room
              </button>
              <button 
                onClick={() => setSelectedArea('terrace')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedArea === 'terrace' ? 'bg-white dark:bg-[#1A1D1A] text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Terrace
              </button>
              <button 
                onClick={() => setSelectedArea('bar')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedArea === 'bar' ? 'bg-white dark:bg-[#1A1D1A] text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Bar Counter
              </button>
              <button 
                onClick={() => setSelectedArea('vip room')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedArea === 'vip room' ? 'bg-white dark:bg-[#1A1D1A] text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                VIP Lounge
              </button>
            </div>
            <span className="text-[10px] text-text-muted font-bold flex items-center gap-1">
              <MapPin size={12} className="text-primary" /> Drag/drop locked layout
            </span>
          </div>

          {/* Tables Map Grid */}
          <div className="flex-1 overflow-y-auto custom-scroll p-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTables.map(table => {
                const isSelected = selectedTableId === table.id;
                return (
                  <div
                    key={table.id}
                    onClick={() => setSelectedTableId(table.id)}
                    className={`h-36 rounded-2xl border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                      getTableStatusBg(table.status, isSelected)
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-base tracking-tight">{table.name}</span>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : table.status === 'occupied' 
                            ? 'bg-primary/10 text-primary' 
                            : table.status === 'dirty' 
                              ? 'bg-warning/20 text-warning' 
                              : 'bg-background dark:bg-[#111311] text-text-muted'
                      }`}>
                        {table.seats} Seats
                      </span>
                    </div>

                    <div className="space-y-1">
                      {table.status === 'occupied' && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Users size={12} className={isSelected ? 'text-white/80' : 'text-text-muted'} />
                          <span className={isSelected ? 'text-white/95' : 'text-text-primary font-medium'}>
                            {table.guestCount} Guests
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-baseline mt-2">
                        <span className={`text-[10px] capitalize ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                          {table.status} {table.status === 'occupied' && `• ${table.timer}m`}
                        </span>
                        
                        {table.status === 'occupied' && (
                          <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>
                            ${(orders.find(o => o.id === table.currentOrderId)?.totalPrice || 0).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Selected Table Seating Console Sidebar */}
        <aside className="w-full lg:w-80 bg-surface border border-border-custom/50 rounded-2xl p-6 flex flex-col justify-between flex-shrink-0 premium-shadow">
          <div>
            <div className="flex justify-between items-start border-b border-border-custom/50 pb-4 mb-6">
              <div>
                <h3 className="font-bold text-lg text-text-primary">{selectedTable.name} Seating Console</h3>
                <p className="text-[10px] text-text-muted mt-0.5 capitalize">{selectedTable.area} Area</p>
              </div>
              <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                selectedTable.status === 'occupied' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : selectedTable.status === 'dirty' 
                    ? 'bg-warning/15 text-warning border border-warning/30' 
                    : 'bg-background dark:bg-[#111311] text-text-muted border border-border-custom'
              }`}>
                {selectedTable.status}
              </span>
            </div>

            {/* Table Details Status based */}
            {selectedTable.status === 'occupied' ? (
              <div className="space-y-4">
                <div className="bg-[#F8F7F4] dark:bg-[#111311] p-4 rounded-xl border border-border-custom/60 space-y-3">
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Occupancy duration:</span>
                    <span className="font-semibold text-text-primary flex items-center gap-1">
                      <Clock size={12} /> {selectedTable.timer} minutes
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Current Active Bill:</span>
                    <span className="font-bold font-mono text-primary">
                      ${(selectedTableOrder?.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Order Fire ID:</span>
                    <span className="font-mono text-text-primary">#{selectedTable.currentOrderId}</span>
                  </div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Order Status:</span>
                    <span className="font-bold uppercase text-[9px] bg-warning/10 text-warning px-1.5 py-0.5 rounded">
                      {selectedTableOrder?.status || 'Active'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleGoToPOS}
                  className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  Go to POS Cart checkout <ArrowRight size={14} />
                </button>
              </div>
            ) : selectedTable.status === 'dirty' ? (
              <div className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  Table requires sanitary cleaning before guests can be seated. Mark clean to make it available.
                </p>
                <button
                  onClick={() => clearTable(selectedTable.id)}
                  className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Trash size={14} /> Mark as Sanitized / Clean
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-xs text-text-muted leading-relaxed">
                  Table is clean. Specify guest size below to seat walk-in customers instantly.
                </p>
                
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
                    Party Size (Guests)
                  </label>
                  <div className="flex items-center justify-between border border-border-custom rounded-xl p-2 bg-white dark:bg-[#1A1D1A]">
                    <button 
                      onClick={() => setPartySize(Math.max(1, partySize - 1))}
                      className="w-8 h-8 rounded-lg bg-background hover:bg-border-custom/30 text-text-muted font-bold"
                    >
                      -
                    </button>
                    <span className="text-sm font-extrabold text-text-primary">{partySize} guests</span>
                    <button 
                      onClick={() => setPartySize(Math.min(selectedTable.seats, partySize + 1))}
                      className="w-8 h-8 rounded-lg bg-background hover:bg-border-custom/30 text-text-muted font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[9px] text-text-muted/75 mt-1.5 block">
                    Max capacity for this table is {selectedTable.seats} guests.
                  </span>
                </div>

                <button 
                  onClick={handleSeatGuests}
                  className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <CheckCircle size={14} /> Seat Guests Now
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 p-3 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <Sparkles size={12} />
              <span className="text-[8px] font-bold tracking-widest uppercase">KDS Sync</span>
            </div>
            <p className="text-[9px] text-text-muted leading-relaxed">
              Table states are synced in real-time with KDS tickets and cashier checkout drawers.
            </p>
          </div>
        </aside>

      </div>

    </div>
  );
};
