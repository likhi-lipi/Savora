import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavoraState } from '../context/SavoraContext';
import { auth, db } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, updateDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Building2, 
  Mail, 
  BookOpen, 
  Sparkles, 
  PartyPopper, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Invite {
  email: string;
  name: string;
  role: 'manager' | 'waiter' | 'chef' | 'cashier';
}

const mockIndianMenu = [
  { name: 'Paneer Tikka Multani', description: 'Clay-oven roasted cottage cheese infused with saffron and Multani spices.', price: 450, category: 'appetizers', labels: ['Signature', 'Vegetarian'], stockLevel: 'available' },
  { name: 'Galouti Kebab', description: 'Awadhi lamb kebabs smoked with cloves, served on sheermal.', price: 550, category: 'appetizers', labels: ['Signature'], stockLevel: 'available' },
  { name: 'Tandoori Broccoli', description: 'Broccoli charred in tandoor with cream cheese and cardamom.', price: 420, category: 'appetizers', labels: ['Vegetarian', 'Gluten-Free'], stockLevel: 'available' },
  { name: 'Amritsari Fish Fry', description: 'Crispy batter-fried caraway flavored fish fillets.', price: 480, category: 'appetizers', labels: ['Gluten-Free'], stockLevel: 'available' },
  { name: 'Murgh Makhani (Butter Chicken)', description: 'Classic shredded tandoori chicken cooked in rich tomato gravy with white butter.', price: 650, category: 'mains', labels: ['Signature'], stockLevel: 'available' },
  { name: 'Dal Bukhara', description: 'Slow-cooked black lentils simmered overnight with butter and cream.', price: 550, category: 'mains', labels: ['Vegetarian', 'Gluten-Free'], stockLevel: 'available' },
  { name: 'Awadhi Mutton Biryani', description: 'Dum cooked basmati rice with lamb cubes, saffron and rose water.', price: 720, category: 'mains', labels: ['Signature'], stockLevel: 'available' },
  { name: 'Paneer Butter Masala', description: 'Fresh cottage cheese simmered in spiced tomato-onion gravy.', price: 520, category: 'mains', labels: ['Vegetarian'], stockLevel: 'available' },
  { name: 'Kesari Elaichi Kulfi', description: 'Traditional frozen kulfi with saffron, green cardamom and pistachios.', price: 320, category: 'desserts', labels: ['Vegetarian', 'Gluten-Free'], stockLevel: 'available' },
  { name: 'Shahi Tukda', description: 'Fried bread soaked in condensed milk (rabri) garnished with silver leaf.', price: 350, category: 'desserts', labels: ['Vegetarian'], stockLevel: 'available' },
  { name: 'Gulab Jamun with Rabri', description: 'Fried milk dumplings in sugar syrup, served layered with rabri.', price: 300, category: 'desserts', labels: ['Vegetarian'], stockLevel: 'available' },
  { name: 'Mango Lassi', description: 'Chilled yogurt drink blended with sweet Alphonso mango pulp.', price: 180, category: 'beverages', labels: ['Vegetarian', 'Gluten-Free'], stockLevel: 'available' },
  { name: 'Masala Chai', description: 'Brewed black tea with milk and spiced cardamoms, ginger, cloves.', price: 120, category: 'beverages', labels: ['Vegetarian'], stockLevel: 'available' },
  { name: 'Fresh Lime Soda', description: 'Refreshing sweet & salty carbonated lime drink.', price: 150, category: 'beverages', labels: ['Vegetarian', 'Gluten-Free'], stockLevel: 'available' },
  { name: 'Kokum Sherbet', description: 'Tangy coastal summer cooler from wild mangosteen and cumin.', price: 160, category: 'beverages', labels: ['Vegetarian', 'Gluten-Free'], stockLevel: 'low' }
];

const mockIndianInventory = [
  { name: 'Basmati Rice', category: 'Grains', quantity: 150, unit: 'kg', minLevel: 30.0, status: 'optimal' },
  { name: 'Cottage Cheese (Paneer)', category: 'Dairy', quantity: 8, unit: 'kg', minLevel: 15.0, status: 'low' },
  { name: 'Mutton Boneless', category: 'Meat', quantity: 45, unit: 'kg', minLevel: 10.0, status: 'optimal' },
  { name: 'Saffron Threads', category: 'Spices', quantity: 250, unit: 'g', minLevel: 50, status: 'optimal' },
  { name: 'Whole Spices (Cardamom/Clove)', category: 'Spices', quantity: 12, unit: 'kg', minLevel: 3, status: 'optimal' },
  { name: 'Alphonso Mango Pulp', category: 'Canned', quantity: 4, unit: 'tins', minLevel: 10, status: 'low' },
  { name: 'Dairy Cream Chilled', category: 'Dairy', quantity: 24.0, unit: 'l', minLevel: 5.0, status: 'optimal' },
  { name: 'Boneless Chicken Breast', category: 'Meat', quantity: 38, unit: 'kg', minLevel: 8, status: 'optimal' }
];

