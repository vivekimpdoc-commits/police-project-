import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Briefcase, MapPin, Clock, Calendar, CheckCircle, 
  AlertTriangle, MoreVertical, Shield, ChevronDown, Download, Users, 
  Car, Radio, ArrowRight, ArrowLeft, Target, ShieldAlert, FileText, Check, X,
  ThumbsUp, Eye, ShieldCheck, UserCheck, CheckCircle2, ChevronRight, Settings,
  Activity, Info, CalendarRange, HelpCircle, Bell, RefreshCw, Layers
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ----------------------------------------------------------------------
// DATA MODELS & DEMO DATA
// ----------------------------------------------------------------------
interface Officer {
  name: string;
  rank: string;
  beltNumber: string;
  mobile: string;
  gender: string;
  station: string;
  skills: string[];
  status: 'Available' | 'On Duty' | 'On Leave';
  experienceYears: number;
}

const DEMO_OFFICERS: Officer[] = [
  { name: 'Constable Ramesh', rank: 'Constable', beltNumber: 'BELT-4421', mobile: '9876543210', gender: 'Male', station: 'Hazratganj', skills: ['Patrolling', 'Crowd Control'], status: 'Available', experienceYears: 5 },
  { name: 'Constable Suresh', rank: 'Constable', beltNumber: 'BELT-4422', mobile: '9876543211', gender: 'Male', station: 'Hazratganj', skills: ['Traffic Control', 'Lathi Charge'], status: 'On Duty', experienceYears: 4 },
  { name: 'Head Constable Sunil', rank: 'Head Constable', beltNumber: 'BELT-3190', mobile: '9876543212', gender: 'Male', station: 'Hazratganj', skills: ['Investigations', 'Night Beat Specialist'], status: 'Available', experienceYears: 12 },
  { name: 'Constable Priya', rank: 'Constable', beltNumber: 'BELT-6701', mobile: '9876543213', gender: 'Female', station: 'Hazratganj', skills: ['Comms', 'Women Desk Specialist'], status: 'On Leave', experienceYears: 3 },
  { name: 'Sub Inspector Amit Singh', rank: 'Sub Inspector', beltNumber: 'BELT-2055', mobile: '9876543214', gender: 'Male', station: 'Hazratganj', skills: ['Riot Control', 'VIP Security'], status: 'Available', experienceYears: 8 },
  { name: 'Traffic SI Anil Yadav', rank: 'Sub Inspector', beltNumber: 'BELT-5102', mobile: '9876543215', gender: 'Male', station: 'Hazratganj', skills: ['Traffic Flow Optimization', 'Accident Investigator'], status: 'On Duty', experienceYears: 10 },
  { name: 'Inspector Rajeev Kumar', rank: 'Inspector', beltNumber: 'BELT-1042', mobile: '9876543216', gender: 'Male', station: 'Hazratganj', skills: ['Tactical Planning', 'Commanding'], status: 'Available', experienceYears: 18 }
];

const DEMO_DUTY_TYPES = [
  { code: 'DT-DAILY', name: 'Daily Duty', desc: 'Routine general station duty roster' },
  { code: 'DT-GD', name: 'General Duty', desc: 'Thana entry, diary logging & station desk' },
  { code: 'DT-NIGHT', name: 'Night Patrol', desc: 'Late night neighborhood vigilance' },
  { code: 'DT-BEAT', name: 'Beat Duty', desc: 'Foot patrols in designated market beats' },
  { code: 'DT-LO', name: 'Law & Order Duty', desc: 'Protest, strike, or VIP movement assembly' },
  { code: 'DT-VIP', name: 'VIP Duty', desc: 'Dignitary escorts and high-security zones' },
  { code: 'DT-FESTIVAL', name: 'Festival Duty', desc: 'Crowd management for seasonal events' },
  { code: 'DT-TRAFFIC', name: 'Traffic Duty', desc: 'Main junction and crossing regulation' },
  { code: 'DT-COURT', name: 'Court Duty', desc: 'Prisoner escort to court hearings' },
  { code: 'DT-BANDOBAST', name: 'Bandobast Duty', desc: 'Heavy barricading & deployment' },
  { code: 'DT-EMERGENCY', name: 'Emergency Duty', desc: 'Unforeseen law/order crisis quick reaction' },
  { code: 'DT-RESERVE', name: 'Reserve Force', desc: 'Thana standby force for quick calls' },
  { code: 'DT-NAKABANDI', name: 'Nakabandi Duty', desc: 'Inter-district highway checkpoints' },
  { code: 'DT-ESCORT', name: 'Escort Duty', desc: 'Secured transport of critical assets/persons' }
];

interface PlannedDuty {
  id: string;
  type: string;
  date: string;
  time: string;
  location: string;
  strength: number;
  shift: 'Morning' | 'Evening' | 'Night';
  instructions: string;
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Published' | 'Cancelled';
  assignedStaff: string[];
}

