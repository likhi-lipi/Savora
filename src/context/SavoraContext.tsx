import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';

// Cache buster for the new Indian mock data
const CACHE_VERSION = 'v3_indian_menu';
const currentVersion = localStorage.getItem('savora_cache_version');
if (currentVersion !== CACHE_VERSION) {
  const keysToRemove = [
    'savora_menu', 'savora_orders', 'savora_tables', 
    'savora_reservations', 'savora_inventory', 'savora_employees', 
    'savora_notifications', 'savora_settings'
  ];
  keysToRemove.forEach(k => localStorage.removeItem(k));
  localStorage.setItem('savora_cache_version', CACHE_VERSION);
}

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, writeBatch } from 'firebase/firestore';

// Types Definition
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starters' | 'soups' | 'mains' | 'breads' | 'rice' | 'desserts' | 'beverages';
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
  paymentMethod: 'card' | 'cash' | 'upi' | 'pending';
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

export interface RestaurantSettings {
  name: string;
  hours: string;
  tax: number;
  service: number;
  receiptFooter: string;
}

interface SavoraContextProps {
  user: { name: string; role: string; restaurantId?: string | null; email?: string | null } | null;
  login: (role: string, name: string) => void;
  logout: () => void;
  tables: Table[];
  menuItems: MenuItem[];
  orders: Order[];
  reservations: Reservation[];
  inventory: InventoryItem[];
  employees: Employee[];
  notifications: Notification[];
  settings: RestaurantSettings;
  updateSettings: (newSettings: RestaurantSettings) => void;
  todayStats: {
    revenue: number;
    ordersCount: number;
    coversCount: number;
    avgCheck: number;
    tableTurn: number;
  };
  setTheme: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
  restaurantId: string | null;
  setRestaurantId: (id: string | null) => void;
  createOrder: (tableId: string, items: OrderItem[], guestCount: number, notes?: string) => string;
  addItemsToOrder: (orderId: string, items: OrderItem[]) => void;
  updateOrderItemQuantity: (orderId: string, menuItemId: string, change: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  settleOrder: (orderId: string, paymentMethod: 'card' | 'cash' | 'upi' | 'pending', tipPercent: number, customTotal?: number) => void;
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
  // Starters
  { id: 'menu-1', name: 'Paneer Tikka', description: 'Soft cubes of cottage cheese marinated in hung curd, aromatic Indian spices, and grilled to perfection in a traditional tandoor.', price: 349.00, category: 'starters', image: 'https://images.unsplash.com/photo-1599487405270-8950c42dcd68?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-2', name: 'Hara Bhara Kebab', description: 'Healthy and tasty vegetarian kababs made with spinach, potatoes, and green peas.', price: 289.00, category: 'starters', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-3', name: 'Chicken Tikka', description: 'Juicy, tender chicken pieces marinated in spiced yogurt and roasted in the tandoor.', price: 429.00, category: 'starters', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: [] },
  { id: 'menu-4', name: 'Tandoori Chicken (Half)', description: 'Iconic half-portion tandoori chicken, marinated with robust spices and char-grilled.', price: 499.00, category: 'starters', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-5', name: 'Seekh Kebab', description: 'Minced lamb blended with Indian spices, skewered and cooked in a clay oven.', price: 449.00, category: 'starters', image: 'https://images.unsplash.com/photo-1603496987351-f84a3ba5ec85?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: [] },
  { id: 'menu-6', name: 'Crispy Corn Masala', description: 'Crunchy golden sweet corn kernels tossed with fiery spices and lemon juice.', price: 249.00, category: 'starters', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-7', name: 'Tandoori Mushroom', description: 'Fresh button mushrooms marinated in tandoori masala and grilled to a smoky finish.', price: 319.00, category: 'starters', image: 'https://images.unsplash.com/photo-1599487405270-8950c42dcd68?w=600&auto=format&fit=crop&q=80', stockLevel: 'low', labels: ['Vegetarian'] },

  // Soups
  { id: 'menu-8', name: 'Tomato Dhaniya Soup', description: 'A light, comforting soup made with fresh ripe tomatoes and a hint of fresh coriander.', price: 189.00, category: 'soups', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-9', name: 'Sweet Corn Soup', description: 'Classic creamy soup bursting with sweet corn kernels and delicate flavors.', price: 199.00, category: 'soups', image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-10', name: 'Hot & Sour Soup', description: 'A perfectly balanced spicy and tangy broth loaded with finely chopped vegetables.', price: 209.00, category: 'soups', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb438?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-11', name: 'Cream of Mushroom Soup', description: 'Rich, earthy mushroom soup finished with fresh cream and cracked black pepper.', price: 229.00, category: 'soups', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4850?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },

  // Main Course
  { id: 'menu-12', name: 'Butter Chicken', description: 'Tender tandoori chicken simmered in a rich, creamy tomato gravy finished with butter and kasuri methi.', price: 499.00, category: 'mains', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-13', name: 'Paneer Butter Masala', description: 'Fresh cottage cheese cubes simmered in a spiced tomato-onion gravy with dried fenugreek.', price: 389.00, category: 'mains', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-14', name: 'Dal Makhani', description: 'Slow-cooked black lentils simmered overnight on hot embers with tomatoes, cream, and butter.', price: 329.00, category: 'mains', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-15', name: 'Kadai Paneer', description: 'Cottage cheese and bell peppers cooked in a spicy, flavorful freshly ground kadai masala.', price: 379.00, category: 'mains', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-16', name: 'Shahi Paneer', description: 'Royal paneer dish in a thick, sweet and spicy creamy gravy made from nuts and cream.', price: 399.00, category: 'mains', image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-17', name: 'Chicken Curry', description: 'Home-style chicken curry cooked slowly with traditional Indian whole spices.', price: 469.00, category: 'mains', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: [] },
  { id: 'menu-18', name: 'Rogan Josh', description: 'A signature Kashmiri dish featuring tender mutton cooked with aromatic spices and a vibrant red chili gravy.', price: 589.00, category: 'mains', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-19', name: 'Malai Kofta', description: 'Fried dumplings of potato and paneer served in a rich, mild, and creamy cashew gravy.', price: 389.00, category: 'mains', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-20', name: 'Chole Masala', description: 'Classic North Indian dish made with white chickpeas simmered in an onion-tomato masala.', price: 299.00, category: 'mains', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-21', name: 'Palak Paneer', description: 'Cubes of soft paneer cooked in a smooth, mildly spiced spinach puree.', price: 369.00, category: 'mains', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },

  // Breads
  { id: 'menu-22', name: 'Butter Naan', description: 'Classic fluffy Indian flatbread baked in a tandoor and generously brushed with butter.', price: 79.00, category: 'breads', image: 'https://images.unsplash.com/photo-1573504859012-70b7904e5d6d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-23', name: 'Garlic Naan', description: 'Traditional Indian flatbread flavored with minced garlic and coriander.', price: 99.00, category: 'breads', image: 'https://images.unsplash.com/photo-1605804364028-591b9f620bd3?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-24', name: 'Cheese Naan', description: 'Indulgent soft naan bread stuffed with a blend of melted cheeses.', price: 149.00, category: 'breads', image: 'https://images.unsplash.com/photo-1573504859012-70b7904e5d6d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-25', name: 'Tandoori Roti', description: 'Whole wheat flatbread baked in a traditional clay oven.', price: 49.00, category: 'breads', image: 'https://images.unsplash.com/photo-1573504859012-70b7904e5d6d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-26', name: 'Butter Roti', description: 'Whole wheat tandoori roti glazed with fresh butter.', price: 59.00, category: 'breads', image: 'https://images.unsplash.com/photo-1573504859012-70b7904e5d6d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-27', name: 'Laccha Paratha', description: 'Multi-layered, flaky whole wheat bread cooked in the tandoor.', price: 99.00, category: 'breads', image: 'https://images.unsplash.com/photo-1573504859012-70b7904e5d6d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-28', name: 'Missi Roti', description: 'Savory bread made from a mix of whole wheat flour and gram flour, spiced with ajwain.', price: 89.00, category: 'breads', image: 'https://images.unsplash.com/photo-1573504859012-70b7904e5d6d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },

  // Rice & Biryani
  { id: 'menu-29', name: 'Hyderabadi Chicken Biryani', description: 'Fragrant basmati rice layered with succulent chicken, saffron, caramelized onions, and slow-cooked in the traditional dum style.', price: 459.00, category: 'rice', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-30', name: 'Hyderabadi Veg Biryani', description: 'Aromatic basmati rice cooked dum-style with assorted seasonal vegetables and biryani spices.', price: 359.00, category: 'rice', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-31', name: 'Mutton Dum Biryani', description: 'A royal delicacy of tender mutton pieces layered with long-grain rice and exotic spices.', price: 599.00, category: 'rice', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-32', name: 'Jeera Rice', description: 'Steamed basmati rice tempered with cumin seeds and ghee.', price: 199.00, category: 'rice', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-33', name: 'Steamed Basmati Rice', description: 'Perfectly cooked, long-grain aromatic white basmati rice.', price: 149.00, category: 'rice', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-34', name: 'Veg Pulao', description: 'Mildly spiced rice cooked with a colorful medley of fresh vegetables.', price: 269.00, category: 'rice', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },

  // Desserts
  { id: 'menu-35', name: 'Gulab Jamun', description: 'Golden fried milk dumplings soaked in a warm, rose-flavored sugar syrup.', price: 149.00, category: 'desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-36', name: 'Rasmalai', description: 'Soft, spongy paneer discs delicately soaked in thickened, sweetened and cardamom-flavored milk.', price: 179.00, category: 'desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-37', name: 'Kulfi Falooda', description: 'Traditional Indian ice cream served with sweet vermicelli, rose syrup, and nuts.', price: 199.00, category: 'desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-38', name: 'Gajar Ka Halwa', description: 'A classic winter dessert of slow-cooked grated carrots, milk, sugar, and dry fruits.', price: 219.00, category: 'desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-39', name: 'Rabdi', description: 'Thickened, sweetened milk with layers of malai, flavored with saffron and cardamom.', price: 199.00, category: 'desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },

  // Beverages
  { id: 'menu-40', name: 'Mango Lassi', description: 'A chilled, refreshing yogurt drink blended with fresh sweet Alphonso mango pulp.', price: 179.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-41', name: 'Sweet Lassi', description: 'Traditional sweetened churned yogurt beverage, served cold.', price: 149.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-42', name: 'Masala Chai', description: 'Brewed black tea with milk and a fragrant blend of ginger, cardamom, and cloves.', price: 79.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-43', name: 'Fresh Lime Soda', description: 'Refreshing sweet and salty sparkling water with freshly squeezed lime juice.', price: 129.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-44', name: 'Jaljeera', description: 'Tangy and cooling Indian summer drink made with cumin, mint, and tamarind.', price: 119.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1594487523542-81c197780f18?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-45', name: 'Cold Coffee', description: 'Creamy, chilled, and frothy blended iced coffee.', price: 189.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-46', name: 'Mineral Water', description: 'Bottled premium mineral water.', price: 40.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4c?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] }
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
      { menuItemId: 'menu-7', name: 'Hyderabadi Chicken Biryani', quantity: 2, price: 459.00, category: 'mains' },
      { menuItemId: 'menu-8', name: 'Paneer Butter Masala', quantity: 1, price: 389.00, category: 'mains' },
      { menuItemId: 'menu-12', name: 'Mango Lassi', quantity: 1, price: 179.00, category: 'beverages' }
    ],
    status: 'ready',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    waiterName: 'Neha Verma',
    totalPrice: 1486.00,
    tax: 74.30,
    serviceCharge: 74.30,
    tip: 0,
    paymentMethod: 'pending',
    timeElapsed: 60
  },
  {
    id: 'ORD-1042',
    tableId: 'T-04',
    tableName: 'Table 04',
    items: [
      { menuItemId: 'menu-4', name: 'Tandoori Mushroom', quantity: 2, price: 319.00, notes: 'Extra tender', category: 'appetizers' },
      { menuItemId: 'menu-5', name: 'Butter Chicken', quantity: 1, price: 499.00, notes: 'Spicy', category: 'mains' },
      { menuItemId: 'menu-13', name: 'Masala Chai', quantity: 3, price: 79.00, category: 'beverages' }
    ],
    status: 'preparing',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    waiterName: 'Neha Verma',
    totalPrice: 1374.00,
    tax: 68.70,
    serviceCharge: 68.70,
    tip: 0,
    paymentMethod: 'pending',
    timeElapsed: 42
  },
  {
    id: 'ORD-1008',
    tableId: 'T-08',
    tableName: 'Table 08',
    items: [
      { menuItemId: 'menu-15', name: 'Jaljeera', quantity: 2, price: 119.00, category: 'beverages' },
      { menuItemId: 'menu-10', name: 'Rasmalai', quantity: 1, price: 179.00, category: 'desserts' }
    ],
    status: 'preparing',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    waiterName: 'Arjun Sharma',
    totalPrice: 417.00,
    tax: 20.85,
    serviceCharge: 20.85,
    tip: 0,
    paymentMethod: 'pending',
    timeElapsed: 15
  },
  {
    id: 'ORD-1017',
    tableId: 'T-07',
    tableName: 'Table 07',
    items: [
      { menuItemId: 'menu-5', name: 'Butter Chicken', quantity: 2, price: 499.00, category: 'mains' },
      { menuItemId: 'menu-11', name: 'Garlic Naan', quantity: 4, price: 99.00, category: 'mains' },
      { menuItemId: 'menu-14', name: 'Jeera Rice', quantity: 1, price: 199.00, category: 'mains' },
      { menuItemId: 'menu-12', name: 'Mango Lassi', quantity: 2, price: 179.00, category: 'beverages' }
    ],
    status: 'pending',
    timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    waiterName: 'Rohit Kumar',
    totalPrice: 1951.00,
    tax: 97.55,
    serviceCharge: 97.55,
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
      { menuItemId: 'menu-1', name: 'Paneer Tikka', quantity: 2, price: 349.00, category: 'appetizers' },
      { menuItemId: 'menu-6', name: 'Dal Makhani', quantity: 1, price: 329.00, category: 'mains' },
      { menuItemId: 'menu-12', name: 'Mango Lassi', quantity: 3, price: 179.00, category: 'beverages' }
    ],
    status: 'completed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    waiterName: 'Aditi Rao',
    totalPrice: 1564.00,
    tax: 78.20,
    serviceCharge: 78.20,
    tip: 100.00,
    paymentMethod: 'card',
    timeElapsed: 45
  },
  {
    id: 'ORD-4919',
    tableId: 'T-12',
    tableName: 'Table 12',
    items: [
      { menuItemId: 'menu-6', name: 'Dal Makhani', quantity: 2, price: 329.00, category: 'mains' },
      { menuItemId: 'menu-8', name: 'Paneer Butter Masala', quantity: 1, price: 389.00, category: 'mains' },
      { menuItemId: 'menu-11', name: 'Garlic Naan', quantity: 2, price: 99.00, category: 'appetizers' }
    ],
    status: 'completed',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    waiterName: 'Neha Verma',
    totalPrice: 1245.00,
    tax: 62.25,
    serviceCharge: 62.25,
    tip: 150.00,
    paymentMethod: 'card',
    timeElapsed: 55
  },
  {
    id: 'ORD-4915',
    tableId: 'T-05',
    tableName: 'Table 05',
    items: [
      { menuItemId: 'menu-7', name: 'Hyderabadi Chicken Biryani', quantity: 6, price: 459.00, category: 'mains' },
      { menuItemId: 'menu-12', name: 'Mango Lassi', quantity: 3, price: 179.00, category: 'beverages' }
    ],
    status: 'completed',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    waiterName: 'Rohit Kumar',
    totalPrice: 3291.00,
    tax: 164.55,
    serviceCharge: 164.55,
    tip: 300.00,
    paymentMethod: 'card',
    timeElapsed: 75
  }
];

const initialReservations: Reservation[] = [
  { id: 'res-1', customerName: 'Aarav Sharma', partySize: 4, time: '19:30', date: 'Today', tableId: 'T-12', tableName: 'Table 12', status: 'confirmed' },
  { id: 'res-2', customerName: 'Rohan Gupta', partySize: 2, time: '18:00', date: 'Today', tableId: 'T-03', tableName: 'Table 03', status: 'confirmed' },
  { id: 'res-3', customerName: 'Priya Verma', partySize: 6, time: '20:15', date: 'Tomorrow', tableId: 'T-01', tableName: 'Table 01', status: 'confirmed' },
  { id: 'res-4', customerName: 'Sneha Iyer', partySize: 2, time: '21:00', date: 'Today', tableId: 'T-10', tableName: 'Table 10', status: 'confirmed' }
];

const initialInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Basmati Rice', category: 'Grains', quantity: 150, unit: 'kg', minLevel: 30.0, status: 'optimal' },
  { id: 'inv-2', name: 'Paneer', category: 'Dairy', quantity: 8, unit: 'kg', minLevel: 15.0, status: 'low' },
  { id: 'inv-3', name: 'Mutton', category: 'Meat', quantity: 45, unit: 'kg', minLevel: 10.0, status: 'optimal' },
  { id: 'inv-4', name: 'Saffron', category: 'Spices', quantity: 250, unit: 'g', minLevel: 50, status: 'optimal' },
  { id: 'inv-5', name: 'Garam Masala', category: 'Spices', quantity: 12, unit: 'kg', minLevel: 3, status: 'optimal' },
  { id: 'inv-6', name: 'Ghee', category: 'Dairy', quantity: 24.0, unit: 'l', minLevel: 5.0, status: 'optimal' },
  { id: 'inv-7', name: 'Chicken', category: 'Meat', quantity: 38, unit: 'kg', minLevel: 8, status: 'optimal' }
];

const initialEmployees: Employee[] = [
  { id: 'emp-1', name: 'Arjun Sharma', role: 'admin', email: 'arjun@savora.com', status: 'active', shift: 'Double Shift' },
  { id: 'emp-2', name: 'Neha Verma', role: 'waiter', email: 'neha@savora.com', status: 'active', shift: 'Morning Shift' },
  { id: 'emp-3', name: 'Rohit Kumar', role: 'manager', email: 'rohit@savora.com', status: 'active', shift: 'Evening Shift' },
  { id: 'emp-4', name: 'Manish Singh', role: 'chef', email: 'manish@savora.com', status: 'active', shift: 'Morning Shift' },
  { id: 'emp-5', name: 'Aditi Rao', role: 'cashier', email: 'aditi@savora.com', status: 'active', shift: 'Double Shift' }
];

const initialNotifications: Notification[] = [
  { id: 'notif-1', title: '2 Late Orders', message: 'Table 04 & Table 07 active orders have exceeded average preparation timer.', type: 'warning', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), read: false },
  { id: 'notif-2', title: 'Low Stock Alert', message: 'Paneer stock running low. Down to 8 kg. Request restock.', type: 'error', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), read: false },
  { id: 'notif-3', title: 'Zomato order received', message: 'New delivery order received via Zomato for ₹1,250.', type: 'info', timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), read: true },
  { id: 'notif-4', title: 'Sales target reached', message: 'Revenue for today exceeded ₹1,00,000 baseline milestone.', type: 'success', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: true }
];

const defaultSettings: RestaurantSettings = {
  name: 'Saffron & Smoke',
  hours: '11:00 AM - 11:00 PM',
  tax: 5.0, // 5% GST
  service: 5.0, // 5% service charge
  receiptFooter: 'Thank you for dining with us.\nअतिथि देवो भवः'
};
export const SavoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; role: string; restaurantId?: string | null; email?: string | null } | null>(() => {
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

  const [restaurantId, setRestaurantId] = useState<string | null>(() => {
    const saved = localStorage.getItem('savora_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return u.restaurantId || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('savora_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
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
              email: firebaseUser.email,
              restaurantId: userData.restaurantId || null
            };
            setUser(loggedInUser);
            setRestaurantId(userData.restaurantId || null);
            localStorage.setItem('savora_user', JSON.stringify(loggedInUser));
          } else {
            const fallbackUser = {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              role: 'admin',
              email: firebaseUser.email,
              restaurantId: null
            };
            setUser(fallbackUser);
            setRestaurantId(null);
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
              setRestaurantId(null);
              localStorage.removeItem('savora_user');
            }
          } catch (e) {
            setUser(null);
            setRestaurantId(null);
            localStorage.removeItem('savora_user');
          }
        } else {
          setUser(null);
          setRestaurantId(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const [todayStats, setTodayStats] = useState({
    revenue: 145000,
    ordersCount: 184,
    coversCount: 216,
    avgCheck: 788,
    tableTurn: 68
  });

  // Real-time Firestore subscriptions for active tenant restaurant
  useEffect(() => {
    if (!restaurantId || restaurantId === 'demo-saffron-smoke') {
      return;
    }

    const unsubMenu = onSnapshot(collection(db, 'restaurants', restaurantId, 'menu'), (snapshot) => {
      const items: MenuItem[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as MenuItem));
      if (items.length > 0) setMenuItems(items);
    });

    const unsubTables = onSnapshot(collection(db, 'restaurants', restaurantId, 'tables'), (snapshot) => {
      const items: Table[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Table));
      if (items.length > 0) setTables(items);
    });

    const unsubOrders = onSnapshot(collection(db, 'restaurants', restaurantId, 'orders'), (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Order));
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      if (items.length > 0) setOrders(items);
    });

    const unsubReservations = onSnapshot(collection(db, 'restaurants', restaurantId, 'reservations'), (snapshot) => {
      const items: Reservation[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Reservation));
      if (items.length > 0) setReservations(items);
    });

