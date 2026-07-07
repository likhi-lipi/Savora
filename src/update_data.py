import os

filepath = r'c:\Users\Admin\Desktop\Projects\Savora\src\context\SavoraContext.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_mock_data = """const initialMenuItems: MenuItem[] = [
  { id: 'menu-1', name: 'Paneer Tikka', description: 'Soft cubes of cottage cheese marinated in hung curd, aromatic Indian spices, and grilled to perfection in a traditional tandoor.', price: 349.00, category: 'appetizers', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883db6d8?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-2', name: 'Hara Bhara Kebab', description: 'Healthy and tasty vegetarian kababs made with spinach, potatoes and green peas.', price: 289.00, category: 'appetizers', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-3', name: 'Chicken Tikka', description: 'Juicy, tender chicken pieces marinated in spiced yogurt and roasted in the tandoor.', price: 429.00, category: 'appetizers', image: 'https://images.unsplash.com/photo-1599487405270-8950c42dcd68?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: [] },
  { id: 'menu-4', name: 'Tandoori Mushroom', description: 'Fresh mushrooms marinated in yogurt and spices, char-grilled.', price: 319.00, category: 'appetizers', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80', stockLevel: 'low', labels: ['Vegetarian'] },
  { id: 'menu-5', name: 'Butter Chicken', description: 'Tender tandoori chicken simmered in a rich, creamy tomato gravy finished with butter and kasuri methi.', price: 499.00, category: 'mains', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-6', name: 'Dal Makhani', description: 'Slow-cooked black lentils simmered overnight on hot embers with tomatoes, cream, and butter.', price: 329.00, category: 'mains', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-7', name: 'Hyderabadi Chicken Biryani', description: 'Fragrant basmati rice layered with succulent chicken, saffron, caramelized onions, and slow-cooked in the traditional dum style.', price: 459.00, category: 'mains', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-8', name: 'Paneer Butter Masala', description: 'Fresh cottage cheese cubes simmered in a spiced tomato-onion gravy with dried fenugreek.', price: 389.00, category: 'mains', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-9', name: 'Gulab Jamun', description: 'Golden fried milk dumplings soaked in rose-flavored sugar syrup.', price: 149.00, category: 'desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-10', name: 'Rasmalai', description: 'Soft paneer discs soaked in thickened, sweetened and delicately flavored milk.', price: 179.00, category: 'desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-11', name: 'Garlic Naan', description: 'Traditional Indian flatbread flavored with garlic and butter, cooked in tandoor.', price: 99.00, category: 'appetizers', image: 'https://images.unsplash.com/photo-1573504859012-70b7904e5d6d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-12', name: 'Mango Lassi', description: 'Chilled yogurt drink blended with fresh sweet Alphonso mango pulp and cardamom.', price: 179.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-13', name: 'Masala Chai', description: 'Brewed black tea with milk and a blend of aromatic spices like ginger, cardamom, and cloves.', price: 79.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-14', name: 'Jeera Rice', description: 'Basmati rice flavored with cumin seeds and whole spices.', price: 199.00, category: 'mains', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-15', name: 'Jaljeera', description: 'Tangy and refreshing Indian summer drink made with cumin, mint, and tamarind.', price: 119.00, category: 'beverages', image: 'https://images.unsplash.com/photo-1594487523542-81c197780f18?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] }
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
  receiptFooter: 'Thank you for dining with us.\\nअतिथि देवो भवः'
};
"""

new_lines = lines[:146] + [new_mock_data] + lines[490:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated SavoraContext.tsx")
