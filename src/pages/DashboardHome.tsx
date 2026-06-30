import React from 'react';
import { 
  Shield, Target, ShieldAlert, Users, Car, Clock, FileText, Sword, Radio, Map, MapPin, BarChart2, Briefcase, Calendar, MoreVertical, CheckCircle, AlertCircle, TrendingUp
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
// STATION DASHBOARD (SHO & Constable)
// ----------------------------------------------------
const SHODashboard = ({ navigate, stats, isConstable }: { navigate: any, stats: any, isConstable?: boolean }) => (
  <>
    {/* Station Metrics */}
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${isConstable ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-4 lg:gap-6 mb-8 animate-fade-in`}>
      <WidgetCard title="Station Strength" value={stats.strength} subtext="Officers Available" icon={Users} colorClass="from-blue-500 to-blue-700" />
      <WidgetCard title="Beat Deployment" value={stats.beat} subtext="Active Patrolling" icon={Map} colorClass="from-emerald-500 to-emerald-700" />
      {!isConstable && (
        <>
          <WidgetCard title="Pending Approvals" value={stats.pending} subtext="Awaiting your review" icon={Clock} colorClass="from-amber-500 to-amber-700" />
          <WidgetCard title="Leave Requests" value={stats.leave} subtext="Action required" icon={FileText} colorClass="from-purple-500 to-purple-700" />
        </>
      )}
    </div>

    {/* Quick Action Banner for Duty Assignment */}
    <div className="bg-gradient-to-r from-[#001229] to-[#0a2342] dark:from-[#001229]/80 dark:to-[#0a2342]/80 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-gray-800 dark:border-white/10 animate-fade-in" style={{animationDelay: '50ms'}}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-[#FF9933]/20 border border-[#FF9933]/30 rounded-full flex items-center justify-center shrink-0">
          <Briefcase className="text-[#FF9933]" size={28} />
        </div>
        <div>
          <h3 className="text-xl font-bold font-heading text-white">Daily Duty Roster {isConstable ? '(आज की ड्यूटी)' : '(ड्यूटी लगाएँ)'}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {isConstable ? 'View personnel assignments for beats and traffic points.' : 'Assign personnel to beats, traffic points, and active deployments.'}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <button onClick={() => navigate('/dashboard/duties')} className="flex-1 md:flex-none px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
          <Calendar size={16} /> View Roster
        </button>
        {!isConstable && (
          <button onClick={() => navigate('/dashboard/duties')} className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-[#FF9933] to-[#ffaa55] hover:scale-105 text-[#001229] rounded-xl text-sm font-extrabold shadow-[0_0_20px_rgba(255,153,51,0.3)] transition-all flex items-center justify-center gap-2">
            <Users size={18} /> Assign Duty Force
          </button>
        )}
      </div>
    </div>

    <div className={`grid grid-cols-1 ${!isConstable ? 'lg:grid-cols-2' : ''} gap-6 mb-8 animate-fade-in`} style={{animationDelay: '100ms'}}>
      {!isConstable && (
        <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
           <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-white mb-4">Pending Approvals Action Center</h3>
           <div className="space-y-3">
             {stats.duties.map((d: any) => (
               <div key={d.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{d.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">Requested by: {d.req}</p>
                  </div>
                  <button onClick={() => navigate('/dashboard/duties')} className="px-4 py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg text-xs font-bold transition-colors">Review</button>
               </div>
             ))}
           </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
         <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-white mb-4">Station Resources</h3>
         <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl text-center">
              <Car className="mx-auto text-gray-400 mb-2" size={24} />
              <div className="font-bold text-xl text-gray-900 dark:text-white">{stats.pcr}</div>
              <div className="text-xs text-gray-500">PCR Vans Active</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl text-center">
              <Sword className="mx-auto text-gray-400 mb-2" size={24} />
              <div className="font-bold text-xl text-gray-900 dark:text-white">{stats.weapons}</div>
              <div className="text-xs text-gray-500">Weapons Issued</div>
            </div>
         </div>
      </div>
    </div>

    {/* Leave Approvals Panel */}
    {!isConstable && (
      <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 mb-8 animate-fade-in" style={{animationDelay: '150ms'}}>
         <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
           <FileText className="text-purple-500" /> 
           Leave Requests (Pending Approval)
         </h3>
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead>
               <tr className="text-xs uppercase text-gray-500 border-b border-gray-100 dark:border-white/10">
                 <th className="pb-3 px-4">Officer</th>
                 <th className="pb-3 px-4">Leave Type</th>
                 <th className="pb-3 px-4">Duration</th>
                 <th className="pb-3 px-4 text-right">Action</th>
               </tr>
             </thead>
             <tbody>
               {stats.leave === '0' || !stats.leave ? (
                 <tr><td colSpan={4} className="py-6 text-center text-gray-500">No pending leave requests.</td></tr>
               ) : (
                 <>
                   <tr className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                     <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">Constable Suresh</td>
                     <td className="py-3 px-4 text-blue-500 font-medium">Casual Leave</td>
                     <td className="py-3 px-4 text-gray-500">3 Days (03-Jul to 05-Jul)</td>
                     <td className="py-3 px-4 flex gap-2 justify-end">
                       <button className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white rounded text-xs font-bold transition-colors">Approve</button>
                       <button className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded text-xs font-bold transition-colors">Deny</button>
                     </td>
                   </tr>
                   {parseInt(stats.leave) > 1 && (
                     <tr className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                       <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">Sub Inspector Amit</td>
                       <td className="py-3 px-4 text-purple-500 font-medium">Earned Leave</td>
                       <td className="py-3 px-4 text-gray-500">7 Days (05-Jul to 11-Jul)</td>
                       <td className="py-3 px-4 flex gap-2 justify-end">
                         <button className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white rounded text-xs font-bold transition-colors">Approve</button>
                         <button className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded text-xs font-bold transition-colors">Deny</button>
                       </td>
                     </tr>
                   )}
                 </>
               )}
             </tbody>
           </table>
         </div>
      </div>
    )}
  </>
);

// ----------------------------------------------------
// MAIN DASHBOARD COMPONENT
// ----------------------------------------------------
export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const role = userData?.role || 'Constable';
  const storedThana = localStorage.getItem('demoThana') || 'Hazratganj';

  const getThanaStats = (thana: string) => {
    switch (thana) {
      case 'Gomti Nagar': return { strength: '65 / 70', beat: '8', pending: '1', leave: '3', pcr: '8/10', weapons: '32', duties: [{ id: 'DTY-8013', title: 'Marine Drive Patrol', req: 'SI Meera' }] };
      case 'Chowk': return { strength: '50 / 55', beat: '6', pending: '4', leave: '1', pcr: '5/6', weapons: '28', duties: [{ id: 'DTY-7011', title: 'Old City Strike Control', req: 'Inspector Tariq' }] };
      case 'Alambagh': return { strength: '42 / 45', beat: '5', pending: '2', leave: '0', pcr: '4/5', weapons: '20', duties: [{ id: 'DTY-6011', title: 'Highway Accident Response', req: 'Constable Mohit' }] };
      default: return { strength: '84 / 90', beat: '12', pending: '3', leave: '2', pcr: '12/15', weapons: '45', duties: [ { id: 'DTY-9022', title: 'Hazratganj Protest', req: 'Constable Ramesh' }, { id: 'DTY-9025', title: 'Night Patrol Route B', req: 'Duty Officer Anil' } ] };
    }
  };
  const thanaStats = getThanaStats(storedThana);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-gray-50 dark:bg-[#000a17]">
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
             {role === 'SHO' && `${storedThana} Station • Monitoring`}
             {!['Constable', 'SHO'].includes(role) && `HQ Analytics • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
           </p>
         </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.open(`${import.meta.env.BASE_URL}generate_ppt.html`, '_blank')} 
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2"
            >
              <FileText size={16} /> Download Project PPTX
            </button>
            {role !== 'Constable' && (
              <button onClick={() => navigate('/dashboard/duties')} className="px-5 py-2.5 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2">
                <Briefcase size={16} /> Manage Deployments
              </button>
            )}
          </div>
      </div>

      {/* Render Dashboard Based on Role */}
      {role === 'Constable' && <SHODashboard navigate={navigate} stats={thanaStats} isConstable={true} />}
      {role === 'SHO' && <SHODashboard navigate={navigate} stats={thanaStats} />}
      {!['Constable', 'SHO'].includes(role) && <MacroDashboard navigate={navigate} />}
      
      <div className="h-8"></div>
    </div>
  );
};
