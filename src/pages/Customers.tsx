import React, { useState } from 'react';

import { Users, Search, Mail, Gift, Phone } from 'lucide-react';

const mockCustomers = [
  {
    id: 'c-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 98765 43210',
    totalSpent: 12450.00,
    visits: 18,
    tier: 'VIP (Top 1%)'
  },
  {
    id: 'c-2',
    name: 'Priya Nair',
    email: 'priya.nair@outlook.com',
    phone: '+91 91234 56789',
    totalSpent: 6850.50,
    visits: 9,
    tier: 'Gold'
  },
  {
    id: 'c-3',
    name: 'Rohan Verma',
    email: 'rohan.verma@gmail.com',
    phone: '+91 99887 65432',
    totalSpent: 4890.75,
    visits: 6,
    tier: 'Gold'
  },
  {
    id: 'c-4',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@icloud.com',
    phone: '+91 90123 45678',
    totalSpent: 18320.00,
    visits: 24,
    tier: 'VIP (Top 1%)'
  },
  {
    id: 'c-5',
    name: 'Vikram Singh',
    email: 'vikram.singh@yahoo.com',
    phone: '+91 93456 78901',
    totalSpent: 2450.00,
    visits: 3,
    tier: 'Silver'
  },
  {
    id: 'c-6',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@gmail.com',
    phone: '+91 97654 32109',
    totalSpent: 7325.00,
    visits: 10,
    tier: 'Gold'
  },
  {
    id: 'c-7',
    name: 'Aditya Mehta',
    email: 'aditya.mehta@gmail.com',
    phone: '+91 98701 23456',
    totalSpent: 1290.00,
    visits: 2,
    tier: 'Silver'
  },
  {
    id: 'c-8',
    name: 'Meera Iyer',
    email: 'meera.iyer@outlook.com',
    phone: '+91 94567 89012',
    totalSpent: 9650.00,
    visits: 14,
    tier: 'Gold'
  }
];
export const Customers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = mockCustomers.filter(cust =>
    cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cust.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'VIP (Top 1%)':
        return <span className="px-2.5 py-1 text-[9px] font-bold uppercase rounded-full bg-primary/10 text-primary border border-primary/20">VIP (Top 1%)</span>;
      case 'Gold':
        return <span className="px-2.5 py-1 text-[9px] font-bold uppercase rounded-full bg-warning/10 text-warning border border-warning/20">Gold Tier</span>;
      default:
        return <span className="px-2.5 py-1 text-[9px] font-bold uppercase rounded-full bg-text-muted/10 text-text-muted border border-border-custom">Silver Tier</span>;
    }
  };

  return (
    <div className="space-y-6 entrance-anim">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">Guest CRM Directory</h2>
        <p className="text-text-muted text-sm mt-1">Nurture guest relationships and manage loyalty tiers.</p>
      </div>

      {/* Control bar */}
      <div className="p-4 bg-surface border border-border-custom/50 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex items-center bg-background border border-border-custom rounded-xl px-2.5 py-1.5 w-full sm:w-80">
          <Search size={14} className="text-text-muted mr-1.5" />
          <input
            type="text"
            placeholder="Search guest profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs w-full outline-none focus:ring-0 placeholder:text-text-muted/70 text-text-primary"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-surface border border-border-custom/50 rounded-2xl premium-shadow overflow-hidden text-left">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#F8F7F4] dark:bg-[#111311] border-b border-border-custom/50 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-4">Guest Name</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4 text-center">Visits</th>
                <th className="px-6 py-4 text-center">Total Spend Value</th>
                <th className="px-6 py-4">Loyalty Tier</th>
                <th className="px-6 py-4 text-right">Loyalty Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/35">
              {filteredCustomers.map(cust => (
                <tr key={cust.id} className="hover:bg-background/25 transition-colors">
                  <td className="px-6 py-4 font-bold text-text-primary flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                      {cust.name[0]}
                    </div>
                    {cust.name}
                  </td>
                  <td className="px-6 py-4 text-text-muted space-y-1">
                    <div className="flex items-center gap-1"><Mail size={12} /> {cust.email}</div>
                    <div className="flex items-center gap-1"><Phone size={12} /> {cust.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-text-primary">{cust.visits}</td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-text-primary">
                    ₹{cust.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">{getTierBadge(cust.tier)}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-primary">
                    <span className="flex items-center justify-end gap-1"><Gift size={12} /> {Math.round(cust.totalSpent * 0.1)} pts</span>
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