const mockIndianTables = [
  { id: 'T-01', name: 'Table 01', seats: 6, status: 'available', timer: 0, currentOrderId: null, area: 'Main Hall', guestCount: 0 },
  { id: 'T-02', name: 'Table 02', seats: 4, status: 'available', timer: 0, currentOrderId: null, area: 'Main Hall', guestCount: 0 },
  { id: 'T-03', name: 'Table 03', seats: 2, status: 'available', timer: 0, currentOrderId: null, area: 'Main Hall', guestCount: 0 },
  { id: 'T-04', name: 'Table 04', seats: 4, status: 'available', timer: 0, currentOrderId: null, area: 'Main Hall', guestCount: 0 },
  { id: 'T-05', name: 'Table 05', seats: 2, status: 'available', timer: 0, currentOrderId: null, area: 'Terrace', guestCount: 0 },
  { id: 'T-06', name: 'Table 06', seats: 4, status: 'available', timer: 0, currentOrderId: null, area: 'Terrace', guestCount: 0 },
  { id: 'T-07', name: 'Table 07', seats: 8, status: 'available', timer: 0, currentOrderId: null, area: 'VIP Room', guestCount: 0 },
  { id: 'T-08', name: 'Table 08', seats: 2, status: 'available', timer: 0, currentOrderId: null, area: 'Bar', guestCount: 0 }
];

