import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, FileText } from 'lucide-react';

export const SupportSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 mt-10 entrance-anim">
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center border-4 border-success/20">
          <CheckCircle size={48} className="text-success" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Ticket Submitted!</h2>
        <p className="text-text-muted text-base max-w-md mx-auto">
          Thank you for reaching out. Your support ticket has been received by our team. We'll get back to you shortly.
        </p>
      </div>

      <div className="pt-8 border-t border-border-custom/50 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => navigate('/app/support-tickets')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-hover transition-all"
        >
          <FileText size={18} />
          View My Tickets
        </button>
        <button
          onClick={() => navigate('/app/dashboard')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border-custom text-text-primary font-bold rounded-xl shadow-sm hover:bg-background transition-all"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
