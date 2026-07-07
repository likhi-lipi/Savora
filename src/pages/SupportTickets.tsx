import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useSavoraState } from '../context/SavoraContext';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
  status: string;
  createdAt: string;
}

export const SupportTickets: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSavoraState();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const q = query(
          collection(db, 'support_tickets'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedTickets: Ticket[] = [];
        querySnapshot.forEach((doc) => {
          fetchedTickets.push({ id: doc.id, ...doc.data() } as Ticket);
        });
        
        // Sort manually by date desc (since firestore requires index for orderBy with where, unless we just sort client side for now)
        fetchedTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setTickets(fetchedTickets);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'pending':
        return <Clock size={16} className="text-warning" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle size={16} className="text-success" />;
      default:
        return <AlertTriangle size={16} className="text-text-muted" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-danger/10 text-danger border-danger/20';
      default: return 'bg-border-custom/50 text-text-muted border-border-custom';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left entrance-anim">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/support')}
            className="p-2 hover:bg-background rounded-xl transition-all"
          >
            <ArrowLeft size={20} className="text-text-muted hover:text-text-primary" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
              <FileText size={32} className="text-primary" />
              My Tickets
            </h2>
            <p className="text-text-muted text-sm mt-1">Review the status of your submitted support tickets.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border-custom/50 rounded-2xl p-6 premium-shadow">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-semibold text-text-muted">Loading your tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-text-muted" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">No tickets found</h3>
            <p className="text-text-muted text-sm mt-1 max-w-sm mx-auto">
              You haven't submitted any support tickets yet. If you need help, feel free to create one.
            </p>
            <button
              onClick={() => navigate('/app/support')}
              className="mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-hover transition-all"
            >
              Create Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="border border-border-custom/60 rounded-xl p-5 hover:bg-background/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-base text-text-primary">{ticket.subject}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted line-clamp-2">{ticket.message}</p>
                    
                    <div className="flex items-center gap-4 text-xs font-semibold text-text-muted pt-2">
                      <span>Category: {ticket.category}</span>
                      <span>•</span>
                      <span>Submitted: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg border border-border-custom">
                    {getStatusIcon(ticket.status)}
                    <span className="text-xs font-bold capitalize text-text-primary">{ticket.status}</span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
