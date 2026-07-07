import React from 'react';
import { useSavoraState } from '../context/SavoraContext';
import { Save, Store, Receipt } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SettingsFormInputs {
  name: string;
  hours: string;
  tax: number;
  service: number;
  receiptFooter: string;
}

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useSavoraState();

  const { register, handleSubmit } = useForm<SettingsFormInputs>({
    defaultValues: settings
  });

  const handleSaveSettings = (data: SettingsFormInputs) => {
    updateSettings(data);
  };

  return (
    <div className="space-y-6 text-left entrance-anim">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">System Settings</h2>
        <p className="text-text-muted text-sm mt-1">Configure restaurant tax parameters, receipt details, and service hours.</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit(handleSaveSettings)} className="space-y-6">
          
          {/* General Config Card */}
          <div className="bg-surface border border-border-custom/50 rounded-2xl p-6 premium-shadow space-y-4">
            <div className="flex items-center gap-2 border-b border-border-custom/40 pb-3 mb-2">
              <Store size={18} className="text-primary" />
              <h3 className="font-bold text-sm text-text-primary">General Configuration</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  Establishment Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  Active Service Hours
                </label>
                <input
                  type="text"
                  {...register('hours')}
                  className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* Tax and fees Config Card */}
          <div className="bg-surface border border-border-custom/50 rounded-2xl p-6 premium-shadow space-y-4">
            <div className="flex items-center gap-2 border-b border-border-custom/40 pb-3 mb-2">
              <Receipt size={18} className="text-primary" />
              <h3 className="font-bold text-sm text-text-primary">Tax & Service Charges</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  GST Bracket (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('tax', { required: 'Tax percentage is required' })}
                  className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  Service Charge Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('service', { required: 'Service percentage is required' })}
                  className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary font-mono"
                />
              </div>
            </div>
          </div>

          {/* Receipt Customizer Card */}
          <div className="bg-surface border border-border-custom/50 rounded-2xl p-6 premium-shadow space-y-4">
            <div className="flex items-center gap-2 border-b border-border-custom/40 pb-3 mb-2">
              <Receipt size={18} className="text-primary" />
              <h3 className="font-bold text-sm text-text-primary">Print Receipt Footers</h3>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                Footer Greeting Text
              </label>
              <input
                type="text"
                {...register('receiptFooter')}
                className="w-full bg-[#F8F7F4] dark:bg-[#111311] border border-border-custom rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-primary text-text-primary"
              />
              <span className="text-[9px] text-text-muted mt-1.5 block leading-normal">
                This text will display at the bottom of thermal receipts and invoice print checks.
              </span>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/95 text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Save size={14} /> Save System Settings
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
