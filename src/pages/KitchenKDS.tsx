import React, { useMemo } from 'react';
import { useSavoraState, Order } from '../context/SavoraContext';
import { 
  Hourglass, 
  Flame, 
  CheckCircle, 
  Timer, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Zap
} from 'lucide-react';

export const KitchenKDS: React.FC = () => {
  const { orders, updateOrderStatus, addNotification } = useSavoraState();

  // Filter orders for KDS board columns
  const pendingOrders = useMemo(() => {
    return orders.filter(o => o.status === 'pending').reverse(); // oldest first
  }, [orders]);

  const preparingOrders = useMemo(() => {
    return orders.filter(o => o.status === 'preparing').reverse(); // oldest first
  }, [orders]);

  const readyOrders = useMemo(() => {
    return orders.filter(o => o.status === 'ready').reverse(); // oldest first
  }, [orders]);

  // Calculations for stats
  const pendingCount = pendingOrders.length;
  const preparingCount = preparingOrders.length;
  const readyCount = readyOrders.length;

  const handleStartPreparing = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
  };

  const handleMarkReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready');
  };

  const handleMarkServed = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    addNotification('Order Served', `Order ${orderId} has been picked up & served.`, 'success');
  };

  return (
    <div className="space-y-6 pt-2 h-[calc(100vh-6rem)] flex flex-col overflow-hidden entrance-anim">
      
      {/* KDS Header summary Bento */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
        
        {/* Pending Card */}
        <div className="bg-surface p-4 rounded-2xl border border-border-custom/50 premium-shadow flex items-center justify-between">
          <div>
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 block">Pending Tickets</span>
            <h3 className="text-2xl font-extrabold tracking-tight font-mono text-text-primary">
              {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
            </h3>
            <p className="text-[10px] text-text-muted mt-0.5">Awaiting preparation fire</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
            <Hourglass size={18} className="animate-pulse" />
          </div>
        </div>

        {/* Preparing Card */}
        <div className="bg-surface p-4 rounded-2xl border border-border-custom/50 premium-shadow flex items-center justify-between">
          <div>
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 block">Active Cooks</span>
            <h3 className="text-2xl font-extrabold tracking-tight font-mono text-text-primary">
              {preparingCount < 10 ? `0${preparingCount}` : preparingCount}
            </h3>
            <p className="text-[10px] text-text-muted mt-0.5">Currently on stove lines</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
            <Flame size={18} />
          </div>
        </div>

        {/* Ready Card */}
        <div className="bg-surface p-4 rounded-2xl border border-border-custom/50 premium-shadow flex items-center justify-between">
          <div>
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 block">Ready at Expo</span>
            <h3 className="text-2xl font-extrabold tracking-tight font-mono text-text-primary">
              {readyCount < 10 ? `0${readyCount}` : readyCount}
            </h3>
            <p className="text-[10px] text-text-muted mt-0.5">Pending runner pickup</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <CheckCircle size={18} />
          </div>
        </div>

        {/* Turn Card */}
        <div className="bg-surface p-4 rounded-2xl border border-border-custom/50 premium-shadow flex items-center justify-between">
          <div>
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 block">Avg Cook Speed</span>
            <h3 className="text-2xl font-extrabold tracking-tight font-mono text-text-primary">
              14<span className="text-sm font-sans font-normal ml-0.5">min</span>
            </h3>
            <p className="text-[10px] text-text-muted mt-0.5">Optimal kitchen operation</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Timer size={18} />
          </div>
        </div>

      </section>

      {/* Main board split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-6">
        
        {/* Kanban Board (3 columns) */}
        <section className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden h-full">
          
          {/* LANE 1: Pending */}
          <div className="flex flex-col h-full bg-surface/30 border border-border-custom/40 rounded-2xl overflow-hidden p-3.5">
            <div className="flex justify-between items-center mb-3 px-1.5 flex-shrink-0">
              <h4 className="font-bold text-sm flex items-center gap-2 text-text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                Pending queue
              </h4>
              <span className="text-xs font-bold font-mono bg-border-custom/50 text-text-muted px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 custom-scroll pr-1">
              {pendingCount === 0 ? (
                <div className="text-center py-16 text-text-muted text-xs">All caught up</div>
              ) : (
                pendingOrders.map(order => (
                  <div 
                    key={order.id}
                    className={`bg-white dark:bg-[#1A1D1A] p-4 rounded-2xl border border-border-custom premium-shadow relative group ${
                      order.timeElapsed >= 15 ? 'border-l-4 border-l-danger bg-danger/5 animate-pulse' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-mono font-bold text-xs text-text-primary">{order.id}</p>
                        <p className="text-[10px] text-text-muted mt-0.5 font-bold uppercase">{order.tableName}</p>
                      </div>
                      <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-lg ${
                        order.timeElapsed >= 15 ? 'bg-danger text-white' : 'bg-background dark:bg-[#111311] text-text-muted'
                      }`}>
                        {order.timeElapsed >= 15 ? 'Urgent' : 'Normal'}
                      </span>
                    </div>

                    <div className="space-y-1.5 my-4 border-b border-border-custom/50 pb-3 text-xs text-text-primary">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-semibold">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="text-[10px] text-text-muted uppercase font-normal">{item.category}</span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="text-[10px] bg-background dark:bg-[#111311] border border-border-custom/65 p-2 rounded-lg italic text-text-muted mb-4">
                        "{order.notes}"
                      </p>
                    )}

                    <div className="flex justify-between items-center gap-3">
                      <span className={`font-mono text-xs font-bold flex items-center gap-1 ${
                        order.timeElapsed >= 15 ? 'text-danger' : 'text-text-muted'
                      }`}>
                        <Timer size={14} /> {order.timeElapsed}m wait
                      </span>
                      <button 
                        onClick={() => handleStartPreparing(order.id)}
                        className="bg-primary hover:bg-primary/95 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase shadow-sm active:scale-95 transition-all flex items-center gap-0.5"
                      >
                        Start Cooking <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LANE 2: Preparing */}
          <div className="flex flex-col h-full bg-surface/30 border border-border-custom/40 rounded-2xl overflow-hidden p-3.5">
            <div className="flex justify-between items-center mb-3 px-1.5 flex-shrink-0">
              <h4 className="font-bold text-sm flex items-center gap-2 text-text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-warning" />
                Active preparing
              </h4>
              <span className="text-xs font-bold font-mono bg-border-custom/50 text-text-muted px-2 py-0.5 rounded-full">
                {preparingCount}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 custom-scroll pr-1">
              {preparingCount === 0 ? (
                <div className="text-center py-16 text-text-muted text-xs">Line is empty</div>
              ) : (
                preparingOrders.map(order => (
                  <div 
                    key={order.id}
                    className="bg-white dark:bg-[#1A1D1A] p-4 rounded-2xl border-l-4 border-l-warning border-y border-r border-border-custom premium-shadow relative group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-mono font-bold text-xs text-text-primary">{order.id}</p>
                        <p className="text-[10px] text-text-muted mt-0.5 font-bold uppercase">{order.tableName}</p>
                      </div>
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-warning/10 text-warning">
                        High Fire
                      </span>
                    </div>

                    <div className="space-y-1.5 my-4 border-b border-border-custom/50 pb-3 text-xs text-text-primary">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-bold">
                          <span>{item.quantity}x {item.name}</span>
                          {item.notes && <span className="text-[9px] text-danger animate-pulse italic">({item.notes})</span>}
                        </div>
                      ))}
                    </div>

                    {order.notes && !order.items.some(i => i.notes) && (
                      <p className="text-[10px] bg-background dark:bg-[#111311] border border-border-custom/65 p-2 rounded-lg italic text-text-muted mb-4">
                        "{order.notes}"
                      </p>
                    )}

                    <div className="flex justify-between items-center gap-3">
                      <span className="font-mono text-xs font-bold text-warning flex items-center gap-1">
                        <Timer size={14} className="animate-spin" style={{ animationDuration: '6s' }} /> {order.timeElapsed}m
                      </span>
                      <button 
                        onClick={() => handleMarkReady(order.id)}
                        className="bg-primary hover:bg-primary/95 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase shadow-sm active:scale-95 transition-all flex items-center gap-0.5"
                      >
                        Fire Ready <CheckCircle size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LANE 3: Ready */}
          <div className="flex flex-col h-full bg-surface/30 border border-border-custom/40 rounded-2xl overflow-hidden p-3.5">
            <div className="flex justify-between items-center mb-3 px-1.5 flex-shrink-0">
              <h4 className="font-bold text-sm flex items-center gap-2 text-text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
                Ready to serve
              </h4>
              <span className="text-xs font-bold font-mono bg-border-custom/50 text-text-muted px-2 py-0.5 rounded-full">
                {readyCount}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 custom-scroll pr-1">
              {readyCount === 0 ? (
                <div className="text-center py-16 text-text-muted text-xs">Expo counter clean</div>
              ) : (
                readyOrders.map(order => (
                  <div 
                    key={order.id}
                    className="bg-[#EEF2EC] dark:bg-[#151815] p-4 rounded-2xl border-l-4 border-l-success border-y border-r border-border-custom premium-shadow relative group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-mono font-bold text-xs text-text-primary">{order.id}</p>
                        <p className="text-[10px] text-text-muted mt-0.5 font-bold uppercase">{order.tableName}</p>
                      </div>
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-success/15 text-success">
                        Ready
                      </span>
                    </div>

                    <div className="space-y-1.5 my-4 border-b border-border-custom/50 pb-3 text-xs text-text-primary">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-text-muted">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="text-[10px] text-text-muted">Completed</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => handleMarkServed(order.id)}
                      className="w-full bg-primary hover:bg-primary/95 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-all"
                    >
                      Serve & Settle Table Check
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        {/* Right Sidebar Widget (1/4 Width on Desktop) */}
        <aside className="w-full lg:w-64 bg-surface border border-border-custom/50 rounded-2xl p-4 flex flex-col gap-5 flex-shrink-0 premium-shadow">
          
          {/* Efficiency Gauge */}
          <div className="text-center bg-background/25 border border-border-custom/55 p-4 rounded-xl">
            <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Kitchen Efficiency</h5>
            
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="56" cy="56" r="50" 
                  fill="transparent" 
                  stroke="var(--color-border-custom)" 
                  strokeWidth="6" 
                  opacity={0.4}
                />
                <circle 
                  cx="56" cy="56" r="50" 
                  fill="transparent" 
                  stroke="#5F8D6E" 
                  strokeWidth="6" 
                  strokeDasharray="314.16" 
                  strokeDashoffset="25.13" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-mono font-extrabold text-text-primary">92%</span>
                <span className="text-[8px] text-primary uppercase font-bold tracking-tight">Optimal</span>
              </div>
            </div>
            <p className="text-[10px] text-text-muted">Avg prep speed is 4% faster than yesterday baseline.</p>
          </div>

          {/* Top Selling Items */}
          <div className="bg-background/25 border border-border-custom/55 p-4 rounded-xl">
            <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Top Fire Dish</h5>
            
            <div className="flex gap-3 items-center">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80" 
                alt="Wagyu sliders" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-primary truncate">Wagyu Sliders</p>
                <p className="text-[10px] text-text-muted mt-0.5">42 fires fired today</p>
                <div className="flex items-center text-primary text-[8px] font-bold mt-1">
                  <TrendingUp size={10} className="mr-0.5" /> +12% increase
                </div>
              </div>
            </div>
          </div>

          {/* Active Kitchen Feed */}
          <div className="bg-background/25 border border-border-custom/55 p-4 rounded-xl flex-1 flex flex-col overflow-hidden min-h-[140px]">
            <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 flex-shrink-0">Live Kitchen Log</h5>
            
            <div className="flex-1 overflow-y-auto space-y-3.5 custom-scroll text-[10px] text-text-muted pr-1">
              <div className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-text-primary leading-tight">ORD-1011 mark ready</p>
                  <p className="text-[8px] text-text-muted/70 mt-0.5">Just now • Station Expo 1</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-text-primary leading-tight">ORD-1042 wait delay</p>
                  <p className="text-[8px] text-text-muted/70 mt-0.5">3m ago • Line Station 2</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-text-primary leading-tight">ORD-1008 start preparing</p>
                  <p className="text-[8px] text-text-muted/70 mt-0.5">15m ago • Chef Dubois</p>
                </div>
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
};
