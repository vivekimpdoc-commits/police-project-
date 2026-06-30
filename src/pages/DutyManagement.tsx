import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Briefcase, MapPin, Clock, Calendar, CheckCircle, 
  AlertTriangle, MoreVertical, Shield, ChevronDown, Download, Users, 
  Car, Radio, ArrowRight, ArrowLeft, Target, ShieldAlert, FileText, Check,
  ThumbsUp, Eye, ShieldCheck, UserCheck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const INITIAL_DUTIES = [
  // Hazratganj
  { id: 'DTY-9021', category: 'VIP Duty', name: 'CM Airport Escort', date: '2026-06-30', shift: 'Morning', district: 'Lucknow', station: 'Hazratganj', staff: 24, status: 'Active (Approved)', approvalStage: 4, priority: 'Critical' },
  { id: 'DTY-9022', category: 'Law & Order', name: 'Hazratganj Protest', date: '2026-06-29', shift: 'Evening', district: 'Lucknow', station: 'Hazratganj', staff: 12, status: 'Pending SHO', approvalStage: 1, priority: 'High' },
  { id: 'DTY-9023', category: 'Traffic Duty', name: 'Hazratganj Chauraha Check', date: '2026-07-01', shift: 'Morning', district: 'Lucknow', station: 'Hazratganj', staff: 6, status: 'Pending District', approvalStage: 2, priority: 'Medium' },
  { id: 'DTY-9024', category: 'Night Patrol', name: 'Sector 4 Area Patrol', date: '2026-06-29', shift: 'Night', district: 'Lucknow', station: 'Hazratganj', staff: 6, status: 'Monitoring (Zone)', approvalStage: 3, priority: 'Medium' },
  { id: 'DTY-9026', category: 'Court Duty', name: 'High Court Security', date: '2026-06-30', shift: 'Morning', district: 'Lucknow', station: 'Hazratganj', staff: 4, status: 'Monitoring (Zone)', approvalStage: 3, priority: 'Medium' },
  { id: 'DTY-9029', category: 'VIP Duty', name: 'Governor House Guard', date: '2026-07-01', shift: 'Morning', district: 'Lucknow', station: 'Hazratganj', staff: 15, status: 'Pending SHO', approvalStage: 1, priority: 'High' },
  
  // Gomti Nagar
  { id: 'DTY-8011', category: 'Traffic Duty', name: 'Marine Drive Diversion', date: '2026-07-01', shift: 'Evening', district: 'Lucknow', station: 'Gomti Nagar', staff: 8, status: 'Active (Approved)', approvalStage: 4, priority: 'Medium' },
  { id: 'DTY-8012', category: 'VIP Duty', name: 'Minister Residence Security', date: '2026-06-29', shift: 'Morning', district: 'Lucknow', station: 'Gomti Nagar', staff: 12, status: 'Active (Approved)', approvalStage: 4, priority: 'High' },
  { id: 'DTY-8013', category: 'Night Patrol', name: 'Vikas Khand Patrol', date: '2026-06-30', shift: 'Night', district: 'Lucknow', station: 'Gomti Nagar', staff: 4, status: 'Pending SHO', approvalStage: 1, priority: 'Low' },
  
  // Chowk
  { id: 'DTY-7011', category: 'Law & Order', name: 'Old City Strike Control', date: '2026-07-02', shift: 'Evening', district: 'Lucknow', station: 'Chowk', staff: 20, status: 'Active (Approved)', approvalStage: 4, priority: 'High' },
  { id: 'DTY-7012', category: 'Festival Duty', name: 'Procession Route Security', date: '2026-07-10', shift: 'Evening', district: 'Lucknow', station: 'Chowk', staff: 45, status: 'Pending District', approvalStage: 2, priority: 'Critical' },
  
  // Alambagh
  { id: 'DTY-6011', category: 'Emergency', name: 'Highway Accident Response', date: '2026-06-29', shift: 'Night', district: 'Lucknow', station: 'Alambagh', staff: 8, status: 'Active (Approved)', approvalStage: 4, priority: 'Critical' },
  { id: 'DTY-6012', category: 'Reserve Force', name: 'Bus Stand QRT', date: '2026-06-30', shift: 'Custom', district: 'Lucknow', station: 'Alambagh', staff: 25, status: 'Monitoring (Zone)', approvalStage: 3, priority: 'High' },
];

