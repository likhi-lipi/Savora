import os
import re

filepath = r'c:\Users\Admin\Desktop\Projects\Savora\src\context\SavoraContext.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_menu_data = """const initialMenuItems: MenuItem[] = [
  // Starters
  { id: 'menu-1', name: 'Paneer Tikka', description: 'Soft cubes of cottage cheese marinated in hung curd, aromatic Indian spices, and grilled to perfection in a traditional tandoor.', price: 349.00, category: 'starters', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883db6d8?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-2', name: 'Hara Bhara Kebab', description: 'Healthy and tasty vegetarian kababs made with spinach, potatoes, and green peas.', price: 289.00, category: 'starters', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-3', name: 'Chicken Tikka', description: 'Juicy, tender chicken pieces marinated in spiced yogurt and roasted in the tandoor.', price: 429.00, category: 'starters', image: 'https://images.unsplash.com/photo-1599487405270-8950c42dcd68?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: [] },
  { id: 'menu-4', name: 'Tandoori Chicken (Half)', description: 'Iconic half-portion tandoori chicken, marinated with robust spices and char-grilled.', price: 499.00, category: 'starters', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-5', name: 'Seekh Kebab', description: 'Minced lamb blended with Indian spices, skewered and cooked in a clay oven.', price: 449.00, category: 'starters', image: 'https://images.unsplash.com/photo-1603496987351-f84a3ba5ec85?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: [] },
  { id: 'menu-6', name: 'Crispy Corn Masala', description: 'Crunchy golden sweet corn kernels tossed with fiery spices and lemon juice.', price: 249.00, category: 'starters', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-7', name: 'Tandoori Mushroom', description: 'Fresh button mushrooms marinated in tandoori masala and grilled to a smoky finish.', price: 319.00, category: 'starters', image: 'https://images.unsplash.com/photo-1626075936496-d2427a00824b?w=600&auto=format&fit=crop&q=80', stockLevel: 'low', labels: ['Vegetarian'] },

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
  { id: 'menu-17', name: 'Chicken Curry', description: 'Home-style chicken curry cooked slowly with traditional Indian whole spices.', price: 469.00, category: 'mains', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: [] },
  { id: 'menu-18', name: 'Rogan Josh', description: 'A signature Kashmiri dish featuring tender mutton cooked with aromatic spices and a vibrant red chili gravy.', price: 589.00, category: 'mains', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-19', name: 'Malai Kofta', description: 'Fried dumplings of potato and paneer served in a rich, mild, and creamy cashew gravy.', price: 389.00, category: 'mains', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-20', name: 'Chole Masala', description: 'Classic North Indian dish made with white chickpeas simmered in an onion-tomato masala.', price: 299.00, category: 'mains', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-21', name: 'Palak Paneer', description: 'Cubes of soft paneer cooked in a smooth, mildly spiced spinach puree.', price: 369.00, category: 'mains', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },

  // Breads
  { id: 'menu-22', name: 'Butter Naan', description: 'Classic fluffy Indian flatbread baked in a tandoor and generously brushed with butter.', price: 79.00, category: 'breads', image: 'https://images.unsplash.com/photo-1573504859012-70b7904e5d6d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-23', name: 'Garlic Naan', description: 'Traditional Indian flatbread flavored with minced garlic and coriander.', price: 99.00, category: 'breads', image: 'https://images.unsplash.com/photo-1605804364028-591b9f620bd3?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-24', name: 'Cheese Naan', description: 'Indulgent soft naan bread stuffed with a blend of melted cheeses.', price: 149.00, category: 'breads', image: 'https://images.unsplash.com/photo-1573504859012-70b7904e5d6d?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-25', name: 'Tandoori Roti', description: 'Whole wheat flatbread baked in a traditional clay oven.', price: 49.00, category: 'breads', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-26', name: 'Butter Roti', description: 'Whole wheat tandoori roti glazed with fresh butter.', price: 59.00, category: 'breads', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-27', name: 'Laccha Paratha', description: 'Multi-layered, flaky whole wheat bread cooked in the tandoor.', price: 99.00, category: 'breads', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },
  { id: 'menu-28', name: 'Missi Roti', description: 'Savory bread made from a mix of whole wheat flour and gram flour, spiced with ajwain.', price: 89.00, category: 'breads', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian'] },

  // Rice & Biryani
  { id: 'menu-29', name: 'Hyderabadi Chicken Biryani', description: 'Fragrant basmati rice layered with succulent chicken, saffron, caramelized onions, and slow-cooked in the traditional dum style.', price: 459.00, category: 'rice', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
  { id: 'menu-30', name: 'Hyderabadi Veg Biryani', description: 'Aromatic basmati rice cooked dum-style with assorted seasonal vegetables and biryani spices.', price: 359.00, category: 'rice', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Vegetarian', 'Gluten-Free'] },
  { id: 'menu-31', name: 'Mutton Dum Biryani', description: 'A royal delicacy of tender mutton pieces layered with long-grain rice and exotic spices.', price: 599.00, category: 'rice', image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?w=600&auto=format&fit=crop&q=80', stockLevel: 'available', labels: ['Signature'] },
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
"""

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if line.startswith('const initialMenuItems: MenuItem[] = ['):
        start_idx = i
    if start_idx != -1 and line.startswith('];'):
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + [new_menu_data] + lines[end_idx+1:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Updated initialMenuItems in SavoraContext.tsx")
else:
    print("Could not find initialMenuItems bounds")
