import React, { useState, useMemo } from 'react';
import { useSavoraState, MenuItem, OrderItem, Table } from '../context/SavoraContext';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  MoreVertical, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  ArrowRight,
  Search,
  BookOpen,
  Send,
  Sparkles,
  QrCode,
  X
} from 'lucide-react';

export const POS: React.FC = () => {
  const {
    tables,
    menuItems,
    orders,
    createOrder,
    addItemsToOrder,
    updateOrderItemQuantity,
    settleOrder,
    clearTable,
    setTableStatus,
    addNotification
  } = useSavoraState();

  const [selectedTableId, setSelectedTableId] = useState<string>('T-04');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [selectedTipPercent, setSelectedTipPercent] = useState<number>(20);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [cartNotes, setCartNotes] = useState('');
  const [guestCount, setGuestCount] = useState(2);

  // Selected Table details
  const selectedTable = useMemo(() => {
    return tables.find(t => t.id === selectedTableId) || tables[0];
  }, [tables, selectedTableId]);

  // Selected Table active order details
  const activeOrder = useMemo(() => {
    if (!selectedTable || !selectedTable.currentOrderId) return null;
    return orders.find(o => o.id === selectedTable.currentOrderId && o.status !== 'completed' && o.status !== 'cancelled') || null;
  }, [orders, selectedTable]);

  // Catalog filtering
  const filteredCatalog = useMemo(() => {
    return menuItems.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [menuItems, searchQuery, selectedCategory]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    if (activeOrder) {
      return activeOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [activeOrder, cartItems]);

  const tax = Number((cartSubtotal * 0.08).toFixed(2));
  const serviceCharge = Number((cartSubtotal * 0.05).toFixed(2));
  const orderTotal = Number((cartSubtotal + tax + serviceCharge).toFixed(2));
  
  const tipAmount = Number((orderTotal * (selectedTipPercent / 100)).toFixed(2));
  const finalTotal = Number((orderTotal + tipAmount).toFixed(2));

  // Add Item to Cart / Active Order
  const handleAddItem = (item: MenuItem) => {
    if (item.stockLevel === 'out') {
      addNotification('Out of Stock', `${item.name} is depleted. Cannot add to cart.`, 'error');
      return;
    }

    const newItem: OrderItem = {
      menuItemId: item.id,
      name: item.name,
      quantity: 1,
      price: item.price,
      category: item.category
    };

    if (activeOrder) {
      // Direct database update for occupied tables
      addItemsToOrder(activeOrder.id, [newItem]);
    } else {
      // Local state update for empty tables
      setCartItems(prev => {
        const existIdx = prev.findIndex(ci => ci.menuItemId === item.id);
        if (existIdx > -1) {
          return prev.map((ci, i) => i === existIdx ? { ...ci, quantity: ci.quantity + 1 } : ci);
        }
        return [...prev, newItem];
      });
    }
  };

  // Adjust Quantity
  const handleQuantityChange = (menuItemId: string, change: number) => {
    if (activeOrder) {
      updateOrderItemQuantity(activeOrder.id, menuItemId, change);
    } else {
      setCartItems(prev => prev.map(item => {
        if (item.menuItemId === menuItemId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as OrderItem[]);
    }
  };

  // Create & Fire order to KDS
  const handleSendToKitchen = () => {
    if (cartItems.length === 0) return;
    createOrder(selectedTableId, cartItems, guestCount, cartNotes);
    setCartItems([]);
    setCartNotes('');
  };

  // Settle Payment
  const handleCompletePayment = () => {
    if (!activeOrder) return;
    settleOrder(activeOrder.id, paymentMethod, selectedTipPercent, finalTotal);
    setShowReceiptModal(false);
  };

  const getTableStatusStyle = (status: Table['status']) => {
    switch (status) {
      case 'occupied':
        return 'bg-primary text-white shadow-sm ring-2 ring-primary ring-offset-2';
      case 'reserved':
        return 'bg-surface border border-border-custom opacity-70';
      case 'dirty':
        return 'bg-warning/15 border border-warning/35 text-warning';
      default:
        return 'bg-white border border-border-custom border-dashed hover:bg-primary/5 hover:border-primary';
    }
  };

  return (
    <div className="pt-2 flex flex-col md:flex-row h-[calc(100vh-6rem)] overflow-hidden gap-6 entrance-anim">
      
      {/* COLUMN 1: Seating Floor Map (1/4 Width) */}
      <section className="w-full md:w-1/4 bg-surface border border-border-custom/50 rounded-2xl flex flex-col overflow-hidden premium-shadow">
        <div className="p-4 border-b border-border-custom/40 flex justify-between items-center bg-background/10">
          <h3 className="font-bold text-sm text-text-primary">Floor Layout</h3>
          <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[9px] font-bold">
            {tables.filter(t => t.status === 'occupied').length}/{tables.length} Occupied
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {tables.map(table => (
              <div
                key={table.id}
                onClick={() => setSelectedTableId(table.id)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all duration-150 relative ${
                  selectedTableId === table.id 
                    ? table.status === 'occupied'
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : 'bg-primary/10 text-primary border-2 border-primary ring-offset-1'
                    : getTableStatusStyle(table.status)
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm tracking-tight">{table.name}</span>
                  {table.status === 'available' && <CheckCircle2 size={12} className="text-primary" />}
                  {table.status === 'occupied' && <Users size={12} className={selectedTableId === table.id ? 'text-white/80' : 'text-text-muted'} />}
                  {table.status === 'dirty' && <AlertCircle size={12} className="text-warning animate-pulse" />}
                  {table.status === 'reserved' && <Clock size={12} className="text-danger" />}
                </div>
                
                <p className={`text-[10px] mt-2 ${selectedTableId === table.id && table.status === 'occupied' ? 'text-white/80' : 'text-text-muted'}`}>
                  {table.status === 'occupied' ? `${table.guestCount} Guests • ${table.timer}m` : table.status === 'reserved' ? 'Reserved 19:30' : table.status === 'dirty' ? 'Dirty / Clean' : 'Available'}
                </p>

                {table.status === 'occupied' && (
                  <p className={`font-mono text-xs font-bold mt-1.5 ${selectedTableId === table.id ? 'text-white' : 'text-primary'}`}>
                    ${(orders.find(o => o.id === table.currentOrderId)?.totalPrice || 0).toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl">
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <Sparkles size={14} />
              <span className="text-[9px] font-bold tracking-widest uppercase">Live Insights</span>
            </div>
            <p className="text-[10px] text-text-muted leading-relaxed">
              Terrace seating is currently at 95% occupancy. Average service turn time: 55m.
            </p>
          </div>
        </div>
      </section>

      {/* COLUMN 2: Active Bill & Cart (2/5 Width) */}
      <section className="flex-1 bg-surface border border-border-custom/50 rounded-2xl flex flex-col overflow-hidden premium-shadow">
        
        {/* Cart Header */}
        <div className="p-4 border-b border-border-custom/40 flex justify-between items-center bg-background/10">
          <div>
            <h3 className="font-bold text-sm text-text-primary">
              {selectedTable.name} — {activeOrder ? 'Active Bill' : 'New Order Session'}
            </h3>
            <p className="text-[10px] text-text-muted mt-0.5 font-mono">
              {activeOrder ? `Bill ID: #${activeOrder.id} • Server: ${activeOrder.waiterName}` : 'Select items below to take guest order'}
            </p>
          </div>
          
          {selectedTable.status === 'dirty' && (
            <button 
              onClick={() => clearTable(selectedTable.id)}
              className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
            >
              Clear Table (Dirty)
            </button>
          )}

          {activeOrder && (
            <div className="flex gap-2">
              <button 
                onClick={() => setShowReceiptModal(true)}
                className="p-1.5 hover:bg-background border border-border-custom rounded-lg text-text-muted hover:text-text-primary transition-colors"
                title="Preview Bill Receipt"
              >
                <Printer size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-3 bg-background/15">
          
          {activeOrder && activeOrder.items.length === 0 && (
            <div className="text-center py-12 text-text-muted text-xs">
              No items in this check.
            </div>
          )}

          {!activeOrder && cartItems.length === 0 && (
            <div className="text-center py-16 flex flex-col items-center justify-center text-text-muted">
              <BookOpen size={36} className="text-border-custom mb-3" />
              <p className="text-xs font-semibold">Ready for Guest Selection</p>
              <p className="text-[10px] max-w-[200px] mt-1">Tap items on the bottom menu catalog to write order.</p>
              
              <div className="mt-4 flex items-center gap-3">
                <label className="text-[10px] font-bold">Party Guests:</label>
                <div className="flex items-center border border-border-custom rounded-lg overflow-hidden bg-white">
                  <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="px-2 py-1 hover:bg-sidebar text-xs">-</button>
                  <span className="px-3 text-xs font-bold">{guestCount}</span>
                  <button onClick={() => setGuestCount(guestCount + 1)} className="px-2 py-1 hover:bg-sidebar text-xs">+</button>
                </div>
              </div>
            </div>
          )}

          {/* Render Active Order Items or Cart Items */}
          {((activeOrder ? activeOrder.items : cartItems)).map(item => (
            <div 
              key={item.menuItemId}
              className="bg-white dark:bg-[#1A1D1A] p-3 rounded-xl border border-border-custom flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-text-primary truncate">{item.name}</h4>
                <p className="text-[9px] text-text-muted mt-0.5 capitalize">{item.category} {item.notes ? `• ${item.notes}` : ''}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border-custom rounded-lg overflow-hidden bg-[#F8F7F4] dark:bg-[#111311]">
                  <button 
                    onClick={() => handleQuantityChange(item.menuItemId, -1)}
                    className="px-2 py-1 hover:bg-sidebar transition-colors text-xs font-bold text-text-muted"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-text-primary">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.menuItemId, 1)}
                    className="px-2 py-1 hover:bg-sidebar transition-colors text-xs font-bold text-text-muted"
                  >
                    +
                  </button>
                </div>
                <span className="font-mono text-xs font-bold w-14 text-right text-text-primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {/* Order notes block for new orders */}
          {!activeOrder && cartItems.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border-custom">
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                Chef Preparation Notes
              </label>
              <textarea
                placeholder="e.g. Medium-rare steak, sauces on side, allergies..."
                value={cartNotes}
                onChange={(e) => setCartNotes(e.target.value)}
                className="w-full bg-white dark:bg-[#1A1D1A] border border-border-custom rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-primary"
                rows={2}
              />
              <button
                onClick={handleSendToKitchen}
                className="mt-3 w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Send size={14} /> Send Order to KDS
              </button>
            </div>
          )}
        </div>

        {/* Menu Catalog Picker (Bottom half of Center pane) */}
        <div className="border-t border-border-custom/50 p-4 bg-background/20 flex flex-col h-[260px] overflow-hidden">
          
          {/* Catalog Controls */}
          <div className="flex gap-2 items-center mb-3">
            <div className="relative flex-1 bg-white dark:bg-[#1A1D1A] border border-border-custom rounded-xl px-2.5 py-1.5 flex items-center">
              <Search size={14} className="text-text-muted mr-1.5" />
              <input
                type="text"
                placeholder="Quick search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-[11px] w-full outline-none focus:ring-0 placeholder:text-text-muted text-text-primary"
              />
            </div>

            <div className="flex bg-white dark:bg-[#1A1D1A] border border-border-custom rounded-xl p-0.5 text-[10px] font-bold">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg ${selectedCategory === 'all' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                All
              </button>
              <button 
                onClick={() => setSelectedCategory('appetizers')}
                className={`px-2.5 py-1 rounded-lg ${selectedCategory === 'appetizers' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                App
              </button>
              <button 
                onClick={() => setSelectedCategory('mains')}
                className={`px-2.5 py-1 rounded-lg ${selectedCategory === 'mains' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                Mains
              </button>
              <button 
                onClick={() => setSelectedCategory('desserts')}
                className={`px-2.5 py-1 rounded-lg ${selectedCategory === 'desserts' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                Des
              </button>
              <button 
                onClick={() => setSelectedCategory('beverages')}
                className={`px-2.5 py-1 rounded-lg ${selectedCategory === 'beverages' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                Bev
              </button>
            </div>
          </div>

          {/* Dishes Catalog Grid */}
          <div className="flex-1 overflow-y-auto custom-scroll grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredCatalog.map(dish => (
              <div
                key={dish.id}
                onClick={() => handleAddItem(dish)}
                className={`p-2.5 bg-white dark:bg-[#1A1D1A] border border-border-custom rounded-xl cursor-pointer hover:border-primary/50 transition-all flex flex-col justify-between active:scale-95 ${
                  dish.stockLevel === 'out' ? 'opacity-40 grayscale pointer-events-none' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-1">
                  <h5 className="font-bold text-[10px] text-text-primary leading-tight truncate-2-lines">{dish.name}</h5>
                  <span className="font-mono text-[10px] font-extrabold text-primary">${dish.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                    dish.stockLevel === 'low' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                  }`}>
                    {dish.stockLevel === 'low' ? 'Low Stock' : 'In Stock'}
                  </span>
                  <Plus size={10} className="text-primary border border-primary/20 rounded p-0.5 w-4 h-4 bg-primary/5" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* COLUMN 3: Payment Summary & Settle (1/3 Width) */}
      <section className="w-full md:w-1/3 bg-surface border border-border-custom/50 rounded-2xl flex flex-col overflow-hidden premium-shadow">
        
        {/* Payment Summary Header */}
        <div className="p-4 border-b border-border-custom/40 bg-background/10">
          <h3 className="font-bold text-sm text-text-primary">Checkout Billing</h3>
          
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                paymentMethod === 'card' 
                  ? 'bg-primary text-white ring-1 ring-primary' 
                  : 'bg-white dark:bg-[#1A1D1A] border border-border-custom text-text-muted hover:text-text-primary'
              }`}
            >
              <CreditCard size={14} /> Credit / Card
            </button>
            
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                paymentMethod === 'cash' 
                  ? 'bg-primary text-white ring-1 ring-primary' 
                  : 'bg-white dark:bg-[#1A1D1A] border border-border-custom text-text-muted hover:text-text-primary'
              }`}
            >
              <DollarSign size={14} /> Cash Drawer
            </button>
          </div>
        </div>

        {/* Calculations Pane */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Subtotal Items</span>
              <span className="font-bold font-mono text-text-primary">${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-text-muted">
              <span>Federal Sales Tax (8%)</span>
              <span className="font-bold font-mono text-text-primary">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-text-muted pb-3 border-b border-border-custom/60">
              <span>Service Charge (5%)</span>
              <span className="font-bold font-mono text-text-primary">${serviceCharge.toFixed(2)}</span>
            </div>
            <div className="pt-4 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-text-muted">Sub Total</span>
              <span className="text-xl font-extrabold text-text-primary font-mono">${orderTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Gratuity Models */}
          <div className="my-6">
            <h4 className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-3">Add Tip (Cashier Gratuity)</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <button 
                onClick={() => setSelectedTipPercent(15)}
                className={`py-3 border rounded-xl font-bold text-xs transition-all active:scale-95 ${
                  selectedTipPercent === 15 
                    ? 'bg-primary/10 text-primary border-primary ring-1 ring-primary/20 shadow-sm' 
                    : 'bg-white dark:bg-[#1A1D1A] border-border-custom text-text-muted hover:bg-background'
                }`}
              >
                15% (${(orderTotal * 0.15).toFixed(2)})
              </button>
              <button 
                onClick={() => setSelectedTipPercent(20)}
                className={`py-3 border rounded-xl font-bold text-xs transition-all active:scale-95 ${
                  selectedTipPercent === 20 
                    ? 'bg-primary/10 text-primary border-primary ring-1 ring-primary/20 shadow-sm' 
                    : 'bg-white dark:bg-[#1A1D1A] border-border-custom text-text-muted hover:bg-background'
                }`}
              >
                20% (${(orderTotal * 0.20).toFixed(2)})
              </button>
              <button 
                onClick={() => setSelectedTipPercent(25)}
                className={`py-3 border rounded-xl font-bold text-xs transition-all active:scale-95 ${
                  selectedTipPercent === 25 
                    ? 'bg-primary/10 text-primary border-primary ring-1 ring-primary/20 shadow-sm' 
                    : 'bg-white dark:bg-[#1A1D1A] border-border-custom text-text-muted hover:bg-background'
                }`}
              >
                25% (${(orderTotal * 0.25).toFixed(2)})
              </button>
            </div>
          </div>

          {/* Grand total highlight */}
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex justify-between items-baseline">
              <span className="text-xs font-semibold text-text-muted">Total Due:</span>
              <span className="text-3xl font-extrabold text-primary font-mono tracking-tight">${finalTotal.toFixed(2)}</span>
            </div>

            <button 
              disabled={!activeOrder}
              onClick={() => setShowReceiptModal(true)}
              className="w-full bg-[#F8F7F4] dark:bg-[#111311] hover:bg-border-custom/40 border border-border-custom py-3.5 rounded-xl text-xs font-bold text-text-primary transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Printer size={14} /> Preview & Print Receipt Check
            </button>

            <button 
              disabled={!activeOrder}
              onClick={handleCompletePayment}
              className="w-full bg-primary hover:bg-primary/95 text-white py-5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/15 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
            >
              Complete payment check <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </section>

      {/* RECEIPT PREVIEW MODAL */}
      {showReceiptModal && activeOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowReceiptModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#1A1D1A] rounded-[2rem] shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border-custom">
            
            {/* Modal close */}
            <button 
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-sidebar text-text-muted"
            >
              <X size={16} />
            </button>

            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            
            {/* Monospace Thermal Receipt */}
            <div className="text-center font-mono mt-4">
              <h2 className="font-extrabold text-xl leading-none text-text-primary">SAVORA POS</h2>
              <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] mt-1 font-bold">Smart Dining Solutions</p>
            </div>

            {/* Receipt metadata */}
            <div className="space-y-1 mt-6 border-b border-dashed border-border-custom pb-3 font-mono text-[10px] text-text-muted">
              <div className="flex justify-between">
                <span>Date: {new Date(activeOrder.timestamp).toLocaleDateString()}</span>
                <span>Time: {new Date(activeOrder.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex justify-between">
                <span>Table: {selectedTable.name} ({selectedTable.area})</span>
                <span>Check: #{activeOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Server: {activeOrder.waiterName}</span>
                <span>Guests: {selectedTable.guestCount || 2}</span>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-2 mt-4 font-mono text-xs border-b border-dashed border-border-custom pb-4 text-text-primary">
              {activeOrder.items.map(item => (
                <div key={item.menuItemId} className="flex justify-between items-start">
                  <div className="max-w-[200px]">
                    <span>{item.quantity}x {item.name}</span>
                    {item.notes && <p className="text-[9px] text-text-muted pl-4 italic">"{item.notes}"</p>}
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Summary calculations */}
            <div className="space-y-1.5 mt-4 font-mono text-xs text-text-muted">
              <div className="flex justify-between">
                <span>Subtotal Items</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee (5%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-border-custom pt-2">
                <span>Gratuity ({selectedTipPercent}%)</span>
                <span>${tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base pt-3 border-t-2 border-border-custom text-text-primary">
                <span>GRAND TOTAL</span>
                <span className="text-primary">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Loyalty QR scan */}
            <div className="text-center mt-6 space-y-4 font-mono">
              <div className="bg-[#F8F7F4] dark:bg-[#111311] p-3 rounded-2xl inline-block border border-border-custom/50">
                <QrCode size={48} className="text-text-primary mx-auto" />
                <p className="text-[8px] mt-1.5 font-bold text-text-muted tracking-tight">SCAN FOR BILL / LOYALTY</p>
              </div>
              <p className="text-[10px] italic text-text-muted">Thank you for dining with us.</p>
              
              <button 
                onClick={handleCompletePayment}
                className="w-full py-3 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5"
              >
                Settle & Print check <CheckCircle2 size={12} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
