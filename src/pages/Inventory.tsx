import React, { useState } from 'react';
import { useSavoraState } from '../context/SavoraContext';
import { Package, Search, Plus, Minus, AlertTriangle, RefreshCw } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { inventory, updateInventoryQuantity } = useSavoraState();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'low':
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-warning/10 text-warning border border-warning/20">Low Level</span>;
      case 'out':
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-danger/10 text-danger border border-danger/20 animate-pulse">Out of Stock</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-success/15 text-primary border border-accent/25">Optimal</span>;
    }
  };

  return (
    <div className="space-y-6 entrance-anim">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">Stock & Inventory</h2>
        <p className="text-text-muted text-sm mt-1">Track pantry ingredients and schedule vendor refills.</p>
      </div>

      {/* Control bar */}
      <div className="p-4 bg-surface border border-border-custom/50 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex items-center bg-background border border-border-custom rounded-xl px-2.5 py-1.5 w-full sm:w-80">
          <Search size={14} className="text-text-muted mr-1.5" />
          <input
            type="text"
            placeholder="Search ingredients catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs w-full outline-none focus:ring-0 placeholder:text-text-muted/70 text-text-primary"
          />
        </div>
      </div>

      {/* Alarms row */}
      {inventory.some(item => item.status !== 'optimal') && (
        <div className="bg-warning/10 border border-warning/20 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="text-warning animate-bounce flex-shrink-0" size={18} />
          <div>
            <h4 className="text-xs font-bold text-text-primary">Depleted Stock Levels Warning</h4>
            <p className="text-[10px] text-text-muted mt-0.5">
              Some key pantry items are below minimum safety levels. Refill Paneer, Saffron, or Ghee to avoid service interruptions.
            </p>
          </div>
        </div>
      )}

      {/* Main Inventory table */}
      <div className="bg-surface border border-border-custom/50 rounded-2xl premium-shadow overflow-hidden text-left">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#F8F7F4] dark:bg-[#111311] border-b border-border-custom/50 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-4">Ingredient Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Safety Threshold</th>
                <th className="px-6 py-4 text-center">Current Quantity</th>
                <th className="px-6 py-4">Fulfillment Status</th>
                <th className="px-6 py-4 text-right">Adjust Stock Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/35">
              {filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-background/25 transition-colors">
                  <td className="px-6 py-4 font-bold text-text-primary flex items-center gap-2">
                    <Package size={14} className="text-primary" /> {item.name}
                  </td>
                  <td className="px-6 py-4 text-text-muted">{item.category}</td>
                  <td className="px-6 py-4 text-center font-semibold text-text-muted">
                    {item.minLevel} {item.unit}
                  </td>
                  <td className="px-6 py-4 text-center font-bold font-mono text-text-primary">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => updateInventoryQuantity(item.id, item.quantity - 1)}
                        className="bg-background border border-border-custom hover:bg-border-custom/30 text-text-muted p-1 rounded-lg active:scale-90 transition-all"
                      >
                        <Minus size={10} />
                      </button>
                      <button
                        onClick={() => updateInventoryQuantity(item.id, item.quantity + 1)}
                        className="bg-background border border-border-custom hover:bg-border-custom/30 text-text-muted p-1 rounded-lg active:scale-90 transition-all"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
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
