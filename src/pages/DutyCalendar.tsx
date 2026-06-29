import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Clock, MapPin, Shield, ShieldAlert, Car, Users, Filter, Plus
} from 'lucide-react';

// Demo Data for the Calendar
const DEMO_EVENTS = [
  { id: 1, date: 2, title: 'VIP Route Bandobast', type: 'vip', location: 'Airport Road', time: '08:00 AM - 04:00 PM', officers: 45 },
  { id: 2, date: 5, title: 'CM Visit Security', type: 'vip', location: 'Hazratganj', time: '09:00 AM - 06:00 PM', officers: 120 },
  { id: 3, date: 5, title: 'Night Patrol', type: 'patrol', location: 'Sector 4', time: '10:00 PM - 06:00 AM', officers: 8 },
  { id: 4, date: 12, title: 'High Court Duty', type: 'court', location: 'High Court', time: '10:00 AM - 05:00 PM', officers: 15 },
  { id: 5, date: 15, title: 'Traffic Diversion', type: 'traffic', location: 'Gomti Nagar', time: '07:00 AM - 11:00 AM', officers: 12 },
  { id: 6, date: 18, title: 'Festival Deployment', type: 'festival', location: 'Aminabad', time: '04:00 PM - 11:00 PM', officers: 80 },
  { id: 7, date: 22, title: 'Riot Mock Drill', type: 'training', location: 'Police Line', time: '08:00 AM - 12:00 PM', officers: 200 },
  { id: 8, date: 28, title: 'Election Booth Security', type: 'election', location: 'Indira Nagar', time: '06:00 AM - 08:00 PM', officers: 35 },
];

