import React from 'react';
import { useSavoraState } from '../context/SavoraContext';
import { FileText, Download, Shield, FileSpreadsheet } from 'lucide-react';

const mockReports = [
  { id: 'rep-1', name: 'June Financial Sales Summary', type: 'PDF', date: '2026-06-30', size: '2.4 MB' },
  { id: 'rep-2', name: 'Inventory Depletion & Cost Log', type: 'CSV', date: '2026-07-01', size: '840 KB' },
  { id: 'rep-3', name: 'Staff Shift Hours Audit', type: 'PDF', date: '2026-06-28', size: '1.2 MB' },
  { id: 'rep-4', name: 'Menu Performance Analytics', type: 'PDF', date: '2026-07-04', size: '4.8 MB' }
];

export const Reports: React.FC = () => {
  const { addNotification } = useSavoraState();

  const handleDownload = (name: string) => {
    addNotification('Report Downloaded', `Successfully downloaded report: ${name}`, 'success');
  };

  return (
    <div className="space-y-6 entrance-anim">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">Reports Center</h2>
        <p className="text-text-muted text-sm mt-1">Export restaurant performance data sheets and tax summaries.</p>
      </div>

      {/* Reports Directory table */}
      <div className="bg-surface border border-border-custom/50 rounded-2xl premium-shadow overflow-hidden text-left">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#F8F7F4] dark:bg-[#111311] border-b border-border-custom/50 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-4">Document Title</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Release Date</th>
                <th className="px-6 py-4">File Size</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/35">
              {mockReports.map(rep => (
                <tr key={rep.id} className="hover:bg-background/25 transition-colors">
                  <td className="px-6 py-4 font-bold text-text-primary flex items-center gap-2.5">
                    {rep.type === 'PDF' ? <FileText size={16} className="text-danger" /> : <FileSpreadsheet size={16} className="text-success" />}
                    {rep.name}
                  </td>
                  <td className="px-6 py-4 text-text-muted font-bold">{rep.type}</td>
                  <td className="px-6 py-4 text-text-muted font-mono">{rep.date}</td>
                  <td className="px-6 py-4 text-text-muted font-mono">{rep.size}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDownload(rep.name)}
                      className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase shadow-sm active:scale-95 transition-all flex items-center gap-0.5 inline-flex"
                    >
                      <Download size={10} /> Get File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
