import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Send, FileText, ChevronRight } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useSavoraState } from '../context/SavoraContext';

export const Support: React.FC = () => {
  const { user, settings } = useSavoraState();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    subject: '',
    category: 'General Inquiry',
    priority: 'Medium',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;
    
    setSubmitting(true);
    try {
      const ticketData = {
        ...formData,
        status: 'Open',
        createdAt: new Date().toISOString(),
        userId: auth.currentUser?.uid || 'anonymous',
        userName: user?.name || 'Unknown User',
        restaurantName: settings.name || 'Unknown Restaurant'
      };
      
      await addDoc(collection(db, 'support_tickets'), ticketData);
      navigate('/app/support-success');
    } catch (err) {
      console.error('Error submitting support ticket:', err);
      alert('Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left entrance-anim">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
            <HelpCircle size={32} className="text-primary" />
            Support Center
          </h2>
          <p className="text-text-muted text-sm mt-1">Submit a ticket to get help with your Savora platform.</p>
        </div>
        <button
          onClick={() => navigate('/app/support-tickets')}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-custom hover:border-primary/50 hover:bg-primary/5 text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <FileText size={16} className="text-primary" />
          My Tickets
          <ChevronRight size={14} className="text-text-muted" />
        </button>
      </div>

      <div className="bg-surface border border-border-custom/50 rounded-2xl p-6 md:p-8 premium-shadow">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted ml-1">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              placeholder="Brief description of the issue"
              className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted ml-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing">Billing & Subscription</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Bug Report">Bug Report</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted ml-1">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted ml-1">Description</label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              placeholder="Please provide detailed information about your request..."
              className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md shadow-primary/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <Send size={16} />
              )}
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};