export const DutyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026 for demo
  const [selectedDay, setSelectedDay] = useState<number | null>(5);
  const [filter, setFilter] = useState('all');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const getEventsForDay = (day: number) => {
    // Only show events if it's the current demo month (June 2026)
    if (currentDate.getMonth() !== 5 || currentDate.getFullYear() !== 2026) return [];
    return DEMO_EVENTS.filter(e => e.date === day && (filter === 'all' || e.type === filter));
  };

  const getEventStyle = (type: string) => {
    switch(type) {
      case 'vip': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'patrol': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      case 'traffic': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30';
      case 'festival': return 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400 border-pink-200 dark:border-pink-500/30';
      case 'court': return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
      case 'training': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
      case 'election': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
    }
  };

  const renderCalendarDays = () => {
    let days = [];
    // Empty slots before 1st day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] border border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-black/10"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isSelected = selectedDay === day;
      const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div 
          key={day} 
          onClick={() => setSelectedDay(day)}
          className={`min-h-[120px] border border-gray-100 dark:border-white/5 p-2 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 flex flex-col gap-1
            ${isSelected ? 'ring-2 ring-[#FF9933] ring-inset bg-[#FF9933]/5 dark:bg-[#FF9933]/10' : 'bg-white dark:bg-[#001229]/60'}
          `}
        >
           <div className="flex justify-between items-start mb-1">
              <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
                ${isToday ? 'bg-blue-500 text-white' : isSelected ? 'bg-[#FF9933] text-[#001229]' : 'text-gray-700 dark:text-white'}
              `}>
                {day}
              </span>
              {dayEvents.length > 0 && (
                <span className="text-[10px] font-bold text-gray-400 dark:text-white/40">{dayEvents.length} Events</span>
              )}
           </div>

           <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
              {dayEvents.slice(0, 3).map((ev, idx) => (
                <div key={idx} className={`text-[10px] font-bold px-2 py-1 rounded truncate border ${getEventStyle(ev.type)}`}>
                  {ev.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-[10px] text-gray-500 dark:text-white/50 text-center font-bold">
                  +{dayEvents.length - 3} more
                </div>
              )}
           </div>
        </div>
      );
    }
    return days;
  };

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-[#000a17]">
      
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 lg:p-8 pb-4 shrink-0">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-1 flex items-center gap-3">
                  <CalendarIcon className="text-[#FF9933]" size={32} />
                  Master Duty Calendar
                </h2>
                <p className="text-gray-500 dark:text-white/60 text-sm mt-2">
                  Plan, schedule, and monitor upcoming massive deployments and daily duties.
                </p>
              </div>
              <div className="flex items-center gap-3">
                 <button className="px-4 py-2 bg-white dark:bg-[#001229] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-white flex items-center gap-2 hover:border-[#FF9933] transition-colors">
                   <Filter size={16} /> Filters
                 </button>
                 <button className="px-4 py-2 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                   <Plus size={16} /> Schedule Duty
                 </button>
              </div>
           </div>

           {/* Calendar Controls */}
           <div className="flex items-center justify-between bg-white dark:bg-[#001229]/80 p-4 rounded-t-2xl border border-gray-200 dark:border-white/10 border-b-0 shadow-sm animate-fade-in">
              <div className="flex items-center gap-4">
                 <h3 className="text-2xl font-bold font-heading dark:text-white w-48">
                   {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                 </h3>
                 <div className="flex items-center gap-1 bg-gray-100 dark:bg-black/20 rounded-lg p-1 border border-gray-200 dark:border-white/5">
                    <button onClick={prevMonth} className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors dark:text-white"><ChevronLeft size={20}/></button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-bold hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors dark:text-white">Today</button>
                    <button onClick={nextMonth} className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors dark:text-white"><ChevronRight size={20}/></button>
                 </div>
              </div>
              
              <div className="hidden md:flex gap-2">
                 <select 
                   value={filter} 
                   onChange={(e) => setFilter(e.target.value)}
                   className="px-4 py-2 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm dark:text-white outline-none font-medium"
                 >
                    <option value="all">All Duty Types</option>
                    <option value="vip">VIP Security</option>
                    <option value="patrol">Patrol</option>
                    <option value="traffic">Traffic</option>
                    <option value="festival">Festivals</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8 custom-scrollbar">
           <div className="bg-white dark:bg-[#001229]/80 rounded-b-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden animate-fade-in">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grid Cells */}
              <div className="grid grid-cols-7">
                {renderCalendarDays()}
              </div>
           </div>
        </div>
      </div>

      {/* Right Side Panel for Selected Day */}
      <div className={`w-80 bg-white dark:bg-[#001229] border-l border-gray-200 dark:border-white/10 shadow-xl flex flex-col transition-all duration-300 ${selectedDay ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
         {selectedDay && (
           <>
             <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 shrink-0">
               <h3 className="text-xl font-bold font-heading dark:text-white flex items-center gap-2">
                 <CalendarIcon size={20} className="text-[#FF9933]" />
                 {monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
               </h3>
               <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
                 {selectedDayEvents.length} deployments scheduled
               </p>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {selectedDayEvents.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-white/30 p-6 text-center">
                    <CalendarIcon size={48} className="mb-4 opacity-50" />
                    <p>No deployments scheduled for this day.</p>
                  </div>
                ) : (
                  selectedDayEvents.map(ev => (
                    <div key={ev.id} className="bg-white dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                       <div className={`absolute top-0 left-0 w-1 h-full ${getEventStyle(ev.type).split(' ')[0]}`}></div>
                       
                       <div className="mb-3">
                         <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 border ${getEventStyle(ev.type)}`}>
                           {ev.type} Duty
                         </span>
                         <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{ev.title}</h4>
                       </div>
                       
                       <div className="space-y-2 text-sm">
                         <div className="flex items-start gap-2 text-gray-600 dark:text-white/70">
                           <Clock size={16} className="text-gray-400 shrink-0 mt-0.5" />
                           <span>{ev.time}</span>
                         </div>
                         <div className="flex items-start gap-2 text-gray-600 dark:text-white/70">
                           <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                           <span>{ev.location}</span>
                         </div>
                         <div className="flex items-start gap-2 text-gray-600 dark:text-white/70">
                           <Users size={16} className="text-gray-400 shrink-0 mt-0.5" />
                           <span>{ev.officers} Officers Deployed</span>
                         </div>
                       </div>
                       
                       <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
                         <button className="text-xs font-bold text-blue-600 dark:text-[#FF9933] hover:underline">View Deployment Details &rarr;</button>
                       </div>
                    </div>
                  ))
                )}
             </div>
           </>
         )}
      </div>

    </div>
  );
};
