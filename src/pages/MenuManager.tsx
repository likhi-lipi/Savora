import React, { useState, useMemo } from 'react';
import { useSavoraState, MenuItem } from '../context/SavoraContext';
import { ImageFallback } from '../components/ImageFallback';
import { 
  Plus, 
  Download, 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  Edit2, 
  Eye, 
  X,
  PackageCheck,
  PackageOpen,
  Wine,
  AlertTriangle
} from 'lucide-react';
import { useForm } from 'react-hook-form';

interface MenuFormInputs {
  name: string;
  category: 'starters' | 'soups' | 'mains' | 'breads' | 'rice' | 'desserts' | 'beverages';
  price: number;
  description: string;
  stockLevel: 'available' | 'low' | 'out';
  isSignature: boolean;
  isGlutenFree: boolean;
  isVegetarian: boolean;
}

export const MenuManager: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItemStock } = useSavoraState();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MenuFormInputs>({
    defaultValues: {
      stockLevel: 'available',
      isSignature: false,
      isGlutenFree: false,
      isVegetarian: false
    }
  });

  // Category filter
  const filteredDishes = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const beveragesList = useMemo(() => {
    return menuItems.filter(item => item.category === 'beverages');
  }, [menuItems]);

  const handleCreateMenuItem = (data: MenuFormInputs) => {
    const labels: string[] = [];
    if (data.isSignature) labels.push('Signature');
    if (data.isGlutenFree) labels.push('Gluten-Free');
    if (data.isVegetarian) labels.push('Vegetarian');

    addMenuItem({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      stockLevel: data.stockLevel,
      labels
    });

    setShowAddModal(false);
    reset();
  };

  const getStockBadge = (stock: MenuItem['stockLevel']) => {
    switch (stock) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary-fixed/30 text-primary border border-primary/20">
            In Stock
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-warning/10 text-warning border border-warning/20">
            Low Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-danger/10 text-danger border border-danger/20">
            Out of Stock
          </span>
        );
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
    <div className="space-y-6 entrance-anim">
      
      {/* Menu Header controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">Menu Management</h2>
          <p className="text-text-muted text-sm mt-1">Curate your seasonal offerings and inventory availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-surface border border-border-custom text-text-primary hover:bg-sidebar rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5">
            <Download size={14} /> Export Catalog PDF
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus size={14} /> Add New Dish
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface border border-border-custom/50 rounded-2xl shadow-sm">
        
        <div 
          onWheel={handleCategoryWheel}
          onMouseDown={handleCategoryMouseDown}
          onMouseLeave={handleCategoryMouseLeaveOrUp}
          onMouseUp={handleCategoryMouseLeaveOrUp}
          onMouseMove={handleCategoryMouseMove}
          className="flex gap-2 text-xs font-bold overflow-x-auto no-scrollbar touch-pan-x w-full sm:w-auto flex-nowrap pb-2 sm:pb-0 cursor-grab active:cursor-grabbing select-none"
        >
          {['all', 'starters', 'soups', 'mains', 'breads', 'rice', 'desserts', 'beverages'].map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition-all capitalize whitespace-nowrap flex-shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-background hover:bg-border-custom/30 text-text-muted hover:text-text-primary border border-border-custom/50'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat === 'rice' ? 'Rice & Biryani' : cat === 'mains' ? 'Main Courses' : cat}
            </button>
          ))}
        </div>

        {/* Live Filter Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center bg-background border border-border-custom/75 rounded-xl px-2.5 py-1.5 flex-1 sm:w-60 focus-within:ring-1 focus-within:ring-primary">
            <Search size={14} className="text-text-muted mr-1.5" />
            <input
              type="text"
              placeholder="Search dishes catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs w-full outline-none focus:ring-0 placeholder:text-text-muted/70 text-text-primary"
            />
          </div>
        </div>

      </div>

      {/* Bento Layout Grid of dishes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Featured Dish Card (Left 2/3 wide on desktop) */}
        <div className="md:col-span-8 bg-surface rounded-2xl border border-border-custom/50 overflow-hidden group hover:shadow-lg transition-all duration-300 premium-shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
            <div className="relative overflow-hidden h-52 sm:h-auto">
              <ImageFallback 
                alt="Royal Paneer Tikka Platter" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1567188040759-fb8a883db6d8?w=800&auto=format&fit=crop&q=80"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md">
                  Best Seller
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Signature Starters</span>
                <h3 className="font-bold text-xl text-text-primary">Royal Paneer Tikka Platter</h3>
                <p className="text-xs text-text-muted leading-relaxed mt-2">
                  Soft cottage cheese cubes marinated in hung curd, Kashmiri chilli, roasted spices and cooked in a traditional clay tandoor. Served with mint chutney and onion salad.
                </p>
                <div className="flex gap-1.5 mt-4 flex-wrap">
                  <span className="px-2 py-0.5 bg-background border border-border-custom rounded-md text-[9px] font-bold text-text-muted uppercase">Gluten-Free Option</span>
                  <span className="px-2 py-0.5 bg-primary/10 rounded-md text-[9px] font-bold text-primary uppercase">Signature</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-border-custom/40">
                <span className="font-mono text-lg font-extrabold text-primary">₹520</span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-background border border-border-custom rounded-xl text-text-muted transition-colors"><Edit2 size={12} /></button>
                  <button className="p-2 hover:bg-background border border-border-custom rounded-xl text-text-muted transition-colors"><Eye size={12} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small stats helper card (Right 1/3 wide) */}
        <div className="md:col-span-4 bg-primary text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <Wine size={120} />
          </div>
          <div>
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Beverage Alerts</span>
            <h3 className="text-xl font-bold mt-2">Beverage Stocks</h3>
          </div>
          <div className="space-y-4 relative z-10 my-4">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span>Inventory Levels</span>
                <span>94% optimal</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: '94%' }} />
              </div>
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed">
              Masala Chai and Fresh Lime Soda are fully stocked. Mango Lassi remains low.
            </p>
          </div>
          <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl text-xs font-bold transition-all active:scale-95">
            Restock Drawer Order
          </button>
        </div>

        {/* Catalog list grid (12 columns wide, each item card uses col-span-4 on desktop) */}
        {filteredDishes.map(dish => (
          <div 
            key={dish.id}
            className="md:col-span-4 bg-surface border border-border-custom/50 rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 premium-shadow flex flex-col"
          >
            <div className="h-44 relative overflow-hidden flex-shrink-0">
              <ImageFallback 
                alt={dish.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={dish.image}
              />
              <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm border border-border-custom/30 font-mono text-xs font-bold text-text-primary">
                ₹{dish.price.toLocaleString('en-IN')}
              </div>
              <div className="absolute top-3 left-3 flex gap-1">
                <span className="px-2 py-0.5 bg-white/90 dark:bg-[#1A1D1A]/90 backdrop-blur-sm text-[8px] font-bold text-text-muted uppercase tracking-wider rounded-lg border border-border-custom/30">
                  {dish.category}
                </span>
                {dish.labels.includes('Signature') && (
                  <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-bold uppercase rounded-lg shadow-sm">
                    Signature
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between text-left">
              <div>
                <h4 className="font-bold text-sm text-text-primary">{dish.name}</h4>
                <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed line-clamp-2">{dish.description}</p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-custom/30">
                {getStockBadge(dish.stockLevel)}
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => updateMenuItemStock(dish.id, dish.stockLevel === 'available' ? 'low' : dish.stockLevel === 'low' ? 'out' : 'available')}
                    className="p-1.5 hover:bg-background border border-border-custom rounded-lg text-text-muted hover:text-text-primary transition-colors text-[9px] font-bold"
                    title="Toggle Stock Level"
                  >
                    Adjust
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Beverage Inventory log list at bottom */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-text-primary">Traditional Beverage Stocks</h3>
          <span className="text-xs text-text-muted">Total items: {beveragesList.length}</span>
        </div>
        <div className="bg-surface rounded-2xl border border-border-custom/50 premium-shadow overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F7F4] dark:bg-[#111311] border-b border-border-custom/50 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Cellar Area</th>
                <th className="px-6 py-4">Serving Price</th>
                <th className="px-6 py-4">Stock Alert</th>
                <th className="px-6 py-4 text-right">Edit Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/35">
              {beveragesList.map(bev => (
                <tr key={bev.id} className="hover:bg-background/25 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-text-primary flex items-center gap-2">
                    <Wine size={14} className="text-primary" /> {bev.name}
                  </td>
                  <td className="px-6 py-3.5 text-text-muted">Beverages</td>
                  <td className="px-6 py-3.5 font-bold font-mono text-text-primary">₹{bev.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3.5">{getStockBadge(bev.stockLevel)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="text-primary hover:underline font-bold text-[10px] tracking-wide">
                      Update levels
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MENU ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1A1D1A] rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border-custom">
            
            <div className="p-6 border-b border-border-custom bg-background/20 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-text-primary">Add New Menu Item</h3>
                <p className="text-xs text-text-muted mt-0.5">Fill in details to release new recipe dishes.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-sidebar rounded-full text-text-muted"
              >
                <X size={16} />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleSubmit(handleCreateMenuItem)}>
              <div className="grid grid-cols-2 gap-4">
                
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Item Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Dish name is required' })}
                    placeholder="e.g. Mutton Rogan Josh"
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  />
                  {errors.name && <p className="text-[10px] text-danger mt-1 font-bold">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Category Group</label>
                  <select
                    {...register('category')}
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  >
                    <option value="starters">Starters</option>
                    <option value="soups">Soups</option>
                    <option value="mains">Main Courses</option>
                    <option value="breads">Breads</option>
                    <option value="rice">Rice & Biryani</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
                    placeholder="0.00"
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  />
                  {errors.price && <p className="text-[10px] text-danger mt-1 font-bold">{errors.price.message}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Dish Description</label>
                  <textarea
                    rows={3}
                    {...register('description', { required: 'Description is required' })}
                    placeholder="Describe short recipe preparation and core ingredients details..."
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  />
                  {errors.description && <p className="text-[10px] text-danger mt-1 font-bold">{errors.description.message}</p>}
                </div>

                {/* Diet labels */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Diet & Menu Badges</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none">
                      <input type="checkbox" {...register('isSignature')} className="rounded border-border-custom text-primary focus:ring-primary" />
                      <span>Signature Special</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none">
                      <input type="checkbox" {...register('isGlutenFree')} className="rounded border-border-custom text-primary focus:ring-primary" />
                      <span>Gluten-Free</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none">
                      <input type="checkbox" {...register('isVegetarian')} className="rounded border-border-custom text-primary focus:ring-primary" />
                      <span>Vegetarian</span>
                    </label>
                  </div>
                </div>

              </div>

              <div className="pt-6 border-t border-border-custom/50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-border-custom hover:bg-background text-text-primary text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  Release Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
