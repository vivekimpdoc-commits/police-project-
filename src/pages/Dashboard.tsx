import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LogOut, User, Bell, CheckSquare, FileText, BarChart2, 
  Calendar, Briefcase, FileDown, Download, AlertTriangle, 
  HelpCircle, Menu, X, Shield, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { userData, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'User Profile' },
    { icon: Bell, label: 'Notifications', badge: 3 },
    { icon: CheckSquare, label: "Today's Tasks" },
    { icon: AlertTriangle, label: 'Pending Requests', badge: 5 },
    { icon: FileText, label: 'Reports' },
    { icon: BarChart2, label: 'Analytics' },
    { icon: Calendar, label: 'Attendance' },
    { icon: Briefcase, label: 'Duty Assignment' },
    { icon: FileDown, label: 'Circulars' },
    { icon: Download, label: 'Downloads' },
    { icon: Shield, label: 'Complaint Management' },
    { icon: HelpCircle, label: 'Help Desk' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'} transition-all duration-300 flex-shrink-0 bg-[var(--color-primary)] text-white h-screen overflow-y-auto z-20 absolute md:relative`}>
        <div className="p-4 flex items-center justify-between sticky top-0 bg-[var(--color-primary)] border-b border-[var(--color-primary-light)] z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
               <span className="font-heading font-bold text-[var(--color-primary)] text-xs">PNO</span>
            </div>
            <span className="font-heading font-bold tracking-wide">UP POLICE</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-[var(--color-primary-light)] text-center">
           <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-2 overflow-hidden border-2 border-[var(--color-accent)]">
             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.fullName || 'User'}`} alt="Profile" />
           </div>
           <h3 className="font-medium text-sm">{userData?.fullName || 'Officer Name'}</h3>
           <span className="text-xs text-[var(--color-accent)]">{userData?.role || 'PNO Officer'}</span>
        </div>

        <nav className="p-2 space-y-1">
          {menuItems.map((item, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-primary-light)] transition-colors text-sm text-left">
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-[var(--color-accent)]" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs py-0.5 px-2 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors text-sm text-left mt-8">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col">
        {/* Header */}
        <header className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-10 flex items-center justify-between p-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[var(--color-glass-border)] rounded-lg transition-colors">
              <Menu size={20} />
            </button>
            <h1 className="font-heading font-semibold text-lg hidden sm:block">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
              <input type="text" placeholder="Search..." className="input-field py-1.5 pl-9 w-64 bg-[var(--color-bg-card)] text-sm" />
            </div>
            <button onClick={toggleTheme} className="p-2 hover:bg-[var(--color-glass-border)] rounded-full transition-colors">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="w-8 h-8 rounded-full border border-[var(--color-accent)] overflow-hidden cursor-pointer">
               <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.fullName || 'User'}`} alt="Profile" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 pt-0 flex-1">
          <div className="mb-8">
             <h2 className="text-2xl font-bold font-heading mb-2 text-[var(--color-primary)] dark:text-[var(--color-accent)]">
               Welcome back, {userData?.fullName || 'Officer'}
             </h2>
             <p className="text-[var(--color-text-muted)] text-sm">
               Here is what's happening today in the {userData?.district || 'Central'} District.
             </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Pending Cases', value: '142', color: 'border-l-4 border-yellow-500' },
              { label: 'Resolved Today', value: '28', color: 'border-l-4 border-green-500' },
              { label: 'Active Personnel', value: '450', color: 'border-l-4 border-blue-500' },
              { label: 'High Priority Alerts', value: '3', color: 'border-l-4 border-red-500' },
            ].map((stat, idx) => (
              <div key={idx} className={`glass-card p-6 ${stat.color}`}>
                <p className="text-[var(--color-text-muted)] text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6 min-h-[300px]">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-heading font-semibold text-lg">Recent Activities</h3>
                 <button className="text-sm text-[var(--color-accent)] hover:underline">View All</button>
               </div>
               
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-start gap-4 p-3 hover:bg-[var(--color-glass-border)] rounded-lg transition-colors cursor-pointer">
                     <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-white flex-shrink-0">
                       <FileText size={18} />
                     </div>
                     <div>
                       <p className="text-sm font-medium">FIR Report #{1024 + i} generated</p>
                       <p className="text-xs text-[var(--color-text-muted)]">By Officer Ramesh • {i * 15} mins ago</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="glass-card p-6">
               <h3 className="font-heading font-semibold text-lg mb-6">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-4">
                 <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors">
                   <UserPlus size={24} className="text-[var(--color-accent)]" />
                   <span className="text-xs font-medium text-center">Add Personnel</span>
                 </button>
                 <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors">
                   <FileText size={24} className="text-[var(--color-accent)]" />
                   <span className="text-xs font-medium text-center">New Report</span>
                 </button>
                 <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors">
                   <AlertTriangle size={24} className="text-red-400" />
                   <span className="text-xs font-medium text-center">Emergency</span>
                 </button>
                 <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors">
                   <Briefcase size={24} className="text-[var(--color-accent)]" />
                   <span className="text-xs font-medium text-center">Assign Duty</span>
                 </button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
