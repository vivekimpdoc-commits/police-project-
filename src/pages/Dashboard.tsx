import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LogOut, User, Bell, CheckSquare, FileText, BarChart2, 
  Calendar, Briefcase, AlertTriangle, 
  Menu, X, Shield, Search, Map, Users, Target, Clock, ShieldAlert,
  Car, Sword, Radio, MoreVertical, CheckCircle
} from 'lucide-react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { DashboardHome } from './DashboardHome';
import { DutyManagement } from './DutyManagement';
import { OfficerAvailability } from './OfficerAvailability';
import { LiveDutyMap } from './LiveDutyMap';
import { DutyCalendar } from './DutyCalendar';
import { AttendanceModule } from './AttendanceModule';
import { GenerateReports } from './GenerateReports';

const ModulePlaceholder = ({ title }: { title: string }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 h-full animate-fade-in text-center mt-20">
    <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 border border-gray-200 dark:border-white/10 mx-auto">
      <Briefcase size={40} className="text-gray-400 dark:text-white/20" />
    </div>
    <h2 className="text-2xl font-bold font-heading text-gray-800 dark:text-white mb-2">{title} Module</h2>
    <p className="text-gray-500 dark:text-white/50 text-sm max-w-md mx-auto">
      This module is currently under development. Detailed features for {title} will be available in the upcoming release.
    </p>
  </div>
);

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
        { icon: BarChart2, label: 'Control Room Overview', path: '/dashboard' },
        { icon: Map, label: 'Live Duty Map', path: '/dashboard/map' },
        { icon: Users, label: 'Officer Availability', path: '/dashboard/officers' },
        { icon: Calendar, label: 'Duty Calendar', path: '/dashboard/calendar' },
      ]
    },
    {
      title: 'DUTY MANAGEMENT',
      items: [
        { icon: Briefcase, label: 'Daily Duty', path: '/dashboard/duties' },
        { icon: Shield, label: 'VIP Duty', badge: 'High', path: '/dashboard/duties' },
        { icon: Target, label: 'Law & Order', path: '/dashboard/duties' },
        { icon: Users, label: 'Election Duty', path: '/dashboard/duties' },
        { icon: Calendar, label: 'Festival Duty', path: '/dashboard/duties' },
        { icon: Car, label: 'Traffic Duty', path: '/dashboard/duties' },
        { icon: Clock, label: 'Night Patrol', path: '/dashboard/duties' },
        { icon: FileText, label: 'Court Duty', path: '/dashboard/duties' },
        { icon: ShieldAlert, label: 'Emergency Response', path: '/dashboard/duties' },
        { icon: Users, label: 'Reserve Force', path: '/dashboard/duties' },
      ]
    },
    {
      title: 'REPORTS & LOGS',
      items: [
        { icon: CheckSquare, label: 'Attendance & Check-in', path: '/dashboard/attendance' },
        { icon: FileText, label: 'Generate Reports', path: '/dashboard/reports' },
        { icon: Bell, label: 'Alerts & Notifications', path: '/dashboard/alerts' },
      ]
    }
  ];

  const location = useLocation();

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
              <h1 className="font-heading font-extrabold tracking-wide text-lg leading-tight">UPCOP COMMAND</h1>
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
                {group.items.map((item, idx) => {
                  const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
                  return (
                  <li key={idx}>
                    <Link to={item.path} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${isActive ? 'bg-gradient-to-r from-[#FF9933]/20 to-transparent text-[#FF9933] border-l-2 border-[#FF9933]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={isActive ? 'text-[#FF9933]' : 'text-white/50'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] py-0.5 px-2 rounded-full font-bold uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )})}
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
               <span className="text-gray-800 dark:text-white font-bold text-[#FF9933]">
                 {localStorage.getItem('demoThana') || 'Hazratganj'} Control Room
               </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            {/* Global Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search officer, PNO no, duty ID..." className="pl-10 pr-4 py-2.5 w-80 bg-gray-100 dark:bg-[#000a17] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933]/50 outline-none dark:text-white transition-all" />
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

        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/duties" element={<DutyManagement />} />
          <Route path="/officers" element={<OfficerAvailability />} />
          <Route path="/map" element={<LiveDutyMap />} />
          <Route path="/calendar" element={<DutyCalendar />} />
          <Route path="/attendance" element={<AttendanceModule />} />
          <Route path="/reports" element={<GenerateReports />} />
          <Route path="/alerts" element={<ModulePlaceholder title="Alerts & Notifications" />} />
          <Route path="*" element={<ModulePlaceholder title="Requested" />} />
        </Routes>
      </main>
    </div>
  );
};

const ChevronRightIcon = ({size}: {size:number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
