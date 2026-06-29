import React, { useState } from 'react';
import { 
  Search, Filter, Users, Shield, ShieldAlert, CheckCircle, 
  MapPin, Clock, Briefcase, Phone, Mail, ChevronRight, X,
  Plus, UploadCloud, Download, FileSpreadsheet, Cpu, Check
} from 'lucide-react';

const MOCK_OFFICERS = [
  { id: 'UP-9021', name: 'Rajesh Kumar', rank: 'Inspector (SHO)', station: 'Hazratganj', status: 'On Duty', duty: 'Hazratganj Protest (Law & Order)', phone: '+91 9876543210' },
  { id: 'UP-7732', name: 'Anil Singh', rank: 'Sub Inspector', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543211' },
  { id: 'UP-5521', name: 'Vikram Yadav', rank: 'Head Constable', station: 'Hazratganj', status: 'On Leave', duty: null, phone: '+91 9876543212' },
  { id: 'UP-8812', name: 'Suresh Tiwari', rank: 'Constable', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543213' },
  { id: 'UP-3341', name: 'Ramesh Patel', rank: 'Constable', station: 'Hazratganj', status: 'In Training', duty: null, phone: '+91 9876543214' },
  { id: 'UP-9922', name: 'Anita Sharma', rank: 'Sub Inspector', station: 'Hazratganj', status: 'On Duty', duty: 'VIP Route Bandobast (GPO)', phone: '+91 9876543215' },
  { id: 'UP-1102', name: 'Manoj Bajpai', rank: 'Inspector', station: 'Hazratganj', status: 'On Duty', duty: 'Janpath Market Security', phone: '+91 9876543216' },
  { id: 'UP-2204', name: 'Deepika Singh', rank: 'Constable', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543217' },
  { id: 'UP-4455', name: 'Rahul Verma', rank: 'Head Constable', station: 'Hazratganj', status: 'On Duty', duty: 'Night Patrol Route A (Park Road)', phone: '+91 9876543218' },
  { id: 'UP-5566', name: 'Amitabh Bachchan', rank: 'Sub Inspector', station: 'Hazratganj', status: 'On Leave', duty: null, phone: '+91 9876543219' },
  { id: 'UP-7788', name: 'Priya Mishra', rank: 'Constable', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543220' },
  { id: 'UP-9900', name: 'Sunil Shetty', rank: 'Constable', station: 'Hazratganj', status: 'On Duty', duty: 'Traffic Management (Atal Chowk)', phone: '+91 9876543221' },
  { id: 'UP-1234', name: 'Ajay Devgn', rank: 'Sub Inspector', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543222' },
  { id: 'UP-5678', name: 'Kareena Kapoor', rank: 'Head Constable', station: 'Hazratganj', status: 'In Training', duty: null, phone: '+91 9876543223' },
];

export const OfficerAvailability: React.FC = () => {
  const storedThana = localStorage.getItem('demoThana') || 'Hazratganj';
  const dynamicOfficers = MOCK_OFFICERS.map(o => ({...o, station: storedThana}));

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<'initial' | 'uploading' | 'ready' | 'processing' | 'success'>('initial');

  const handleUploadSimulate = () => {
    setUploadStep('uploading');
    setTimeout(() => setUploadStep('ready'), 2000);
  };

  const handleAIRunSimulate = () => {
    setUploadStep('processing');
    setTimeout(() => setUploadStep('success'), 3000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'On Duty': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'On Leave': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'In Training': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const filteredOfficers = dynamicOfficers.filter(officer => {
    const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          officer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || officer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: MOCK_OFFICERS.length,
    available: MOCK_OFFICERS.filter(o => o.status === 'Available').length,
    onDuty: MOCK_OFFICERS.filter(o => o.status === 'On Duty').length,
    onLeave: MOCK_OFFICERS.filter(o => o.status === 'On Leave').length,
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
         <div>
           <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-1 flex items-center gap-3">
             <Users className="text-[#FF9933]" size={32} />
             Officer Availability & Force Tracking
           </h2>
           <p className="text-gray-500 dark:text-white/60 text-sm mt-2">
             Real-time manpower status, deployment history, and resource allocation.
           </p>
         </div>
         <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsManualEntryOpen(true)}
             className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
           >
              <Plus size={16} /> New Entry
           </button>
           <button 
             onClick={() => { setUploadStep('initial'); setIsUploadModalOpen(true); }}
             className="px-5 py-2.5 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2"
           >
              <UploadCloud size={16} /> Excel Bulk Upload & AI
           </button>
         </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
        <div className="bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
           <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Force</p>
           <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</h3>
        </div>
        <div className="bg-white dark:bg-green-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-500/20 shadow-sm">
           <p className="text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">Available to Deploy</p>
           <h3 className="text-2xl font-bold text-green-700 dark:text-green-500">{stats.available}</h3>
        </div>
        <div className="bg-white dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-500/20 shadow-sm">
           <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">Currently On Duty</p>
           <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-500">{stats.onDuty}</h3>
        </div>
        <div className="bg-white dark:bg-amber-900/20 p-5 rounded-2xl border border-amber-100 dark:border-amber-500/20 shadow-sm">
           <p className="text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">On Leave / Rest</p>
           <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-500">{stats.onLeave}</h3>
        </div>
      </div>

      <div className="flex gap-6 animate-fade-in" style={{animationDelay: '100ms'}}>
        
        {/* Main List Area */}
        <div className={`flex-1 bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-all ${selectedOfficer ? 'hidden lg:block lg:w-2/3' : 'w-full'}`}>
           
           {/* Toolbar */}
           <div className="p-4 border-b border-gray-100 dark:border-white/10 flex flex-wrap gap-4 bg-gray-50/50 dark:bg-black/20 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                 <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search by Name or PNO Number (e.g. UP-9021)" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-[#FF9933] outline-none dark:text-white transition-colors" 
                    />
                 </div>
                 <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm dark:text-white outline-none"
                 >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="On Duty">On Duty</option>
                    <option value="On Leave">On Leave</option>
                    <option value="In Training">In Training</option>
                 </select>
              </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="text-xs uppercase text-gray-500 dark:text-white/40 bg-gray-50 dark:bg-transparent border-b border-gray-100 dark:border-white/5">
                   <th className="p-4 font-semibold">Officer Profile</th>
                   <th className="p-4 font-semibold">PNO Number</th>
                   <th className="p-4 font-semibold">Station / Unit</th>
                   <th className="p-4 font-semibold">Current Status</th>
                   <th className="p-4 font-semibold text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="text-sm divide-y divide-gray-100 dark:divide-white/5">
                 {filteredOfficers.map((officer) => (
                   <tr 
                     key={officer.id} 
                     onClick={() => setSelectedOfficer(officer)}
                     className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedOfficer?.id === officer.id ? 'bg-[#FF9933]/5 dark:bg-[#FF9933]/10' : ''}`}
                   >
                     <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden shrink-0">
                             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${officer.name}&backgroundColor=002147`} alt="Profile" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 dark:text-white">{officer.name}</div>
                            <div className="text-xs text-gray-500 dark:text-white/50">{officer.rank}</div>
                          </div>
                        </div>
                     </td>
                     <td className="p-4 font-mono font-medium text-gray-800 dark:text-white/90">
                        {officer.id}
                     </td>
                     <td className="p-4 text-gray-600 dark:text-white/70">
                        {officer.station}
                     </td>
                     <td className="p-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(officer.status)}`}>
                         {officer.status}
                       </span>
                     </td>
                     <td className="p-4 text-right">
                       <ChevronRight size={18} className="inline-block text-gray-400" />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             {filteredOfficers.length === 0 && (
               <div className="p-8 text-center text-gray-500 dark:text-white/50">
                 No officers found matching your search.
               </div>
             )}
           </div>
        </div>

        {/* Side Panel (Officer Details) */}
        {selectedOfficer && (
          <div className="w-full lg:w-1/3 bg-white dark:bg-[#001229]/90 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden flex flex-col animate-slide-in-right">
             <div className="p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <h3 className="font-heading font-bold text-gray-800 dark:text-white">Officer Dossier</h3>
                <button onClick={() => setSelectedOfficer(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 transition-colors">
                  <X size={18} />
                </button>
             </div>
             
             <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden mb-4 border-4 border-white dark:border-[#001229] shadow-lg relative">
                     <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedOfficer.name}&backgroundColor=002147`} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedOfficer.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-white/60 mb-2">{selectedOfficer.rank} • {selectedOfficer.id}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOfficer.status)}`}>
                    {selectedOfficer.status}
                  </span>
                </div>

                <div className="space-y-4">
                   <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Info</h4>
                      <div className="flex items-center gap-3 mb-2 text-sm text-gray-700 dark:text-white/80">
                        <Phone size={16} className="text-[#FF9933]" /> {selectedOfficer.phone}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-white/80">
                        <MapPin size={16} className="text-[#FF9933]" /> {selectedOfficer.station} Police Station
                      </div>
                   </div>

                   <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Current Assignment</h4>
                      {selectedOfficer.duty ? (
                        <div>
                          <p className="font-bold text-sm text-gray-800 dark:text-white mb-1 flex items-center gap-2">
                             <Briefcase size={16} className="text-blue-500" /> {selectedOfficer.duty}
                          </p>
                          <p className="text-xs text-gray-500">Active since 08:00 AM today.</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-white/50 italic">No active assignment. Officer is available for deployment.</p>
                      )}
                   </div>
                </div>
             </div>

             <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                {selectedOfficer.status === 'Available' ? (
                  <button className="w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#ffaa55] hover:scale-[1.02] text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex justify-center items-center gap-2">
                    <Shield size={16} /> Deploy Immediately
                  </button>
                ) : (
                  <button className="w-full py-3 bg-white dark:bg-[#000a17] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2">
                    <Clock size={16} /> View Schedule
                  </button>
                )}
             </div>
          </div>
        )}

      </div>

      {/* Excel Upload & AI Assignment Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#001229] w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="text-[#FF9933]" size={20} /> Excel Roster Upload & AI Assignment
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              {uploadStep === 'initial' && (
                <div className="text-center animate-fade-in">
                  <div className="mb-8">
                    <button className="px-6 py-3 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl text-gray-600 dark:text-white/70 hover:border-[#FF9933] hover:text-[#FF9933] transition-all flex items-center justify-center gap-2 mx-auto mb-4 w-full max-w-md">
                      <Download size={18} /> Download Demo Excel Template
                    </button>
                    <p className="text-xs text-gray-500 dark:text-white/50">Fill the template with correct officer details (Name, PNO No, Preferences, Rank).</p>
                  </div>
                  
                  <div 
                    onClick={handleUploadSimulate}
                    className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-10 bg-gray-50 dark:bg-black/20 hover:border-[#FF9933] hover:bg-[#FF9933]/5 cursor-pointer transition-all flex flex-col items-center justify-center"
                  >
                    <UploadCloud size={48} className="text-gray-400 dark:text-white/30 mb-4" />
                    <p className="font-bold text-gray-700 dark:text-white/80 mb-1">Click to Upload Roster Data (Excel/CSV)</p>
                    <p className="text-xs text-gray-500">Supports .xlsx, .xls, .csv</p>
                  </div>
                </div>
              )}

              {uploadStep === 'uploading' && (
                <div className="text-center py-12 animate-fade-in flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-gray-200 dark:border-white/10 border-t-[#FF9933] rounded-full animate-spin mb-6"></div>
                  <h3 className="font-bold text-lg dark:text-white mb-2">Parsing Excel Data...</h3>
                  <p className="text-gray-500 dark:text-white/50 text-sm">Validating rows and extracting officer records.</p>
                </div>
              )}

              {uploadStep === 'ready' && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileSpreadsheet size={40} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">Excel Data Extracted!</h3>
                  <p className="text-gray-500 dark:text-white/60 mb-8">145 New Officer records found. 12 previous records updated.</p>
                  
                  <div className="p-5 bg-[#FF9933]/10 border border-[#FF9933]/30 rounded-xl mb-8 flex items-start gap-4 text-left">
                    <Cpu className="text-[#FF9933] shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-[#FF9933] mb-1">AI Duty Allocation Engine Ready</h4>
                      <p className="text-sm text-[#FF9933]/80">Run the AI module to automatically assign available officers to pending duties based on their rank, previous patrol history, and proximity.</p>
                    </div>
                  </div>

                  <button 
                    onClick={handleAIRunSimulate}
                    className="w-full py-4 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl font-black text-lg shadow-xl shadow-[#FF9933]/20 transition-all flex justify-center items-center gap-2 group"
                  >
                    <Cpu size={24} className="group-hover:rotate-12 transition-transform" /> RUN AI ALLOCATION
                  </button>
                </div>
              )}

              {uploadStep === 'processing' && (
                <div className="text-center py-12 animate-fade-in flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center">
                       <Cpu size={40} className="text-blue-500 animate-pulse" />
                    </div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="font-bold text-xl dark:text-white mb-2 text-blue-500">AI Module Processing...</h3>
                  <div className="text-left max-w-sm mx-auto space-y-2 mt-4 text-sm text-gray-600 dark:text-white/60">
                    <p className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Analyzing VIP route requirements...</p>
                    <p className="flex items-center gap-2 animate-pulse text-blue-500"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Matching officer availability & ranks...</p>
                    <p className="flex items-center gap-2 text-gray-400"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div> Optimizing for minimum travel distance...</p>
                  </div>
                </div>
              )}

              {uploadStep === 'success' && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <Check size={40} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">AI Allocation Complete!</h3>
                  <p className="text-gray-500 dark:text-white/60 mb-6">45 duties assigned. 120 officers deployed efficiently.</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                     <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                       <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Efficiency Gain</p>
                       <p className="text-xl font-bold text-green-500 mt-1">+34% Coverage</p>
                     </div>
                     <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                       <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Resource Util.</p>
                       <p className="text-xl font-bold text-blue-500 mt-1">92% Optimal</p>
                     </div>
                  </div>

                  <button 
                    onClick={() => setIsUploadModalOpen(false)}
                    className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold transition-all"
                  >
                    View Updated Roster
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {isManualEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#001229] w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="text-[#FF9933]" size={20} /> Register New Officer
              </h3>
              <button onClick={() => setIsManualEntryOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Officer Name</label>
                   <input type="text" placeholder="e.g. Rahul Singh" className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] dark:text-white" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">PNO Number</label>
                   <input type="text" placeholder="e.g. UP-1029" className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] dark:text-white" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rank</label>
                   <select className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] dark:text-white">
                     <option>Constable</option>
                     <option>Head Constable</option>
                     <option>Sub Inspector</option>
                     <option>Inspector</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Posting Station</label>
                   <select className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] dark:text-white">
                     <option>Hazratganj</option>
                     <option>Gomti Nagar</option>
                     <option>Chowk</option>
                     <option>Alambagh</option>
                     <option>Indira Nagar</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Number</label>
                 <input type="tel" placeholder="+91 9999999999" className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] dark:text-white" />
               </div>

               <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
                 <button onClick={() => setIsManualEntryOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm">Cancel</button>
                 <button onClick={() => setIsManualEntryOpen(false)} className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#ffaa55] text-[#001229] rounded-xl font-bold shadow-lg transition-all text-sm">Save Officer Profile</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
