import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Types Definition
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'desserts' | 'beverages';
  image: string;
  stockLevel: 'available' | 'low' | 'out';
  labels: string[];
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  category: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  timestamp: string;
  notes?: string;
  waiterName: string;
  totalPrice: number;
  tax: number;
  serviceCharge: number;
  tip: number;
  paymentMethod: 'card' | 'cash' | 'pending';
  timeElapsed: number; // minutes elapsed since order placed
}

export interface Table {
  id: string;
  name: string;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'dirty';
  timer: number; // time occupied in minutes
  currentOrderId: string | null;
  area: 'Main Hall' | 'Terrace' | 'Bar' | 'VIP Room';
  guestCount: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  partySize: number;
  time: string;
  date: string;
  tableId: string;
  tableName: string;
  status: 'confirmed' | 'seated' | 'cancelled';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minLevel: number;
  status: 'optimal' | 'low' | 'out';
}

export interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'waiter' | 'chef' | 'cashier';
  email: string;
  status: 'active' | 'break' | 'off';
  shift: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface SavoraContextProps {
  user: { name: string; role: string } | null;
  login: (role: string, name: string) => void;
  logout: () => void;
  tables: Table[];
  menuItems: MenuItem[];
  orders: Order[];
  reservations: Reservation[];
  inventory: InventoryItem[];
  employees: Employee[];
  notifications: Notification[];
  todayStats: {
    revenue: number;
    ordersCount: number;
    coversCount: number;
    avgCheck: number;
    tableTurn: number;
  };
  setTheme: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
  createOrder: (tableId: string, items: OrderItem[], guestCount: number, notes?: string) => string;
  addItemsToOrder: (orderId: string, items: OrderItem[]) => void;
  updateOrderItemQuantity: (orderId: string, menuItemId: string, change: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  settleOrder: (orderId: string, paymentMethod: 'card' | 'cash', tipPercent: number, customTotal?: number) => void;
  clearTable: (tableId: string) => void;
  setTableStatus: (tableId: string, status: Table['status'], guestCount?: number) => void;
  addReservation: (res: Omit<Reservation, 'id' | 'status'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItemStock: (id: string, stockLevel: MenuItem['stockLevel']) => void;
  addNotification: (title: string, message: string, type: Notification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateInventoryQuantity: (id: string, quantity: number) => void;
  updateEmployeeStatus: (id: string, status: Employee['status']) => void;
  resetMockData: () => void;
}

const SavoraContext = createContext<SavoraContextProps | undefined>(undefined);

const initialMenuItems: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Signature Wagyu Tartare',
    description: 'Hand-cut Australian Wagyu beef, cured egg yolk, caper berries, and house-made truffle sourdough crisps.',
    price: 32.00,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: ['Signature', 'Gluten-Free']
  },
  {
    id: 'menu-2',
    name: 'Heirloom Burrata',
    description: 'Creamy Puglia burrata, aged balsamic glaze, cold-pressed olive oil, and organic basil.',
    price: 18.50,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'low',
    labels: ['Vegetarian']
  },
  {
    id: 'menu-3',
    name: 'Pan-Seared Scallops',
    description: 'Jumbo scallops, cauliflower purée, crispy pancetta, and herb oil.',
    price: 26.00,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1532636875304-0c8fe1197e14?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: ['Gluten-Free']
  },
  {
    id: 'menu-4',
    name: 'Caesar Salad',
    description: 'Crisp romaine, shaved parmesan, garlic croutons, house Caesar dressing.',
    price: 14.00,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: []
  },
  {
    id: 'menu-5',
    name: 'Prime Ribeye Steak',
    description: '400g dry-aged USDA Prime Ribeye, roasted garlic bone marrow, rosemary butter.',
    price: 64.50,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: ['Signature']
  },
  {
    id: 'menu-6',
    name: 'Wild Atlantic Salmon',
    description: 'Pan-seared skin-on salmon, charcoal-grilled asparagus, and citrus reduction.',
    price: 29.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1485921325814-a532d8f49d7f?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: ['Gluten-Free']
  },
  {
    id: 'menu-7',
    name: 'Truffle Risotto',
    description: 'Acquerello carnaroli rice, seasonal wild mushrooms, fresh black truffle shavings.',
    price: 38.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: ['Signature', 'Vegetarian']
  },
  {
    id: 'menu-8',
    name: 'Braised Short Ribs',
    description: 'Slow-cooked beef short ribs, creamy polenta, red wine reduction glaze.',
    price: 42.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: []
  },
  {
    id: 'menu-9',
    name: 'Molten Lava Cake',
    description: '70% dark Belgian chocolate, Tahitian vanilla bean gelato, raspberry coulis.',
    price: 14.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: ['Vegetarian']
  },
  {
    id: 'menu-10',
    name: 'Gelato Trio',
    description: 'Tahitian Vanilla, Sicilian Pistachio, Dark Chocolate scoops.',
    price: 10.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: ['Vegetarian', 'Gluten-Free']
  },
  {
    id: 'menu-11',
    name: 'Tiramisu',
    description: 'Espresso-soaked ladyfingers, whipped mascarpone crema, cocoa powder dusting.',
    price: 12.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: ['Vegetarian']
  },
  {
    id: 'menu-12',
    name: 'Domaine Serene Chardonnay',
    description: 'Premium Oregon white wine, crisp acidity with hints of green apple and toasted oak.',
    price: 115.00,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: []
  },
  {
    id: 'menu-13',
    name: 'Estate Cabernet (Glass)',
    description: 'Bold red wine with notes of blackberry, cassis, and structured tannins.',
    price: 22.66,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: []
  },
  {
    id: 'menu-14',
    name: 'Old Fashioned Reserve',
    description: 'Premium bourbon, Angostura bitters, orange peel, luxardo cherry over clear ice.',
    price: 18.00,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: []
  },
  {
    id: 'menu-15',
    name: 'Veuve Clicquot Yellow Label',
    description: 'Classic dry French Champagne, fine bubbles, crisp and yellow-fruit flavors.',
    price: 145.00,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1594487523542-81c197780f18?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'low',
    labels: []
  },
  {
    id: 'menu-16',
    name: 'Espresso',
    description: 'Double shot of our house artisan blend, rich hazelnut crema.',
    price: 4.50,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-151097252790b-af4f42d91015?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: []
  },
  {
    id: 'menu-17',
    name: 'Martini',
    description: 'Dry gin or vodka, vermouth, green olives or a lemon twist.',
    price: 16.00,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?w=600&auto=format&fit=crop&q=80',
    stockLevel: 'available',
    labels: []
  }
];

const initialTables: Table[] = [
  { id: 'T-01', name: 'Table 01', seats: 6, status: 'occupied', timer: 60, currentOrderId: 'ORD-1011', area: 'Main Hall', guestCount: 5 },
  { id: 'T-02', name: 'Table 02', seats: 4, status: 'available', timer: 0, currentOrderId: null, area: 'Main Hall', guestCount: 0 },
  { id: 'T-03', name: 'Table 03', seats: 2, status: 'reserved', timer: 0, currentOrderId: null, area: 'Main Hall', guestCount: 0 },
  { id: 'T-04', name: 'Table 04', seats: 4, status: 'occupied', timer: 42, currentOrderId: 'ORD-1042', area: 'Main Hall', guestCount: 4 },
  { id: 'T-05', name: 'Table 05', seats: 2, status: 'available', timer: 0, currentOrderId: null, area: 'Terrace', guestCount: 0 },
  { id: 'T-06', name: 'Table 06', seats: 4, status: 'dirty', timer: 10, currentOrderId: null, area: 'Terrace', guestCount: 0 },
  { id: 'T-07', name: 'Table 07', seats: 8, status: 'occupied', timer: 80, currentOrderId: 'ORD-1017', area: 'VIP Room', guestCount: 7 },
  { id: 'T-08', name: 'Table 08', seats: 2, status: 'occupied', timer: 15, currentOrderId: 'ORD-1008', area: 'Bar', guestCount: 2 },
  { id: 'T-09', name: 'Table 09', seats: 2, status: 'available', timer: 0, currentOrderId: null, area: 'Bar', guestCount: 0 },
  { id: 'T-10', name: 'Table 10', seats: 4, status: 'reserved', timer: 0, currentOrderId: null, area: 'Terrace', guestCount: 0 },
  { id: 'T-12', name: 'Table 12', seats: 4, status: 'available', timer: 0, currentOrderId: null, area: 'Main Hall', guestCount: 0 },
  { id: 'T-18', name: 'Table 18', seats: 4, status: 'available', timer: 0, currentOrderId: null, area: 'Main Hall', guestCount: 0 }
];

const initialOrders: Order[] = [
  {
    id: 'ORD-1011',
    tableId: 'T-01',
    tableName: 'Table 01',
    items: [
      { menuItemId: 'menu-7', name: 'Truffle Risotto', quantity: 2, price: 38.00, category: 'mains' },
      { menuItemId: 'menu-2', name: 'Heirloom Burrata', quantity: 1, price: 18.50, category: 'appetizers' },
      { menuItemId: 'menu-12', name: 'Domaine Serene Chardonnay', quantity: 1, price: 115.00, category: 'beverages' }
    ],
    status: 'ready',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    waiterName: 'Sarah Jenkins',
    totalPrice: 209.50,
    tax: 16.76,
    serviceCharge: 10.48,
    tip: 0,
    paymentMethod: 'pending',
    timeElapsed: 60
  },
  {
    id: 'ORD-1042',
    tableId: 'T-04',
    tableName: 'Table 04',
    items: [
      { menuItemId: 'menu-3', name: 'Pan-Seared Scallops', quantity: 2, price: 26.00, notes: 'Extra purée', category: 'appetizers' },
      { menuItemId: 'menu-5', name: 'Prime Ribeye Steak', quantity: 1, price: 64.50, notes: 'Medium Rare', category: 'mains' },
      { menuItemId: 'menu-13', name: 'Estate Cabernet (Glass)', quantity: 3, price: 22.66, notes: 'Glass', category: 'beverages' }
    ],
    status: 'preparing',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    waiterName: 'Sarah Jenkins',
    totalPrice: 184.48,
    tax: 14.76,
    serviceCharge: 9.22,
    tip: 0,
    paymentMethod: 'pending',
    timeElapsed: 42
  },
  {
    id: 'ORD-1008',
    tableId: 'T-08',
    tableName: 'Table 08',
    items: [
      { menuItemId: 'menu-4', name: 'Caesar Salad', quantity: 1, price: 14.00, category: 'appetizers' },
      { menuItemId: 'menu-14', name: 'Old Fashioned Reserve', quantity: 2, price: 18.00, category: 'beverages' },
      { menuItemId: 'menu-10', name: 'Gelato Trio', quantity: 1, price: 10.00, category: 'desserts' }
    ],
    status: 'preparing',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    waiterName: 'Sarah Jenkins',
    totalPrice: 60.00,
    tax: 4.80,
    serviceCharge: 3.00,
    tip: 0,
    paymentMethod: 'pending',
    timeElapsed: 15
  },
  {
    id: 'ORD-1017',
    tableId: 'T-07',
    tableName: 'Table 07',
    items: [
      { menuItemId: 'menu-5', name: 'Prime Ribeye Steak', quantity: 3, price: 64.50, category: 'mains' },
      { menuItemId: 'menu-8', name: 'Braised Short Ribs', quantity: 2, price: 42.00, category: 'mains' },
      { menuItemId: 'menu-15', name: 'Veuve Clicquot Yellow Label', quantity: 1, price: 145.00, category: 'beverages' }
    ],
    status: 'pending',
    timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    waiterName: 'Sarah Jenkins',
    totalPrice: 422.50,
    tax: 33.80,
    serviceCharge: 21.13,
    tip: 0,
    paymentMethod: 'pending',
    timeElapsed: 80
  },
  // Completed historical orders for charts & overview
  {
    id: 'ORD-4921',
    tableId: 'T-18',
    tableName: 'Table 18',
    items: [
      { menuItemId: 'menu-1', name: 'Signature Wagyu Tartare', quantity: 2, price: 32.00, category: 'appetizers' },
      { menuItemId: 'menu-5', name: 'Prime Ribeye Steak', quantity: 1, price: 64.50, category: 'mains' },
      { menuItemId: 'menu-14', name: 'Old Fashioned Reserve', quantity: 3, price: 18.00, category: 'beverages' }
    ],
    status: 'completed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    waiterName: 'Sarah Jenkins',
    totalPrice: 182.50,
    tax: 14.60,
    serviceCharge: 9.13,
    tip: 36.50,
    paymentMethod: 'card',
    timeElapsed: 45
  },
  {
    id: 'ORD-4919',
    tableId: 'T-12',
    tableName: 'Table 12',
    items: [
      { menuItemId: 'menu-6', name: 'Wild Atlantic Salmon', quantity: 2, price: 29.00, category: 'mains' },
      { menuItemId: 'menu-7', name: 'Truffle Risotto', quantity: 1, price: 38.00, category: 'mains' },
      { menuItemId: 'menu-17', name: 'Martini', quantity: 2, price: 16.00, category: 'beverages' }
    ],
    status: 'completed',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    waiterName: 'Sarah Jenkins',
    totalPrice: 128.00,
    tax: 10.24,
    serviceCharge: 6.40,
    tip: 25.00,
    paymentMethod: 'card',
    timeElapsed: 55
  },
  {
    id: 'ORD-4915',
    tableId: 'T-05',
    tableName: 'Table 05',
    items: [
      { menuItemId: 'menu-5', name: 'Prime Ribeye Steak', quantity: 6, price: 64.50, category: 'mains' },
      { menuItemId: 'menu-12', name: 'Domaine Serene Chardonnay', quantity: 3, price: 115.00, category: 'beverages' }
    ],
    status: 'completed',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    waiterName: 'Sarah Jenkins',
    totalPrice: 732.00,
    tax: 58.56,
    serviceCharge: 36.60,
    tip: 150.00,
    paymentMethod: 'card',
    timeElapsed: 75
  }
];

const initialReservations: Reservation[] = [
  { id: 'res-1', customerName: 'Sarah Jenkins', partySize: 4, time: '19:30', date: 'Today', tableId: 'T-12', tableName: 'Table 12', status: 'confirmed' },
  { id: 'res-2', customerName: 'David Kim', partySize: 2, time: '18:00', date: 'Today', tableId: 'T-03', tableName: 'Table 03', status: 'confirmed' },
  { id: 'res-3', customerName: 'Michael Vance', partySize: 6, time: '20:15', date: 'Tomorrow', tableId: 'T-01', tableName: 'Table 01', status: 'confirmed' },
  { id: 'res-4', customerName: 'Jessica Taylor', partySize: 2, time: '21:00', date: 'Today', tableId: 'T-10', tableName: 'Table 10', status: 'confirmed' }
];

const initialInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Wagyu Beef Tenderloin', category: 'Meat', quantity: 18.5, unit: 'kg', minLevel: 5.0, status: 'optimal' },
  { id: 'inv-2', name: 'Burrata Cheese Puglia', category: 'Dairy', quantity: 4, unit: 'pcs', minLevel: 10.0, status: 'low' },
  { id: 'inv-3', name: 'Jumbo Scallops Fresh', category: 'Seafood', quantity: 8.2, unit: 'kg', minLevel: 3.0, status: 'optimal' },
  { id: 'inv-4', name: 'Black Summer Truffles', category: 'Gourmet', quantity: 350, unit: 'g', minLevel: 100, status: 'optimal' },
  { id: 'inv-5', name: 'Domaine Serene Chardonnay', category: 'Wine', quantity: 42, unit: 'bottles', minLevel: 10, status: 'optimal' },
  { id: 'inv-6', name: 'Veuve Clicquot Champagne', category: 'Wine', quantity: 4, unit: 'bottles', minLevel: 12, status: 'low' },
  { id: 'inv-7', name: 'Artisan Coffee Beans', category: 'Beverage', quantity: 24.0, unit: 'kg', minLevel: 5.0, status: 'optimal' },
  { id: 'inv-8', name: 'Prime USDA Ribeye Portions', category: 'Meat', quantity: 28, unit: 'portions', minLevel: 8, status: 'optimal' }
];