const INITIAL_PLANNED_DUTIES: PlannedDuty[] = [
  { id: 'DUTY-001', type: 'Night Patrol', date: '2026-06-30', time: '22:00 - 06:00', location: 'Hazratganj Sector-4 Market', strength: 3, shift: 'Night', instructions: 'Maintain flashlights and keep radio active. Check locked shops.', status: 'Published', assignedStaff: ['Constable Ramesh', 'Head Constable Sunil'] },
  { id: 'DUTY-002', type: 'VIP Duty', date: '2026-07-01', time: '08:00 - 16:00', location: 'Vidhan Sabha Marg Crossing', strength: 2, shift: 'Morning', instructions: 'Riot gear and formal uniform mandatory. Guard VIP corridor.', status: 'Pending Review', assignedStaff: ['Sub Inspector Amit Singh'] },
  { id: 'DUTY-003', type: 'Traffic Duty', date: '2026-06-30', time: '14:00 - 22:00', location: 'Atal Chowk Crossing', strength: 1, shift: 'Evening', instructions: 'Manage heavy evening commuter flow.', status: 'Approved', assignedStaff: ['Traffic SI Anil Yadav'] }
];

export const DutyManagement: React.FC = () => {
  const { userData } = useAuth();
  const userRole = userData?.role || 'Constable';
  const storedThana = localStorage.getItem('demoThana') || 'Hazratganj';

  // State Management
  const [activeModule, setActiveModule] = useState<number>(1); // Modules 1 to 15
  const [wizardStep, setWizardStep] = useState(1);
  const [staffList, setStaffList] = useState<Officer[]>(DEMO_OFFICERS);
  const [plannedDuties, setPlannedDuties] = useState<PlannedDuty[]>(INITIAL_PLANNED_DUTIES);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // 4. Duty Planning Form State
  const [planType, setPlanType] = useState('Daily Duty');
  const [planDate, setPlanDate] = useState('2026-07-01');
  const [planTime, setPlanTime] = useState('08:00 - 16:00');
  const [planLocation, setPlanLocation] = useState('');
  const [planStrength, setPlanStrength] = useState(2);
  const [planShift, setPlanShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [planInstructions, setPlanInstructions] = useState('');

  // AI Assignment Factor States
  const [aiFactors, setAiFactors] = useState({
    rank: true,
    availability: true,
    previousDuty: true,
    nightRotation: true,
    experience: true,
    femaleRequirement: false,
    equalWorkload: true
  });

  // Manual Assignment Temp States
  const [selectedDutyId, setSelectedDutyId] = useState('DUTY-002');
  const [selectedOfficerName, setSelectedOfficerName] = useState('Constable Ramesh');

  // Calendar View
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');

  // Trigger AI Auto Assignment Recommendation
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Suggesting Sub Inspector Amit Singh for VIP Duty (Meets VIP training standards).",
    "Suggesting Constable Ramesh for Night Patrol (Completed 36 hours since last night shift).",
    "Alert: Constable Priya is currently on leave. Do not assign."
  ]);

  // Handle Planning Submit
  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planLocation) return alert('Please enter location.');
    
    const newPlan: PlannedDuty = {
      id: `DUTY-00${plannedDuties.length + 1}`,
      type: planType,
      date: planDate,
      time: planTime,
      location: planLocation,
      strength: planStrength,
      shift: planShift,
      instructions: planInstructions,
      status: 'Draft',
      assignedStaff: []
    };
    setPlannedDuties([newPlan, ...plannedDuties]);
    setPlanLocation('');
    setPlanInstructions('');
    alert('Duty Plan Saved as Draft!');
    setActiveModule(10); // Go to Monitoring Tab
  };

  // Handle Manual Assignment
  const handleManualAssign = () => {
    setPlannedDuties(plannedDuties.map(d => {
      if (d.id === selectedDutyId) {
        if (d.assignedStaff.includes(selectedOfficerName)) {
          alert('Officer is already assigned to this duty!');
          return d;
        }
        return { ...d, assignedStaff: [...d.assignedStaff, selectedOfficerName] };
      }
      return d;
    }));
    alert(`Assigned ${selectedOfficerName} successfully!`);
  };

  // Handle Remove Staff Manual
  const handleRemoveStaff = (dutyId: string, officerName: string) => {
    setPlannedDuties(plannedDuties.map(d => {
      if (d.id === dutyId) {
        return { ...d, assignedStaff: d.assignedStaff.filter(name => name !== officerName) };
      }
      return d;
    }));
  };

  // AI Assignment Trigger
  const triggerAIAssignment = () => {
    // Logic simulation
    let assignCount = 0;
    const updated = plannedDuties.map(d => {
      if (d.status === 'Draft' || d.status === 'Pending Review') {
        const available = staffList.filter(o => o.status === 'Available' && !d.assignedStaff.includes(o.name));
        const assignees = available.slice(0, d.strength).map(o => o.name);
        assignCount += assignees.length;
        return { ...d, assignedStaff: [...d.assignedStaff, ...assignees], status: 'Approved' as const };
      }
      return d;
    });
    setPlannedDuties(updated);
    alert(`AI Assigned ${assignCount} officers based on rank, rotation history and workloads.`);
  };

  // Handle Approval Action
  const handleApproveStatus = (id: string, newStatus: 'Draft' | 'Pending Review' | 'Approved' | 'Published' | 'Cancelled') => {
    setPlannedDuties(plannedDuties.map(d => {
      if (d.id === id) return { ...d, status: newStatus };
      return d;
    }));
  };

  // Emergency Deployment
  const triggerEmergencyForce = () => {
    const activeReserves = staffList.filter(o => o.status === 'Available').slice(0, 3);
    if (activeReserves.length === 0) return alert('No reserves available!');
    
    const emergencyDuty: PlannedDuty = {
      id: `DUTY-EM-${Date.now().toString().slice(-4)}`,
      type: 'Emergency Duty',
      date: new Date().toISOString().split('T')[0],
      time: 'Immediate - 8 Hours',
      location: 'Hazratganj Main Market (Anti-Riot Standby)',
      strength: activeReserves.length,
      shift: 'Morning',
      instructions: 'Urgent Crowd control deployment. Riot Shield + INSAS gear activated.',
      status: 'Published',
      assignedStaff: activeReserves.map(o => o.name)
    };
    setPlannedDuties([emergencyDuty, ...plannedDuties]);
    alert(`Emergency deployment published! Activated reserve officers: ${activeReserves.map(o => o.name).join(', ')}`);
  };

  // 15 Modules Sidebar Navigation Config
  const MODULES_MENU = [
    { id: 1, label: '1. Dashboard (थाना डैशबोर्ड)' },
    { id: 2, label: '2. Staff Master (बल उपलब्ध)' },
    { id: 3, label: '3. Duty Types (ड्यूटी प्रकार)' },
    { id: 4, label: '4. Duty Planning (नियोजन)' },
    { id: 5, label: '5. AI Assignment (AI आवंटन)' },
    { id: 6, label: '6. Manual Assignment (मैनुअल)' },
    { id: 7, label: '7. Duty Approval (अनुमोदन)' },
    { id: 8, label: '8. Duty Calendar (कैलेंडर)' },
    { id: 9, label: '9. Conflict Detection (टकराव)' },
    { id: 10, label: '10. Duty Monitoring (निगरानी)' },
    { id: 11, label: '11. Reserve Force (रिजर्व बल)' },
    { id: 12, label: '12. Emergency Duty (आपातकालीन)' },
    { id: 13, label: '13. AI Suggestions (सिफारिशें)' },
    { id: 14, label: '14. Search & Filters (खोज/फ़िल्टर)' },
    { id: 15, label: '15. Reports & Log (रिपोर्ट्स)' }
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-[#000a17]">
      
      {/* 15 Modules Sidebar inside the page */}
      <div className="w-64 bg-[#001229] border-r border-white/10 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Layers size={18} className="text-[#FF9933]" />
          <span className="text-white text-xs font-bold uppercase tracking-wider">Thana Duty Modules</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {MODULES_MENU.map(mod => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-all ${activeModule === mod.id ? 'bg-[#FF9933] text-[#001229] shadow-lg shadow-[#FF9933]/20' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              {mod.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Workspace for Active Module */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
        
        {/* Module Title Header */}
        <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-[#001229] dark:text-white">
              {MODULES_MENU.find(m => m.id === activeModule)?.label}
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/60">
              Station Duty Management Suite • Police Station: {storedThana}
            </p>
          </div>
          {activeModule === 12 && (
            <button onClick={triggerEmergencyForce} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold animate-pulse shadow-lg flex items-center gap-2">
              🚨 Trigger Quick Deployment
            </button>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* MODULE 1: DASHBOARD */}
        {/* ---------------------------------------------------- */}
        {activeModule === 1 && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Roster */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Today's Duty Summary</p>
                <h3 className="text-2xl font-black mt-2 text-gray-900 dark:text-white">{plannedDuties.filter(d => d.status === 'Published').length} Active</h3>
              </div>
              <div className="bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Available Force</p>
                <h3 className="text-2xl font-black mt-2 text-green-500">{staffList.filter(s => s.status === 'Available').length} Officers</h3>
              </div>
              <div className="bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Personnel on Duty</p>
                <h3 className="text-2xl font-black mt-2 text-[#FF9933]">{staffList.filter(s => s.status === 'On Duty').length} Deployed</h3>
              </div>
              <div className="bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Reserve Force</p>
                <h3 className="text-2xl font-black mt-2 text-blue-500">3 Standby</h3>
              </div>
              <div className="bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending Duty</p>
                <h3 className="text-2xl font-black mt-2 text-red-500">{plannedDuties.filter(d => d.status === 'Pending Review').length} Review</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Alerts */}
              <div className="lg:col-span-2 bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                <h3 className="font-bold font-heading text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bell size={18} className="text-red-500 animate-bounce" /> Today's Alerts (थाना अलर्ट)
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-xl text-xs text-red-700 dark:text-red-300">
                    ⚠️ <b>Conflict Detected:</b> Sub Inspector Amit Singh assigned to VIP Duty while marked as having 3 consecutive Night Patrols.
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-300">
                    ⚠️ <b>Location Mismatch:</b> Constable Suresh check-in flagged 1.2km away from Atal Chowk Traffic Point.
                  </div>
                </div>
              </div>

              {/* Upcoming Duties */}
              <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                <h3 className="font-bold font-heading text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-[#FF9933]" /> Tomorrow's Duties
                </h3>
                <div className="space-y-3">
                  {plannedDuties.map((d, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                      <div>
                        <p className="font-bold text-xs text-gray-800 dark:text-white">{d.type} - {d.location}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{d.time}</p>
                      </div>
                      <span className="text-[9px] bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded border border-blue-500/20">{d.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 2: STAFF MASTER */}
        {/* ---------------------------------------------------- */}
        {activeModule === 2 && (
          <div className="space-y-6 bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Active Duty Force Roster</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Search staff name..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-xs outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 text-gray-400 font-bold uppercase">
                    <th className="p-3">Name</th>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Belt Number</th>
                    <th className="p-3">Mobile</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Skills</th>
                    <th className="p-3">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                  {staffList
                    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-gray-900 dark:text-white">{s.name}</td>
                      <td className="p-3">{s.rank}</td>
                      <td className="p-3 font-mono">{s.beltNumber}</td>
                      <td className="p-3">{s.mobile}</td>
                      <td className="p-3">{s.gender}</td>
                      <td className="p-3 flex gap-1 flex-wrap">
                        {s.skills.map((sk, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded text-[9px]">{sk}</span>
                        ))}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold border ${
                          s.status === 'Available' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          s.status === 'On Duty' ? 'bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 3: DUTY TYPES */}
        {/* ---------------------------------------------------- */}
        {activeModule === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {DEMO_DUTY_TYPES.map((dt, idx) => (
              <div key={idx} className="bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9933]/5 rounded-bl-full -mr-8 -mt-8"></div>
                <h4 className="font-bold text-[#FF9933] text-base mb-1">{dt.name}</h4>
                <p className="text-[10px] font-mono text-gray-400 mb-3">{dt.code}</p>
                <p className="text-xs text-gray-500 dark:text-white/60">{dt.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 4: DUTY PLANNING (WIZARD FORM) */}
        {/* ---------------------------------------------------- */}
        {activeModule === 4 && (
          <div className="max-w-4xl mx-auto animate-fade-in pb-12">
            
            {/* Wizard Progress Header */}
            <div className="flex justify-between items-center mb-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-white/10 -z-10 -translate-y-1/2 rounded"></div>
              {[
                { step: 1, label: 'Duty Classification', icon: Briefcase },
                { step: 2, label: 'Schedule & Map', icon: MapPin },
                { step: 3, label: 'Team Leader & Gear', icon: Users },
                { step: 4, label: 'Roster Review', icon: CheckCircle }
              ].map(s => (
                <div key={s.step} className="flex flex-col items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setWizardStep(s.step)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                      wizardStep > s.step 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                        : wizardStep === s.step 
                          ? 'bg-[#FF9933] text-[#001229] shadow-lg shadow-[#FF9933]/30 scale-110' 
                          : 'bg-white dark:bg-[#001229] text-gray-400 dark:text-white/30 border-2 border-gray-200 dark:border-white/10'
                    }`}
                  >
                    {wizardStep > s.step ? <Check size={20} /> : <s.icon size={20} />}
                  </button>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${wizardStep >= s.step ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-white/40'}`}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Wizard Content Panel */}
            <div className="bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden min-h-[450px] flex flex-col">
              
              {/* Top Banner */}
              <div className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 p-5 flex items-center gap-4 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#FF9933]/20 text-[#FF9933] flex items-center justify-center font-bold text-lg">
                  {wizardStep}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base dark:text-white">
                    {wizardStep === 1 && "Step 1: Select Duty Classification & Priority Level"}
                    {wizardStep === 2 && "Step 2: Schedule & Geolocation Coordinates"}
                    {wizardStep === 3 && "Step 3: Allocate Force Leader & Logistics Gear"}
                    {wizardStep === 4 && "Step 4: Roster Review & Submit to Draft Queue"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-white/50">
                    {wizardStep === 1 && "Choose category cards and priority tags for rotation logic."}
                    {wizardStep === 2 && "Enter date range, time slots, and verify location coordinates."}
                    {wizardStep === 3 && "Assign SI/Inspector commanders, vehicles, and weapons."}
                    {wizardStep === 4 && "Cross-examine parameters for time conflicts before saving."}
                  </p>
                </div>
              </div>

              {/* Steps Body */}
              <div className="p-6 lg:p-8 flex-1 bg-white dark:bg-transparent overflow-y-auto">
                
                {/* STEP 1: CATEGORY SELECTION */}
                {wizardStep === 1 && (
                  <div className="space-y-6">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Select Duty Classification Card</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['Daily Duty', 'Night Patrol', 'Beat Duty', 'Law & Order', 'VIP Duty', 'Festival Duty', 'Traffic Duty', 'Emergency'].map(cat => (
                        <div 
                          key={cat} 
                          onClick={() => setPlanType(cat)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[100px] relative overflow-hidden group ${
                            planType === cat 
                              ? 'border-[#FF9933] bg-[#FF9933]/10 shadow-[0_0_15px_rgba(255,153,51,0.15)]' 
                              : 'border-gray-205 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full mb-3 flex items-center justify-center ${planType === cat ? 'bg-[#FF9933] text-[#001229]' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/50'}`}>
                            <Target size={14} />
                          </div>
                          <h4 className={`font-bold text-xs ${planType === cat ? 'text-[#FF9933]' : 'text-gray-700 dark:text-white/70'}`}>{cat}</h4>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Duty Code Name (e.g., Op Safe Night)</label>
                        <input type="text" placeholder="Enter custom name..." className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none text-gray-900 dark:text-white text-xs" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Priority Rank</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none text-gray-900 dark:text-white text-xs">
                          <option>🟢 Normal Duty</option>
                          <option>🟡 Medium Priority</option>
                          <option>🟠 High Priority</option>
                          <option>🔴 Critical Emergency</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: SHIFT AND LOCATION MAP */}
                {wizardStep === 2 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Duty Timeline Dates</label>
                        <div className="flex gap-4">
                          <input type="date" value={planDate} onChange={e => setPlanDate(e.target.value)} className="flex-1 px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none text-gray-900 dark:text-white text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Shift Selection</label>
                        <div className="flex gap-2">
                          {['Morning', 'Evening', 'Night'].map(shift => (
                            <button 
                              key={shift}
                              type="button"
                              onClick={() => { setPlanShift(shift as any); setPlanTime(shift === 'Morning' ? '08:00 - 16:00' : shift === 'Evening' ? '14:00 - 22:00' : '22:00 - 06:00'); }}
                              className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all ${
                                planShift === shift 
                                  ? 'bg-[#FF9933] border-[#FF9933] text-[#001229] shadow-md shadow-[#FF9933]/10' 
                                  : 'border-gray-250 dark:border-white/10 text-gray-650 dark:text-white/60 hover:bg-white/5'
                              }`}
                            >
                              {shift}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Planned Location Name</label>
                        <input type="text" placeholder="e.g. Atal Chowk Crossing" value={planLocation} onChange={e => setPlanLocation(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none text-gray-900 dark:text-white text-xs" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Drop Location Pin On Map</label>
                      <div className="h-[200px] w-full rounded-xl bg-gray-200 dark:bg-white/5 border border-gray-250 dark:border-white/10 relative overflow-hidden flex items-center justify-center group cursor-crosshair">
                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Lucknow,UP&zoom=14&size=400x200&maptype=roadmap&sensor=false')] bg-cover opacity-60 mix-blend-luminosity"></div>
                        <div className="relative z-10 flex flex-col items-center">
                          <MapPin size={32} className="text-[#FF9933] animate-bounce" />
                          <span className="px-3 py-1 bg-black/60 text-white rounded-full text-[10px] font-bold mt-1.5 border border-white/15 shadow">Coords Lock: Gomti Nagar Beat #4</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: LOGISTICS COMMAND */}
                {wizardStep === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-150 dark:border-white/5">
                      <h4 className="font-bold text-xs text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3">
                        <Users size={16} className="text-[#FF9933]" /> Team Leader Allocation
                      </h4>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 mb-1.5 uppercase block">Leader In-Charge Rank SI/Inspector</label>
                        <select className="w-full px-3 py-2 bg-white dark:bg-[#001229] border border-gray-250 dark:border-white/10 rounded-lg text-xs outline-none text-gray-900 dark:text-white">
                          <option>Sub Inspector Amit Singh (Available)</option>
                          <option>Inspector Rajeev Kumar (Available)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 mb-1.5 uppercase block">Required Officer Strength</label>
                        <input type="number" min="1" value={planStrength} onChange={e => setPlanStrength(parseInt(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-[#001229] border border-gray-250 dark:border-white/10 rounded-lg text-xs outline-none text-gray-900 dark:text-white" />
                      </div>
                    </div>

                    <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-150 dark:border-white/5">
                      <h4 className="font-bold text-xs text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3">
                        <Car size={16} className="text-blue-500" /> Logistics & Gear
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 mb-1 block">Vehicles</label>
                          <select className="w-full px-2 py-1.5 bg-white dark:bg-[#001229] border border-gray-250 dark:border-white/10 rounded-lg text-[10px] outline-none text-gray-900 dark:text-white">
                            <option>PCR Bolero</option>
                            <option>Patrol Bike</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 mb-1 block">Weapons Type</label>
                          <select className="w-full px-2 py-1.5 bg-white dark:bg-[#001229] border border-gray-250 dark:border-white/10 rounded-lg text-[10px] outline-none text-gray-900 dark:text-white">
                            <option>Lathi Only</option>
                            <option>INSAS Rifle</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 mb-1 block">Special Dispatch Notes</label>
                        <textarea rows={2} value={planInstructions} onChange={e => setPlanInstructions(e.target.value)} placeholder="e.g. Carry night torches..." className="w-full px-3 py-2 bg-white dark:bg-[#001229] border border-gray-250 dark:border-white/10 rounded-lg text-xs outline-none text-gray-900 dark:text-white"></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: FINAL REWIEW */}
                {wizardStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-[#FF9933]/5 border border-[#FF9933]/20 p-5 rounded-2xl space-y-4">
                      <h4 className="font-bold text-sm text-[#FF9933] border-b border-[#FF9933]/20 pb-2">Roster Summary Details</h4>
                      <div className="grid grid-cols-2 gap-y-3 text-xs">
                        <p className="text-gray-500">Duty Type / Class:</p>
                        <p className="font-bold text-gray-850 dark:text-white">{planType}</p>
                        
                        <p className="text-gray-500">Location Area:</p>
                        <p className="font-bold text-gray-850 dark:text-white">{planLocation || 'Not Specified'}</p>

                        <p className="text-gray-500">Timeline Schedule:</p>
                        <p className="font-bold text-gray-850 dark:text-white">{planDate} ({planTime} - {planShift} Shift)</p>

                        <p className="text-gray-500">Assigned Officer Strength:</p>
                        <p className="font-bold text-gray-850 dark:text-white">{planStrength} Officers Requested</p>
                      </div>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/25 rounded-xl flex gap-3 items-center">
                      <CheckCircle2 className="text-green-500" size={20} />
                      <p className="text-xs text-gray-550 dark:text-green-300">Roster conflict engines checked. 0 conflicts identified for selected shift.</p>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleAddPlan}
                      className="w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#ffaa55] hover:opacity-90 text-[#001229] font-black rounded-xl text-xs shadow-lg transition-all"
                    >
                      Save Duty Plan & Submit to Draft Queue
                    </button>
                  </div>
                )}

              </div>

              {/* Wizard Footer Controls */}
              <div className="bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 p-5 flex justify-between shrink-0">
                <button 
                  type="button"
                  onClick={() => setWizardStep(prev => Math.max(prev - 1, 1))}
                  disabled={wizardStep === 1}
                  className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                    wizardStep === 1 
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                      : 'border-gray-300 text-gray-700 dark:text-white hover:bg-white/10'
                  }`}
                >
                  Previous Step
                </button>
                {wizardStep < 4 && (
                  <button 
                    type="button"
                    onClick={() => setWizardStep(prev => Math.min(prev + 1, 4))}
                    className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-[#001229] rounded-xl text-xs font-bold shadow hover:opacity-95"
                  >
                    Next Step
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 5: AI DUTY ASSIGNMENT */}
        {/* ---------------------------------------------------- */}
        {activeModule === 5 && (
          <div className="max-w-2xl bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">AI Duty Matrix Engine</h3>
            
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-white/60">Configure the parameters that the AI engine will use to auto-select and balance officers for duties:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(aiFactors).map((factor) => (
                  <label key={factor} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-black/20 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-gray-150 dark:border-white/5">
                    <input 
                      type="checkbox" 
                      checked={(aiFactors as any)[factor]} 
                      onChange={() => setAiFactors(prev => ({ ...prev, [factor]: !(prev as any)[factor] }))}
                      className="rounded text-[#FF9933] focus:ring-[#FF9933]" 
                    />
                    <span className="text-xs font-bold text-gray-800 dark:text-white capitalize">{factor.replace(/([A-Z])/g, ' $1')} Matching</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
              <h4 className="text-xs font-bold text-blue-500 flex items-center gap-2 mb-1.5">
                <Info size={14} /> AI Recommendation Metrics
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-blue-200/80 leading-relaxed">
                Rank weights, previous workloads, night shifts completed, and special skills metrics will be matched to output the best-fit scoring list for each draft duty slot.
              </p>
            </div>

            <button onClick={triggerAIAssignment} className="w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#ff8c1a] hover:opacity-95 text-[#001229] font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2">
              <RefreshCw size={16} /> Run AI Auto Allocation (स्मार्ट ऑटो आवंटन)
            </button>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 6: MANUAL DUTY ASSIGNMENT */}
        {/* ---------------------------------------------------- */}
        {activeModule === 6 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Manual Assignment Form */}
            <div className="lg:col-span-1 bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm h-fit space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Manual Assignment Control</h3>
              
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">1. Select Planned Duty Slot</label>
                <select value={selectedDutyId} onChange={e => setSelectedDutyId(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none text-gray-900 dark:text-white">
                  {plannedDuties.map(d => (
                    <option key={d.id} value={d.id} className="text-gray-900">{d.id} - {d.type} ({d.location})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">2. Select Staff / Officer</label>
                <select value={selectedOfficerName} onChange={e => setSelectedOfficerName(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none text-gray-900 dark:text-white">
                  {staffList.map(o => (
                    <option key={o.beltNumber} value={o.name} className="text-gray-900">{o.name} ({o.rank} - {o.status})</option>
                  ))}
                </select>
              </div>

              <button onClick={handleManualAssign} className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-[#001229] rounded-xl text-xs font-bold shadow-md">
                Add Selected Staff to Duty
              </button>
            </div>

            {/* List & Roster preview */}
            <div className="lg:col-span-2 bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Current Force Assignments</h3>
              <div className="space-y-4">
                {plannedDuties.map((d) => (
                  <div key={d.id} className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-150 dark:border-white/5 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white">{d.id} • {d.type}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">📍 {d.location} • {d.time}</p>
                      </div>
                      <span className="text-[9px] bg-green-500/10 text-green-500 font-bold px-2 py-0.5 border border-green-500/20 rounded">{d.status}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {d.assignedStaff.length === 0 ? (
                        <p className="text-[10px] text-gray-400 italic">No personnel assigned yet.</p>
                      ) : (
                        d.assignedStaff.map(name => (
                          <span key={name} className="px-2.5 py-1 bg-[#FF9933]/10 border border-[#FF9933]/20 text-[#FF9933] rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors cursor-pointer group" onClick={() => handleRemoveStaff(d.id, name)}>
                            {name} <X size={10} className="opacity-60 group-hover:opacity-100" />
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 7: DUTY APPROVAL */}
        {/* ---------------------------------------------------- */}
        {activeModule === 7 && (
          <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">Roster Verification & Approval Pipeline</h3>
            
            <div className="space-y-4">
              {plannedDuties.map((d) => (
                <div key={d.id} className="p-5 bg-gray-50 dark:bg-black/20 border border-gray-150 dark:border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{d.type} - {d.location}</h4>
                    <p className="text-xs text-gray-500 mt-1">Date: {d.date} • Required Force: {d.strength} • Assigned: {d.assignedStaff.length}</p>
                    <div className="flex gap-1.5 items-center mt-2">
                      <span className="text-[10px] bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded font-bold text-gray-600 dark:text-white/60">{d.status}</span>
                      {d.assignedStaff.length < d.strength && (
                        <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-bold">INSUFFICIENT FORCE</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {d.status === 'Draft' && (
                      <button onClick={() => handleApproveStatus(d.id, 'Pending Review')} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition-colors">Submit for Review</button>
                    )}
                    {d.status === 'Pending Review' && (
                      <>
                        <button onClick={() => handleApproveStatus(d.id, 'Approved')} className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow transition-colors">Approve Draft</button>
                        <button onClick={() => handleApproveStatus(d.id, 'Cancelled')} className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow transition-colors">Reject/Cancel</button>
                      </>
                    )}
                    {d.status === 'Approved' && (
                      <button onClick={() => handleApproveStatus(d.id, 'Published')} className="px-4 py-2 bg-gradient-to-r from-[#FF9933] to-[#ff8c1a] text-[#001229] rounded-lg text-xs font-extrabold shadow-md hover:opacity-90">Publish Today's Roster</button>
                    )}
                    {d.status === 'Published' && (
                      <span className="text-xs text-green-500 font-bold flex items-center gap-1"><CheckCircle size={14} /> Roster Published & Locked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 8: DUTY CALENDAR */}
        {/* ---------------------------------------------------- */}
        {activeModule === 8 && (
          <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Thana Duty Calendar Planner</h3>
              <div className="flex p-0.5 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg">
                {['day', 'week', 'month'].map(v => (
                  <button 
                    key={v}
                    onClick={() => setCalendarView(v as any)}
                    className={`px-3 py-1.5 text-xs font-bold capitalize rounded-md transition-all ${calendarView === v ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center border border-gray-100 dark:border-white/5 p-4 rounded-xl">
              {['Mon 29', 'Tue 30', 'Wed 01', 'Thu 02', 'Fri 03', 'Sat 04', 'Sun 05'].map((day, idx) => (
                <div key={idx} className="space-y-3 min-h-[150px] bg-gray-50/50 dark:bg-black/10 p-2 rounded-lg border border-gray-150 dark:border-white/5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{day}</p>
                  
                  {plannedDuties.map(d => (
                    <div key={d.id} className="p-2 bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/25 rounded text-[9px] font-bold text-left space-y-0.5">
                      <p className="truncate">{d.type}</p>
                      <p className="text-[8px] text-gray-400 truncate">{d.location}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 9: DUTY CONFLICT DETECTION */}
        {/* ---------------------------------------------------- */}
        {activeModule === 9 && (
          <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">Thana Conflict Detection Board</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex gap-3 items-start">
                <AlertTriangle className="text-red-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-sm text-red-500">Double Duty / Schedule Overlap Detected</h4>
                  <p className="text-xs text-gray-500 dark:text-red-300/80 mt-1">
                    Constable Ramesh is allocated to "Sector 4 Night Patrol" and "Daily Thana Desk" in consecutive shifts without the mandatory 8-hour off-duty transition window.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-3 items-start">
                <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-sm text-amber-500">Consecutive Night Duties Alert</h4>
                  <p className="text-xs text-gray-500 dark:text-amber-300/80 mt-1">
                    Head Constable Sunil has been assigned to Night Patrol for 3 nights in rotation. Recommend rotation offset.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex gap-3 items-start">
                <Info className="text-blue-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-sm text-blue-500">Insufficient Strength Alert</h4>
                  <p className="text-xs text-gray-500 dark:text-blue-300/80 mt-1">
                    VIP corridor deployment requires 4 officers, currently only 1 officer (SI Amit Singh) is assigned.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 10: DUTY MONITORING */}
        {/* ---------------------------------------------------- */}
        {activeModule === 10 && (
          <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">Real-time Duty Monitoring Console</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                <p className="text-xs text-gray-400 font-bold">Upcoming Duties</p>
                <h4 className="text-xl font-bold mt-1 text-blue-500">2 Scheduled</h4>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                <p className="text-xs text-gray-400 font-bold">Active Duties</p>
                <h4 className="text-xl font-bold mt-1 text-green-500">1 Live</h4>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/20 p-4 rounded-xl">
                <p className="text-xs text-gray-400 font-bold">Completed Duties</p>
                <h4 className="text-xl font-bold mt-1 text-gray-400">12 Checked-out</h4>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                <p className="text-xs text-gray-400 font-bold">Pending Duties</p>
                <h4 className="text-xl font-bold mt-1 text-amber-500">1 Draft</h4>
              </div>
            </div>

            <div className="space-y-3">
              {plannedDuties.map((d, i) => (
                <div key={i} className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-gray-800 dark:text-white">{d.type} - {d.location}</h4>
                    <p className="text-[10px] text-gray-400 mt-1">{d.time} • Staff Assigned: {d.assignedStaff.join(', ') || 'None'}</p>
                  </div>
                  <span className="text-[10px] bg-green-500/10 text-green-500 font-bold px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-wider">{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 11: RESERVE FORCE */}
        {/* ---------------------------------------------------- */}
        {activeModule === 11 && (
          <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">Reserve Standby Force Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staffList.filter(o => o.status === 'Available').slice(0, 3).map((o, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-gray-850 dark:text-white">{o.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{o.rank} • Belt: {o.beltNumber}</p>
                  </div>
                  <button onClick={triggerEmergencyForce} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all shadow">
                    Assign to Active Duty
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 12: EMERGENCY DUTY */}
        {/* ---------------------------------------------------- */}
        {activeModule === 12 && (
          <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">Emergency & Quick Deploy Board</h3>
            
            <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center animate-pulse border border-red-500/30">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h4 className="font-bold text-base text-red-600">Quick Force Deployment (त्वरित बल तैनात करें)</h4>
                <p className="text-xs text-gray-500 dark:text-red-300/80 max-w-md mt-1 leading-relaxed">
                  In case of immediate emergencies or sudden VIP corridor requirements, deploy the available reserve force instantly without approval delays.
                </p>
              </div>
              <button onClick={triggerEmergencyForce} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                🚨 Trigger Quick Deployment (त्वरित तैनाती)
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 13: AI RECOMMENDATIONS */}
        {/* ---------------------------------------------------- */}
        {activeModule === 13 && (
          <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">AI Recommendation Log</h3>
            
            <div className="space-y-3">
              {aiSuggestions.map((rec, i) => (
                <div key={i} className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-xs text-gray-700 dark:text-blue-200 font-bold">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 14: SEARCH & FILTERS */}
        {/* ---------------------------------------------------- */}
        {activeModule === 14 && (
          <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">Advanced Search & Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Officer Name / Belt No</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="e.g. Ramesh" 
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none text-gray-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Rank</label>
                <select value={filterRank} onChange={e => setFilterRank(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none text-gray-900 dark:text-white">
                  <option value="">All Ranks</option>
                  <option value="Constable">Constable</option>
                  <option value="Head Constable">Head Constable</option>
                  <option value="Sub Inspector">Sub Inspector</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Availability Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none text-gray-900 dark:text-white">
                  <option value="">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="On Duty">On Duty</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>

            <div className="border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden mt-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-black/20 text-gray-400 font-bold uppercase border-b border-gray-200 dark:border-white/10">
                    <th className="p-3">Officer Name</th>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList
                    .filter(o => !searchQuery || o.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .filter(o => !filterRank || o.rank === filterRank)
                    .filter(o => !filterStatus || o.status === filterStatus)
                    .map((o, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-white/5 text-gray-700 dark:text-white/80">
                        <td className="p-3 font-bold">{o.name}</td>
                        <td className="p-3">{o.rank}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full border bg-white/5 border-white/10 text-xs font-bold">{o.status}</span></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODULE 15: REPORTS */}
        {/* ---------------------------------------------------- */}
        {activeModule === 15 && (
          <div className="bg-white dark:bg-[#001229]/80 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">Thana Duty Reports & Registers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-gray-50 dark:bg-black/20 border border-gray-150 dark:border-white/5 rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Daily Duty Report</h4>
                <p className="text-xs text-gray-500 dark:text-white/50 mb-4">Export today's beat deployments, traffic slots filled, and active VIP escorts.</p>
                <button onClick={() => alert('Exporting PDF Daily Duty Report...')} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Download size={14} /> Export Daily Report
                </button>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-black/20 border border-gray-150 dark:border-white/5 rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Weekly Duty Register</h4>
                <p className="text-xs text-gray-500 dark:text-white/50 mb-4">Official weekly rotation ledger format including approvals and signatures.</p>
                <button onClick={() => alert('Exporting Excel Weekly Duty Register...')} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Download size={14} /> Export Weekly Register
                </button>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-black/20 border border-gray-150 dark:border-white/5 rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Individual Duty History</h4>
                <p className="text-xs text-gray-500 dark:text-white/50 mb-4">History log of shifts, night duties, and leaves for auditing fairness.</p>
                <button onClick={() => alert('Exporting PDF Audit History...')} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Download size={14} /> Export Audit Ledger
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
