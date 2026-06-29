import React, { useState } from 'react';
import { 
  Search, Filter, Users, Shield, ShieldAlert, CheckCircle, 
  MapPin, Clock, Briefcase, Phone, Mail, ChevronRight, X
} from 'lucide-react';

const MOCK_OFFICERS = [
  { id: 'UP-9021', name: 'Rajesh Kumar', rank: 'Inspector (SHO)', station: 'Hazratganj', status: 'On Duty', duty: 'Hazratganj Protest (Law & Order)', phone: '+91 9876543210' },
  { id: 'UP-7732', name: 'Anil Singh', rank: 'Sub Inspector', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543211' },
  { id: 'UP-5521', name: 'Vikram Yadav', rank: 'Head Constable', station: 'Hazratganj', status: 'On Leave', duty: null, phone: '+91 9876543212' },
  { id: 'UP-8812', name: 'Suresh Tiwari', rank: 'Constable', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543213' },
  { id: 'UP-3341', name: 'Ramesh Patel', rank: 'Constable', station: 'Gomti Nagar', status: 'In Training', duty: null, phone: '+91 9876543214' },
  { id: 'UP-9922', name: 'Anita Sharma', rank: 'Sub Inspector', station: 'Hazratganj', status: 'On Duty', duty: 'VIP Route Bandobast', phone: '+91 9876543215' },
  { id: 'UP-1102', name: 'Manoj Bajpai', rank: 'Inspector', station: 'Gomti Nagar', status: 'On Duty', duty: 'High Court Security', phone: '+91 9876543216' },
  { id: 'UP-2204', name: 'Deepika Singh', rank: 'Constable', station: 'Indira Nagar', status: 'Available', duty: null, phone: '+91 9876543217' },
  { id: 'UP-4455', name: 'Rahul Verma', rank: 'Head Constable', station: 'Hazratganj', status: 'On Duty', duty: 'Night Patrol Route A', phone: '+91 9876543218' },
  { id: 'UP-5566', name: 'Amitabh Bachchan', rank: 'Sub Inspector', station: 'Aminabad', status: 'On Leave', duty: null, phone: '+91 9876543219' },
  { id: 'UP-7788', name: 'Priya Mishra', rank: 'Constable', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543220' },
  { id: 'UP-9900', name: 'Sunil Shetty', rank: 'Constable', station: 'Chowk', status: 'On Duty', duty: 'Traffic Management', phone: '+91 9876543221' },
  { id: 'UP-1234', name: 'Ajay Devgn', rank: 'Inspector (SHO)', station: 'Indira Nagar', status: 'Available', duty: null, phone: '+91 9876543222' },
  { id: 'UP-5678', name: 'Kareena Kapoor', rank: 'Sub Inspector', station: 'Gomti Nagar', status: 'In Training', duty: null, phone: '+91 9876543223' },
];

export const OfficerAvailability: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'On Duty': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'On Leave': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'In Training': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const filteredOfficers = MOCK_OFFICERS.filter(off => {
    const matchesSearch = off.name.toLowerCase().includes(searchTerm.toLowerCase()) || off.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || off.status === statusFilter;
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
                      placeholder="Search by Name or Belt Number (e.g. UP-9021)" 
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
                   <th className="p-4 font-semibold">Belt Number</th>
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
    </div>
  );
};
