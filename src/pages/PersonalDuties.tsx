import React from 'react';
import { Briefcase, Calendar, CheckCircle, ShieldAlert, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const PersonalDuties: React.FC = () => {
  const { userData } = useAuth();
  const userName = userData?.fullName || 'Constable Ramesh';

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-gray-50 dark:bg-[#000a17]">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-heading text-[#001229] dark:text-white">
          My Profile & Duties
        </h2>
        <p className="text-gray-500 dark:text-white/60 text-sm mt-1">
          Welcome back, {userName}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-50 dark:bg-[#FF9933]/10 rounded-full"></div>
          <div className="flex justify-between items-start mb-2 relative">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Upcoming Duty</p>
            <div className="w-10 h-10 rounded-xl bg-[#FF9933] text-white flex items-center justify-center shadow-lg shadow-[#FF9933]/30">
              <Briefcase size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#001229] dark:text-white relative">Night Patrol</h3>
          <p className="text-xs text-gray-500 mt-4 relative">Today, 22:00 - 06:00</p>
        </div>

        <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full"></div>
          <div className="flex justify-between items-start mb-2 relative">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leave Balance</p>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Calendar size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#001229] dark:text-white relative">12 Days</h3>
          <p className="text-xs text-gray-500 mt-4 relative">Casual & Earned Leave</p>
        </div>

        <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full"></div>
          <div className="flex justify-between items-start mb-2 relative">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warnings/Alerts</p>
            <div className="w-10 h-10 rounded-xl bg-[#34d399] text-white flex items-center justify-center shadow-lg shadow-[#34d399]/30">
              <CheckCircle size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#001229] dark:text-white relative">0</h3>
          <p className="text-xs text-gray-500 mt-4 relative">Clean Record</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden pb-4">
        <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-bold text-[#001229] dark:text-white">My Duty Schedule</h3>
          <button className="px-5 py-2.5 bg-[#001229] dark:bg-white text-white dark:text-[#001229] rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Calendar size={16} /> Request Leave
          </button>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] uppercase text-gray-500 dark:text-white/40 border-b border-gray-100 dark:border-white/5">
                <th className="p-4 pl-6 font-bold tracking-wider">Date</th>
                <th className="p-4 font-bold tracking-wider">Duty Name</th>
                <th className="p-4 font-bold tracking-wider">Location</th>
                <th className="p-4 font-bold tracking-wider">Timing</th>
                <th className="p-4 font-bold tracking-wider">Status</th>
                <th className="p-4 pr-6 font-bold tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              
              <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 pl-6 text-gray-600 dark:text-white/70">Today</td>
                <td className="p-4 font-bold text-[#001229] dark:text-white">Sector 4 Night Patrol</td>
                <td className="p-4 text-gray-600 dark:text-white/70">Gomti Nagar</td>
                <td className="p-4 text-gray-600 dark:text-white/70">22:00 - 06:00</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded text-[11px] font-bold">
                    Upcoming
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button className="px-4 py-2 bg-[#FF9933] text-[#001229] hover:bg-[#ffaa55] rounded text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm">
                    <ShieldAlert size={14} /> Report & Check-in
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 pl-6 text-gray-600 dark:text-white/70">Tomorrow</td>
                <td className="p-4 font-bold text-[#001229] dark:text-white">VIP Escort Reserve</td>
                <td className="p-4 text-gray-600 dark:text-white/70">Police Line</td>
                <td className="p-4 text-gray-600 dark:text-white/70">08:00 - 16:00</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 rounded text-[11px] font-bold">
                    Assigned
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20 rounded text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-gray-200 dark:border-white/10">
                    <Check size={14} /> Acknowledge
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
