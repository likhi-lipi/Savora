import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  UtensilsCrossed, 
  TrendingUp, 
  Layers, 
  Package, 
  ChefHat, 
  Users, 
  CheckCircle,
  HelpCircle,
  Plus,
  Minus,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSavoraState } from '../context/SavoraContext';
import { SavoraLogo } from '../components/SavoraLogo';

const features = [
  {
    icon: UtensilsCrossed,
    title: 'POS Terminal',
    description: 'Fast, touch-optimized ordering interface for waiters. Complete checks in fewer clicks during busy service.'
  },
  {
    icon: ChefHat,
    title: 'Kitchen Display (KDS)',
    description: 'Kanban kitchen display with color-coded preparation columns, auto timers, and touch-ready card state controls.'
  },
  {
    icon: TrendingUp,
    title: 'AI Analytics',
    description: 'Machine learning analytics predicting peak hours, low stock levels, and offering dish optimization tips.'
  },
  {
    icon: Layers,
    title: 'Interactive Floor Map',
    description: 'Visual seating layout tracking real-time status of dining areas, terrace tables, and occupancy durations.'
  },
  {
    icon: Package,
    title: 'Smart Inventory',
    description: 'Automatic recipe ingredient depletion with low stock system warnings and supplier purchase order generation.'
  },
  {
    icon: Users,
    title: 'Customer CRM',
    description: 'Loyalty tracking system showing dining histories, VIP preferences, check values, and target marketing lists.'
  }
];

const faqs = [
  {
    question: 'How long does Savora take to set up at a restaurant?',
    answer: 'Savora can be initialized in less than 24 hours. Because it runs natively on standard browsers, tablets, and phones, you do not need to buy proprietary hardware. Import your menu via CSV and configure your floor plan in minutes.'
  },
  {
    question: 'Can Savora work offline during network outages?',
    answer: 'Yes! Savora POS utilizes offline syncing capabilities. If your internet connection goes down, orders continue to register locally on tablets and print receipts, then sync back to the cloud database the moment connectivity is restored.'
  },
  {
    question: 'Does Savora support cloud kitchens or multi-location outlets?',
    answer: 'Absolutely. Savora is built on a multi-tenant cloud framework. Owners can manage menu updates, view consolidated reports, and track inventory across multiple branches or cloud kitchen brands from a single consolidated dashboard.'
  },
  {
    question: 'Are receipt layouts and tax structures customizable?',
    answer: 'Yes, Savora provides full receipt branding control. You can add your logo, customize footers with QR payment codes, configure service charges, and set up tax brackets based on local legislation (GST, VAT, Sales Tax).'
  }
];

