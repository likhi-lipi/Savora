import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { TrendingUp, Award, Calendar, ChevronRight } from 'lucide-react';

const categoryData = [
  { name: 'Appetizers', sales: 4800, margin: 75 },
  { name: 'Main Courses', sales: 12400, margin: 60 },
  { name: 'Desserts', sales: 3200, margin: 80 },
  { name: 'Beverages', sales: 7900, margin: 85 },
];

const peakHoursData = [
  { hour: '11:00', covers: 12 },
  { hour: '12:30', covers: 68 }, // Lunch peak
  { hour: '14:00', covers: 32 },
  { hour: '16:00', covers: 18 },
  { hour: '18:00', covers: 52 },
  { hour: '19:30', covers: 120 }, // Dinner peak
  { hour: '21:00', covers: 84 },
  { hour: '22:30', covers: 28 },
];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6 entrance-anim">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">Business Intelligence</h2>
        <p className="text-text-muted text-sm mt-1">Deep-dive analysis of menu sales margins and peak hour trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Sales Chart */}
        <div className="bg-surface p-6 rounded-2xl border border-border-custom/50 premium-shadow">
          <h3 className="font-bold text-base text-text-primary mb-1">Sales by Menu Category</h3>
          <p className="text-text-muted text-xs mb-6">Consolidated revenue compared against average gross margins</p>
          
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-custom)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface)', 
                    borderColor: 'var(--color-border-custom)',
                    borderRadius: '12px'
                  }} 
                />
                <Bar dataKey="sales" fill="#5F8D6E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Dining Hours Line Chart */}
        <div className="bg-surface p-6 rounded-2xl border border-border-custom/50 premium-shadow">
          <h3 className="font-bold text-base text-text-primary mb-1">Occupancy Peak Hours</h3>
          <p className="text-text-muted text-xs mb-6">Real-time covers seated compared across hourly intervals</p>
          
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-custom)" opacity={0.5} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface)', 
                    borderColor: 'var(--color-border-custom)',
                    borderRadius: '12px'
                  }} 
                />
                <Line type="monotone" dataKey="covers" stroke="#5F8D6E" strokeWidth={3} dot={{ fill: '#5F8D6E', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Margins summary card bento row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-surface border border-border-custom/50 rounded-2xl p-5 premium-shadow">
          <Award className="text-primary mb-3" size={24} />
          <h4 className="font-bold text-xs text-text-primary">Highest Margin Items</h4>
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            Beverages (85% gross margin) and Appetizers (75%) generate highest returns. Promote glass wine sales to check customers.
          </p>
        </div>
        <div className="bg-surface border border-border-custom/50 rounded-2xl p-5 premium-shadow">
          <TrendingUp className="text-primary mb-3" size={24} />
          <h4 className="font-bold text-xs text-text-primary">Peak Ticket Hour</h4>
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            Dinner rush hits at 19:30, reaching maximum seat capacity. Kitchen preparations operate at maximum capacity.
          </p>
        </div>
        <div className="bg-[#EEF2EC] dark:bg-[#151815] border border-primary/20 rounded-2xl p-5 shadow-sm">
          <Calendar className="text-primary mb-3" size={24} />
          <h4 className="font-bold text-xs text-text-primary text-primary">Monthly Sales Forecast</h4>
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            Revenue is predicted to expand by 14% this month due to seasonal events and VIP seat bookings.
          </p>
        </div>
      </div>

    </div>
  );
};