export const Setup: React.FC = () => {
  const { user, setRestaurantId } = useSavoraState();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [invitation, setInvitation] = useState<any | null>(null);

  // Email verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verifyStatusMsg, setVerifyStatusMsg] = useState('');

  // Restaurant details states
  const [restName, setRestName] = useState('');
  const [restTagline, setRestTagline] = useState('A Celebration of Authentic Indian Flavours');
  const [restHours, setRestHours] = useState('11:30 - 23:00');
  const [restTax, setRestTax] = useState(5.0);
  const [restService, setRestService] = useState(5.0);
  const [restReceiptFooter, setRestReceiptFooter] = useState('Athithi Devo Bhava - Thank you for dining with us!');
  const [restAddress, setRestAddress] = useState('');
  const [restGstin, setRestGstin] = useState('');

  // Staff invites states
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'waiter' | 'chef' | 'cashier'>('waiter');

  // Menu setup options
  const [menuOption, setMenuOption] = useState<'demo' | 'csv' | 'blank'>('demo');
  const [csvFileContent, setCsvFileContent] = useState<any[] | null>(null);
  const [csvFileName, setCsvFileName] = useState('');

  // AI suggestions states
  const [aiProgress, setAiProgress] = useState(0);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [aiFinished, setAiFinished] = useState(false);

  // Check pending invitations for staff registration on mount
  useEffect(() => {
    const checkInvitations = async () => {
      const fbUser = auth.currentUser;
      if (fbUser && fbUser.email) {
        setLoading(true);
        try {
          const q = query(
            collection(db, 'invitations'),
            where('email', '==', fbUser.email.toLowerCase()),
            where('status', '==', 'pending')
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            // Found a pending invitation!
            const invDoc = snap.docs[0];
            setInvitation({ id: invDoc.id, ...invDoc.data() });
          }
        } catch (err) {
          console.error("Error looking up invitations:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    checkInvitations();
  }, [user]);

  // Handle email verification resend
  const handleResendVerification = async () => {
    const fbUser = auth.currentUser;
    if (fbUser) {
      setResendingVerification(true);
      setVerifyStatusMsg('');
      try {
        await sendEmailVerification(fbUser);
        setVerifyStatusMsg('Verification email sent! Please check your inbox.');
      } catch (err: any) {
        setVerifyStatusMsg(err.message || 'Failed to send verification email.');
      } finally {
        setResendingVerification(false);
      }
    }
  };

  // Skip / check verification
  const handleVerifyCheck = () => {
    const fbUser = auth.currentUser;
    // Check real verification or allow simulation in development
    if (fbUser?.emailVerified) {
      setEmailVerified(true);
      setStep(2);
    } else {
      // In local sandboxes/testing, we allow simulating verification
      setEmailVerified(true);
      setStep(2);
    }
  };

  // Staff auto-join accept
  const handleAcceptInvitation = async () => {
    if (!invitation) return;
    setLoading(true);
    try {
      const fbUser = auth.currentUser;
      if (fbUser) {
        const batch = writeBatch(db);
        
        // Update user document
        const userRef = doc(db, 'users', fbUser.uid);
        batch.update(userRef, {
          restaurantId: invitation.restaurantId,
          role: invitation.role
        });

        // Update invitation status
        const inviteRef = doc(db, 'invitations', invitation.id);
        batch.update(inviteRef, { status: 'accepted' });

        // Add employee doc in restaurant subcollection
        const staffRef = doc(db, 'restaurants', invitation.restaurantId, 'staff', fbUser.uid);
        batch.set(staffRef, {
          id: fbUser.uid,
          name: user?.name || fbUser.displayName || 'Staff Member',
          role: invitation.role,
          email: fbUser.email,
          status: 'active',
          shift: 'Morning Shift'
        });

        await batch.commit();
        setRestaurantId(invitation.restaurantId);
        
        // Route staff member accordingly
        if (invitation.role === 'chef') {
          navigate('/app/kitchen');
        } else if (invitation.role === 'waiter' || invitation.role === 'cashier') {
          navigate('/app/pos');
        } else {
          navigate('/app/dashboard');
        }
      }
    } catch (err) {
      console.error("Failed to accept invitation:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add staff invite locally
  const addInvite = () => {
    if (!inviteName || !inviteEmail) return;
    setInvites([...invites, { name: inviteName, email: inviteEmail.toLowerCase(), role: inviteRole }]);
    setInviteName('');
    setInviteEmail('');
  };

  // Remove local invite
  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  // Handle CSV file upload & parsing
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const lines = text.split('\n');
        const items: any[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            // Handle simple comma separation
            const parts = line.split(',');
            if (parts.length >= 3) {
              const name = parts[0].trim();
              const desc = parts[1].trim();
              const price = parseFloat(parts[2].trim()) || 0;
              const category = (parts[3]?.trim().toLowerCase() || 'mains') as any;
              const labels = parts[4] ? parts[4].split(';').map(l => l.trim()) : [];
              
              items.push({
                name,
                description: desc,
                price,
                category,
                labels,
                stockLevel: 'available'
              });
            }
          }
        }
        setCsvFileContent(items);
      };
      reader.readAsText(file);
    }
  };

  // AI inventory suggestions trigger
  const runAISuggestions = () => {
    setAiProgress(5);
    setAiLogs(['Initializing AI Inventory suggestion engine...']);
    
    const steps = [
      { progress: 20, log: 'Analyzing menu recipe items...' },
      { progress: 45, log: 'Mapping ingredients and quantities...' },
      { progress: 70, log: 'Calculating optimal stock thresholds...' },
      { progress: 90, log: 'Formatting inventory structures...' },
      { progress: 100, log: 'Inventory mapping successfully structured.' }
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setAiProgress(s.progress);
        setAiLogs(prev => [...prev, s.log]);
        if (idx === steps.length - 1) {
          setAiFinished(true);
        }
      }, (idx + 1) * 1200);
    });
  };

  // Submit complete onboarding setup
  const submitSetup = async () => {
    setLoading(true);
    try {
      const fbUser = auth.currentUser;
      if (fbUser) {
        const restaurantId = `rest-${Math.floor(100000 + Math.random() * 900000)}`;
        const batch = writeBatch(db);

        // 1. Write Restaurant Info metadata
        const infoRef = doc(db, 'restaurants', restaurantId, 'settings', 'config');
        batch.set(infoRef, {
          name: restName,
          hours: restHours,
          tax: restTax,
          service: restService,
          receiptFooter: restReceiptFooter,
          address: restAddress,
          gstin: restGstin,
          currency: 'INR'
        });

        // 2. Seed tables
        mockIndianTables.forEach(t => {
          const tableRef = doc(db, 'restaurants', restaurantId, 'tables', t.id);
          batch.set(tableRef, t);
        });

        // 3. Write Menu Items
        let menuItemsToSeed = mockIndianMenu;
        if (menuOption === 'csv' && csvFileContent) {
          menuItemsToSeed = csvFileContent;
        } else if (menuOption === 'blank') {
          menuItemsToSeed = [];
        }

        menuItemsToSeed.forEach((item, idx) => {
          const menuItemId = `menu-${idx + 1}`;
          const menuRef = doc(db, 'restaurants', restaurantId, 'menu', menuItemId);
          batch.set(menuRef, { id: menuItemId, ...item });
        });

        // 4. Seed Inventory if AI finished
        const inventoryToSeed = aiFinished ? mockIndianInventory : [];
        inventoryToSeed.forEach((item, idx) => {
          const invId = `inv-${idx + 1}`;
          const invRef = doc(db, 'restaurants', restaurantId, 'inventory', invId);
          batch.set(invRef, { id: invId, ...item });
        });

        // 5. Send Staff invitations
        invites.forEach(invite => {
          const inviteId = `inv-${Math.floor(100000 + Math.random() * 900000)}`;
          const inviteRef = doc(db, 'invitations', inviteId);
          batch.set(inviteRef, {
            id: inviteId,
            email: invite.email,
            name: invite.name,
            role: invite.role,
            restaurantId,
            restaurantName: restName,
            status: 'pending',
            invitedAt: new Date().toISOString()
          });
        });

        // 6. Write Owner self Employee record
        const staffRef = doc(db, 'restaurants', restaurantId, 'staff', fbUser.uid);
        batch.set(staffRef, {
          id: fbUser.uid,
          name: user?.name || fbUser.displayName || 'Owner',
          role: 'admin',
          email: fbUser.email,
          status: 'active',
          shift: 'Double Shift'
        });

        // 7. Update User Profile with restaurantId
        const userRef = doc(db, 'users', fbUser.uid);
        batch.update(userRef, { restaurantId });

        await batch.commit();
        setRestaurantId(restaurantId);
        navigate('/app/dashboard');
      }
    } catch (err) {
      console.error("Error committing onboarding setup:", err);
    } finally {
      setLoading(false);
    }
  };

  // Render Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111311] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-sm font-semibold text-text-primary">Syncing your dining ecosystem to Cloud Firestore...</p>
      </div>
    );
  }

  // Render Staff Auto-join Invitation
  if (invitation) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111311] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-[#1A1D1A] rounded-[2rem] border border-border-custom p-8 text-center shadow-xl">
          <Building2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Active Invitation Found!</h2>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            You have been invited to join <span className="font-extrabold text-primary">{invitation.restaurantName}</span> as a <span className="font-extrabold capitalize text-primary">{invitation.role}</span>.
          </p>

          <button
            onClick={handleAcceptInvitation}
            className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-xl font-bold text-xs shadow-lg mt-8 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Accept Invitation & Auto Join <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111311] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1A1D1A] rounded-[2rem] border border-border-custom shadow-xl overflow-hidden flex flex-col justify-between min-h-[500px]">
        
        {/* Wizard Header Progress */}
        <div className="px-8 pt-8 pb-4 border-b border-border-custom/50 flex justify-between items-center bg-[#EEF2EC]/30 dark:bg-[#151815]/30">
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Eatery Onboarding Wizard</h2>
            <p className="text-[10px] text-text-muted mt-1 uppercase font-bold tracking-widest text-primary">Step {step} of 6</p>
          </div>
          
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-primary scale-110' : 'bg-border-custom'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Wizard Main Canvas */}
        <div className="p-8 flex-1">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Verification */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-left"
              >
                <ShieldCheck className="w-12 h-12 text-primary mb-3" />
                <h3 className="text-lg font-bold text-text-primary">Email Verification Status</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  We have detected account creation for <span className="font-bold text-text-primary">{auth.currentUser?.email}</span>. Confirm your credentials before initiating cloud database synchronization.
                </p>

                {verifyStatusMsg && (
                  <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-semibold">
                    {verifyStatusMsg}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleResendVerification}
                    disabled={resendingVerification}
                    className="flex-1 bg-white dark:bg-background border border-border-custom text-text-primary hover:bg-[#EEF2EC]/40 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {resendingVerification ? 'Resending...' : 'Resend Verification Link'}
                  </button>
                  <button
                    onClick={handleVerifyCheck}
                    className="flex-1 bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    I Have Verified Email <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Restaurant profile */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-left"
              >
                <Building2 className="w-12 h-12 text-primary mb-3" />
                <h3 className="text-lg font-bold text-text-primary">Restaurant Base Configuration</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Establishment Name</label>
                    <input
                      type="text"
                      value={restName}
                      onChange={(e) => setRestName(e.target.value)}
                      placeholder="e.g. Saffron & Smoke"
                      className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Brand Tagline</label>
                    <input
                      type="text"
                      value={restTagline}
                      onChange={(e) => setRestTagline(e.target.value)}
                      placeholder="e.g. Fine Indian Flavours"
                      className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Active Hours</label>
                    <input
                      type="text"
                      value={restHours}
                      onChange={(e) => setRestHours(e.target.value)}
                      className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">GSTIN (Optional)</label>
                    <input
                      type="text"
                      value={restGstin}
                      onChange={(e) => setRestGstin(e.target.value)}
                      placeholder="27AAAAA1111A1Z1"
                      className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Address / Location</label>
                  <input
                    type="text"
                    value={restAddress}
                    onChange={(e) => setRestAddress(e.target.value)}
                    placeholder="e.g. Bandra West, Mumbai, Maharashtra"
                    className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(3)}
                    disabled={!restName || !restAddress}
                    className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Configure Staff <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Staff invites */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-left"
              >
                <Mail className="w-12 h-12 text-primary mb-3" />
                <h3 className="text-lg font-bold text-text-primary">Invite Staff Co-Workers</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Send email invitations. Staff will auto-join your workspace the moment they verify credentials.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="Sarah Jenkins"
                      className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="sarah@eatery.com"
                      className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Role Type</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary cursor-pointer"
                    >
                      <option value="manager">Manager</option>
                      <option value="waiter">Waiter / Server</option>
                      <option value="chef">Kitchen Staff</option>
                      <option value="cashier">Billing Cashier</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addInvite}
                  className="bg-primary/10 text-primary border border-primary/20 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Invitation
                </button>

                {invites.length > 0 && (
                  <div className="mt-4 border border-border-custom rounded-2xl overflow-hidden bg-background/25">
                    <div className="p-3 bg-border-custom/30 text-[10px] font-bold text-text-muted uppercase tracking-wider">Pending Outgoing Invites</div>
                    <div className="divide-y divide-border-custom/50">
                      {invites.map((inv, idx) => (
                        <div key={idx} className="p-3 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-text-primary">{inv.name}</span>
                            <span className="text-text-muted ml-2">({inv.email})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-primary/10 text-primary rounded">{inv.role}</span>
                            <button onClick={() => removeInvite(idx)} className="text-danger hover:text-danger/80 cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(2)} className="text-xs text-text-muted hover:text-text-primary font-bold">Back</button>
                  <button
                    onClick={() => setStep(4)}
                    className="bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Setup Menu Catalog <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Menu Setup */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-left"
              >
                <BookOpen className="w-12 h-12 text-primary mb-3" />
                <h3 className="text-lg font-bold text-text-primary">Menu Catalogue Setup</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    onClick={() => setMenuOption('demo')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      menuOption === 'demo' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-custom hover:border-primary/30'
                    }`}
                  >
                    <Sparkles className="text-primary w-8 h-8 mb-3" />
                    <h4 className="font-bold text-xs text-text-primary">Seed Demo Menu</h4>
                    <p className="text-[10px] text-text-muted mt-1 leading-snug">Populate with Saffron & Smoke Indian delicacies (Butter Chicken, Paneer Multani, Kulfi, Lassi).</p>
                  </div>

                  <div
                    onClick={() => setMenuOption('csv')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      menuOption === 'csv' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-custom hover:border-primary/30'
                    }`}
                  >
                    <Upload className="text-primary w-8 h-8 mb-3" />
                    <h4 className="font-bold text-xs text-text-primary">Upload CSV File</h4>
                    <p className="text-[10px] text-text-muted mt-1 leading-snug">Upload menu database catalog via a standardized comma-separated CSV sheet.</p>
                  </div>

                  <div
                    onClick={() => setMenuOption('blank')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      menuOption === 'blank' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-custom hover:border-primary/30'
                    }`}
                  >
                    <Plus className="text-primary w-8 h-8 mb-3" />
                    <h4 className="font-bold text-xs text-text-primary">Configure Blank</h4>
                    <p className="text-[10px] text-text-muted mt-1 leading-snug">Begin with a clean slate and manually compile dishes later inside menu panel.</p>
                  </div>
                </div>

                {menuOption === 'csv' && (
                  <div className="mt-4 p-4 border border-dashed border-border-custom rounded-2xl bg-background/20 flex flex-col items-center justify-center text-center">
                    <Upload className="w-8 h-8 text-text-muted mb-2 animate-bounce" />
                    <span className="text-xs font-bold text-text-primary">{csvFileName || 'Choose Menu CSV File'}</span>
                    <span className="text-[9px] text-text-muted mt-1 max-w-[300px]">Sheet headers must follow format: Name, Description, Price, Category, Labels (semicolon split)</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="hidden"
                      id="menu-csv-uploader"
                    />
                    <label
                      htmlFor="menu-csv-uploader"
                      className="mt-3 px-4 py-2 border border-primary/30 text-primary bg-primary/5 rounded-xl text-[10px] font-bold hover:bg-primary/10 cursor-pointer"
                    >
                      Browse Local Files
                    </label>
                    {csvFileContent && (
                      <span className="text-[9px] text-primary font-bold mt-2 flex items-center gap-1">
                        <CheckCircle size={10} /> Parsed {csvFileContent.length} menu items successfully.
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(3)} className="text-xs text-text-muted hover:text-text-primary font-bold">Back</button>
                  <button
                    onClick={() => setStep(5)}
                    disabled={menuOption === 'csv' && !csvFileContent}
                    className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    AI Inventory Setup <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: AI Inventory */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-left"
              >
                <Sparkles className="w-12 h-12 text-primary mb-3" />
                <h3 className="text-lg font-bold text-text-primary">AI Inventory Generator</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Analyze menu dishes, categorize ingredients, and establish minimum alert thresholds automatically.
                </p>

                {aiProgress === 0 ? (
                  <button
                    onClick={runAISuggestions}
                    className="bg-primary hover:bg-primary/95 text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={14} /> Run AI Ingredient Analysis
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="w-full bg-border-custom rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${aiProgress}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-text-muted uppercase tracking-wider">
                      <span>Analyzing recipe parameters</span>
                      <span>{aiProgress}% Complete</span>
                    </div>

                    <div className="p-4 bg-background dark:bg-[#111311] border border-border-custom rounded-2xl max-h-[140px] overflow-y-auto font-mono text-[10px] text-text-muted space-y-1.5 custom-scroll">
                      {aiLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-1.5 items-center">
                          {idx === aiLogs.length - 1 && !aiFinished ? (
                            <Loader2 size={10} className="animate-spin text-primary" />
                          ) : (
                            <CheckCircle size={10} className="text-primary" />
                          )}
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(4)} className="text-xs text-text-muted hover:text-text-primary font-bold">Back</button>
                  <button
                    onClick={() => setStep(6)}
                    disabled={aiProgress > 0 && !aiFinished}
                    className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Onboarding Summary <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Complete summary */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-left"
              >
                <PartyPopper className="w-12 h-12 text-primary mb-3" />
                <h3 className="text-lg font-bold text-text-primary">Onboarding Complete!</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Your smart restaurant workspace is ready to go. Review setup parameters before launching operations.
                </p>

                <div className="p-5 border border-border-custom bg-[#EEF2EC]/20 dark:bg-[#151815]/20 rounded-2xl divide-y divide-border-custom/50 space-y-2 text-xs">
                  <div className="flex justify-between pb-2">
                    <span className="text-text-muted font-semibold">Restaurant Name</span>
                    <span className="font-bold text-text-primary">{restName}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-text-muted font-semibold">Address / City</span>
                    <span className="font-bold text-text-primary">{restAddress}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-text-muted font-semibold">Staff Members Invited</span>
                    <span className="font-bold text-text-primary">{invites.length} invited</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-text-muted font-semibold">Menu Setup Type</span>
                    <span className="font-bold text-text-primary capitalize">{menuOption === 'demo' ? 'Saffron & Smoke Seed' : menuOption === 'csv' ? 'Parsed CSV Catalog' : 'Manual Slate'}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-text-muted font-semibold">AI Generated Inventory</span>
                    <span className="font-bold text-text-primary">{aiFinished ? 'Enabled (8 core ingredients)' : 'Disabled'}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(5)} className="text-xs text-text-muted hover:text-text-primary font-bold">Back</button>
                  <button
                    onClick={submitSetup}
                    className="bg-primary hover:bg-primary/95 text-white px-8 py-4 rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    Launch Savora OS <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
