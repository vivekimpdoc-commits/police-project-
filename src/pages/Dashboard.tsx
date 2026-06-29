import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LogOut, User, Bell, CheckSquare, FileText, BarChart2, 
  Calendar, Briefcase, AlertTriangle, 
  Menu, X, Shield, Search, Map, Users, Target, Clock, ShieldAlert,
  Car, Sword, Radio, MoreVertical, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock Data for Charts
const attendanceData = [
  { time: '06:00', present: 850 },
  { time: '10:00', present: 1200 },
  { time: '14:00', present: 1150 },
  { time: '18:00', present: 1300 },
  { time: '22:00', present: 900 },
  { time: '02:00', present: 600 },
];

export const Dashboard: React.FC = () => {
  const { userData, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuGroups = [
    {
      title: 'MAIN',
      items: [
        { icon: BarChart2, label: 'Control Room Overview', active: true },
        { icon: Map, label: 'Live Duty Map' },
        { icon: Users, label: 'Officer Availability' },
        { icon: Calendar, label: 'Duty Calendar' },
      ]
    },
    {
      title: 'DUTY MANAGEMENT',
      items: [
        { icon: Briefcase, label: 'Daily Duty' },
        { icon: Shield, label: 'VIP Duty', badge: 'High' },
        { icon: Target, label: 'Law & Order' },
        { icon: Users, label: 'Election Duty' },
        { icon: Calendar, label: 'Festival Duty' },
        { icon: Car, label: 'Traffic Duty' },
        { icon: Clock, label: 'Night Patrol' },
        { icon: FileText, label: 'Court Duty' },
        { icon: ShieldAlert, label: 'Emergency Response' },
        { icon: Users, label: 'Reserve Force' },
      ]
    },
    {
      title: 'REPORTS & LOGS',
      items: [
        { icon: CheckSquare, label: 'Attendance & Check-in' },
        { icon: FileText, label: 'Generate Reports' },
        { icon: Bell, label: 'Alerts & Notifications' },
      ]
    }
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
           <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
             {trend.value} 
           </span>
        )}
        <span className="text-gray-400 dark:text-gray-500 ml-2">{subtext}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#000a17] flex overflow-hidden font-sans">
      
      {/* Enterprise Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0 -translate-x-full'} transition-all duration-300 flex-shrink-0 bg-[#001229] border-r border-white/10 text-white h-screen flex flex-col z-30 absolute md:relative`}>
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-[#001229] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9933] to-[#ffaa55] flex items-center justify-center shadow-lg shadow-[#FF9933]/20">
               <Shield size={22} className="text-[#001229]" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold tracking-wide text-lg leading-tight">PNO DUTY</h1>
              <p className="text-[10px] text-white/50 tracking-widest font-semibold">UP POLICE PORTAL</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        {/* User Quick Profile */}
        <div className="p-6 border-b border-white/10 shrink-0 bg-white/5 mx-4 mt-4 rounded-xl">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-[#FF9933] overflow-hidden shrink-0">
               <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.fullName || 'Admin'}&backgroundColor=002147`} alt="Profile" />
             </div>
             <div className="overflow-hidden">
               <h3 className="font-bold text-sm truncate">{userData?.fullName || 'Superintendent'}</h3>
               <p className="text-xs text-[#FF9933] font-medium truncate">{userData?.role || 'Control Room Admin'}</p>
             </div>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <p className="px-4 text-[11px] font-bold text-white/40 tracking-wider mb-2">{group.title}</p>
              <ul className="space-y-1">
                {group.items.map((item, idx) => (
                  <li key={idx}>
                    <button className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${item.active ? 'bg-gradient-to-r from-[#FF9933]/20 to-transparent text-[#FF9933] border-l-2 border-[#FF9933]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={item.active ? 'text-[#FF9933]' : 'text-white/50'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] py-0.5 px-2 rounded-full font-bold uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors text-sm font-bold">
            <LogOut size={18} />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-[#001229]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-600 dark:text-white/70">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-gray-400 dark:text-white/40 text-sm font-medium">
               <span>Dashboard</span>
               <ChevronRightIcon size={14} />
               <span className="text-gray-800 dark:text-white">Control Room Overview</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            {/* Global Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search officer, belt no, duty ID..." className="pl-10 pr-4 py-2.5 w-80 bg-gray-100 dark:bg-[#000a17] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933]/50 outline-none dark:text-white transition-all" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                 <kbd className="px-1.5 py-0.5 bg-white dark:bg-white/10 rounded text-[10px] text-gray-400 dark:text-white/40 font-mono">Ctrl</kbd>
                 <kbd className="px-1.5 py-0.5 bg-white dark:bg-white/10 rounded text-[10px] text-gray-400 dark:text-white/40 font-mono">K</kbd>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-3 md:pl-5">
              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-600 dark:text-white/70">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#001229]"></span>
              </button>
              <button className="relative p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-red-500 dark:text-red-400">
                <AlertTriangle size={20} />
              </button>
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-600 dark:text-white/70">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
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
               <button className="px-5 py-2.5 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2">
                 <Briefcase size={16} /> Assign New Duty
               </button>
             </div>
          </div>

          {/* Core Duty Metrics (Row 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <WidgetCard title="Total Assigned Today" value="2,450" subtext="Officers on active duty" icon={Shield} colorClass="from-blue-500 to-blue-700" trend={{value: '+12%', isPositive: true}} />
            <WidgetCard title="VIP Deployments" value="8" subtext="Active VIP routes" icon={Target} colorClass="from-amber-500 to-amber-700" />
            <WidgetCard title="Emergency Alert" value="2" subtext="Requires immediate attention" icon={ShieldAlert} colorClass="from-red-500 to-red-700" />
            <WidgetCard title="Reserve Force Available" value="184" subtext="Officers on standby" icon={Users} colorClass="from-green-500 to-green-700" />
          </div>

          {/* Secondary Metrics (Row 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-[#001229]/50 p-4 rounded-xl border border-gray-100 dark:border-white/5">
               <div className="text-gray-500 dark:text-white/50 text-xs font-semibold mb-1 flex items-center gap-1.5"><Car size={14}/> Traffic Duty</div>
               <div className="text-xl font-bold dark:text-white">342</div>
            </div>
            <div className="bg-white dark:bg-[#001229]/50 p-4 rounded-xl border border-gray-100 dark:border-white/5">
               <div className="text-gray-500 dark:text-white/50 text-xs font-semibold mb-1 flex items-center gap-1.5"><Clock size={14}/> Night Patrol</div>
               <div className="text-xl font-bold dark:text-white">156</div>
            </div>
            <div className="bg-white dark:bg-[#001229]/50 p-4 rounded-xl border border-gray-100 dark:border-white/5">
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
                  {/* Map Mockup - Will be replaced by Google Maps / Leaflet component later */}
                  <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Lucknow,UP&zoom=12&size=800x400&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x333333&style=feature:water|element:geometry|color:0x1b2c45&style=feature:landscape|element:geometry|color:0x000a17&sensor=false')] bg-cover bg-center opacity-40 dark:opacity-60 mix-blend-luminosity"></div>
                  
                  {/* Mock Map Markers */}
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
               <button className="text-sm font-semibold text-[#FF9933] hover:underline">View All Duties</button>
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
          
          <div className="h-8"></div> {/* Bottom Padding */}
        </div>
      </main>
    </div>
  );
};

const ChevronRightIcon = ({size}: {size:number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
