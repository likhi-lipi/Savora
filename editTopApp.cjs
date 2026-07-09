const fs = require('fs');
const file = 'src/components/TopAppBar.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add context variables
content = content.replace(
  '    setTheme \n  } = useSavoraState();',
  '    setTheme,\n    menuItems,\n    orders,\n    customers,\n    employees,\n    inventory\n  } = useSavoraState();'
);

// 2. Add derived search logic
const searchLogic = `
  const normalizedQuery = searchQuery.toLowerCase();
  
  const searchResults = {
    menu: searchQuery.length > 1 ? menuItems.filter(m => m.name.toLowerCase().includes(normalizedQuery) || m.category.includes(normalizedQuery)) : [],
    orders: searchQuery.length > 1 ? orders.filter(o => o.id.toLowerCase().includes(normalizedQuery) || o.tableName.toLowerCase().includes(normalizedQuery)) : [],
    customers: searchQuery.length > 1 ? customers.filter(c => c.name.toLowerCase().includes(normalizedQuery) || c.phone.includes(normalizedQuery)) : [],
    staff: searchQuery.length > 1 ? employees.filter(e => e.name.toLowerCase().includes(normalizedQuery) || e.role.includes(normalizedQuery)) : [],
    inventory: searchQuery.length > 1 ? inventory.filter(i => i.name.toLowerCase().includes(normalizedQuery)) : []
  };

  const hasResults = Object.values(searchResults).some(arr => arr.length > 0);
`;
content = content.replace(
  '  // Toggle Theme',
  searchLogic + '\n  // Toggle Theme'
);

// 3. Replace Global Search JSX
const searchJSX = `
      {/* Global Search */}
      <div className="flex-1 max-w-md hidden sm:block relative">
        <div className="relative flex items-center bg-background/50 border border-border-custom rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all group">
          <Search size={18} className="text-text-muted mr-2" />
          <input
            id="global-search"
            type="text"
            placeholder="Search orders, tables, menu, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm w-full outline-none focus:ring-0 placeholder:text-text-muted/70 text-text-primary"
            autoComplete="off"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-text-muted hover:text-text-primary">
              <X size={14} />
            </button>
          )}
          {!searchQuery && (
            <span className="text-[10px] font-bold text-text-muted border border-border-custom rounded px-1.5 py-0.5 group-focus-within:hidden select-none">
              Ctrl K
            </span>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {searchQuery.length > 1 && (
          <div className="absolute top-full mt-2 w-full max-h-[70vh] overflow-y-auto bg-surface border border-border-custom rounded-2xl shadow-xl z-50 custom-scroll text-left entrance-anim">
            <div className="p-2 space-y-1">
              {!hasResults && (
                <div className="p-4 text-center text-text-muted text-xs">
                  No results found for "{searchQuery}"
                </div>
              )}
              
              {searchResults.orders.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">Orders</div>
                  {searchResults.orders.map(o => (
                    <div key={o.id} className="px-3 py-2 hover:bg-background/50 rounded-xl cursor-pointer flex justify-between items-center transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{o.id}</p>
                        <p className="text-xs text-text-muted">{o.tableName} • {o.items.length} items</p>
                      </div>
                      <span className="text-xs font-bold text-primary">₹{o.totalPrice}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.customers.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">Customers</div>
                  {searchResults.customers.map(c => (
                    <div key={c.id} className="px-3 py-2 hover:bg-background/50 rounded-xl cursor-pointer flex justify-between items-center transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{c.name}</p>
                        <p className="text-xs text-text-muted">{c.phone}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c.tier}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.menu.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">Menu Items</div>
                  {searchResults.menu.map(m => (
                    <div key={m.id} className="px-3 py-2 hover:bg-background/50 rounded-xl cursor-pointer flex justify-between items-center transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={m.image} alt={m.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{m.name}</p>
                          <p className="text-xs text-text-muted capitalize">{m.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-text-primary">₹{m.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.staff.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">Staff</div>
                  {searchResults.staff.map(s => (
                    <div key={s.id} className="px-3 py-2 hover:bg-background/50 rounded-xl cursor-pointer flex justify-between items-center transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{s.name}</p>
                        <p className="text-xs text-text-muted capitalize">{s.role}</p>
                      </div>
                      <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full \${s.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}\`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
`;
content = content.replace(
  /<div className="flex-1 max-w-md hidden sm:block">[\s\S]*?<\/div>\s*<\/div>/,
  searchJSX
);

fs.writeFileSync(file, content);
console.log("Done");
