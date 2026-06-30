import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  LogOut, User, Bell, CheckSquare, FileText, BarChart2,
  Calendar, Briefcase, AlertTriangle,
  Menu, X, Shield, Search, Map, Users, Target, Clock, ShieldAlert,
  Car, Sword, Radio, MoreVertical, CheckCircle, ChevronDown
} from 'lucide-react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { DashboardHome } from './DashboardHome';
import { DutyManagement } from './DutyManagement';
import { OfficerAvailability } from './OfficerAvailability';
import { LiveDutyMap } from './LiveDutyMap';
import { DutyCalendar } from './DutyCalendar';
import { AttendanceModule } from './AttendanceModule';
import { GenerateReports } from './GenerateReports';
import { PersonalDuties } from './PersonalDuties';

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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'MAIN': true,
    'DUTY MANAGEMENT': false,
    'REPORTS & LOGS': true,
    'STATION COMMAND': true,
    'STATION DUTIES': false,
    'STATION LOGS': true,
    'STATION CONTROL (थाना नियंत्रण)': true,
    'DUTY MANAGEMENT (ड्यूटी)': true,
    'PERSONNEL (कर्मचारी)': false,
    'MY RECORDS (मेरा खाता)': true
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: prev[title] === undefined ? false : !prev[title]
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getMenuGroups = () => {
    if (userData?.role === 'SHO') {
      return [
        {
          title: 'STATION COMMAND',
          items: [
            { icon: BarChart2, label: 'Station Dashboard', path: '/dashboard' },
            { icon: Users, label: 'Station Force (Officers)', path: '/dashboard/officers' },
            { icon: Calendar, label: 'Station Roster', path: '/dashboard/calendar' },
          ]
        },
        {
          title: 'STATION DUTIES',
          categories: [
            {
              name: 'Regular Deployments',
              items: [
                { icon: Briefcase, label: 'Daily Beat Duty', path: '/dashboard/duties' },
                { icon: Car, label: 'Traffic Points', path: '/dashboard/duties' },
                { icon: Clock, label: 'Night Patrols', path: '/dashboard/duties' },
                { icon: Users, label: 'Station Reserve', path: '/dashboard/duties' },
              ]
            },
            {
              name: 'Security & Law',
              items: [
                { icon: Shield, label: 'VIP Routes', badge: 'High', path: '/dashboard/duties' },
                { icon: Target, label: 'Law & Order', path: '/dashboard/duties' },
              ]
            },
            {
              name: 'Event Duties',
              items: [
                { icon: Users, label: 'Election Booths', path: '/dashboard/duties' },
                { icon: Calendar, label: 'Local Festivals', path: '/dashboard/duties' },
              ]
            },
            {
              name: 'Legal/Emergency',
              items: [
                { icon: FileText, label: 'Court Duty/Escort', path: '/dashboard/duties' },
                { icon: ShieldAlert, label: 'Emergency Response', badge: 'Urgent', path: '/dashboard/duties' },
              ]
            }
          ]
        },
        {
          title: 'APPROVALS & REQUESTS',
          items: [
            { icon: FileText, label: 'Leave Applications', badge: '2', path: '/dashboard/attendance' },
            { icon: Briefcase, label: 'Duty Approvals', badge: '3', path: '/dashboard/duties' },
          ]
        },
        {
          title: 'STATION LOGS',
          items: [
            { icon: CheckSquare, label: 'Staff Attendance', path: '/dashboard/attendance' },
            { icon: FileText, label: 'Daily Diary (GD)', path: '/dashboard/reports' },
            { icon: Bell, label: 'Station Alerts', path: '/dashboard/alerts' },
          ]
        }
      ];
    } else if (userData?.role === 'Constable') {
      return [
        {
          title: 'STATION CONTROL (थाना नियंत्रण)',
          items: [
            { icon: BarChart2, label: 'Station Dashboard', path: '/dashboard' },
            { icon: Users, label: 'Station Force', path: '/dashboard/officers' },
          ]
        },
        {
          title: 'DUTY MANAGEMENT (ड्यूटी)',
          categories: [
            {
              name: 'Regular Deployments',
              items: [
                { icon: Briefcase, label: 'Daily Beat Duty', path: '/dashboard/duties' },
                { icon: Car, label: 'Traffic Points', path: '/dashboard/duties' },
                { icon: Clock, label: 'Night Patrols', path: '/dashboard/duties' },
                { icon: Users, label: 'Reserve Force', path: '/dashboard/duties' },
              ]
            },
            {
              name: 'Security & Law',
              items: [
                { icon: Shield, label: 'VIP Routes', badge: 'High', path: '/dashboard/duties' },
                { icon: Target, label: 'Law & Order', path: '/dashboard/duties' },
              ]
            },
            {
              name: 'Event Duties',
              items: [
                { icon: Users, label: 'Election Duty', path: '/dashboard/duties' },
                { icon: Calendar, label: 'Festival Duty', path: '/dashboard/duties' },
              ]
            },
            {
              name: 'Legal/Emergency',
              items: [
                { icon: FileText, label: 'Court Duty/Escort', path: '/dashboard/duties' },
                { icon: ShieldAlert, label: 'Emergency Response', badge: 'Urgent', path: '/dashboard/duties' },
              ]
            }
          ]
        },
        {
          title: 'PERSONNEL (कर्मचारी)',
          categories: [
            {
              name: 'Staff Management',
              items: [
                { icon: User, label: 'Add New Officer', path: '/dashboard/officers' },
                { icon: Car, label: 'Transfer In/Out', path: '/dashboard/officers' },
                { icon: FileText, label: 'Posting Orders', path: '/dashboard/officers' },
              ]
            },
            {
              name: 'Records & Training',
              items: [
                { icon: CheckSquare, label: 'Training Records', path: '/dashboard/officers' },
                { icon: BarChart2, label: 'Performance Log', path: '/dashboard/officers' },
              ]
            }
          ]
        },
        {
          title: 'MY RECORDS (मेरा खाता)',
          items: [
            { icon: Calendar, label: 'My Duty Schedule', path: '/dashboard/my-duties' },
            { icon: CheckSquare, label: 'My Attendance', path: '/dashboard/attendance' },
          ]
        }
      ];
    } else {
      return [
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
          categories: [
            {
              name: 'Regular Duties',
              items: [
                { icon: Briefcase, label: 'Daily Duty', path: '/dashboard/duties' },
                { icon: Car, label: 'Traffic Duty', path: '/dashboard/duties' },
                { icon: Clock, label: 'Night Patrol', path: '/dashboard/duties' },
                { icon: Users, label: 'Reserve Force', path: '/dashboard/duties' },
              ]
            },
            {
              name: 'Security & Law',
              items: [
                { icon: Shield, label: 'VIP Duty', badge: 'High', path: '/dashboard/duties' },
                { icon: Target, label: 'Law & Order', path: '/dashboard/duties' },
              ]
            },
            {
              name: 'Event Duties',
              items: [
                { icon: Users, label: 'Election Duty', path: '/dashboard/duties' },
                { icon: Calendar, label: 'Festival Duty', path: '/dashboard/duties' },
              ]
            },
            {
              name: 'Legal/Emergency Services',
              items: [
                { icon: FileText, label: 'Court Duty', path: '/dashboard/duties' },
                { icon: ShieldAlert, label: 'Emergency Response', badge: 'Urgent', path: '/dashboard/duties' },
              ]
            }
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
    }
  };

  const menuGroups = getMenuGroups();

  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#000a17] flex overflow-hidden font-sans">

      {/* Enterprise Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0 -translate-x-full'} transition-all duration-300 flex-shrink-0 bg-gradient-to-b from-[#1a1c29] to-[#0a0a0f] border-r border-white/10 text-white h-screen flex flex-col z-30 absolute md:relative`}>
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9933] to-[#ffaa55] flex items-center justify-center shadow-lg shadow-[#FF9933]/20">
              <Shield size={22} className="text-[#001229]" />
            </div>
            <div className="flex-1 overflow-hidden pr-2">
              <h1 className="font-heading font-extrabold tracking-wide text-lg leading-tight text-white flex items-baseline gap-1.5 truncate">
                KARTAVYA AI <span className="text-sm font-medium text-[#FF9933] font-sans tracking-normal opacity-90 truncate">(कर्तव्य AI)</span>
              </h1>
              <p className="text-[10px] text-white/60 font-semibold tracking-wider uppercase leading-snug mt-1 whitespace-normal break-words w-full" title="Key Attendance, Roster, Tracking, And Verification Yield Assistant">
                Key Attendance, Roster, Tracking, And Verification Yield Assistant
              </p>
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
          {menuGroups.map((group, gIdx) => {
            const isGroupExpanded = expandedGroups[group.title] !== false;
            return (
              <div key={gIdx}>
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-4 mb-2 cursor-pointer group outline-none"
                >
                  <p className="text-[11px] font-bold text-white/40 tracking-wider group-hover:text-white/70 transition-colors uppercase">{group.title}</p>
                  <ChevronDown size={14} className={`text-white/40 group-hover:text-white/70 transition-transform duration-300 ${isGroupExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isGroupExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>

                  {group.items && (
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
                        );
                      })}
                    </ul>
                  )}

                  {group.categories && (
                    <div className="space-y-4 mt-2">
                      {group.categories.map((category, cIdx) => (
                        <div key={cIdx}>
                          <p className="px-4 text-[10px] font-semibold text-[#FF9933]/60 uppercase tracking-wider mb-1.5">{category.name}</p>
                          <ul className="space-y-1 border-l border-white/5 ml-5 pl-2">
                            {category.items.map((item, idx) => {
                              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
                              return (
                                <li key={idx}>
                                  <Link to={item.path} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm font-medium ${isActive ? 'bg-[#FF9933]/10 text-[#FF9933]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                                    <div className="flex items-center gap-3">
                                      <item.icon size={16} className={isActive ? 'text-[#FF9933]' : 'text-white/40'} />
                                      <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] py-0.5 px-1.5 rounded-full font-bold uppercase tracking-wider">
                                        {item.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )
          })}
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
          <Route path="/my-duties" element={<PersonalDuties />} />
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

const ChevronRightIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
