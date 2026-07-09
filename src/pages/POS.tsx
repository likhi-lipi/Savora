import React, { useState, useMemo } from 'react';
import { useSavoraState, MenuItem, OrderItem, Table } from '../context/SavoraContext';
import { SavoraLogo } from '../components/SavoraLogo';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Plus, 
  Minus, 
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
    addNotification,
    settings
  } = useSavoraState();

  const [selectedTableId, setSelectedTableId] = useState<string>('T-04');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'upi'>('card');
  const [selectedTipPercent, setSelectedTipPercent] = useState<number>(10);
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

  const taxRate = settings.tax / 100;
  const serviceRate = settings.service / 100;

  const tax = Number((cartSubtotal * taxRate).toFixed(2));
  const serviceCharge = Number((cartSubtotal * serviceRate).toFixed(2));
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
    window.print();
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
  const handleCategoryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.currentTarget.scrollLeft += e.deltaY;
  };
  const handleCategoryMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.setAttribute('data-isdown', 'true');
    el.setAttribute('data-startx', String(e.pageX - el.offsetLeft));
    el.setAttribute('data-scrollleft', String(el.scrollLeft));
  };
  const handleCategoryMouseLeaveOrUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.setAttribute('data-isdown', 'false');
  };
  const handleCategoryMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.getAttribute('data-isdown') !== 'true') return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const startX = Number(el.getAttribute('data-startx') || 0);
    const scrollLeft = Number(el.getAttribute('data-scrollleft') || 0);
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
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
                    ₹{Math.round(orders.find(o => o.id === table.currentOrderId)?.totalPrice || 0).toLocaleString('en-IN')}
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
              className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Clear Table (Dirty)
            </button>
          )}

          {activeOrder && (
            <div className="flex gap-2">
              <button 
                onClick={() => setShowReceiptModal(true)}
                className="p-1.5 hover:bg-background border border-border-custom rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-pointer"
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
                <span className="font-mono text-xs font-bold w-16 text-right text-text-primary">
                  ₹{Math.round(item.price * item.quantity).toLocaleString('en-IN')}
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
                placeholder="e.g. Less spicy, saffron strands extra, allergen warning..."
                value={cartNotes}
                onChange={(e) => setCartNotes(e.target.value)}
                className="w-full bg-white dark:bg-[#1A1D1A] border border-border-custom rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-primary"
                rows={2}
              />
              <button
                onClick={handleSendToKitchen}
                className="mt-3 w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
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

            <div 
              onWheel={handleCategoryWheel}
              onMouseDown={handleCategoryMouseDown}
              onMouseLeave={handleCategoryMouseLeaveOrUp}
              onMouseUp={handleCategoryMouseLeaveOrUp}
              onMouseMove={handleCategoryMouseMove}
              className="flex bg-white dark:bg-[#1A1D1A] border border-border-custom rounded-xl p-0.5 text-[10px] font-bold overflow-x-auto no-scrollbar touch-pan-x flex-nowrap shrink-0 max-w-full cursor-grab active:cursor-grabbing select-none"
             >
              {['all', 'starters', 'soups', 'mains', 'breads', 'rice', 'desserts', 'beverages'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap flex-shrink-0 ${selectedCategory === cat ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
                >
                  {cat === 'all' ? 'All' : cat === 'rice' ? 'Rice & Biryani' : cat === 'mains' ? 'Mains' : cat}
                </button>
              ))}
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
                  <span className="font-mono text-[10px] font-extrabold text-primary">₹{Math.round(dish.price)}</span>
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
          
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer ${
                paymentMethod === 'card' 
                  ? 'bg-primary text-white ring-1 ring-primary' 
                  : 'bg-white dark:bg-[#1A1D1A] border border-border-custom text-text-muted hover:text-text-primary'
              }`}
            >
              <CreditCard size={12} /> Card
            </button>
            
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer ${
                paymentMethod === 'cash' 
                  ? 'bg-primary text-white ring-1 ring-primary' 
                  : 'bg-white dark:bg-[#1A1D1A] border border-border-custom text-text-muted hover:text-text-primary'
              }`}
            >
              <DollarSign size={12} /> Cash
            </button>

            <button
              onClick={() => setPaymentMethod('upi')}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer ${
                paymentMethod === 'upi' 
                  ? 'bg-primary text-white ring-1 ring-primary' 
                  : 'bg-white dark:bg-[#1A1D1A] border border-border-custom text-text-muted hover:text-text-primary'
              }`}
            >
              <QrCode size={12} /> UPI / QR
            </button>
          </div>
        </div>

        {/* Calculations Pane */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto custom-scroll">
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Subtotal Items</span>
              <span className="font-bold font-mono text-text-primary">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-text-muted">
              <span>CGST ({(settings.tax / 2).toFixed(1)}%)</span>
              <span className="font-bold font-mono text-text-primary">₹{(tax / 2).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-text-muted">
              <span>SGST ({(settings.tax / 2).toFixed(1)}%)</span>
              <span className="font-bold font-mono text-text-primary">₹{(tax / 2).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-text-muted pb-3 border-b border-border-custom/60">
              <span>Service Charge ({settings.service}%)</span>
              <span className="font-bold font-mono text-text-primary">₹{serviceCharge.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-4 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-text-muted">Sub Total</span>
              <span className="text-xl font-extrabold text-text-primary font-mono">₹{orderTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Gratuity Models */}
          <div className="my-6">
            <h4 className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-3">Add Tip (Cashier Gratuity)</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <button 
                onClick={() => setSelectedTipPercent(5)}
                className={`py-3 border rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                  selectedTipPercent === 5 
                    ? 'bg-primary/10 text-primary border-primary ring-1 ring-primary/20 shadow-sm' 
                    : 'bg-white dark:bg-[#1A1D1A] border-border-custom text-text-muted hover:bg-background'
                }`}
              >
                5% (₹{(orderTotal * 0.05).toFixed(0)})
              </button>
              <button 
                onClick={() => setSelectedTipPercent(10)}
                className={`py-3 border rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                  selectedTipPercent === 10 
                    ? 'bg-primary/10 text-primary border-primary ring-1 ring-primary/20 shadow-sm' 
                    : 'bg-white dark:bg-[#1A1D1A] border-border-custom text-text-muted hover:bg-background'
                }`}
              >
                10% (₹{(orderTotal * 0.10).toFixed(0)})
              </button>
              <button 
                onClick={() => setSelectedTipPercent(15)}
                className={`py-3 border rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                  selectedTipPercent === 15 
                    ? 'bg-primary/10 text-primary border-primary ring-1 ring-primary/20 shadow-sm' 
                    : 'bg-white dark:bg-[#1A1D1A] border-border-custom text-text-muted hover:bg-background'
                }`}
              >
                15% (₹{(orderTotal * 0.15).toFixed(0)})
              </button>
            </div>
          </div>

          {/* UPI Live QR Preview */}
          {paymentMethod === 'upi' && activeOrder && (
            <div className="mb-6 p-4 bg-white dark:bg-background border border-border-custom rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Scan QR to pay UPI</p>
              <div className="p-2 bg-white rounded-xl border border-border-custom">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`upi://pay?pa=savorapay@upi&pn=${encodeURIComponent(settings.name)}&am=${finalTotal}&cu=INR`)}`}
                  alt="UPI QR Code"
                  className="w-[120px] h-[120px]"
                />
              </div>
              <span className="text-[10px] font-bold font-mono text-primary mt-2">TOTAL: ₹{finalTotal.toLocaleString('en-IN')}</span>
              <span className="text-[8px] text-text-muted mt-0.5">BHIM, GPay, PhonePe, Paytm accepted</span>
            </div>
          )}

          {/* Grand total highlight */}
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex justify-between items-baseline">
              <span className="text-xs font-semibold text-text-muted">Total Due:</span>
              <span className="text-3xl font-extrabold text-primary font-mono tracking-tight">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            <button 
              disabled={!activeOrder}
              onClick={() => setShowReceiptModal(true)}
              className="w-full bg-[#F8F7F4] dark:bg-[#111311] hover:bg-border-custom/40 border border-border-custom py-3.5 rounded-xl text-xs font-bold text-text-primary transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <Printer size={14} /> Preview & Print Receipt Check
            </button>

            <button 
              disabled={!activeOrder}
              onClick={handleCompletePayment}
              className="w-full bg-primary hover:bg-primary/95 text-white py-5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/15 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Complete payment check <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </section>

      {/* RECEIPT PREVIEW MODAL */}
      {showReceiptModal && activeOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md no-print">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowReceiptModal(false)}
          />
          <div 
            id="printable-receipt"
            className="relative w-full max-w-sm bg-white dark:bg-[#1A1D1A] rounded-[2rem] shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border-custom text-text-primary"
          >
            
            {/* Modal close */}
            <button 
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-sidebar text-text-muted cursor-pointer no-print"
            >
              <X size={16} />
            </button>

            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary no-print" />
            
            {/* Monospace Thermal Receipt */}
            <div className="text-center font-mono mt-4">
              <div className="flex justify-center mb-2">
                <SavoraLogo size={32} />
              </div>
              <h2 className="font-extrabold text-sm leading-none text-text-primary">SAVORA</h2>
              <p className="text-[9px] text-text-muted mt-1 uppercase tracking-wider font-bold">
                {settings.tagline || 'Smart Dining Simplified'}
              </p>
              
              <div className="mt-4 border-t border-dashed border-border-custom pt-3">
                <p className="text-xs font-bold text-text-primary">{settings.name || 'Saffron & Smoke Restaurant'}</p>
                <p className="text-[9px] text-text-muted mt-0.5">{settings.address || 'MG Road, Bengaluru, Karnataka 560001'}</p>
              </div>

              <div className="mt-2 text-[9px] text-text-muted">
                <p><span className="font-bold">Phone:</span> {settings.phone || '+91 98765 43210'}</p>
                <p><span className="font-bold">Website:</span> {settings.website || 'www.savora.app'}</p>
                <p><span className="font-bold">GSTIN:</span> {settings.gstin || '29ABCDE1234F1Z5'}</p>
              </div>
            </div>

            {/* Receipt metadata */}
            <div className="space-y-1 mt-4 border-t border-b border-dashed border-border-custom py-3 font-mono text-[9px] text-text-muted">
              <div className="flex justify-between">
                <span>Invoice No: #{activeOrder.id}</span>
                <span>Table: {selectedTable.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time: {new Date(activeOrder.timestamp).toLocaleDateString()} {new Date(activeOrder.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <span>Guests: {selectedTable.guestCount || 2}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier: {activeOrder.waiterName}</span>
                <span>Status: PRE-SETTLED</span>
              </div>
            </div>

            {/* Items list */}
            <div className="mt-4 font-mono text-xs border-b border-dashed border-border-custom pb-4 text-text-primary">
              <div className="flex justify-between text-[10px] font-extrabold text-text-primary border-b border-dashed border-border-custom pb-1.5 mb-2 uppercase tracking-wider">
                <span className="w-1/2 text-left">Item</span>
                <span className="w-1/12 text-center">Qty</span>
                <span className="w-3/12 text-right">Rate</span>
                <span className="w-3/12 text-right">Amount</span>
              </div>
              <div className="space-y-2">
                {activeOrder.items.map(item => (
                  <div key={item.menuItemId} className="flex justify-between items-start text-[10px]">
                    <div className="w-1/2 text-left pr-1">
                      <span className="break-words font-semibold">{item.name}</span>
                      {item.notes && <p className="text-[8px] text-text-muted italic leading-tight mt-0.5">"{item.notes}"</p>}
                    </div>
                    <span className="w-1/12 text-center font-semibold">{item.quantity}</span>
                    <span className="w-3/12 text-right">{Math.round(item.price).toLocaleString('en-IN')}</span>
                    <span className="w-3/12 text-right">{Math.round(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary calculations */}
            <div className="space-y-1.5 mt-4 font-mono text-[10px] text-text-muted border-b border-dashed border-border-custom pb-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%)</span>
                <span>₹{(tax / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (2.5%)</span>
                <span>₹{(tax / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-dashed border-border-custom text-text-primary mt-2">
                <span>GRAND TOTAL</span>
                <span className="text-primary">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Loyalty QR scan & footer */}
            <div className="text-center mt-5 space-y-3 font-mono">
              <div className="bg-[#F8F7F4] dark:bg-[#111311] p-2.5 rounded-2xl inline-block border border-border-custom/50 no-print">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=95x95&data=${encodeURIComponent(`upi://pay?pa=savorapay@upi&pn=${encodeURIComponent(settings.name)}&am=${finalTotal}&cu=INR`)}`}
                  alt="Receipt Pay QR"
                  className="w-[95px] h-[95px] mx-auto bg-white p-1 rounded-lg"
                />
                <p className="text-[7.5px] mt-1.5 font-extrabold text-text-muted tracking-tight">SCAN QR FOR FEEDBACK & UPI PAY</p>
              </div>
              
              <div className="space-y-0.5 text-text-primary">
                <p className="text-[10px] font-bold">Thank You For Dining With Us</p>
                <p className="text-[9px] font-medium text-text-muted">Visit Again</p>
              </div>

              <div className="text-[8px] text-text-muted pt-1">
                <p>{settings.website || 'www.savora.app'}</p>
                <p>{settings.email || 'support@savora.app'}</p>
              </div>
              
              <button 
                onClick={handleCompletePayment}
                className="w-full py-3 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer no-print"
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
