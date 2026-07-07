import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Cpu, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIInsights: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello! I am Savora AI, your automated dining analyst. I monitor your floor occupancy, chef prep speeds, inventory depletion rates, and receipt billing in real-time. Ask me anything about your restaurant operations.',
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Generate responsive AI response based on query keywords
    setTimeout(() => {
      let aiText = "I've reviewed our data logs. Today's sales performance is solid, showing ₹14,920 in total revenue. Average prep speed is optimal at 14 minutes. Let me know if you'd like a specific breakdown of dishes or inventory.";
      const query = chatInput.toLowerCase();

      if (query.includes('dish') || query.includes('sell') || query.includes('menu')) {
        aiText = 'According to today\'s sales log, "Wagyu Sliders" is our top fire item with 42 units sold, followed by "Truffle Risotto" (+12% increase). Suggest placing the chardonnay on special as it yields high margin conversions.';
      } else if (query.includes('staff') || query.includes('shift') || query.includes('hour')) {
        aiText = 'Occupancy forecasting indicates a dining rush peaking at 19:30. Based on table booking checks, Table 12 has a VIP party (Sarah Jenkins) arriving. Ensure 1 extra server is assigned to the Main Room.';
      } else if (query.includes('stock') || query.includes('inventory') || query.includes('wine')) {
        aiText = 'Stock levels audit: chardonnay and ribeye portions are optimal. However, Veuve Clicquot Yellow Label champagne is down to 4 bottles (safety limit is 12). I recommend sending a restock order to vendor Alpha Wine.';
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="pt-2 flex flex-col lg:flex-row h-[calc(100vh-6rem)] overflow-hidden gap-6 entrance-anim">
      
      {/* Left Pane: Interactive Chat Interface (2/3 Width) */}
      <section className="flex-1 bg-surface border border-border-custom/50 rounded-2xl flex flex-col overflow-hidden premium-shadow">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-border-custom/40 flex items-center gap-3 bg-background/10">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary shadow-inner">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-text-primary">Savora AI Analytical Workspace</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Ask questions about menu pricing, labor rostering, or stock logistics</p>
          </div>
        </div>

        {/* Messages list view */}
        <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-4 bg-background/15">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[9px] shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-[#1A1D1A] text-primary border border-border-custom'
              }`}>
                {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              
              <div className={`p-3.5 rounded-2xl text-xs text-left leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-white dark:bg-[#1A1D1A] border border-border-custom text-text-primary rounded-tl-none'
              }`}>
                <p>{msg.text}</p>
                <span className={`text-[8px] mt-1.5 block text-right ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-text-muted/70'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input prompt */}
        <form className="p-4 border-t border-border-custom/50 bg-white dark:bg-[#1A1D1A] flex gap-3" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Ask AI: 'how is inventory stock?' or 'who is seated at table 12?'"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 bg-background dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-primary"
          />
          <button 
            type="submit"
            className="bg-primary hover:bg-primary/95 text-white p-3 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
          >
            <Send size={14} />
          </button>
        </form>

      </section>

      {/* Right Pane: Predictive stats indicators (1/3 Width) */}
      <aside className="w-full lg:w-80 bg-surface border border-border-custom/50 rounded-2xl p-5 flex flex-col gap-5 flex-shrink-0 premium-shadow text-left">
        
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-primary" />
            <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">Predictive Modeling</h4>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            AI constantly monitors active dining rooms and supplies lists to forecast demand shifts.
          </p>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto custom-scroll pr-1">
          
          {/* Refill prediction */}
          <div className="bg-[#F8F7F4] dark:bg-[#111311] p-4 rounded-xl border border-border-custom/55">
            <span className="text-[9px] font-extrabold uppercase bg-danger/10 text-danger px-2 py-0.5 rounded-full">Refill Forecast</span>
            <h5 className="font-bold text-xs text-text-primary mt-2">Veuve Clicquot Refill Date</h5>
            <p className="text-[10px] text-text-muted mt-1">
              Refill threshold will trigger in <span className="font-bold text-text-primary font-mono">2 days</span> based on weekend guest booking covers.
            </p>
          </div>

          {/* Pricing Suggestion */}
          <div className="bg-[#F8F7F4] dark:bg-[#111311] p-4 rounded-xl border border-border-custom/55">
            <span className="text-[9px] font-extrabold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">Menu Pricing</span>
            <h5 className="font-bold text-xs text-text-primary mt-2">Chardonnay Price Uplift</h5>
            <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
              Domain Chardonnay is priced 8% lower than competitor average. Raising glass price by ₹1.50 is predicted to add ₹620 monthly.
            </p>
            <a href="#" className="text-[9px] font-bold text-primary hover:underline flex items-center gap-0.5 mt-2">
              Apply pricing change <ArrowUpRight size={10} />
            </a>
          </div>

          {/* Alert */}
          <div className="bg-warning/10 border border-warning/20 p-3 rounded-xl flex gap-2">
            <AlertTriangle size={14} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-[9px] text-text-muted leading-tight">
              Predicted rush period starts in 45 minutes. Ensure Chef Dubois and expos are fully briefed.
            </p>
          </div>

        </div>

      </aside>

    </div>
  );
};