    const unsubInventory = onSnapshot(collection(db, 'restaurants', restaurantId, 'inventory'), (snapshot) => {
      const items: InventoryItem[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as InventoryItem));
      if (items.length > 0) setInventory(items);
    });

    const unsubEmployees = onSnapshot(collection(db, 'restaurants', restaurantId, 'staff'), (snapshot) => {
      const items: Employee[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Employee));
      if (items.length > 0) setEmployees(items);
    });

    const unsubNotifications = onSnapshot(collection(db, 'restaurants', restaurantId, 'notifications'), (snapshot) => {
      const items: Notification[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Notification));
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      if (items.length > 0) setNotifications(items);
    });

    const unsubSettings = onSnapshot(doc(db, 'restaurants', restaurantId, 'settings', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as RestaurantSettings);
      }
    });

    return () => {
      unsubMenu();
      unsubTables();
      unsubOrders();
      unsubReservations();
      unsubInventory();
      unsubEmployees();
      unsubNotifications();
      unsubSettings();
    };
  }, [restaurantId]);

  // Calculate and sync today statistics based on completed orders
  useEffect(() => {
    const completed = orders.filter(o => o.status === 'completed');
    const completedToday = completed.filter(o => {
      const orderDate = new Date(o.timestamp);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    });

    const calculatedRevenue = completedToday.reduce((sum, o) => sum + o.totalPrice, 0) + 140000; // static base + actual
    const calculatedOrdersCount = completedToday.length + 180;
    const calculatedCovers = completedToday.reduce((sum, o) => {
      const table = tables.find(t => t.id === o.tableId);
      return sum + (table ? table.seats : 2);
    }, 0) + 210;

    const baseChecks = 180;
    const totalChecks = baseChecks + completedToday.length;
    const avgCheck = totalChecks > 0 ? Math.round(calculatedRevenue / totalChecks) : 780;

    setTodayStats({
      revenue: calculatedRevenue,
      ordersCount: calculatedOrdersCount,
      coversCount: calculatedCovers,
      avgCheck: avgCheck,
      tableTurn: 68
    });
  }, [orders, tables]);

  // Sync state to local storage for local / offline demo mode
  useEffect(() => {
    if (!restaurantId || restaurantId === 'demo-saffron-smoke') {
      localStorage.setItem('savora_tables', JSON.stringify(tables));
    }
  }, [tables, restaurantId]);

  useEffect(() => {
    if (!restaurantId || restaurantId === 'demo-saffron-smoke') {
      localStorage.setItem('savora_menu', JSON.stringify(menuItems));
    }
  }, [menuItems, restaurantId]);

  useEffect(() => {
    if (!restaurantId || restaurantId === 'demo-saffron-smoke') {
      localStorage.setItem('savora_orders', JSON.stringify(orders));
    }
  }, [orders, restaurantId]);

  useEffect(() => {
    if (!restaurantId || restaurantId === 'demo-saffron-smoke') {
      localStorage.setItem('savora_reservations', JSON.stringify(reservations));
    }
  }, [reservations, restaurantId]);

  useEffect(() => {
    if (!restaurantId || restaurantId === 'demo-saffron-smoke') {
      localStorage.setItem('savora_inventory', JSON.stringify(inventory));
    }
  }, [inventory, restaurantId]);

  useEffect(() => {
    if (!restaurantId || restaurantId === 'demo-saffron-smoke') {
      localStorage.setItem('savora_employees', JSON.stringify(employees));
    }
  }, [employees, restaurantId]);

  useEffect(() => {
    if (!restaurantId || restaurantId === 'demo-saffron-smoke') {
      localStorage.setItem('savora_notifications', JSON.stringify(notifications));
    }
  }, [notifications, restaurantId]);

  useEffect(() => {
    if (!restaurantId || restaurantId === 'demo-saffron-smoke') {
      localStorage.setItem('savora_settings', JSON.stringify(settings));
    }
  }, [settings, restaurantId]);

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
    const newUserData = { name, role, restaurantId: 'demo-saffron-smoke' };
    setUser(newUserData);
    setRestaurantId('demo-saffron-smoke');
    localStorage.setItem('savora_user', JSON.stringify(newUserData));
    addNotification('Logged In', `Logged in as ${name} (${role})`, 'success');
  };

  const logout = () => {
    setUser(null);
    setRestaurantId(null);
    localStorage.removeItem('savora_user');
    signOut(auth).catch(err => console.error("Signout error:", err));
  };

  // POS - Create Order
  const createOrder = (tableId: string, items: OrderItem[], guestCount: number, notes?: string): string => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const table = tables.find(t => t.id === tableId);
    
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // GST (split in POS UI, e.g. 5% = 2.5% CGST + 2.5% SGST)
    const taxRate = settings.tax / 100;
    const serviceRate = settings.service / 100;
    const tax = Number((subtotal * taxRate).toFixed(2));
    const serviceCharge = Number((subtotal * serviceRate).toFixed(2));
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

    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      setDoc(doc(db, 'restaurants', restaurantId, 'orders', orderId), newOrder);
      const updatedTable = {
        status: 'occupied',
        currentOrderId: orderId,
        timer: 1,
        guestCount: guestCount || (table ? table.seats : 2)
      };
      updateDoc(doc(db, 'restaurants', restaurantId, 'tables', tableId), updatedTable);
      addNotification('Order Sent', `Order ${orderId} created for Table ${table?.name || tableId}`, 'info');
    } else {
      setOrders(prev => [newOrder, ...prev]);
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
    }

    return orderId;
  };

  // Add items to existing order
  const addItemsToOrder = (orderId: string, newItems: OrderItem[]) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const mergedItems = [...order.items];
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
    const taxRate = settings.tax / 100;
    const serviceRate = settings.service / 100;
    const tax = Number((subtotal * taxRate).toFixed(2));
    const serviceCharge = Number((subtotal * serviceRate).toFixed(2));
    const totalPrice = Number((subtotal + tax + serviceCharge).toFixed(2));

    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      const updatedOrder = {
        ...order,
        items: mergedItems,
        totalPrice,
        tax,
        serviceCharge,
        status: 'pending' // Send back to pending status in KDS
      };
      setDoc(doc(db, 'restaurants', restaurantId, 'orders', orderId), updatedOrder);
      addNotification('Order Updated', `Added items to ${orderId}`, 'info');
    } else {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            items: mergedItems,
            totalPrice,
            tax,
            serviceCharge,
            status: 'pending'
          };
        }
        return o;
      }));
      addNotification('Order Updated', `Added items to ${orderId}`, 'info');
    }
  };

  // Update order item quantity directly
  const updateOrderItemQuantity = (orderId: string, menuItemId: string, change: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updatedItems = order.items.map(item => {
      if (item.menuItemId === menuItemId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as OrderItem[];

    const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = settings.tax / 100;
    const serviceRate = settings.service / 100;
    const tax = Number((subtotal * taxRate).toFixed(2));
    const serviceCharge = Number((subtotal * serviceRate).toFixed(2));
    const totalPrice = Number((subtotal + tax + serviceCharge).toFixed(2));

    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      const updatedOrder = {
        ...order,
        items: updatedItems,
        totalPrice,
        tax,
        serviceCharge
      };
      setDoc(doc(db, 'restaurants', restaurantId, 'orders', orderId), updatedOrder);
    } else {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
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
    }
  };

  // KDS - Update status
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      updateDoc(doc(db, 'restaurants', restaurantId, 'orders', orderId), { status });
    } else {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return { ...o, status };
        }
        return o;
      }));
    }

    if (status === 'preparing') {
      addNotification('Kitchen Preparing', `${orderId} is now in preparation.`, 'info');
    } else if (status === 'ready') {
      const order = orders.find(o => o.id === orderId);
      addNotification('Order Ready!', `${orderId} for Table ${order?.tableName || 'Table'} is ready to be served.`, 'success');
    }
  };

  // Settle Bill (Cashier)
  const settleOrder = (orderId: string, paymentMethod: 'card' | 'cash' | 'upi' | 'pending', tipPercent: number, customTotal?: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const tip = Number((order.totalPrice * (tipPercent / 100)).toFixed(2));
    const finalTotal = customTotal || Number((order.totalPrice + tip).toFixed(2));

    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      const finalOrder = {
        ...order,
        status: 'completed',
        paymentMethod,
        tip,
        totalPrice: finalTotal
      };
      setDoc(doc(db, 'restaurants', restaurantId, 'orders', orderId), finalOrder);
      updateDoc(doc(db, 'restaurants', restaurantId, 'tables', order.tableId), {
        status: 'dirty',
        currentOrderId: null,
        guestCount: 0,
        timer: 0
      });
      addNotification('Payment Settled', `Order ${orderId} settled (₹${finalTotal}) via ${paymentMethod.toUpperCase()}`, 'success');
    } else {
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

      addNotification('Payment Settled', `Order ${orderId} settled (₹${finalTotal}) via ${paymentMethod.toUpperCase()}`, 'success');
    }
  };

  // Table - Clean / Ready
  const clearTable = (tableId: string) => {
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      updateDoc(doc(db, 'restaurants', restaurantId, 'tables', tableId), { status: 'available' });
    } else {
      setTables(prev => prev.map(t => {
        if (t.id === tableId) {
          return { ...t, status: 'available' };
        }
        return t;
      }));
    }
    addNotification('Table Cleared', `Table ${tableId} is clean and available.`, 'success');
  };

  const setTableStatus = (tableId: string, status: Table['status'], guestCount = 0) => {
    const seats = tables.find(t => t.id === tableId)?.seats || 2;
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      updateDoc(doc(db, 'restaurants', restaurantId, 'tables', tableId), {
        status,
        guestCount: status === 'occupied' ? guestCount || seats : 0,
        timer: status === 'occupied' ? 1 : 0
      });
    } else {
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
    }
  };

  // Reservations
  const addReservation = (res: Omit<Reservation, 'id' | 'status'>) => {
    const newResId = `res-${Math.floor(100 + Math.random() * 900)}`;
    const newRes: Reservation = {
      ...res,
      id: newResId,
      status: 'confirmed'
    };

    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      setDoc(doc(db, 'restaurants', restaurantId, 'reservations', newResId), newRes);
      if (res.tableId) {
        updateDoc(doc(db, 'restaurants', restaurantId, 'tables', res.tableId), { status: 'reserved' });
      }
    } else {
      setReservations(prev => [...prev, newRes]);
      if (res.tableId) {
        setTables(prev => prev.map(t => {
          if (t.id === res.tableId) {
            return { ...t, status: 'reserved' };
          }
          return t;
        }));
      }
    }

    addNotification('Reservation Placed', `Confirmed reservation for ${res.customerName} on ${res.date} at ${res.time}`, 'success');
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    const res = reservations.find(r => r.id === id);
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      updateDoc(doc(db, 'restaurants', restaurantId, 'reservations', id), { status });
      if (status === 'seated' && res?.tableId) {
        setTableStatus(res.tableId, 'occupied', res.partySize);
      }
    } else {
      setReservations(prev => prev.map(r => {
        if (r.id === id) {
          if (status === 'seated' && r.tableId) {
            setTableStatus(r.tableId, 'occupied', r.partySize);
          }
          return { ...r, status };
        }
        return r;
      }));
    }
  };

  // Menu items config
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItemId = `menu-${menuItems.length + 1}`;
    const newItem: MenuItem = {
      ...item,
      id: newItemId
    };

    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      setDoc(doc(db, 'restaurants', restaurantId, 'menu', newItemId), newItem);
    } else {
      setMenuItems(prev => [...prev, newItem]);
    }
    addNotification('Menu Item Added', `Added ${item.name} to ${item.category}`, 'success');
  };

  const updateMenuItemStock = (id: string, stockLevel: MenuItem['stockLevel']) => {
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      updateDoc(doc(db, 'restaurants', restaurantId, 'menu', id), { stockLevel });
    } else {
      setMenuItems(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, stockLevel };
        }
        return item;
      }));
    }
    addNotification('Stock Updated', `Updated stock status for menu item.`, 'info');
  };

  // Notifications hub
  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotifId = `notif-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNotif: Notification = {
      id: newNotifId,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      setDoc(doc(db, 'restaurants', restaurantId, 'notifications', newNotifId), newNotif);
    } else {
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      updateDoc(doc(db, 'restaurants', restaurantId, 'notifications', id), { read: true });
    } else {
      setNotifications(prev => prev.map(n => {
        if (n.id === id) {
          return { ...n, read: true };
        }
        return n;
      }));
    }
  };

  const markAllNotificationsAsRead = () => {
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      notifications.forEach(n => {
        if (!n.read) {
          updateDoc(doc(db, 'restaurants', restaurantId, 'notifications', n.id), { read: true });
        }
      });
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  // Inventory
  const updateInventoryQuantity = (id: string, quantity: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, quantity);
    const status = newQty === 0 ? 'out' : newQty <= item.minLevel ? 'low' : 'optimal';

    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      updateDoc(doc(db, 'restaurants', restaurantId, 'inventory', id), { quantity: newQty, status });
    } else {
      setInventory(prev => prev.map(item => {
        if (item.id === id) {
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
    }
  };

  // Employees Roster
  const updateEmployeeStatus = (id: string, status: Employee['status']) => {
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      updateDoc(doc(db, 'restaurants', restaurantId, 'staff', id), { status });
    } else {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === id) {
          return { ...emp, status };
        }
        return emp;
      }));
    }
  };

  // Simulate active timers (preparation durations, seated timers)
  useEffect(() => {
    const interval = setInterval(() => {
      if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
        // Active Firestore users skip local intervals to avoid write storms
        return;
      }
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
  }, [restaurantId, orders]);

  const resetMockData = () => {
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      const batch = writeBatch(db);
      
      // Delete old and upload defaults to Firestore
      tables.forEach(t => batch.delete(doc(db, 'restaurants', restaurantId, 'tables', t.id)));
      menuItems.forEach(m => batch.delete(doc(db, 'restaurants', restaurantId, 'menu', m.id)));
      orders.forEach(o => batch.delete(doc(db, 'restaurants', restaurantId, 'orders', o.id)));
      reservations.forEach(r => batch.delete(doc(db, 'restaurants', restaurantId, 'reservations', r.id)));
      inventory.forEach(i => batch.delete(doc(db, 'restaurants', restaurantId, 'inventory', i.id)));
      employees.forEach(e => batch.delete(doc(db, 'restaurants', restaurantId, 'staff', e.id)));
      notifications.forEach(n => batch.delete(doc(db, 'restaurants', restaurantId, 'notifications', n.id)));
      batch.delete(doc(db, 'restaurants', restaurantId, 'settings', 'config'));
      
      initialTables.forEach(t => batch.set(doc(db, 'restaurants', restaurantId, 'tables', t.id), t));
      initialMenuItems.forEach(m => batch.set(doc(db, 'restaurants', restaurantId, 'menu', m.id), m));
      initialOrders.forEach(o => batch.set(doc(db, 'restaurants', restaurantId, 'orders', o.id), o));
      initialReservations.forEach(r => batch.set(doc(db, 'restaurants', restaurantId, 'reservations', r.id), r));
      initialInventory.forEach(i => batch.set(doc(db, 'restaurants', restaurantId, 'inventory', i.id), i));
      initialEmployees.forEach(e => batch.set(doc(db, 'restaurants', restaurantId, 'staff', e.id), e));
      initialNotifications.forEach(n => batch.set(doc(db, 'restaurants', restaurantId, 'notifications', n.id), n));
      batch.set(doc(db, 'restaurants', restaurantId, 'settings', 'config'), defaultSettings);

      batch.commit().then(() => {
        addNotification('System Reset', 'All database items successfully reseeded to default states in Cloud Firestore.', 'success');
      }).catch(err => {
        console.error("Firestore batch reset failed:", err);
      });
    } else {
      setTables(initialTables);
      setMenuItems(initialMenuItems);
      setOrders(initialOrders);
      setReservations(initialReservations);
      setInventory(initialInventory);
      setEmployees(initialEmployees);
      setNotifications(initialNotifications);
      setSettings(defaultSettings);
      localStorage.removeItem('savora_tables');
      localStorage.removeItem('savora_menu');
      localStorage.removeItem('savora_orders');
      localStorage.removeItem('savora_reservations');
      localStorage.removeItem('savora_inventory');
      localStorage.removeItem('savora_employees');
      localStorage.removeItem('savora_notifications');
      localStorage.removeItem('savora_settings');
      addNotification('System Reset', 'All database items successfully reseeded to default states.', 'success');
    }
  };

  const updateSettings = (newSettings: RestaurantSettings) => {
    if (restaurantId && restaurantId !== 'demo-saffron-smoke') {
      setDoc(doc(db, 'restaurants', restaurantId, 'settings', 'config'), newSettings);
    } else {
      setSettings(newSettings);
    }
    addNotification('Settings Updated', 'Tax percentages and receipt footers successfully updated in system.', 'success');
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
      settings,
      updateSettings,
      todayStats,
      theme,
      setTheme,
      restaurantId,
      setRestaurantId,
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