export const Landing: React.FC = () => {
  const { theme, setTheme } = useSavoraState();
  const [isAnnual, setIsAnnual] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111311] transition-colors duration-300">
      
      {/* Landing Top Header */}
      <header className="fixed top-0 left-0 w-full h-20 bg-white/70 dark:bg-[#111311]/70 backdrop-blur-md border-b border-border-custom/50 z-50 flex items-center justify-between px-6 md:px-16 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <SavoraLogo size={36} />
          <span className="font-bold text-lg text-primary tracking-tight font-sans">Savora</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 hover:bg-border-custom/30 rounded-full transition-all text-text-muted hover:text-text-primary"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <Link to="/login" className="text-sm font-semibold text-text-muted hover:text-text-primary transition-colors">
            Sign In
          </Link>
          <Link to="/login" className="bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-20 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
            Smart Dining. Simplified.
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-6 leading-tight text-text-primary font-sans">
            The Premium Operating System for <span className="text-primary">Modern Restaurants</span>
          </h1>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Savora combines table reservations, POS billing, kitchen KDS displays, inventory, and AI forecasting in a beautiful Vercel-inspired SaaS interface.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <a href="#features" className="w-full sm:w-auto bg-white dark:bg-[#1A1D1A] border border-border-custom text-text-primary px-8 py-4 rounded-xl font-bold hover:bg-[#EEF2EC] dark:hover:bg-[#151815] transition-all flex items-center justify-center">
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* Dashboard Mockup Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative rounded-2xl overflow-hidden border border-border-custom bg-white dark:bg-[#1A1D1A] p-4 shadow-2xl"
        >
          <div className="h-6 flex items-center gap-1.5 border-b border-border-custom/50 pb-3 mb-3 text-text-muted select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-[10px] ml-2 font-mono">dashboard.savora.app</span>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&auto=format&fit=crop&q=80" 
            alt="Savora Premium OS Mockup" 
            className="w-full object-cover rounded-xl h-[300px] md:h-[500px]"
          />
        </motion.div>
      </section>

      {/* Features Bento Section */}
      <section id="features" className="py-24 bg-white dark:bg-[#1A1D1A] border-y border-border-custom/40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
              Built for Hospitality Excellence
            </h2>
            <p className="text-text-muted text-sm md:text-base mt-4">
              Everything you need to orchestrate a high-performance eatery, from host stand seating to kitchen expo lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#F8F7F4] dark:bg-[#111311] p-8 rounded-2xl border border-border-custom/50 premium-shadow-hover relative overflow-hidden group"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">{feat.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 text-left">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl font-extrabold text-text-primary mt-3 tracking-tight">Loved by Chef & Managers</h2>
            <p className="text-text-muted text-sm mt-4 leading-relaxed">
              Discover how dining establishments are accelerating table turnover times, reducing wastage, and raising average billing metrics.
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#1A1D1A] p-8 rounded-2xl border border-border-custom/60 shadow-sm text-left lg:col-span-1">
            <p className="text-text-muted text-sm leading-relaxed italic">
              "We deployed Savora on iPads across our dining rooms. Order tickets hit the KDS instantly, and our servers never have to leave the table to print checks. It saved us thousands."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">MJ</div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">Marcus Jenkins</h4>
                <p className="text-[10px] text-text-muted">General Manager, Lumière Dining</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1D1A] p-8 rounded-2xl border border-border-custom/60 shadow-sm text-left lg:col-span-1">
            <p className="text-text-muted text-sm leading-relaxed italic">
              "The AI Inventory stock predictions alert my suppliers automatically before we run out of Paneer or Basmati Rice. That feature alone is worth the subscription."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">AL</div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">Elena Rostova</h4>
                <p className="text-[10px] text-text-muted">Director, Rostova Cloud Kitchens</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Module */}
      <section id="pricing" className="py-24 bg-white dark:bg-[#1A1D1A] border-t border-border-custom/40 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
            Predictable, Simple Pricing Plans
          </h2>
          <p className="text-text-muted text-sm mt-4 max-w-lg mx-auto">
            Choose the workspace scale that matches your dining capacity. No setup fees, cancel anytime.
          </p>

          {/* Pricing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${!isAnnual ? 'text-primary' : 'text-text-muted'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 bg-primary/20 rounded-full relative flex items-center p-0.5"
            >
              <div className={`w-5 h-5 bg-primary rounded-full transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-semibold ${isAnnual ? 'text-primary' : 'text-text-muted'}`}>
              Annual <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">Save 20%</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            {/* Starter */}
            <div className="bg-[#F8F7F4] dark:bg-[#111311] p-8 rounded-3xl border border-border-custom flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-text-primary">Starter</h3>
                <p className="text-text-muted text-xs mt-1">Perfect for cafés, cloud kitchens, and small restaurants.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text-primary">₹{isAnnual ? '799' : '999'}</span>
                  <span className="text-text-muted text-xs">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-text-muted">
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Up to 8 Tables</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> 2 Staff Accounts</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> POS Billing System</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Kitchen Display System (KDS)</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Basic Inventory Management</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Digital & Printed Receipts</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Basic Sales Reports</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Email Support</li>
                </ul>
              </div>
              <Link to="/login" className="mt-8 w-full bg-white dark:bg-[#1A1D1A] hover:bg-[#EEF2EC] text-text-primary border border-border-custom py-3 rounded-xl text-center text-xs font-bold shadow-sm transition-all">
                Start Free Trial
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white dark:bg-[#1A1D1A] p-8 rounded-3xl border-2 border-primary flex flex-col justify-between relative shadow-lg">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary">Professional</h3>
                <p className="text-text-muted text-xs mt-1">Ideal for growing restaurants and multi-table dining.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text-primary">₹{isAnnual ? '1,999' : '2,499'}</span>
                  <span className="text-text-muted text-xs">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-text-muted">
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Unlimited Tables</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Unlimited Staff Accounts</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Advanced POS & Billing</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Kitchen Display System (KDS)</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Complete Inventory Management</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Customer CRM</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> AI Sales Insights</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Reservation Management</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Advanced Analytics & Reports</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Priority Support</li>
                </ul>
              </div>
              <Link to="/login" className="mt-8 w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-center text-xs font-bold shadow-md transition-all">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-[#F8F7F4] dark:bg-[#111311] p-8 rounded-3xl border border-border-custom flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-text-primary">Enterprise</h3>
                <p className="text-text-muted text-xs mt-1">Designed for restaurant chains and enterprise businesses.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text-primary">Custom</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-text-muted">
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Multi-Branch Management</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Franchise Support</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Dedicated Account Manager</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> API & ERP Integrations</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> White Label Solution</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Advanced Security</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> Custom Deployment</li>
                  <li className="flex items-center gap-2.5"><CheckCircle size={14} className="text-primary" /> SLA & 24/7 Priority Support</li>
                </ul>
              </div>
              <Link to="/login" className="mt-8 w-full bg-white dark:bg-[#1A1D1A] hover:bg-[#EEF2EC] text-text-primary border border-border-custom py-3 rounded-xl text-center text-xs font-bold shadow-sm transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-text-primary text-center tracking-tight">Frequently Asked Questions</h2>
        <div className="mt-16 space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-[#1A1D1A] border border-border-custom/75 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left flex justify-between items-center font-bold text-text-primary text-sm md:text-base outline-none focus:ring-0"
              >
                <span>{faq.question}</span>
                <span className="text-primary flex-shrink-0 ml-4">
                  {expandedFaq === idx ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              
              {expandedFaq === idx && (
                <div className="p-6 pt-0 text-text-muted text-xs md:text-sm border-t border-border-custom/10 leading-relaxed transition-all">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action banner */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="bg-primary rounded-[2rem] p-10 md:p-16 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-[0.07] select-none pointer-events-none translate-x-20 -translate-y-20 w-[350px] h-[350px]">
            <SavoraLogo size={350} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Ready to upgrade your service speed?
          </h2>
          <p className="text-white/80 max-w-lg mx-auto text-sm md:text-base mt-6 leading-relaxed">
            Get started today. Try Savora professional completely free for 14 days. No credit card required.
          </p>
          <div className="mt-10 flex justify-center">
            <Link to="/login" className="bg-[#F8F7F4] hover:bg-white text-primary px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 text-sm">
              Launch Savora Terminal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-custom bg-white dark:bg-[#111311] py-12 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <SavoraLogo size={28} />
            <span className="font-bold text-text-primary text-sm">Savora Operating Suite</span>
          </div>

          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} Savora. Google DeepMind pair-programmed. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs font-semibold text-text-muted">
            <a href="#" className="hover:text-text-primary transition-all">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-all">Terms of Service</a>
            <a href="#" className="hover:text-text-primary transition-all">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
