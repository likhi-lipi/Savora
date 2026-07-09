import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavoraState } from '../context/SavoraContext';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  Sparkles, 
  ArrowRight,
  Download,
  Plus,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Weekly chart mock data
const chartData = [
  { day: 'Mon', revenue: 8400, covers: 110 },
  { day: 'Tue', revenue: 10200, covers: 132 },
  { day: 'Wed', revenue: 9100, covers: 120 },
  { day: 'Thu', revenue: 13400, covers: 174 },
  { day: 'Fri', revenue: 14920, covers: 184 },
  { day: 'Sat', revenue: 16100, covers: 210 },
  { day: 'Sun', revenue: 11800, covers: 150 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { todayStats, orders, tables, resetMockData } = useSavoraState();

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const activeTablesCount = useMemo(() => {
    return tables.filter(t => t.status === 'occupied').length;
  }, [tables]);

  const totalTables = tables.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-success/10 text-success border border-success/20">Completed</span>;
      case 'ready':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-accent/25 text-primary border border-accent/40 animate-pulse">Ready</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-warning/10 text-warning border border-warning/20">Preparing</span>;
      case 'pending':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-danger/10 text-danger border border-danger/20">Pending</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-text-muted/10 text-text-muted border border-border-custom">Cancelled</span>;
    }
  };

  // Sparkline data generators
  const sparkRevenue = [35, 15, 28, 12, 32, 8, 22];
  const sparkOrders = [25, 28, 18, 32, 12, 28, 5];
  const sparkCovers = [15, 18, 12, 28, 18, 38, 32];
  const sparkTurn = [32, 22, 28, 10, 18, 12, 5];

  const renderSparkline = (points: number[], color: string) => (
    <div className="w-full h-12 overflow-hidden pb-1 mt-2">
      <svg className="w-full h-full" viewBox="0 -2 100 45" preserveAspectRatio="none">
        <path
          d={`M ${points.map((p, i) => `${(i / (points.length - 1)) * 100},${p}`).join(' L ')}`}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  return (
    <div className="space-y-6 entrance-anim">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">Daily Overview</h2>
          <p className="text-text-muted text-sm mt-1">Real-time performance analytics for Friday service.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={resetMockData}
            className="px-4 py-2.5 bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            <AlertCircle size={14} /> Reseed Database
          </button>
          <button className="px-4 py-2.5 bg-surface border border-border-custom text-text-primary hover:bg-sidebar rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <div className="bg-surface rounded-2xl p-5 border border-border-custom/50 premium-shadow premium-shadow-hover flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">Today's Revenue</span>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-extrabold tracking-tight font-mono text-text-primary">
                  ₹{todayStats.revenue.toLocaleString('en-IN')}
                </h3>
                <span className="text-text-muted text-xs font-medium">INR</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary text-[10px] font-bold bg-primary/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +14.2%
            </div>
          </div>
          <div className="mt-4">{renderSparkline(sparkRevenue, '#5F8D6E')}</div>
        </div>

        {/* Orders */}
        <div className="bg-surface rounded-2xl p-5 border border-border-custom/50 premium-shadow premium-shadow-hover flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">Total Orders</span>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-extrabold tracking-tight font-mono text-text-primary">
                  {todayStats.ordersCount}
                </h3>
                <span className="text-text-muted text-xs font-medium">checks</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary text-[10px] font-bold bg-primary/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +8.1%
            </div>
          </div>
          <div className="mt-4">{renderSparkline(sparkOrders, '#5F8D6E')}</div>
        </div>

        {/* Avg Check */}
        <div className="bg-surface rounded-2xl p-5 border border-border-custom/50 premium-shadow premium-shadow-hover flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">Average Check</span>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-extrabold tracking-tight font-mono text-text-primary">
                  ₹{todayStats.avgCheck.toLocaleString('en-IN')}
                </h3>
                <span className="text-text-muted text-xs font-medium">per cover</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary text-[10px] font-bold bg-primary/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +3.4%
            </div>
          </div>
          <div className="mt-4">{renderSparkline(sparkCovers, '#5F8D6E')}</div>
        </div>

        {/* Occupancy / Turn */}
        <div className="bg-surface rounded-2xl p-5 border border-border-custom/50 premium-shadow premium-shadow-hover flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">Seating Occupancy</span>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-extrabold tracking-tight font-mono text-text-primary">
                  {activeTablesCount}/{totalTables}
                </h3>
                <span className="text-text-muted text-xs font-medium">tables</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-accent/20 text-primary px-2 py-0.5 rounded-full">
              {Math.round((activeTablesCount / totalTables) * 100)}% active
            </span>
          </div>
          <div className="mt-4">{renderSparkline(sparkTurn, '#A4BE7B')}</div>
        </div>

      </div>

      {/* Charts & AI Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-border-custom/50 premium-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="font-bold text-lg tracking-tight text-text-primary">Revenue Trends</h3>
              <p className="text-text-muted text-xs">Comparison of weekly sales performance</p>
            </div>
            <div className="flex bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom/60 rounded-xl p-1 shadow-inner">
              <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-[#1A1D1A] rounded-lg shadow-sm text-primary transition-all">
                Revenue (₹)
              </button>
            </div>
          </div>
          
          <div className="h-72 w-full mt-4 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5F8D6E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#5F8D6E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-custom)" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface)', 
                    borderColor: 'var(--color-border-custom)',
                    borderRadius: '12px',
                    color: 'var(--color-text-primary)'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#5F8D6E" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Smart Insights */}
        <div className="bg-surface border border-border-custom/50 rounded-2xl p-6 premium-shadow flex flex-col justify-between relative overflow-hidden group">
          
          {/* Subtle gradient light flare */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary shadow-inner">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight text-text-primary">AI Business Insights</h3>
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-0.5">Savora AI Agent</p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Insight 1 */}
              <div className="bg-[#F8F7F4] dark:bg-[#111311] p-4 rounded-xl border border-border-custom/60 hover:border-primary/25 transition-all">
                <span className="text-[10px] font-bold text-primary uppercase">Menu Optimization</span>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Demand for <span className="text-text-primary font-bold">"Hyderabadi Dum Biryani"</span> is up 42%. Feature as chef's special tonight for high-margin revenue uplift.
                </p>
              </div>

              {/* Insight 2 */}
              <div className="bg-[#F8F7F4] dark:bg-[#111311] p-4 rounded-xl border border-border-custom/60 hover:border-primary/25 transition-all">
                <span className="text-[10px] font-bold text-primary uppercase">Staffing Alert</span>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Forecasted rush at <span className="text-text-primary font-bold">19:30</span>. Suggest calling 1 extra server for optimal guest experience.
                </p>
              </div>

              {/* Insight 3 */}
              <div className="bg-[#F8F7F4] dark:bg-[#111311] p-4 rounded-xl border border-border-custom/60 hover:border-primary/25 transition-all">
                <span className="text-[10px] font-bold text-primary uppercase">VIP Guest Alert</span>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  VIP guest <span className="text-text-primary font-bold">Aarav Sharma</span> (Top 1%) booked Table 12. Recommend preparing signature Saffron Lassi table welcome.
                </p>
              </div>

            </div>
          </div>

          <button 
            onClick={() => navigate("/app/analytics")}
            className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 mt-6 shadow-sm active:scale-95 group"
          >
            View Analytics Workspace
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Recent Orders table */}
      <div className="bg-surface border border-border-custom/50 rounded-2xl premium-shadow overflow-hidden">
        <div className="p-6 border-b border-border-custom/40 flex justify-between items-center bg-background/10">
          <div>
            <h3 className="font-bold text-lg tracking-tight text-text-primary">Recent Orders Flow</h3>
            <p className="text-text-muted text-xs mt-1">Live order pipeline monitoring</p>
          </div>
          <button className="text-primary text-xs font-bold hover:underline px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all">
            View Operations logs
          </button>
        </div>

        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F8F7F4] dark:bg-[#111311] text-text-muted uppercase text-[9px] tracking-widest font-bold border-b border-border-custom/30">
              <tr>
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-6 py-3.5">Table info</th>
                <th className="px-6 py-3.5">Waiter</th>
                <th className="px-6 py-3.5">Fulfillment Status</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5 text-right">Timer elapsed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/25">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-background/25 transition-colors">
                  <td className="px-6 py-4 font-mono text-text-muted font-bold">{order.id}</td>
                  <td className="px-6 py-4 font-semibold text-text-primary">{order.tableName}</td>
                  <td className="px-6 py-4 text-text-muted">{order.waiterName}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 font-mono font-bold text-text-primary">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right font-mono text-text-muted">
                    {order.status === 'completed' ? 'Settled' : `${order.timeElapsed}m ago`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