export const DutyManagement: React.FC = () => {
  const { userData } = useAuth();
  const userRole = userData?.role || 'Constable';

  const storedThana = localStorage.getItem('demoThana') || 'Hazratganj';
  const storedDistrict = localStorage.getItem('demoDistrict') || 'Lucknow';

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create'
  const [duties, setDuties] = useState(() => {
    // TRUE FILTERING: Only show duties assigned to the logged-in Thana
    return INITIAL_DUTIES.filter(d => d.station === storedThana).map(d => ({...d, district: storedDistrict}));
  });
  
  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [dutyCategory, setDutyCategory] = useState('Law & Order');
  const [expandedDuty, setExpandedDuty] = useState<string | null>(null);
  
  // Filtering State
  const [activeCategory, setActiveCategory] = useState('Law & Order');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    if (status.includes('Approved') || status.includes('Active')) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (status.includes('Pending')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    if (status.includes('Monitoring')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const nextStep = () => setWizardStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setWizardStep(prev => Math.max(prev - 1, 1));

  // Hierarchy Logic
  const canApprove = (stage: number) => {
    if (userRole === 'SHO' && stage === 1) return true;
    if (userRole === 'District Admin' && stage === 2) return true;
    return false;
  };

  const handleApprove = (id: string, currentStage: number) => {
    setDuties(duties.map(d => {
      if (d.id === id) {
        if (currentStage === 1) return { ...d, approvalStage: 2, status: 'Pending District' };
        if (currentStage === 2) return { ...d, approvalStage: 3, status: 'Monitoring (Zone)' };
      }
      return d;
    }));
  };

  const renderApprovalPipeline = (stage: number) => {
    const steps = [
      { num: 0, label: 'Constable Request', icon: UserCheck },
      { num: 1, label: 'SHO Approval', icon: ShieldCheck },
      { num: 2, label: 'District Admin', icon: CheckCircle2 },
      { num: 3, label: 'Range/Zone Monitor', icon: Eye },
      { num: 4, label: 'State HQ (Active)', icon: Shield }
    ];

    return (
      <div className="flex items-center w-full max-w-3xl mx-auto py-6">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
             <div className="flex flex-col items-center gap-2 relative z-10 w-24">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  stage >= step.num 
                    ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                    : stage === step.num - 1 
                      ? 'bg-amber-500 border-amber-500 text-[#001229] shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
                      : 'bg-white dark:bg-[#001229] border-gray-300 dark:border-white/20 text-gray-400 dark:text-white/30'
                }`}>
                  <step.icon size={18} />
                </div>
                <span className={`text-[10px] text-center font-bold uppercase tracking-wider ${stage >= step.num ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-white/40'}`}>
                  {step.label}
                </span>
             </div>
             {idx < steps.length - 1 && (
               <div className="flex-1 h-1 bg-gray-200 dark:bg-white/10 relative -mt-5 mx-2 rounded-full overflow-hidden">
                 <div className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-700`} style={{ width: stage > step.num ? '100%' : '0%' }}></div>
               </div>
             )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
         <div>
           <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-1 flex items-center gap-3">
             <Briefcase className="text-[#FF9933]" size={32} />
             Duty Management Dashboard
           </h2>
           <p className="text-gray-500 dark:text-white/60 text-sm mt-2 flex items-center gap-2">
             Logged in as: <span className="px-2 py-0.5 bg-white/10 rounded-md font-bold text-white border border-white/20">{userData?.fullName} ({userRole})</span>
           </p>
         </div>
         <div className="flex items-center gap-3">
           {['Constable', 'SHO'].includes(userRole) && (
             <button 
               onClick={() => { setActiveTab('create'); setWizardStep(1); }}
               className="px-5 py-2.5 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2"
             >
               <Plus size={16} /> Request New Deployment
             </button>
           )}
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab('list')}
          className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'list' ? 'border-[#FF9933] text-[#FF9933]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white'}`}
        >
          Hierarchy Approval Queue
        </button>
        {['Constable', 'SHO'].includes(userRole) && (
          <button 
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'create' ? 'border-[#FF9933] text-[#FF9933]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white'}`}
          >
            Advanced Duty Entry
          </button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden animate-fade-in">
           {/* Filters */}
           {/* Main Content Area with Sidebar */}
           <div className="flex flex-col md:flex-row min-h-[600px]">
              
              {/* Left Sub-Menu Sidebar (Dark Orange Theme) */}
              <div className="w-full md:w-64 bg-gradient-to-b from-[#1a1c29] to-[#0a0a0f] border-r border-white/5 p-4 shrink-0 rounded-bl-2xl overflow-y-auto shadow-inner">
                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Duty Management</h3>
                 
                 <div className="mb-4">
                   <button 
                     onClick={() => setActiveCategory('All')}
                     className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between group
                       ${activeCategory === 'All' 
                         ? 'bg-[#FF9933]/20 text-[#FF9933] border border-[#FF9933]/50 shadow-md' 
                         : 'bg-white/5 text-white/90 hover:bg-white/10 hover:text-white border border-white/10'
                       }`}
                   >
                     <span className="flex items-center gap-3">
                       <Briefcase size={16} className={activeCategory === 'All' ? 'text-[#FF9933]' : 'text-white/70 group-hover:text-white'} />
                       All Duties
                     </span>
                   </button>
                 </div>

                 <div className="space-y-4">
                   {[
                     { name: 'Regular Duties', items: ['Daily Duty', 'Traffic Duty', 'Night Patrol', 'Reserve Force'] },
                     { name: 'Security & Law', items: ['VIP Duty', 'Law & Order'] },
                     { name: 'Event Duties', items: ['Election Duty', 'Festival Duty'] },
                     { name: 'Legal/Emergency Services', items: ['Court Duty', 'Emergency Response'] }
                   ].map((group, gIdx) => (
                     <div key={gIdx}>
                       <p className="px-2 text-[10px] font-semibold text-[#FF9933]/60 uppercase tracking-wider mb-2">{group.name}</p>
                       <div className="space-y-2">
                         {group.items.map(cat => {
                            const isActive = activeCategory === cat;
                            return (
                              <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between group
                                  ${isActive 
                                    ? 'bg-[#FF9933]/20 text-[#FF9933] border border-[#FF9933]/50 shadow-md' 
                                    : 'bg-white/5 text-white/90 hover:bg-white/10 hover:text-white border border-white/10'
                                  }`}
                              >
                                <span className="flex items-center gap-3">
                                  {cat === 'VIP Duty' && <Shield size={16} className={isActive ? 'text-[#FF9933]' : 'text-white/70 group-hover:text-white'} />}
                                  {cat === 'Law & Order' && <Target size={16} className={isActive ? 'text-[#FF9933]' : 'text-white/70 group-hover:text-white'} />}
                                  {cat === 'Traffic Duty' && <Car size={16} className={isActive ? 'text-[#FF9933]' : 'text-white/70 group-hover:text-white'} />}
                                  {cat === 'Night Patrol' && <Clock size={16} className={isActive ? 'text-[#FF9933]' : 'text-white/70 group-hover:text-white'} />}
                                  {cat === 'Election Duty' && <Users size={16} className={isActive ? 'text-[#FF9933]' : 'text-white/70 group-hover:text-white'} />}
                                  {cat === 'Festival Duty' && <Calendar size={16} className={isActive ? 'text-[#FF9933]' : 'text-white/70 group-hover:text-white'} />}
                                  {cat === 'Emergency Response' && <AlertTriangle size={16} className={isActive ? 'text-[#FF9933]' : 'text-white/70 group-hover:text-white'} />}
                                  {['Daily Duty', 'Court Duty', 'Reserve Force'].includes(cat) && <FileText size={16} className={isActive ? 'text-[#FF9933]' : 'text-white/70 group-hover:text-white'} />}
                                  
                                  {cat}
                                </span>
                                
                                {cat === 'VIP Duty' && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${isActive ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-500/10 text-red-500/70 border-red-500/20'}`}>HIGH</span>}
                              </button>
                            );
                         })}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Right Side Table Area */}
              <div className="flex-1 flex flex-col min-w-0">
                 {/* Search & Top Filters */}
                 <div className="p-4 border-b border-gray-100 dark:border-white/10 flex flex-wrap gap-4 bg-white dark:bg-transparent items-center justify-between">
                    <div className="relative max-w-sm w-full">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                       <input 
                         type="text" 
                         placeholder={`Search ${activeCategory === 'All' ? '' : activeCategory} duties...`}
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-[#FF9933] outline-none dark:text-white transition-colors" 
                       />
                    </div>
                    <button className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2">
                       <Filter size={16} /> Advanced Filter
                    </button>
                 </div>

           {/* Table */}
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="text-xs uppercase text-gray-500 dark:text-white/40 bg-gray-50 dark:bg-transparent border-b border-gray-100 dark:border-white/5">
                   <th className="p-4 font-semibold w-10"></th>
                   <th className="p-4 font-semibold">Duty Details</th>
                   <th className="p-4 font-semibold">Location</th>
                   <th className="p-4 font-semibold">Personnel</th>
                   <th className="p-4 font-semibold">Hierarchy Status</th>
                   <th className="p-4 font-semibold text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="text-sm divide-y divide-gray-100 dark:divide-white/5">
                 {duties
                    .filter(d => activeCategory === 'All' || d.category === activeCategory)
                    .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase()) || d.station.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((duty) => (
                   <React.Fragment key={duty.id}>
                     <tr className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${expandedDuty === duty.id ? 'bg-gray-50 dark:bg-white/5' : ''}`} onClick={() => setExpandedDuty(expandedDuty === duty.id ? null : duty.id)}>
                       <td className="p-4 text-gray-400">
                         <ChevronRight size={18} className={`transition-transform ${expandedDuty === duty.id ? 'rotate-90' : ''}`} />
                       </td>
                       <td className="p-4">
                          <div className="font-bold text-gray-800 dark:text-white">{duty.name}</div>
                          <div className="text-xs text-gray-500 dark:text-white/50 mt-0.5">{duty.id} • {duty.category}</div>
                       </td>
                       <td className="p-4">
                          <div className="flex items-center gap-1.5 text-gray-800 dark:text-white/90 font-medium mb-1">
                            <MapPin size={14} className="text-gray-400" /> {duty.station}
                          </div>
                       </td>
                       <td className="p-4">
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                             {duty.staff}
                           </div>
                         </div>
                       </td>
                       <td className="p-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(duty.status)}`}>
                           {duty.status}
                         </span>
                       </td>
                       <td className="p-4 text-right">
                         {canApprove(duty.approvalStage) ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleApprove(duty.id, duty.approvalStage); }}
                              className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold shadow-md transition-colors flex items-center gap-1 ml-auto"
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                         ) : (
                            <span className="text-xs text-gray-400 italic">No Action Needed</span>
                         )}
                       </td>
                     </tr>
                     
                     {/* Expanded Row for Hierarchy Pipeline View */}
                     {expandedDuty === duty.id && (
                       <tr>
                         <td colSpan={6} className="p-0 border-b-2 border-[#FF9933]/30">
                           <div className="bg-gray-50/80 dark:bg-black/40 p-6 shadow-inner animate-fade-in">
                              <h4 className="text-sm font-bold text-gray-700 dark:text-white/80 mb-4 text-center tracking-wider">APPROVAL PIPELINE</h4>
                              {renderApprovalPipeline(duty.approvalStage)}
                              
                              {canApprove(duty.approvalStage) && (
                                <div className="mt-6 flex justify-center">
                                   <button 
                                      onClick={() => handleApprove(duty.id, duty.approvalStage)}
                                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-extrabold shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                      <ThumbsUp size={18} /> Approve Deployment (As {userRole})
                                    </button>
                                </div>
                              )}
                              
                              {/* Force Assignment Section for SHO */}
                              {userRole === 'SHO' && duty.status.includes('Active') && (
                                <div className="mt-8 border-t border-gray-200 dark:border-white/10 pt-6 text-left animate-fade-in" style={{animationDelay: '150ms'}}>
                                  <h5 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                                    <Users size={18} className="text-[#FF9933]" />
                                    Assign Personnel to this Deployment
                                  </h5>
                                  <div className="bg-white dark:bg-[#001229] rounded-xl p-5 border border-gray-200 dark:border-white/10">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                      <p className="text-sm text-gray-500 dark:text-white/60">
                                        You need to deploy <strong className="text-gray-900 dark:text-white">{duty.staff}</strong> officers. Select available officers from your Thana:
                                      </p>
                                      <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-md text-xs font-bold">
                                        1/{duty.staff} Assigned
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <select className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-sm outline-none text-gray-900 dark:text-white">
                                        <option className="text-gray-900 dark:text-white bg-white dark:bg-[#001229]">Select Officer...</option>
                                        <option className="text-gray-900 dark:text-white bg-white dark:bg-[#001229]">Constable Rahul Singh</option>
                                        <option className="text-gray-900 dark:text-white bg-white dark:bg-[#001229]">Constable Amit Kumar</option>
                                        <option className="text-gray-900 dark:text-white bg-white dark:bg-[#001229]">Sub Inspector Vikram</option>
                                      </select>
                                      <button className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-[#001229] rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 shrink-0">
                                        <Plus size={16} /> Add to Duty
                                      </button>
                                    </div>
                                    <div className="mt-5 flex gap-2 flex-wrap">
                                      {/* Assigned officers chips */}
                                      <span className="px-3 py-1.5 bg-[#FF9933]/10 border border-[#FF9933]/20 text-[#FF9933] rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#FF9933]/20 transition-colors cursor-pointer group">
                                        Constable Ramesh <X size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                           </div>
                         </td>
                       </tr>
                     )}
                   </React.Fragment>
                 ))}
               </tbody>
             </table>
              </div>
           </div>
        </div>
      </div>
      )}

      {/* CREATE TAB - Kept exact same wizard code */}
      {activeTab === 'create' && (
        <div className="max-w-5xl mx-auto animate-fade-in pb-12">
           
           {/* Wizard Progress */}
           <div className="flex justify-between items-center mb-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-white/10 -z-10 -translate-y-1/2 rounded"></div>
              {[
                { step: 1, label: 'Duty Type & Basics', icon: Briefcase },
                { step: 2, label: 'Location & Time', icon: MapPin },
                { step: 3, label: 'Personnel & Gear', icon: Users },
                { step: 4, label: 'Review & Send to SHO', icon: CheckCircle }
              ].map(s => (
                <div key={s.step} className="flex flex-col items-center gap-2">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${wizardStep > s.step ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : wizardStep === s.step ? 'bg-[#FF9933] text-[#001229] shadow-lg shadow-[#FF9933]/30 scale-110' : 'bg-white dark:bg-[#001229] text-gray-400 dark:text-white/30 border-2 border-gray-200 dark:border-white/10'}`}>
                     {wizardStep > s.step ? <Check size={20} /> : <s.icon size={20} />}
                   </div>
                   <span className={`text-xs font-bold ${wizardStep >= s.step ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-white/40'}`}>{s.label}</span>
                </div>
              ))}
           </div>

           {/* Wizard Form Container */}
           <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden min-h-[400px] flex flex-col relative">
             
             {/* Dynamic Top Bar */}
             <div className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  {wizardStep === 1 ? <Briefcase size={20}/> : wizardStep === 2 ? <MapPin size={20}/> : wizardStep === 3 ? <ShieldAlert size={20}/> : <FileText size={20}/>}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg dark:text-white">
                    {wizardStep === 1 && "Step 1: Select Duty Category & Basic Details"}
                    {wizardStep === 2 && "Step 2: Pinpoint Location & Schedule"}
                    {wizardStep === 3 && "Step 3: Allocate Force & Equipment"}
                    {wizardStep === 4 && "Step 4: Final Review & Submit"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-white/50">
                    {wizardStep === 1 && "Choose the right classification for accurate resource allocation."}
                    {wizardStep === 2 && "Where and when will this duty take place?"}
                    {wizardStep === 3 && "Assign officers, vehicles, and weapons to this duty."}
                    {wizardStep === 4 && "Verify details before sending to SHO for approval."}
                  </p>
                </div>
             </div>

             {/* Form Area */}
             <div className="p-6 lg:p-8 flex-1 bg-white dark:bg-transparent">
                
                {/* STEP 1: BASICS */}
                {wizardStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    
                    <div>
                      <label className="text-sm font-bold text-gray-700 dark:text-white/80 mb-3 block">1. Select Duty Classification</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Law & Order', 'VIP Escort', 'Traffic Check', 'Night Patrol', 'Election Duty', 'Court Duty', 'Festival Guard', 'Emergency'].map(cat => (
                          <div 
                            key={cat} 
                            onClick={() => setDutyCategory(cat)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${dutyCategory === cat ? 'border-[#FF9933] bg-[#FF9933]/10 shadow-[0_0_15px_rgba(255,153,51,0.15)]' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                          >
                            <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center ${dutyCategory === cat ? 'bg-[#FF9933] text-[#001229]' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/50'}`}>
                               <Target size={14} />
                            </div>
                            <h4 className={`font-bold text-sm ${dutyCategory === cat ? 'text-[#FF9933]' : 'text-gray-700 dark:text-white/70'}`}>{cat}</h4>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div>
                        <label className="text-sm font-bold text-gray-700 dark:text-white/80 mb-2 block">Duty Name / Code Name</label>
                        <input type="text" placeholder="e.g., Operation Sunrise" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#FF9933]/50 outline-none text-gray-900 dark:text-white transition-all" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 dark:text-white/80 mb-2 block">Priority Level</label>
                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#FF9933]/50 outline-none text-gray-900 dark:text-white transition-all appearance-none">
                          <option className="text-gray-900 dark:text-white bg-white dark:bg-[#001229]">🟢 Low Priority</option>
                          <option className="text-gray-900 dark:text-white bg-white dark:bg-[#001229]">🟡 Medium Priority</option>
                          <option className="text-gray-900 dark:text-white bg-white dark:bg-[#001229]">🟠 High Priority</option>
                          <option className="text-gray-900 dark:text-white bg-white dark:bg-[#001229]">🔴 CRITICAL EMERGENCY</option>
                        </select>
                      </div>
                    </div>

                  </div>
                )}

                {/* STEP 2: LOCATION */}
                {wizardStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       
                       <div className="space-y-6">
                         <div>
                           <label className="text-sm font-bold text-gray-700 dark:text-white/80 mb-2 block">District & Police Station</label>
                           <div className="flex gap-4">
                             <input disabled value={storedDistrict} type="text" className="flex-1 px-4 py-3 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl outline-none text-gray-500 dark:text-white/50 cursor-not-allowed" />
                             <input disabled value={storedThana} type="text" className="flex-1 px-4 py-3 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl outline-none text-gray-500 dark:text-white/50 cursor-not-allowed" />
                           </div>
                         </div>
                         
                         <div>
                           <label className="text-sm font-bold text-gray-700 dark:text-white/80 mb-2 block">Schedule Dates</label>
                           <div className="flex items-center gap-4">
                             <input type="date" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none text-gray-900 dark:text-white" />
                             <span className="text-gray-400">to</span>
                             <input type="date" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none text-gray-900 dark:text-white" />
                           </div>
                         </div>

                         <div>
                           <label className="text-sm font-bold text-gray-700 dark:text-white/80 mb-2 block">Shift Timing</label>
                           <div className="flex gap-2">
                             {['Morning', 'Evening', 'Night Patrol', 'Custom'].map(shift => (
                               <button key={shift} className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-[#FF9933]/10 hover:text-[#FF9933] hover:border-[#FF9933] transition-colors">{shift}</button>
                             ))}
                           </div>
                         </div>
                       </div>

                       <div>
                         <label className="text-sm font-bold text-gray-700 dark:text-white/80 mb-2 block">Pinpoint Exact Location</label>
                         <div className="w-full h-[250px] bg-gray-200 dark:bg-white/5 rounded-xl border border-gray-300 dark:border-white/10 relative overflow-hidden flex items-center justify-center group cursor-crosshair">
                            {/* Mock Map */}
                            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Lucknow,UP&zoom=14&size=600x300&maptype=roadmap&sensor=false')] bg-cover bg-center opacity-60 mix-blend-luminosity transition-transform group-hover:scale-105 duration-700"></div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-[#001229] to-transparent opacity-50"></div>
                            
                            <div className="relative z-10 flex flex-col items-center">
                               <MapPin size={40} className="text-[#FF9933] drop-shadow-xl animate-bounce" />
                               <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full mt-2 text-white text-xs font-bold border border-white/20 shadow-lg">
                                 Click map to drop pin
                               </div>
                            </div>
                         </div>
                       </div>

                    </div>
                  </div>
                )}

                {/* STEP 3: PERSONNEL & GEAR */}
                {wizardStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex gap-4 items-start">
                       <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                         <Target size={20} />
                       </div>
                       <div>
                         <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">Smart Suggestion Active</h4>
                         <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">For <b>{dutyCategory}</b>, system recommends: 1 Team Leader, 4 Constables, 1 Bolero Vehicle, and Anti-Riot Gear.</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700 dark:text-white/80 block border-b border-gray-200 dark:border-white/10 pb-2">Assign Officers</label>
                        
                        <div>
                           <p className="text-xs text-gray-500 mb-2 font-medium">Team Leader In-charge</p>
                           <div className="flex items-center gap-3 p-3 border border-[#FF9933]/50 bg-[#FF9933]/5 rounded-xl">
                             <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
                               <img src="https://api.dicebear.com/7.x/initials/svg?seed=Inspector&backgroundColor=002147" alt="Profile" />
                             </div>
                             <div className="flex-1">
                               <p className="font-bold text-sm dark:text-white">Insp. Rajesh Kumar</p>
                               <p className="text-xs text-gray-500">PNO: UP-9921 • Available</p>
                             </div>
                             <button className="text-xs font-bold text-[#FF9933] bg-white dark:bg-[#001229] px-3 py-1.5 rounded-lg border border-[#FF9933]/20 shadow-sm hover:bg-[#FF9933] hover:text-white transition-colors">Change</button>
                           </div>
                        </div>

                        <div>
                           <p className="text-xs text-gray-500 mb-2 font-medium">Add Force (Staff Count)</p>
                           <div className="flex gap-2">
                             <input type="number" defaultValue="4" className="w-20 px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none dark:text-white text-center font-bold" />
                             <button className="flex-1 bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 hover:border-[#FF9933] hover:bg-[#FF9933]/5 transition-colors rounded-xl text-sm font-semibold dark:text-white/70 flex items-center justify-center gap-2">
                               <Plus size={16} /> Auto-Select Available Constables
                             </button>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700 dark:text-white/80 block border-b border-gray-200 dark:border-white/10 pb-2">Logistics & Gear</label>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20">
                             <div className="flex items-center justify-between mb-2">
                               <Car size={16} className="text-gray-500" />
                               <input type="checkbox" defaultChecked className="accent-[#FF9933]" />
                             </div>
                             <p className="font-bold text-sm dark:text-white">Vehicles</p>
                             <p className="text-xs text-gray-500">1 PCR Bolero</p>
                           </div>
                           
                           <div className="p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20">
                             <div className="flex items-center justify-between mb-2">
                               <Radio size={16} className="text-gray-500" />
                               <input type="checkbox" defaultChecked className="accent-[#FF9933]" />
                             </div>
                             <p className="font-bold text-sm dark:text-white">Comms</p>
                             <p className="text-xs text-gray-500">5 Wireless Sets</p>
                           </div>

                           <div className="p-3 border border-[#FF9933]/30 rounded-xl bg-[#FF9933]/5 col-span-2 flex justify-between items-center cursor-pointer hover:bg-[#FF9933]/10 transition-colors">
                             <div className="flex items-center gap-3">
                               <div className="p-2 bg-white dark:bg-[#001229] rounded-lg shadow-sm"><ShieldAlert size={16} className="text-[#FF9933]" /></div>
                               <div>
                                 <p className="font-bold text-sm dark:text-white">Specialized Weapons / Gear</p>
                                 <p className="text-xs text-gray-500">Click to add riot gear, rifles, etc.</p>
                               </div>
                             </div>
                             <Plus size={18} className="text-gray-400" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW */}
                {wizardStep === 4 && (
                  <div className="animate-fade-in flex flex-col items-center text-center max-w-lg mx-auto py-8">
                     <div className="w-20 h-20 rounded-full bg-amber-500/10 border-4 border-amber-500/30 flex items-center justify-center mb-6">
                       <CheckCircle size={40} className="text-amber-500" />
                     </div>
                     <h3 className="text-2xl font-bold font-heading dark:text-white mb-2">Ready to Submit for Approval</h3>
                     <p className="text-sm text-gray-500 dark:text-white/60 mb-8">
                       The duty roster for <b>{dutyCategory}</b> has been compiled. It will now be sent to your SHO for the first level of approval.
                     </p>
                     
                     <div className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-left space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-3">
                          <span className="text-sm text-gray-500 font-semibold">Total Force</span>
                          <span className="font-bold dark:text-white text-lg">5 Personnel</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-3">
                          <span className="text-sm text-gray-500 font-semibold">Location</span>
                          <span className="font-bold dark:text-white text-right">{storedDistrict} - {storedThana}<br/><span className="text-xs font-normal text-gray-400">Map Pin Verified</span></span>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                          <span className="text-sm text-gray-500 font-semibold">Next Step in Hierarchy</span>
                          <span className="font-bold text-amber-500 text-sm flex items-center gap-1"><ShieldCheck size={14}/> Awaiting SHO Approval</span>
                        </div>
                     </div>
                  </div>
                )}

             </div>

             {/* Wizard Footer Controls */}
             <div className="p-5 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-between items-center mt-auto">
                {wizardStep > 1 ? (
                  <button onClick={prevStep} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                ) : <div />}
                
                {wizardStep < 4 ? (
                  <button onClick={nextStep} className="px-8 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
                    Continue to Step {wizardStep + 1} <ArrowRight size={18} />
                  </button>
                ) : (
                  <button onClick={() => { 
                      setActiveTab('list'); 
                      setWizardStep(1); 
                      setDuties([{ id: 'DTY-9099', category: dutyCategory, name: 'New Request', date: '2026-07-02', shift: 'Morning', district: storedDistrict, station: storedThana, staff: 5, status: 'Pending SHO', approvalStage: 1, priority: 'High' }, ...duties]);
                  }} className="px-10 py-3 bg-gradient-to-r from-[#FF9933] to-[#ffaa55] text-[#001229] rounded-xl text-sm font-extrabold shadow-[0_0_20px_rgba(255,153,51,0.4)] hover:scale-105 transition-all flex items-center gap-2 animate-pulse">
                    <CheckCircle size={18} /> Send to SHO for Approval
                  </button>
                )}
             </div>

           </div>
        </div>
      )}

    </div>
  );
};
