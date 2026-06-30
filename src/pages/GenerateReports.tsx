import React, { useState } from 'react';
import { 
  FileText, Download, Filter, Search, Calendar, 
  MapPin, Users, Shield, FileBarChart, Clock, 
  CheckCircle, AlertTriangle, Printer, ChevronDown,
  FileSpreadsheet
} from 'lucide-react';

// Mock Data for Recent Reports
const RECENT_REPORTS = [
  { id: 'REP-2023-0891', type: 'Daily Duty Deployment', date: '2023-10-25 08:30 AM', generatedBy: 'Insp. Rajesh Kumar', status: 'Completed', format: 'PDF' },
  { id: 'REP-2023-0890', type: 'Crime & Incident Log', date: '2023-10-24 11:45 PM', generatedBy: 'SI Vikram Singh', status: 'Completed', format: 'Excel' },
  { id: 'REP-2023-0889', type: 'Law & Order Summary', date: '2023-10-24 06:15 PM', generatedBy: 'DSP Amit Sharma', status: 'Completed', format: 'PDF' },
  { id: 'REP-2023-0888', type: 'Attendance & Leave', date: '2023-10-24 09:00 AM', generatedBy: 'Admin Desk', status: 'Completed', format: 'Excel' },
  { id: 'REP-2023-0887', type: 'Vehicle/Patrolling Log', date: '2023-10-23 10:20 PM', generatedBy: 'Insp. Rajesh Kumar', status: 'Pending', format: 'PDF' },
];

const REPORT_TYPES = [
  { id: 'duty', name: 'Duty Deployment', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'crime', name: 'Crime & Incident Log', icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'attendance', name: 'Attendance & Leave', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'law_order', name: 'Law & Order Summary', icon: FileBarChart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'patrol', name: 'Patrolling Log', icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

export const GenerateReports: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('duty');
  const [dateRange, setDateRange] = useState('today');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Report generated successfully!');
    }, 2000);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#000a17] p-6 lg:p-8 custom-scrollbar">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-[#FF9933]" /> Generate Reports
          </h1>
          <p className="text-gray-500 dark:text-white/60 text-sm mt-1">
            Create, download, and manage official police reports and logs.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-medium">
            <Printer size={16} /> Print Recent
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2 bg-gradient-to-r from-[#FF9933] to-[#ff8c1a] text-[#001229] font-bold rounded-xl shadow-lg shadow-[#FF9933]/20 hover:scale-105 transition-transform flex items-center gap-2 text-sm"
          >
            {isGenerating ? (
              <span className="w-4 h-4 border-2 border-[#001229] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <FileText size={18} />
            )}
            {isGenerating ? 'Generating...' : 'Generate New'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Report Configuration (Takes up 1 column on large screens) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Report Type Selector */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 dark:text-white/90 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter size={16} className="text-[#FF9933]" /> Report Type
            </h2>
            <div className="flex flex-col gap-3">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                    selectedType === type.id 
                      ? 'bg-gray-50 dark:bg-white/10 border-[#FF9933] shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${type.bg}`}>
                    <type.icon size={20} className={type.color} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-sm ${selectedType === type.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-white/70'}`}>
                      {type.name}
                    </p>
                  </div>
                  {selectedType === type.id && (
                    <CheckCircle size={18} className="ml-auto text-[#FF9933]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Configuration */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
             <h2 className="text-sm font-bold text-gray-800 dark:text-white/90 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search size={16} className="text-[#FF9933]" /> Parameters
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-white/50 mb-1.5 block">Time Period</label>
                <div className="relative">
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-[#FF9933] outline-none appearance-none cursor-pointer"
                  >
                    <option value="today" className="text-gray-900 dark:text-white dark:bg-gray-800">Today</option>
                    <option value="yesterday" className="text-gray-900 dark:text-white dark:bg-gray-800">Yesterday</option>
                    <option value="this_week" className="text-gray-900 dark:text-white dark:bg-gray-800">This Week</option>
                    <option value="this_month" className="text-gray-900 dark:text-white dark:bg-gray-800">This Month</option>
                    <option value="custom" className="text-gray-900 dark:text-white dark:bg-gray-800">Custom Range...</option>
                  </select>
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-white/50 mb-1.5 block">Jurisdiction / Thana</label>
                <div className="relative">
                  <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-[#FF9933] outline-none appearance-none cursor-pointer">
                    <option value="all" className="text-gray-900 dark:text-white dark:bg-gray-800">All Stations (District)</option>
                    <option value="hazratganj" className="text-gray-900 dark:text-white dark:bg-gray-800">Hazratganj</option>
                    <option value="gomtinagar" className="text-gray-900 dark:text-white dark:bg-gray-800">Gomti Nagar</option>
                    <option value="indiranagar" className="text-gray-900 dark:text-white dark:bg-gray-800">Indira Nagar</option>
                  </select>
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-white/50 mb-1.5 block">Format</label>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-[#FF9933] rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <FileText size={16} className="text-red-500" />
                    <span className="text-sm font-medium dark:text-white">PDF</span>
                  </button>
                  <button className="flex-1 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:border-[#FF9933] rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <FileSpreadsheet size={16} className="text-green-500" />
                    <span className="text-sm font-medium dark:text-white">Excel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Reports & Preview (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-4 flex gap-4 items-start">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-full shrink-0">
              <AlertTriangle size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300">Important Notice for Official Records</h4>
              <p className="text-xs text-blue-800 dark:text-blue-400/80 mt-1 leading-relaxed">
                All generated reports are logged in the central UP Police Database. Modifying generated documents offline is strictly prohibited. Ensure parameters are correct before generating finalized GD (General Diary) extracts.
              </p>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-[#FF9933]" /> Recently Generated Reports
              </h2>
              <button className="text-sm text-[#FF9933] hover:underline font-medium">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/50 font-medium">
                  <tr>
                    <th className="px-5 py-3">Report ID</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Generated On</th>
                    <th className="px-5 py-3">Generated By</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {RECENT_REPORTS.map((report, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-mono font-medium text-gray-900 dark:text-white">
                        {report.id}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {report.type.includes('Duty') && <Users size={14} className="text-blue-500" />}
                          {report.type.includes('Crime') && <Shield size={14} className="text-red-500" />}
                          {report.type.includes('Law') && <FileBarChart size={14} className="text-purple-500" />}
                          {report.type.includes('Attendance') && <Clock size={14} className="text-orange-500" />}
                          {report.type.includes('Vehicle') && <MapPin size={14} className="text-emerald-500" />}
                          <span className="font-medium text-gray-700 dark:text-white/80">{report.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-white/60 text-xs">
                        {report.date}
                      </td>
                      <td className="px-5 py-4 text-gray-700 dark:text-white/80">
                        {report.generatedBy}
                      </td>
                      <td className="px-5 py-4">
                        {report.status === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                            <CheckCircle size={12} /> {report.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></span> {report.status}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-1.5 text-gray-500 hover:text-[#FF9933] hover:bg-[#FF9933]/10 rounded-lg transition-colors"
                            title={`Download ${report.format}`}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-500 dark:text-white/50">
               <span>Showing 1 to 5 of 24 entries</span>
               <div className="flex gap-1">
                 <button className="px-2.5 py-1 rounded border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5">Prev</button>
                 <button className="px-2.5 py-1 rounded bg-[#FF9933] text-[#001229] font-bold">1</button>
                 <button className="px-2.5 py-1 rounded border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5">2</button>
                 <button className="px-2.5 py-1 rounded border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5">Next</button>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
