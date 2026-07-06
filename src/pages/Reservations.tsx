import React, { useState, useMemo } from 'react';
import { useSavoraState, Reservation } from '../context/SavoraContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  Check, 
  X, 
  Plus, 
  Search, 
  MapPin, 
  TrendingUp 
} from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ReservationFormInputs {
  customerName: string;
  partySize: number;
  date: string;
  time: string;
  tableId: string;
}

export const Reservations: React.FC = () => {
  const { 
    reservations, 
    tables, 
    addReservation, 
    updateReservationStatus, 
    addNotification 
  } = useSavoraState();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReservationFormInputs>();

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => 
      res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tableName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reservations, searchQuery]);

  const availableTables = useMemo(() => {
    return tables.filter(t => t.status === 'available');
  }, [tables]);

  const handleCreateReservation = (data: ReservationFormInputs) => {
    const table = tables.find(t => t.id === data.tableId);
    
    addReservation({
      customerName: data.customerName,
      partySize: Number(data.partySize),
      date: data.date,
      time: data.time,
      tableId: data.tableId,
      tableName: table ? table.name : 'Unassigned'
    });

    setShowAddModal(false);
    reset();
  };

  const handleSeatGuest = (res: Reservation) => {
    updateReservationStatus(res.id, 'seated');
    addNotification('Guest Seated', `${res.customerName} has been seated at ${res.tableName}.`, 'success');
  };

  const handleCancelBooking = (id: string) => {
    updateReservationStatus(id, 'cancelled');
    addNotification('Booking Cancelled', 'Reservation status updated to cancelled.', 'info');
  };

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'seated':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary border border-primary/20">Seated</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-danger/10 text-danger border border-danger/20">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-warning/10 text-warning border border-warning/20">Confirmed</span>;
    }
  };

  return (
    <div className="space-y-6 entrance-anim">
      
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">Reservation Bookings</h2>
          <p className="text-text-muted text-sm mt-1">Manage guest seat bookings and party check-ins.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 self-start"
        >
          <Plus size={14} /> New Reservation
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-surface border border-border-custom/50 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex items-center bg-background border border-border-custom rounded-xl px-2.5 py-1.5 w-full sm:w-80">
          <Search size={14} className="text-text-muted mr-1.5" />
          <input
            type="text"
            placeholder="Search customer names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs w-full outline-none focus:ring-0 placeholder:text-text-muted/70 text-text-primary"
          />
        </div>
        
        <div className="text-xs text-text-muted flex items-center gap-4">
          <span className="flex items-center gap-1"><Clock size={12} className="text-primary" /> Active Service Hours: 11:30 - 23:00</span>
        </div>
      </div>

      {/* Grid of Reservation cards */}
      <div className="bg-surface border border-border-custom/50 rounded-2xl premium-shadow overflow-hidden">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F8F7F4] dark:bg-[#111311] border-b border-border-custom/50 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-4">Guest Name</th>
                <th className="px-6 py-4">Party Size</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Table Assigned</th>
                <th className="px-6 py-4">Fulfillment Status</th>
                <th className="px-6 py-4 text-right">Console Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/35">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted text-xs">
                    No reservations matching current filters
                  </td>
                </tr>
              ) : (
                filteredReservations.map(res => (
                  <tr key={res.id} className="hover:bg-background/25 transition-colors group">
                    <td className="px-6 py-4 font-bold text-text-primary flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {res.customerName[0]}
                      </div>
                      {res.customerName}
                    </td>
                    <td className="px-6 py-4 text-text-muted font-bold">
                      <span className="flex items-center gap-1"><Users size={12} /> {res.partySize} Guests</span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-primary">{res.time}</span>
                        <span className="text-[10px] text-text-muted/80">{res.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {res.tableName}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(res.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {res.status === 'confirmed' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSeatGuest(res)}
                            className="bg-primary hover:bg-primary/95 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase shadow-sm active:scale-95 transition-all flex items-center gap-0.5"
                          >
                            <Check size={10} /> Seat Party
                          </button>
                          <button
                            onClick={() => handleCancelBooking(res.id)}
                            className="bg-background hover:bg-danger/10 border border-border-custom hover:border-danger text-text-muted hover:text-danger p-1.5 rounded-xl transition-all active:scale-95"
                            title="Cancel Booking"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      {res.status === 'seated' && (
                        <span className="text-[10px] text-text-muted italic">Checked In</span>
                      )}
                      {res.status === 'cancelled' && (
                        <span className="text-[10px] text-text-muted/70 line-through">Revoked</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD RESERVATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1A1D1A] rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border-custom">
            
            <div className="p-6 border-b border-border-custom bg-background/20 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-text-primary">Create Guest Reservation</h3>
                <p className="text-xs text-text-muted mt-0.5">Secure table seats ahead of dinner services.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-sidebar rounded-full text-text-muted"
              >
                <X size={16} />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleSubmit(handleCreateReservation)}>
              <div className="grid grid-cols-2 gap-4">
                
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Customer Name</label>
                  <input
                    type="text"
                    {...register('customerName', { required: 'Customer name is required' })}
                    placeholder="e.g. David Hasselhoff"
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  />
                  {errors.customerName && <p className="text-[10px] text-danger mt-1 font-bold">{errors.customerName.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Party Size (Covers)</label>
                  <input
                    type="number"
                    {...register('partySize', { required: 'Party size is required', min: { value: 1, message: 'Must seat at least 1 guest' } })}
                    placeholder="2"
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  />
                  {errors.partySize && <p className="text-[10px] text-danger mt-1 font-bold">{errors.partySize.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Assign Dining Table</label>
                  <select
                    {...register('tableId', { required: 'Table assignment is required' })}
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  >
                    <option value="">Select Table...</option>
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.seats} seats - {t.status})
                      </option>
                    ))}
                  </select>
                  {errors.tableId && <p className="text-[10px] text-danger mt-1 font-bold">{errors.tableId.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Reservation Date</label>
                  <select
                    {...register('date')}
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Next Friday">Next Friday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Seating Time (24h)</label>
                  <input
                    type="text"
                    {...register('time', { required: 'Seating time is required' })}
                    placeholder="19:30"
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  />
                  {errors.time && <p className="text-[10px] text-danger mt-1 font-bold">{errors.time.message}</p>}
                </div>

              </div>

              <div className="pt-6 border-t border-border-custom/50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-border-custom hover:bg-background text-text-primary text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  Confirm Booking
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
