import React from 'react';
import { 
  Shield, Target, ShieldAlert, Users, Car, Clock, FileText, Sword, Radio, Map, BarChart2, Briefcase, Calendar, MoreVertical, CheckCircle, AlertCircle, TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const attendanceData = [
  { time: '06:00', present: 850 },
  { time: '10:00', present: 1200 },
  { time: '14:00', present: 1150 },
  { time: '18:00', present: 1300 },
  { time: '22:00', present: 900 },
  { time: '02:00', present: 600 },
];

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
         <span className={trend.isPositive ? 'text-green-500 flex items-center gap-1' : 'text-red-500 flex items-center gap-1'}>
           {trend.isPositive ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />} {trend.value} 
         </span>
      )}
      <span className="text-gray-400 dark:text-gray-500 ml-2">{subtext}</span>
    </div>
  </div>
);

// ----------------------------------------------------
// MACRO DASHBOARD (District / Zone / State HQ)
// ----------------------------------------------------
const MacroDashboard = ({ navigate }: { navigate: any }) => (
  <>
    {/* Core Duty Metrics Row 1 */}
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 animate-fade-in">
      <WidgetCard title="Today's Duty" value="2,450" subtext="Officers on active duty" icon={Briefcase} colorClass="from-blue-500 to-blue-700" trend={{value: '+12%', isPositive: true}} />
      <WidgetCard title="VIP Deployment" value="18" subtext="Active VIP routes" icon={Target} colorClass="from-amber-500 to-amber-700" trend={{value: '+2', isPositive: false}} />
      <WidgetCard title="Emergency Duty" value="3" subtext="Requires immediate attention" icon={ShieldAlert} colorClass="from-red-500 to-red-700" trend={{value: '+1', isPositive: false}} />
      <WidgetCard title="Reserve Force" value="482" subtext="Standby ready" icon={Users} colorClass="from-green-500 to-green-700" trend={{value: '-15', isPositive: false}} />
    </div>

    {/* Core Duty Metrics Row 2 */}
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 animate-fade-in" style={{animationDelay: '100ms'}}>
      <WidgetCard title="Traffic Deployment" value="840" subtext="Chaurahas & Checkpoints" icon={Car} colorClass="from-indigo-500 to-indigo-700" />
      <WidgetCard title="Night Patrol" value="320" subtext="Scheduled for tonight" icon={Map} colorClass="from-slate-700 to-slate-900" />
      <WidgetCard title="Court Duty" value="142" subtext="Hearings & Escorts" icon={FileText} colorClass="from-purple-500 to-purple-700" />
      <WidgetCard title="Logistics (Veh/Wep)" value="450 / 890" subtext="Total Vehicles & Weapons Active" icon={Radio} colorClass="from-teal-500 to-teal-700" />
    </div>

    {/* Secondary Metrics Row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
       <div className="bg-white dark:bg-[#001229]/80 p-4 rounded-xl border border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div><p className="text-xs text-gray-500">Pending Duties</p><p className="text-xl font-bold text-amber-600">45</p></div>
          <Clock className="text-amber-200" size={24} />
       </div>
       <div className="bg-white dark:bg-[#001229]/80 p-4 rounded-xl border border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div><p className="text-xs text-gray-500">Completed Duties</p><p className="text-xl font-bold text-green-600">1,204</p></div>
          <CheckCircle className="text-green-200" size={24} />
       </div>
       <div className="bg-white dark:bg-[#001229]/80 p-4 rounded-xl border border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div><p className="text-xs text-gray-500">Officers On Duty</p><p className="text-xl font-bold text-blue-600">4,120</p></div>
          <Shield className="text-blue-200" size={24} />
       </div>
       <div className="bg-white dark:bg-[#001229]/80 p-4 rounded-xl border border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div><p className="text-xs text-gray-500">Officers Off Duty</p><p className="text-xl font-bold text-gray-400">850</p></div>
          <Users className="text-gray-200" size={24} />
       </div>
    </div>

    {/* Live Map & Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{animationDelay: '200ms'}}>
      
      {/* Monthly Duty Report Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BarChart2 size={18} className="text-[#FF9933]" /> Monthly Duty Report
            </h3>
            <select className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs px-2 py-1 dark:text-white outline-none">
              <option>June 2026</option>
              <option>May 2026</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9933" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF9933" stopOpacity={0}/>
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

      {/* Live Map CTA Widget */}
      <div className="bg-gradient-to-br from-[#001229] to-[#0d386b] dark:from-[#000a17] dark:to-[#001229] rounded-2xl border border-blue-900/30 shadow-lg p-6 flex flex-col relative overflow-hidden group cursor-pointer" onClick={() => navigate('/dashboard/map')}>
         <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Lucknow,UP&zoom=11&size=400x400&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x333333&style=feature:water|element:geometry|color:0x1b2c45&style=feature:landscape|element:geometry|color:0x000a17&sensor=false')] bg-cover opacity-20 mix-blend-luminosity group-hover:scale-110 transition-transform duration-700"></div>
         <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-600/20 transition-colors"></div>
         
         <div className="relative z-10 flex-1 flex flex-col">
           <div className="flex justify-between items-start mb-auto">
             <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-[#FF9933]">
               <Map size={24} />
             </div>
             <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30 animate-pulse">
               <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> LIVE
             </span>
           </div>
           
           <div className="mt-8">
             <h3 className="text-xl font-bold font-heading text-white mb-2 group-hover:text-[#FF9933] transition-colors">Tactical Live Map</h3>
             <p className="text-sm text-blue-200/70 mb-4">Real-time GPS tracking of 245 active units, VIP routes, and emergency responses.</p>
             <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl text-sm font-bold border border-white/20 transition-all flex items-center justify-center gap-2">
               Open Command Center <TrendingUp size={16} />
             </button>
           </div>
         </div>
      </div>
    </div>
  </>
);

// ----------------------------------------------------
// SHO DASHBOARD (Police Station)
// ----------------------------------------------------
const SHODashboard = ({ navigate }: { navigate: any }) => (
  <>
    {/* SHO Metrics */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 animate-fade-in">
      <WidgetCard title="Station Strength" value="84 / 90" subtext="Officers Available" icon={Users} colorClass="from-blue-500 to-blue-700" />
      <WidgetCard title="Beat Deployment" value="12" subtext="Active Patrolling" icon={Map} colorClass="from-emerald-500 to-emerald-700" />
      <WidgetCard title="Pending Approvals" value="3" subtext="Awaiting your review" icon={Clock} colorClass="from-amber-500 to-amber-700" />
      <WidgetCard title="Leave Requests" value="2" subtext="Action required" icon={FileText} colorClass="from-purple-500 to-purple-700" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{animationDelay: '100ms'}}>
      <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
         <h3 className="font-bold font-heading text-lg dark:text-white mb-4">Pending Approvals Action Center</h3>
         <div className="space-y-3">
           {[
             { id: 'DTY-9022', title: 'Hazratganj Protest (Law & Order)', req: 'Constable Ramesh' },
             { id: 'DTY-9025', title: 'Night Patrol Route B', req: 'Duty Officer Anil' }
           ].map(d => (
             <div key={d.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                <div>
                  <h4 className="font-bold text-sm dark:text-white">{d.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">Requested by: {d.req}</p>
                </div>
                <button onClick={() => navigate('/dashboard/duties')} className="px-4 py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg text-xs font-bold transition-colors">Review</button>
             </div>
           ))}
         </div>
      </div>
      
      <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
         <h3 className="font-bold font-heading text-lg dark:text-white mb-4">Station Resources</h3>
         <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl text-center">
              <Car className="mx-auto text-gray-400 mb-2" size={24} />
              <div className="font-bold text-xl dark:text-white">12/15</div>
              <div className="text-xs text-gray-500">PCR Vans Active</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl text-center">
              <Sword className="mx-auto text-gray-400 mb-2" size={24} />
              <div className="font-bold text-xl dark:text-white">45</div>
              <div className="text-xs text-gray-500">Weapons Issued</div>
            </div>
         </div>
      </div>
    </div>
  </>
);

// ----------------------------------------------------
// CONSTABLE DASHBOARD (Personal View)
// ----------------------------------------------------
const ConstableDashboard = () => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8 animate-fade-in">
      <WidgetCard title="Upcoming Duty" value="Night Patrol" subtext="Today, 22:00 - 06:00" icon={Briefcase} colorClass="from-[#FF9933] to-[#ffaa55]" />
      <WidgetCard title="Leave Balance" value="12 Days" subtext="Casual & Earned Leave" icon={Calendar} colorClass="from-blue-500 to-blue-700" />
      <WidgetCard title="Warnings/Alerts" value="0" subtext="Clean Record" icon={CheckCircle} colorClass="from-green-500 to-green-700" />
    </div>

    <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 animate-fade-in" style={{animationDelay: '100ms'}}>
      <h3 className="font-bold font-heading text-lg dark:text-white mb-4">My Duty Schedule</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
           <thead>
             <tr className="text-xs uppercase text-gray-500 border-b border-gray-100 dark:border-white/10">
               <th className="pb-3">Date</th>
               <th className="pb-3">Duty Name</th>
               <th className="pb-3">Location</th>
               <th className="pb-3">Timing</th>
               <th className="pb-3">Status</th>
             </tr>
           </thead>
           <tbody className="text-sm">
             <tr className="border-b border-gray-50 dark:border-white/5">
               <td className="py-4 dark:text-white font-medium">Today</td>
               <td className="py-4 font-bold dark:text-white">Sector 4 Night Patrol</td>
               <td className="py-4 text-gray-500">Gomti Nagar</td>
               <td className="py-4 dark:text-white">22:00 - 06:00</td>
               <td className="py-4"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-bold">Upcoming</span></td>
             </tr>
             <tr>
               <td className="py-4 dark:text-white font-medium">Tomorrow</td>
               <td className="py-4 font-bold dark:text-white">VIP Escort Reserve</td>
               <td className="py-4 text-gray-500">Police Line</td>
               <td className="py-4 dark:text-white">08:00 - 16:00</td>
               <td className="py-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-bold">Assigned</span></td>
             </tr>
           </tbody>
        </table>
      </div>
    </div>
  </>
);

// ----------------------------------------------------
// MAIN DASHBOARD COMPONENT
// ----------------------------------------------------
export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const role = userData?.role || 'Constable';

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
      {/* Dynamic Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
         <div>
           <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-1 flex items-center gap-3">
             {role === 'Constable' && 'My Profile & Duties'}
             {role === 'SHO' && 'Police Station Control'}
             {!['Constable', 'SHO'].includes(role) && 'Live Control Room'}
           </h2>
           <p className="text-gray-500 dark:text-white/60 text-sm">
             {role === 'Constable' && `Welcome back, ${userData?.fullName}`}
             {role === 'SHO' && 'Hazratganj Station • Monitoring'}
             {!['Constable', 'SHO'].includes(role) && `HQ Analytics • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
           </p>
         </div>
         <div className="flex items-center gap-3">
           {role !== 'Constable' && (
             <button onClick={() => navigate('/dashboard/duties')} className="px-5 py-2.5 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2">
               <Briefcase size={16} /> Manage Deployments
             </button>
           )}
         </div>
      </div>

      {/* Render Dashboard Based on Role */}
      {role === 'Constable' && <ConstableDashboard />}
      {role === 'SHO' && <SHODashboard navigate={navigate} />}
      {!['Constable', 'SHO'].includes(role) && <MacroDashboard navigate={navigate} />}
      
      <div className="h-8"></div>
    </div>
  );
};
