import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavoraState } from '../context/SavoraContext';
import { Shield, Layers, Utensils, CreditCard, UserCheck, ArrowRight, Sun, Moon } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const Login: React.FC = () => {
  const { login, theme, setTheme } = useSavoraState();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'waiter' | 'chef' | 'cashier'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (isRegister && !name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        // Firebase Auth signup
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        // Firestore user profile document write
        await setDoc(doc(db, 'users', uid), {
          name,
          email,
          role,
          createdAt: new Date().toISOString()
        });

        // Trigger context login to sync states
        login(role, name);
        routeToRole(role);
      } else {
        // Firebase Auth signin
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Immediately fetch user profile for quick routing
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        
        let userRole = 'admin';
        let userName = email.split('@')[0];
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          userRole = userData.role || 'admin';
          userName = userData.name || userName;
        }

        login(userRole, userName);
        routeToRole(userRole);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already in use.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateRoleLogin = (role: string, name: string) => {
    login(role, name);
    routeToRole(role);
  };

  const routeToRole = (role: string) => {
    if (role === 'chef') {
      navigate('/app/kitchen');
    } else if (role === 'waiter' || role === 'cashier') {
      navigate('/app/pos');
    } else {
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111311] flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 bg-white dark:bg-[#1A1D1A] rounded-[2rem] shadow-2xl border border-border-custom overflow-hidden">
        
        {/* Left Side: Standard Credentials Form */}
        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm font-bold">
                  S
                </div>
                <span className="font-extrabold text-primary tracking-tight">Savora</span>
              </div>
              
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 hover:bg-background rounded-full transition-all text-text-muted hover:text-text-primary"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>

            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              {isRegister ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-text-muted mt-1 leading-normal">
              {isRegister 
                ? 'Register your eatery to launch POS system.' 
                : 'Sign in to access your restaurant command panel.'}
            </p>

            {errorMsg && (
              <div className="mt-4 p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleEmailLogin}>
              {isRegister && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                      placeholder="Marc Jenkins"
                      className="w-full bg-background dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                      Restaurant Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full bg-background dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary transition-all cursor-pointer"
                    >
                      <option value="admin">Owner / Admin</option>
                      <option value="manager">Floor Manager</option>
                      <option value="waiter">Waiter / Server</option>
                      <option value="chef">Kitchen Staff (Chef)</option>
                      <option value="cashier">Billing Cashier</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  placeholder="name@restaurant.com"
                  className="w-full bg-background dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  Security Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  placeholder="••••••••"
                  className="w-full bg-background dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary transition-all"
                />
              </div>

              {!isRegister && (
                <div className="text-right">
                  <a href="#" className="text-[10px] font-bold text-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white py-3.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 mt-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}</span>
                {!isLoading && <ArrowRight size={14} />}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-border-custom/50 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-text-muted hover:text-text-primary font-semibold transition-colors"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Right Side: Visual Role Picker for Rapid Dev Testing */}
        <div className="md:col-span-7 bg-[#EEF2EC] dark:bg-[#151815] p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border-custom">
          <div>
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full">
              Developer Demo Sandbox
            </span>
            <h3 className="text-xl font-bold text-text-primary mt-4 tracking-tight">
              Instant Simulation Logins
            </h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              Skip credentials typing. Click any card below to instantly launch Savora with pre-configured mock roles and see specialized workflows.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Admin */}
              <button 
                onClick={() => simulateRoleLogin('admin', 'Marc Jenkins')}
                className="bg-white dark:bg-[#1A1D1A] border border-border-custom hover:border-primary/50 hover:shadow-md p-4 rounded-2xl text-left transition-all active:scale-95 group"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <Shield size={16} />
                  </div>
                  <span className="text-[9px] font-extrabold bg-[#EEF2EC] dark:bg-[#151815] text-primary px-2 py-0.5 rounded uppercase">Full</span>
                </div>
                <h4 className="font-bold text-xs text-text-primary">Owner / Admin</h4>
                <p className="text-[10px] text-text-muted mt-1 leading-snug">Access every system module: finances, settings, shifts.</p>
              </button>

              {/* Manager */}
              <button 
                onClick={() => simulateRoleLogin('manager', 'Marcus Vance')}
                className="bg-white dark:bg-[#1A1D1A] border border-border-custom hover:border-primary/50 hover:shadow-md p-4 rounded-2xl text-left transition-all active:scale-95 group"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <UserCheck size={16} />
                  </div>
                  <span className="text-[9px] font-extrabold bg-[#EEF2EC] dark:bg-[#151815] text-primary px-2 py-0.5 rounded uppercase">Ops</span>
                </div>
                <h4 className="font-bold text-xs text-text-primary">Floor Manager</h4>
                <p className="text-[10px] text-text-muted mt-1 leading-snug">Manage floor seating plans, staff rosters, reservations.</p>
              </button>

              {/* Waiter */}
              <button 
                onClick={() => simulateRoleLogin('waiter', 'Sarah Jenkins')}
                className="bg-white dark:bg-[#1A1D1A] border border-border-custom hover:border-primary/50 hover:shadow-md p-4 rounded-2xl text-left transition-all active:scale-95 group"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <Layers size={16} />
                  </div>
                  <span className="text-[9px] font-extrabold bg-[#EEF2EC] dark:bg-[#151815] text-primary px-2 py-0.5 rounded uppercase">POS</span>
                </div>
                <h4 className="font-bold text-xs text-text-primary">Waiter / Server</h4>
                <p className="text-[10px] text-text-muted mt-1 leading-snug">Fast ordering cart, table mappings, direct kitchen fires.</p>
              </button>

              {/* Chef */}
              <button 
                onClick={() => simulateRoleLogin('chef', 'Pierre Dubois')}
                className="bg-white dark:bg-[#1A1D1A] border border-border-custom hover:border-primary/50 hover:shadow-md p-4 rounded-2xl text-left transition-all active:scale-95 group"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <Utensils size={16} />
                  </div>
                  <span className="text-[9px] font-extrabold bg-[#EEF2EC] dark:bg-[#151815] text-primary px-2 py-0.5 rounded uppercase">KDS</span>
                </div>
                <h4 className="font-bold text-xs text-text-primary">Kitchen (Chef)</h4>
                <p className="text-[10px] text-text-muted mt-1 leading-snug">Dedicated live KDS board showing pending tickets and timers.</p>
              </button>

              {/* Cashier */}
              <button 
                onClick={() => simulateRoleLogin('cashier', 'Elena Rostova')}
                className="bg-white dark:bg-[#1A1D1A] border border-border-custom hover:border-primary/50 hover:shadow-md p-4 rounded-2xl text-left transition-all active:scale-95 sm:col-span-2 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                    <CreditCard size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-text-primary">Billing Cashier</h4>
                      <span className="text-[9px] font-extrabold bg-[#EEF2EC] dark:bg-[#151815] text-primary px-2 py-0.5 rounded uppercase">Receipts</span>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5 leading-snug">Access payments checkout, gratuity models, print receipt configurations.</p>
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