const initialEmployees: Employee[] = [
  { id: 'emp-1', name: 'Marc Jenkins', role: 'admin', email: 'marc@savora.com', status: 'active', shift: 'Double Shift' },
  { id: 'emp-2', name: 'Sarah Jenkins', role: 'waiter', email: 'sarah@savora.com', status: 'active', shift: 'Morning Shift' },
  { id: 'emp-3', name: 'Marcus Vance', role: 'manager', email: 'marcus@savora.com', status: 'active', shift: 'Evening Shift' },
  { id: 'emp-4', name: 'Pierre Dubois', role: 'chef', email: 'pierre@savora.com', status: 'active', shift: 'Morning Shift' },
  { id: 'emp-5', name: 'Elena Rostova', role: 'cashier', email: 'elena@savora.com', status: 'active', shift: 'Double Shift' }
];

const initialNotifications: Notification[] = [
  { id: 'notif-1', title: '2 Late Orders', message: 'Table 04 & Table 07 active orders have exceeded average preparation timer.', type: 'warning', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), read: false },
  { id: 'notif-2', title: 'Low Stock Alert', message: 'Veuve Clicquot Champagne is down to 4 bottles. Reroute orders or request restock.', type: 'error', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), read: false },
  { id: 'notif-3', title: 'VIP Reservation seated', message: 'Sarah Jenkins party has been checked in and assigned to Table 12.', type: 'info', timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), read: true },
  { id: 'notif-4', title: 'Sales target reached', message: 'Revenue for today exceeded $10,000 baseline milestone.', type: 'success', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: true }
];

