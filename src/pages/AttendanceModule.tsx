import React, { useState } from 'react';
import { 
  CheckSquare, Clock, MapPin, Search, Filter, Calendar, 
  UserCheck, UserX, AlertCircle, QrCode, Smartphone,
  ChevronDown, Download, CheckCircle2, XCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const DEMO_ATTENDANCE = [
  { id: 'UPP-1042', name: 'Inspector Rajeev Kumar', station: 'Hazratganj', shift: '08:00 - 16:00', checkIn: '07:45 AM', status: 'On Time', location: 'Station HQ', method: 'Biometric' },
  { id: 'UPP-2055', name: 'Sub Inspector Amit Singh', station: 'Hazratganj', shift: '08:00 - 16:00', checkIn: '08:15 AM', status: 'Late', location: 'Sector 4 Beat', method: 'GPS App' },
  { id: 'UPP-3190', name: 'Head Constable Sunil', station: 'Hazratganj', shift: 'Night Patrol', checkIn: '--:--', status: 'Absent', location: 'Unknown', method: '-' },
  { id: 'UPP-4421', name: 'Constable Ramesh', station: 'Hazratganj', shift: '08:00 - 16:00', checkIn: '07:50 AM', status: 'On Time', location: 'Station HQ', method: 'Biometric' },
  { id: 'UPP-4422', name: 'Constable Suresh', station: 'Hazratganj', shift: '08:00 - 16:00', checkIn: '07:55 AM', status: 'On Time', location: 'Station HQ', method: 'Biometric' },
  { id: 'UPP-5102', name: 'Traffic SI Anil Yadav', station: 'Hazratganj', shift: '10:00 - 18:00', checkIn: '09:40 AM', status: 'On Time', location: 'Atal Chowk', method: 'GPS App' },
  { id: 'UPP-6701', name: 'Constable Priya', station: 'Hazratganj', shift: '08:00 - 16:00', checkIn: '--:--', status: 'On Leave', location: '-', method: '-' },
  { id: 'UPP-7023', name: 'Inspector Sanjay', station: 'Hazratganj', shift: '08:00 - 16:00', checkIn: '08:30 AM', status: 'Late', location: 'Station HQ', method: 'Biometric' },
];

const checkinTrendData = [
  { time: '06:00', count: 120 },
  { time: '07:00', count: 450 },
  { time: '08:00', count: 1800 },
  { time: '09:00', count: 2100 },
  { time: '10:00', count: 2450 },
  { time: '11:00', count: 2500 },
];

export const AttendanceModule: React.FC = () => {
  const storedThana = localStorage.getItem('demoThana') || 'Hazratganj';
  const dynamicAttendance = DEMO_ATTENDANCE.map(a => ({...a, station: storedThana}));

  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Today');

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'On Time': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Late': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Absent': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'On Leave': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
         <div>
           <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-2 flex items-center gap-3">
             <CheckSquare className="text-[#FF9933]" size={32} /> Attendance & Check-in
           </h2>
           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
             <p className="text-gray-500 dark:text-white/60 text-sm">Real-time force attendance tracking via Biometric and GPS Check-ins.</p>
             <span className="inline-flex items-center gap-1.5 bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider w-fit">
               <UserCheck size={12} /> Managed by: {userData?.fullName || 'Head Moharrir'}
             </span>
           </div>
         </div>
         
         <div className="flex items-center gap-3">
           <button className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2">
              <Download size={16} /> Export Report
           </button>
           <button className="px-5 py-2.5 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2">
              <QrCode size={16} /> Force Live Check-in
           </button>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#001229]/80 rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full -mr-4 -mt-4"></div>
           <p className="text-gray-500 dark:text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Present (On Time)</p>
           <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2">2,145</h3>
           <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
             <CheckCircle2 size={16} /> 85% of Active Force
           </div>
        </div>
        
        <div className="bg-white dark:bg-[#001229]/80 rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4"></div>
           <p className="text-gray-500 dark:text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Marked Late</p>
           <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2">124</h3>
           <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
             <AlertCircle size={16} /> Needs Review
           </div>
        </div>

        <div className="bg-white dark:bg-[#001229]/80 rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4"></div>
           <p className="text-gray-500 dark:text-white/50 text-xs font-bold uppercase tracking-wider mb-1">On Approved Leave</p>
           <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2">210</h3>
           <div className="flex items-center gap-1 text-blue-500 text-sm font-bold">
             <Calendar size={16} /> Scheduled
           </div>
        </div>

        <div className="bg-white dark:bg-[#001229]/80 rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full -mr-4 -mt-4"></div>
           <p className="text-gray-500 dark:text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Absent (AWOL)</p>
           <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2">12</h3>
           <div className="flex items-center gap-1 text-red-500 text-sm font-bold">
             <XCircle size={16} /> Escalated to SHO
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col">
           <div className="p-5 border-b border-gray-100 dark:border-white/10 flex flex-wrap justify-between items-center gap-4">
             <div className="flex items-center gap-6">
                {['Today', 'Yesterday', 'Weekly'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-1 text-sm font-bold transition-all border-b-2 ${activeTab === tab ? 'border-[#FF9933] text-[#FF9933]' : 'border-transparent text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search officer..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-1.5 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none dark:text-white focus:border-[#FF9933]"
                />
             </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-gray-50/50 dark:bg-black/20 text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 border-b border-gray-100 dark:border-white/10">
                   <th className="p-4 font-bold">Officer Details</th>
                   <th className="p-4 font-bold">Shift & Location</th>
                   <th className="p-4 font-bold">Check-in Time</th>
                   <th className="p-4 font-bold">Method</th>
                   <th className="p-4 font-bold">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                  {dynamicAttendance.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase())).map((officer) => (
                    <tr key={officer.id} className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden shrink-0">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${officer.name}&backgroundColor=FF9933`} alt={officer.name} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#FF9933] transition-colors">{officer.name}</p>
                            <p className="text-xs text-gray-500 dark:text-white/50">{officer.id} • {officer.station}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800 dark:text-white/90">{officer.shift}</p>
                        <p className="text-xs text-gray-500 dark:text-white/50 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {officer.location}</p>
                      </td>
                      <td className="p-4 font-mono text-gray-700 dark:text-white/80">
                        {officer.checkIn}
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-white/60">
                          {officer.method === 'Biometric' ? <UserCheck size={14} className="text-blue-500" /> : officer.method === 'GPS App' ? <Smartphone size={14} className="text-green-500" /> : <UserX size={14} className="text-gray-400" />}
                          {officer.method}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusBadge(officer.status)}`}>
                          {officer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Analytics Side */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
             <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-4 flex items-center gap-2">
               <Clock size={16} className="text-[#FF9933]" /> Morning Check-in Surge
             </h3>
             <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={checkinTrendData}>
                   <defs>
                     <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#FF9933" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#FF9933" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                   <Tooltip contentStyle={{backgroundColor: '#001229', border: 'none', borderRadius: '8px', color: '#fff'}} />
                   <Area type="monotone" dataKey="count" stroke="#FF9933" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
             <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-4">Location Validation Failed</h3>
             <div className="space-y-3">
               {[
                 { n: 'HC Sunil', loc: '2km away from Beat', time: '08:12 AM' },
                 { n: 'Const. Vikram', loc: 'Location Mocking Detected', time: '07:55 AM' }
               ].map((alert, i) => (
                 <div key={i} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-500/5 rounded-xl border border-red-100 dark:border-red-500/10">
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{alert.n}</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{alert.loc}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{alert.time}</p>
                    </div>
                 </div>
               ))}
             </div>
             <button className="w-full mt-4 py-2 text-xs font-bold text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white transition-colors">
               View All Flags
             </button>
          </div>
        </div>
      </div>
      
      <div className="h-8"></div>
    </div>
  );
};
