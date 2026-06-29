import React from 'react';
import { 
  Shield, Target, ShieldAlert, Users, Car, Clock, FileText, Sword, Radio, Map, BarChart2, Briefcase, Calendar, MoreVertical 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';

const attendanceData = [
  { time: '06:00', present: 850 },
  { time: '10:00', present: 1200 },
  { time: '14:00', present: 1150 },
  { time: '18:00', present: 1300 },
  { time: '22:00', present: 900 },
  { time: '02:00', present: 600 },
];

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();

  const WidgetCard = ({ title, value, subtext, icon: Icon, colorClass, trend }: any) => (
    <div className="bg-white dark:bg-[#001229]/80 rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-sm`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-center text-xs font-medium relative z-10">
        {trend && (
           <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
             {trend.value} 
           </span>
        )}
        <span className="text-gray-400 dark:text-gray-500 ml-2">{subtext}</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
         <div>
           <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-1">
             Live Control Room
           </h2>
           <p className="text-gray-500 dark:text-white/60 text-sm">
             Lucknow Central District • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </p>
         </div>
         <div className="flex items-center gap-3">
           <button className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
             <Calendar size={16} /> Date Filter
           </button>
           <button onClick={() => navigate('/dashboard/duties')} className="px-5 py-2.5 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2">
             <Briefcase size={16} /> Assign New Duty
           </button>
         </div>
      </div>

      {/* Core Duty Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <WidgetCard title="Total Assigned Today" value="2,450" subtext="Officers on active duty" icon={Shield} colorClass="from-blue-500 to-blue-700" trend={{value: '+12%', isPositive: true}} />
        <WidgetCard title="VIP Deployments" value="8" subtext="Active VIP routes" icon={Target} colorClass="from-amber-500 to-amber-700" />
        <WidgetCard title="Emergency Alert" value="2" subtext="Requires immediate attention" icon={ShieldAlert} colorClass="from-red-500 to-red-700" />
        <WidgetCard title="Reserve Force Available" value="184" subtext="Officers on standby" icon={Users} colorClass="from-green-500 to-green-700" />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white dark:bg-[#001229]/50 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:bg-gray-50 transition-colors cursor-pointer">
           <div className="text-gray-500 dark:text-white/50 text-xs font-semibold mb-1 flex items-center gap-1.5"><Car size={14}/> Traffic Duty</div>
           <div className="text-xl font-bold dark:text-white">342</div>
        </div>
        <div className="bg-white dark:bg-[#001229]/50 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:bg-gray-50 transition-colors cursor-pointer">
           <div className="text-gray-500 dark:text-white/50 text-xs font-semibold mb-1 flex items-center gap-1.5"><Clock size={14}/> Night Patrol</div>
           <div className="text-xl font-bold dark:text-white">156</div>
        </div>
        <div className="bg-white dark:bg-[#001229]/50 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:bg-gray-50 transition-colors cursor-pointer">
           <div className="text-gray-500 dark:text-white/50 text-xs font-semibold mb-1 flex items-center gap-1.5"><FileText size={14}/> Court Duty</div>
           <div className="text-xl font-bold dark:text-white">89</div>
        </div>
        <div className="bg-white dark:bg-[#001229]/50 p-4 rounded-xl border border-gray-100 dark:border-white/5">
           <div className="text-gray-500 dark:text-white/50 text-xs font-semibold mb-1 flex items-center gap-1.5"><Car size={14}/> Vehicles Active</div>
           <div className="text-xl font-bold dark:text-white">410</div>
        </div>
        <div className="bg-white dark:bg-[#001229]/50 p-4 rounded-xl border border-gray-100 dark:border-white/5">
           <div className="text-gray-500 dark:text-white/50 text-xs font-semibold mb-1 flex items-center gap-1.5"><Sword size={14}/> Weapons Issued</div>
           <div className="text-xl font-bold dark:text-white">1,820</div>
        </div>
        <div className="bg-white dark:bg-[#001229]/50 p-4 rounded-xl border border-gray-100 dark:border-white/5">
           <div className="text-gray-500 dark:text-white/50 text-xs font-semibold mb-1 flex items-center gap-1.5"><Radio size={14}/> Comm Sets</div>
           <div className="text-xl font-bold dark:text-white">2,105</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Live Duty Map Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col overflow-hidden">
           <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
             <h3 className="font-heading font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Map size={18} className="text-[#FF9933]" /> Live Deployment Map
             </h3>
             <div className="flex gap-2">
               <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-white/50"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Daily</span>
               <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-white/50"><span className="w-2 h-2 rounded-full bg-amber-500"></span> VIP</span>
               <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-white/50"><span className="w-2 h-2 rounded-full bg-red-500"></span> Emergency</span>
             </div>
           </div>
           <div className="flex-1 bg-gray-100 dark:bg-black/50 relative min-h-[350px]">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Lucknow,UP&zoom=12&size=800x400&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x333333&style=feature:water|element:geometry|color:0x1b2c45&style=feature:landscape|element:geometry|color:0x000a17&sensor=false')] bg-cover bg-center opacity-40 dark:opacity-60 mix-blend-luminosity"></div>
              
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute top-1/3 left-2/3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-medium border border-white/10">
                    Map Integration Pending (OpenStreetMap/Google Maps)
                 </div>
              </div>
           </div>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col p-5">
           <h3 className="font-heading font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
             <BarChart2 size={18} className="text-blue-500" /> Active Personnel Trend
           </h3>
           <div className="flex-1 min-h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d386b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0d386b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <Tooltip contentStyle={{backgroundColor: '#001229', border: 'none', borderRadius: '8px', color: '#fff'}} />
                  <Area type="monotone" dataKey="present" stroke="#FF9933" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Critical Active Duties Table */}
      <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
         <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
           <h3 className="font-heading font-bold text-gray-800 dark:text-white">High Priority Active Duties</h3>
           <button onClick={() => navigate('/dashboard/duties')} className="text-sm font-semibold text-[#FF9933] hover:underline">View All Duties</button>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="text-xs uppercase text-gray-500 dark:text-white/40 bg-gray-50 dark:bg-transparent border-b border-gray-100 dark:border-white/5">
                 <th className="p-4 font-semibold">Duty ID</th>
                 <th className="p-4 font-semibold">Category</th>
                 <th className="p-4 font-semibold">Location</th>
                 <th className="p-4 font-semibold">Assigned Staff</th>
                 <th className="p-4 font-semibold">Status</th>
                 <th className="p-4 font-semibold text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="text-sm divide-y divide-gray-100 dark:divide-white/5">
               {[
                 { id: 'DTY-9021', type: 'VIP Security', loc: 'Airport Route', staff: 24, status: 'On Duty', sColor: 'text-green-500 bg-green-500/10' },
                 { id: 'DTY-9022', type: 'Law & Order', loc: 'Hazratganj Chauraha', staff: 12, status: 'Pending', sColor: 'text-amber-500 bg-amber-500/10' },
                 { id: 'DTY-9023', type: 'Emergency Response', loc: 'Gomti Nagar', staff: 8, status: 'Assigned', sColor: 'text-blue-500 bg-blue-500/10' },
               ].map((duty, idx) => (
                 <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                   <td className="p-4 font-mono font-medium text-gray-800 dark:text-white/90">{duty.id}</td>
                   <td className="p-4 font-semibold text-gray-700 dark:text-white/80">{duty.type}</td>
                   <td className="p-4 text-gray-500 dark:text-white/60">{duty.loc}</td>
                   <td className="p-4">
                     <div className="flex items-center gap-2">
                       <Users size={14} className="text-gray-400" />
                       <span className="font-medium dark:text-white/80">{duty.staff} Officers</span>
                     </div>
                   </td>
                   <td className="p-4">
                     <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${duty.sColor}`}>
                       {duty.status}
                     </span>
                   </td>
                   <td className="p-4 text-right">
                     <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-white/50 transition-colors">
                       <MoreVertical size={16} />
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>
      <div className="h-8"></div>
    </div>
  );
};