export const SavoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(() => {
    const saved = localStorage.getItem('savora_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('savora_platform_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('savora_tables');
    return saved ? JSON.parse(saved) : initialTables;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('savora_menu');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('savora_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('savora_reservations');
    return saved ? JSON.parse(saved) : initialReservations;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('savora_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('savora_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('savora_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const loggedInUser = {
              name: userData.name || firebaseUser.displayName || 'User',
              role: userData.role || 'admin',
              email: firebaseUser.email
            };
            setUser(loggedInUser);
            localStorage.setItem('savora_user', JSON.stringify(loggedInUser));
          } else {
            const fallbackUser = {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              role: 'admin',
              email: firebaseUser.email
            };
            setUser(fallbackUser);
            localStorage.setItem('savora_user', JSON.stringify(fallbackUser));
          }
        } catch (error) {
          console.error("Error fetching user profile from Firestore:", error);
        }
      } else {
        // If the currently saved user is a Firebase user (has email), clear it since they are now signed out.
        const saved = localStorage.getItem('savora_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.email) {
              setUser(null);
              localStorage.removeItem('savora_user');
            }
          } catch (e) {
            setUser(null);
            localStorage.removeItem('savora_user');
          }
        } else {
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const [todayStats, setTodayStats] = useState({
    revenue: 14920,
    ordersCount: 184,
    coversCount: 216,
    avgCheck: 81.08,
    tableTurn: 68
  });

  // Calculate and sync today statistics based on completed orders
  useEffect(() => {
    const completed = orders.filter(o => o.status === 'completed');
    const completedToday = completed.filter(o => {
      const orderDate = new Date(o.timestamp);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    });

    const calculatedRevenue = completedToday.reduce((sum, o) => sum + o.totalPrice, 0) + 14000; // static base + actual
    const calculatedOrdersCount = completedToday.length + 180;
    const calculatedCovers = completedToday.reduce((sum, o) => {
      const table = initialTables.find(t => t.id === o.tableId);
      return sum + (table ? table.seats : 2);
    }, 0) + 210;

    const baseChecks = 180;
    const totalChecks = baseChecks + completedToday.length;
    const avgCheck = totalChecks > 0 ? Number((calculatedRevenue / totalChecks).toFixed(2)) : 80;

    setTodayStats({
      revenue: calculatedRevenue,
      ordersCount: calculatedOrdersCount,
      coversCount: calculatedCovers,
      avgCheck: avgCheck,
      tableTurn: 68
    });
  }, [orders]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('savora_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('savora_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('savora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('savora_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('savora_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('savora_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('savora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Set Theme
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('savora_platform_theme', newTheme);
    const root = window.document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Run on mount to set initial theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Authenticate
  const login = (role: string, name: string) => {
    const newUserData = { name, role };
    setUser(newUserData);
    localStorage.setItem('savora_user', JSON.stringify(newUserData));
    addNotification('Logged In', `Logged in as ${name} (${role})`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('savora_user');
    signOut(auth).catch(err => console.error("Signout error:", err));
  };

  // POS - Create Order
  const createOrder = (tableId: string, items: OrderItem[], guestCount: number, notes?: string): string => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const table = tables.find(t => t.id === tableId);
    
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Number((subtotal * 0.08).toFixed(2));
    const serviceCharge = Number((subtotal * 0.05).toFixed(2));
    const totalPrice = Number((subtotal + tax + serviceCharge).toFixed(2));

    const newOrder: Order = {
      id: orderId,
      tableId,
      tableName: table ? table.name : 'Unknown',
      items,
      status: 'pending',
      timestamp: new Date().toISOString(),
      notes,
      waiterName: user?.name || 'Sarah Jenkins',
      totalPrice,
      tax,
      serviceCharge,
      tip: 0,
      paymentMethod: 'pending',
      timeElapsed: 0
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update Table status
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'occupied',
          currentOrderId: orderId,
          timer: 1,
          guestCount: guestCount || t.seats
        };
      }
      return t;
    }));

    addNotification('Order Sent', `Order ${orderId} created for Table ${table?.name || tableId}`, 'info');
    return orderId;
  };

  // Add items to existing order
  const addItemsToOrder = (orderId: string, newItems: OrderItem[]) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const mergedItems = [...o.items];
        
        newItems.forEach(newItem => {
          const existingIndex = mergedItems.findIndex(mi => mi.menuItemId === newItem.menuItemId);
          if (existingIndex > -1) {
            mergedItems[existingIndex].quantity += newItem.quantity;
            if (newItem.notes) {
              mergedItems[existingIndex].notes = mergedItems[existingIndex].notes 
                ? `${mergedItems[existingIndex].notes}, ${newItem.notes}`
                : newItem.notes;
            }
          } else {
            mergedItems.push(newItem);
          }
        });

        const subtotal = mergedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = Number((subtotal * 0.08).toFixed(2));
        const serviceCharge = Number((subtotal * 0.05).toFixed(2));
        const totalPrice = Number((subtotal + tax + serviceCharge).toFixed(2));

        return {
          ...o,
          items: mergedItems,
          totalPrice,
          tax,
          serviceCharge,
          status: 'pending' // Send back to pending status in KDS
        };
      }
      return o;
    }));

    addNotification('Order Updated', `Added items to ${orderId}`, 'info');
  };

  // Update order item quantity directly
  const updateOrderItemQuantity = (orderId: string, menuItemId: string, change: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(item => {
          if (item.menuItemId === menuItemId) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        }).filter(Boolean) as OrderItem[];

        const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = Number((subtotal * 0.08).toFixed(2));
        const serviceCharge = Number((subtotal * 0.05).toFixed(2));
        const totalPrice = Number((subtotal + tax + serviceCharge).toFixed(2));

        return {
          ...o,
          items: updatedItems,
          totalPrice,
          tax,
          serviceCharge
        };
      }
      return o;
    }));
  };

  // KDS - Update status
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    }));

    // Toast notification for status changes
    if (status === 'preparing') {
      addNotification('Kitchen Preparing', `${orderId} is now in preparation.`, 'info');
    } else if (status === 'ready') {
      const order = orders.find(o => o.id === orderId);
      addNotification('Order Ready!', `${orderId} for Table ${order?.tableName || 'Table'} is ready to be served.`, 'success');
    }
  };

  // Settle Bill (Cashier)
  const settleOrder = (orderId: string, paymentMethod: 'card' | 'cash', tipPercent: number, customTotal?: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const tip = Number((order.totalPrice * (tipPercent / 100)).toFixed(2));
    const finalTotal = customTotal || Number((order.totalPrice + tip).toFixed(2));

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'completed',
          paymentMethod,
          tip,
          totalPrice: finalTotal
        };
      }
      return o;
    }));

    // Free the table, set status to dirty
    setTables(prev => prev.map(t => {
      if (t.id === order.tableId) {
        return {
          ...t,
          status: 'dirty',
          currentOrderId: null,
          guestCount: 0,
          timer: 0
        };
      }
      return t;
    }));

    addNotification('Payment Settled', `Order ${orderId} settled ($${finalTotal}) via ${paymentMethod.toUpperCase()}`, 'success');
  };

  // Table - Clean / Ready
  const clearTable = (tableId: string) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { ...t, status: 'available' };
      }
      return t;
    }));
    addNotification('Table Cleared', `Table ${tableId} is clean and available.`, 'success');
  };

  const setTableStatus = (tableId: string, status: Table['status'], guestCount = 0) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status,
          guestCount: status === 'occupied' ? guestCount || t.seats : 0,
          timer: status === 'occupied' ? 1 : 0
        };
      }
      return t;
    }));
  };

  // Reservations
  const addReservation = (res: Omit<Reservation, 'id' | 'status'>) => {
    const newRes: Reservation = {
      ...res,
      id: `res-${Math.floor(100 + Math.random() * 900)}`,
      status: 'confirmed'
    };
    setReservations(prev => [...prev, newRes]);

    // Mark table as reserved in system
    if (res.tableId) {
      setTables(prev => prev.map(t => {
        if (t.id === res.tableId) {
          return { ...t, status: 'reserved' };
        }
        return t;
      }));
    }

    addNotification('Reservation Placed', `Confirmed reservation for ${res.customerName} on ${res.date} at ${res.time}`, 'success');
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(r => {
      if (r.id === id) {
        // If seated, occupy table immediately
        if (status === 'seated' && r.tableId) {
          setTableStatus(r.tableId, 'occupied', r.partySize);
        }
        return { ...r, status };
      }
      return r;
    }));
  };

  // Menu items config
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${menuItems.length + 1}`
    };
    setMenuItems(prev => [...prev, newItem]);
    addNotification('Menu Item Added', `Added ${item.name} to ${item.category}`, 'success');
  };

  const updateMenuItemStock = (id: string, stockLevel: MenuItem['stockLevel']) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, stockLevel };
      }
      return item;
    }));
    addNotification('Stock Updated', `Updated stock status for menu item.`, 'info');
  };

  // Notifications hub
  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `notif-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Inventory
  const updateInventoryQuantity = (id: string, quantity: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, quantity);
        const status = newQty === 0 ? 'out' : newQty <= item.minLevel ? 'low' : 'optimal';
        
        // Trigger alert notifications for critical levels
        if (status === 'out') {
          addNotification('Stock Depleted!', `${item.name} is completely out of stock.`, 'error');
        } else if (status === 'low') {
          addNotification('Low Inventory Warning', `${item.name} is running low (${newQty} ${item.unit} left).`, 'warning');
        }

        return {
          ...item,
          quantity: newQty,
          status
        };
      }
      return item;
    }));
  };

  // Employees Roster
  const updateEmployeeStatus = (id: string, status: Employee['status']) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        return { ...emp, status };
      }
      return emp;
    }));
  };

  // Simulate active timers (preparation durations, seated timers)
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment active occupied table timers
      setTables(prev => prev.map(t => {
        if (t.status === 'occupied' && t.timer > 0) {
          return { ...t, timer: t.timer + 1 };
        }
        return t;
      }));

      // Increment elapsed timers on preparation orders
      setOrders(prev => prev.map(o => {
        if (o.status === 'pending' || o.status === 'preparing') {
          const updatedTime = o.timeElapsed + 1;
          
          // Trigger system warning for extremely late orders (e.g. over 15 mins)
          if (updatedTime === 15) {
            addNotification(
              'Kitchen Delay Warning', 
              `Order ${o.id} at ${o.tableName} has been in queue for 15 minutes.`, 
              'warning'
            );
          }
          return { ...o, timeElapsed: updatedTime };
        }
        return o;
      }));
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  const resetMockData = () => {
    setTables(initialTables);
    setMenuItems(initialMenuItems);
    setOrders(initialOrders);
    setReservations(initialReservations);
    setInventory(initialInventory);
    setEmployees(initialEmployees);
    setNotifications(initialNotifications);
    localStorage.removeItem('savora_tables');
    localStorage.removeItem('savora_menu');
    localStorage.removeItem('savora_orders');
    localStorage.removeItem('savora_reservations');
    localStorage.removeItem('savora_inventory');
    localStorage.removeItem('savora_employees');
    localStorage.removeItem('savora_notifications');
    addNotification('System Reset', 'All database items successfully reseeded to default states.', 'success');
  };

  return (
    <SavoraContext.Provider value={{
      user,
      login,
      logout,
      tables,
      menuItems,
      orders,
      reservations,
      inventory,
      employees,
      notifications,
      todayStats,
      theme,
      setTheme,
      createOrder,
      addItemsToOrder,
      updateOrderItemQuantity,
      updateOrderStatus,
      settleOrder,
      clearTable,
      setTableStatus,
      addReservation,
      updateReservationStatus,
      addMenuItem,
      updateMenuItemStock,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      updateInventoryQuantity,
      updateEmployeeStatus,
      resetMockData
    }}>
      {children}
    </SavoraContext.Provider>
  );
};

export const useSavoraState = () => {
  const context = useContext(SavoraContext);
  if (context === undefined) {
    throw new Error('useSavoraState must be used within a SavoraProvider');
  }
  return context;
};
