import React, { useState } from 'react';
import { 
  Search, Filter, Users, Shield, ShieldAlert, CheckCircle, 
  MapPin, Clock, Briefcase, Phone, Mail, ChevronRight, X,
  Plus, UploadCloud, Download, FileSpreadsheet, Cpu, Check, AlertTriangle, Info
} from 'lucide-react';
import * as XLSX from 'xlsx';

const MOCK_OFFICERS = [
  // Hazratganj
  { id: 'UP-9021', name: 'Rajesh Kumar', rank: 'Inspector (SHO)', station: 'Hazratganj', status: 'On Duty', duty: 'Hazratganj Protest (Law & Order)', phone: '+91 9876543210' },
  { id: 'UP-7732', name: 'Anil Singh', rank: 'Sub Inspector', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543211' },
  { id: 'UP-5521', name: 'Vikram Yadav', rank: 'Head Constable', station: 'Hazratganj', status: 'On Leave', duty: null, phone: '+91 9876543212' },
  { id: 'UP-8812', name: 'Suresh Tiwari', rank: 'Constable', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543213' },
  { id: 'UP-3341', name: 'Ramesh Patel', rank: 'Constable', station: 'Hazratganj', status: 'In Training', duty: null, phone: '+91 9876543214' },
  { id: 'UP-9922', name: 'Anita Sharma', rank: 'Sub Inspector', station: 'Hazratganj', status: 'On Duty', duty: 'VIP Route Bandobast (GPO)', phone: '+91 9876543215' },
  { id: 'UP-1102', name: 'Manoj Bajpai', rank: 'Inspector', station: 'Hazratganj', status: 'On Duty', duty: 'Janpath Market Security', phone: '+91 9876543216' },
  { id: 'UP-2204', name: 'Deepika Singh', rank: 'Constable', station: 'Hazratganj', status: 'Available', duty: null, phone: '+91 9876543217' },
  
  // Gomti Nagar
  { id: 'UP-4455', name: 'Rahul Verma', rank: 'Inspector (SHO)', station: 'Gomti Nagar', status: 'On Duty', duty: 'Marine Drive Patrol', phone: '+91 9876543218' },
  { id: 'UP-5566', name: 'Amitabh Bachchan', rank: 'Sub Inspector', station: 'Gomti Nagar', status: 'On Leave', duty: null, phone: '+91 9876543219' },
  { id: 'UP-7788', name: 'Priya Mishra', rank: 'Constable', station: 'Gomti Nagar', status: 'Available', duty: null, phone: '+91 9876543220' },
  { id: 'UP-9900', name: 'Sunil Shetty', rank: 'Constable', station: 'Gomti Nagar', status: 'On Duty', duty: '1090 Chauraha Traffic', phone: '+91 9876543221' },
  { id: 'UP-1234', name: 'Ajay Devgn', rank: 'Head Constable', station: 'Gomti Nagar', status: 'Available', duty: null, phone: '+91 9876543222' },
  
  // Chowk
  { id: 'UP-5678', name: 'Kareena Kapoor', rank: 'Sub Inspector', station: 'Chowk', status: 'In Training', duty: null, phone: '+91 9876543223' },
  { id: 'UP-6677', name: 'Salman Khan', rank: 'Inspector (SHO)', station: 'Chowk', status: 'On Duty', duty: 'Old City Area Security', phone: '+91 9876543224' },
  { id: 'UP-8899', name: 'Aamir Khan', rank: 'Constable', station: 'Chowk', status: 'Available', duty: null, phone: '+91 9876543225' },
  
  // Alambagh
  { id: 'UP-2345', name: 'Akshay Kumar', rank: 'Inspector (SHO)', station: 'Alambagh', status: 'Available', duty: null, phone: '+91 9876543226' },
  { id: 'UP-3456', name: 'Katrina Kaif', rank: 'Sub Inspector', station: 'Alambagh', status: 'On Duty', duty: 'Bus Stand Patrol', phone: '+91 9876543227' },
];

// Valid values for validation
const VALID_RANKS = ['Constable', 'Head Constable', 'Sub Inspector', 'Inspector', 'Inspector (SHO)'];
const VALID_STATUSES = ['Available', 'On Duty', 'On Leave', 'In Training'];

export const OfficerAvailability: React.FC = () => {
  const storedThana = localStorage.getItem('demoThana') || 'Hazratganj';

  const [officers, setOfficers] = useState(() => {
    const saved = localStorage.getItem('demoOfficers');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter for current thana
      return parsed.filter((o: any) => o.station === storedThana);
    }
    return MOCK_OFFICERS.filter(o => o.station === storedThana);
  });
  
  // Persist to localStorage whenever officers change
  React.useEffect(() => {
    const saved = localStorage.getItem('demoOfficers');
    let allOfficers = saved ? JSON.parse(saved) : MOCK_OFFICERS;
    
    // Remove old officers of this thana, and add current ones
    allOfficers = allOfficers.filter((o: any) => o.station !== storedThana);
    allOfficers = [...allOfficers, ...officers];
    
    localStorage.setItem('demoOfficers', JSON.stringify(allOfficers));
  }, [officers, storedThana]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<'initial' | 'uploading' | 'ready' | 'error' | 'processing' | 'success'>('initial');
  const [excelParsedData, setExcelParsedData] = useState<any[]>([]);
  const [excelErrors, setExcelErrors] = useState<string[]>([]);
  const [excelFileName, setExcelFileName] = useState('');
  const [manualForm, setManualForm] = useState({ name: '', id: '', rank: 'Constable', phone: '', status: 'Available' });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ============================
  // DOWNLOAD DEMO TEMPLATE
  // ============================
  const handleDownloadTemplate = () => {
    const templateData = [
      { 'Name (नाम)': 'Ravi Shankar', 'PNO Number (बेल्ट नंबर)': 'UP-5001', 'Rank (पद)': 'Constable', 'Phone (मोबाइल)': '9111000001', 'Status (स्थिति)': 'Available' },
      { 'Name (नाम)': 'Pradeep Mishra', 'PNO Number (बेल्ट नंबर)': 'UP-5002', 'Rank (पद)': 'Head Constable', 'Phone (मोबाइल)': '9111000002', 'Status (स्थिति)': 'Available' },
      { 'Name (नाम)': 'Kavita Rani', 'PNO Number (बेल्ट नंबर)': 'UP-5003', 'Rank (पद)': 'Sub Inspector', 'Phone (मोबाइल)': '9111000003', 'Status (स्थिति)': 'On Duty' },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 25 }, // Name
      { wch: 22 }, // PNO
      { wch: 20 }, // Rank
      { wch: 18 }, // Phone
      { wch: 15 }, // Status
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Officers');
    
    // Add a second sheet with instructions
    const instructionData = [
      { 'Column (कॉलम)': 'Name (नाम)', 'Required (ज़रूरी)': 'YES ✅', 'Description (विवरण)': 'Full name of the officer', 'Example (उदाहरण)': 'Ravi Shankar' },
      { 'Column (कॉलम)': 'PNO Number (बेल्ट नंबर)', 'Required (ज़रूरी)': 'YES ✅', 'Description (विवरण)': 'Unique PNO / Belt number (format: UP-XXXX)', 'Example (उदाहरण)': 'UP-5001' },
      { 'Column (कॉलम)': 'Rank (पद)', 'Required (ज़रूरी)': 'YES ✅', 'Description (विवरण)': 'Constable / Head Constable / Sub Inspector / Inspector', 'Example (उदाहरण)': 'Constable' },
      { 'Column (कॉलम)': 'Phone (मोबाइल)', 'Required (ज़रूरी)': 'Optional', 'Description (विवरण)': '10-digit mobile number', 'Example (उदाहरण)': '9111000001' },
      { 'Column (कॉलम)': 'Status (स्थिति)', 'Required (ज़रूरी)': 'Optional', 'Description (विवरण)': 'Available / On Duty / On Leave / In Training (default: Available)', 'Example (उदाहरण)': 'Available' },
    ];
    const wsInst = XLSX.utils.json_to_sheet(instructionData);
    wsInst['!cols'] = [{ wch: 28 }, { wch: 15 }, { wch: 55 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsInst, 'Instructions (निर्देश)');

    XLSX.writeFile(wb, `${storedThana}_Officer_Template.xlsx`);
  };

  // ============================
  // PARSE UPLOADED EXCEL
  // ============================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    setUploadStep('uploading');
    setExcelErrors([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (jsonData.length === 0) {
          setExcelErrors(['Excel file is empty. Please add officer data and try again.']);
          setUploadStep('error');
          return;
        }

        // Map columns flexibly (support both English and Hindi column names)
        const errors: string[] = [];
        const parsed: any[] = [];

        jsonData.forEach((row, idx) => {
          const rowNum = idx + 2; // Excel row (1=header, 2=first data)
          
          // Try multiple possible column name variations
          const name = row['Name (नाम)'] || row['Name'] || row['नाम'] || row['name'] || row['Officer Name'] || '';
          const pno = row['PNO Number (बेल्ट नंबर)'] || row['PNO Number'] || row['PNO'] || row['बेल्ट नंबर'] || row['Belt Number'] || row['pno'] || row['ID'] || '';
          const rank = row['Rank (पद)'] || row['Rank'] || row['पद'] || row['rank'] || row['Designation'] || '';
          const phone = row['Phone (मोबाइल)'] || row['Phone'] || row['मोबाइल'] || row['phone'] || row['Mobile'] || row['Contact'] || '';
          const status = row['Status (स्थिति)'] || row['Status'] || row['स्थिति'] || row['status'] || '';

          // Validation
          if (!name.toString().trim()) {
            errors.push(`Row ${rowNum}: Name is empty (नाम खाली है)`);
            return;
          }
          if (!pno.toString().trim()) {
            errors.push(`Row ${rowNum}: PNO Number is empty (बेल्ट नंबर खाली है)`);
            return;
          }

          // Check for duplicate PNO in existing officers
          const existingPNO = officers.find(o => o.id === pno.toString().trim());
          if (existingPNO) {
            errors.push(`Row ${rowNum}: PNO "${pno}" already exists (${existingPNO.name})`);
            return;
          }

          // Check for duplicate PNO within uploaded data
          const duplicateInUpload = parsed.find(p => p.id === pno.toString().trim());
          if (duplicateInUpload) {
            errors.push(`Row ${rowNum}: Duplicate PNO "${pno}" in the file`);
            return;
          }

          // Normalize rank
          let normalizedRank = rank.toString().trim() || 'Constable';
          const rankLower = normalizedRank.toLowerCase();
          if (rankLower.includes('constable') && rankLower.includes('head')) normalizedRank = 'Head Constable';
          else if (rankLower.includes('constable')) normalizedRank = 'Constable';
          else if (rankLower.includes('sub') && rankLower.includes('inspector')) normalizedRank = 'Sub Inspector';
          else if (rankLower.includes('inspector') && rankLower.includes('sho')) normalizedRank = 'Inspector (SHO)';
          else if (rankLower.includes('inspector')) normalizedRank = 'Inspector';

          // Normalize status
          let normalizedStatus = status.toString().trim() || 'Available';
          const statusLower = normalizedStatus.toLowerCase();
          if (statusLower.includes('available') || statusLower.includes('उपलब्ध')) normalizedStatus = 'Available';
          else if (statusLower.includes('duty') || statusLower.includes('ड्यूटी')) normalizedStatus = 'On Duty';
          else if (statusLower.includes('leave') || statusLower.includes('छुट्टी')) normalizedStatus = 'On Leave';
          else if (statusLower.includes('training') || statusLower.includes('प्रशिक्षण')) normalizedStatus = 'In Training';
          else normalizedStatus = 'Available';

          // Format phone
          let formattedPhone = phone.toString().trim();
          if (formattedPhone && !formattedPhone.startsWith('+91')) {
            formattedPhone = formattedPhone.replace(/^0+/, '');
            if (formattedPhone.length === 10) formattedPhone = `+91 ${formattedPhone}`;
          }

          parsed.push({
            id: pno.toString().trim(),
            name: name.toString().trim(),
            rank: normalizedRank,
            station: storedThana,
            status: normalizedStatus,
            duty: null,
            phone: formattedPhone || 'N/A'
          });
        });

        setExcelParsedData(parsed);
        
        if (parsed.length === 0 && errors.length > 0) {
          setExcelErrors(errors);
          setUploadStep('error');
        } else {
          setExcelErrors(errors);
          setUploadStep('ready');
        }
      } catch (err) {
        console.error('Excel parse error:', err);
        setExcelErrors(['Failed to read Excel file. Please check the format and try again.']);
        setUploadStep('error');
      }
    };
    reader.readAsBinaryString(file);
    if (e.target) e.target.value = '';
  };

  const handleConfirmUpload = () => {
    setUploadStep('processing');
    setTimeout(() => {
      setOfficers(prev => [...prev, ...excelParsedData]);
      setUploadStep('success');
    }, 2000);
  };

  const handleManualSave = () => {
    if (!manualForm.name || !manualForm.id) return;
    setOfficers(prev => [...prev, {
      id: manualForm.id, name: manualForm.name, rank: manualForm.rank,
      station: storedThana, status: manualForm.status, duty: null,
      phone: manualForm.phone || 'N/A'
    }]);
    setManualForm({ name: '', id: '', rank: 'Constable', phone: '', status: 'Available' });
    setIsManualEntryOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'On Duty': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'On Leave': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'In Training': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          officer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || officer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: officers.length,
    available: officers.filter(o => o.status === 'Available').length,
    onDuty: officers.filter(o => o.status === 'On Duty').length,
    onLeave: officers.filter(o => o.status === 'On Leave').length,
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative bg-gray-50 dark:bg-[#000a17]">
      
      <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
         <div>
           <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-1 flex items-center gap-3">
             <Users className="text-[#FF9933]" size={32} /> Officer Availability & Force Tracking
           </h2>
           <p className="text-gray-500 dark:text-white/60 text-sm mt-2">Real-time manpower status and resource allocation.</p>
         </div>
         <div className="flex items-center gap-3">
           <button onClick={() => setIsManualEntryOpen(true)}
             className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2">
              <Plus size={16} /> New Entry
           </button>
           <button onClick={() => { setUploadStep('initial'); setExcelFileName(''); setExcelParsedData([]); setExcelErrors([]); setIsUploadModalOpen(true); }}
             className="px-5 py-2.5 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2">
              <UploadCloud size={16} /> Excel Bulk Upload
           </button>
         </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
        <div className="bg-white dark:bg-[#001229]/80 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
           <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Force</p>
           <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</h3>
        </div>
        <div className="bg-white dark:bg-green-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-500/20 shadow-sm">
           <p className="text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">Available</p>
           <h3 className="text-2xl font-bold text-green-700 dark:text-green-500">{stats.available}</h3>
        </div>
        <div className="bg-white dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-500/20 shadow-sm">
           <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">On Duty</p>
           <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-500">{stats.onDuty}</h3>
        </div>
        <div className="bg-white dark:bg-amber-900/20 p-5 rounded-2xl border border-amber-100 dark:border-amber-500/20 shadow-sm">
           <p className="text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">On Leave</p>
           <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-500">{stats.onLeave}</h3>
        </div>
      </div>

      {/* Table + Side Panel */}
      <div className="flex gap-6 animate-fade-in" style={{animationDelay: '100ms'}}>
        <div className={`flex-1 bg-white dark:bg-[#001229]/80 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-all ${selectedOfficer ? 'hidden lg:block lg:w-2/3' : 'w-full'}`}>
           <div className="p-4 border-b border-gray-100 dark:border-white/10 flex flex-wrap gap-4 bg-gray-50/50 dark:bg-black/20 items-center">
              <div className="relative max-w-md w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input type="text" placeholder="Search by Name or PNO..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-[#FF9933] outline-none dark:text-white" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                 className="px-4 py-2 bg-white dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm dark:text-white outline-none">
                 <option value="All">All Statuses</option>
                 <option value="Available">Available</option>
                 <option value="On Duty">On Duty</option>
                 <option value="On Leave">On Leave</option>
                 <option value="In Training">In Training</option>
              </select>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="text-xs uppercase text-gray-500 dark:text-white/40 bg-gray-50 dark:bg-transparent border-b border-gray-100 dark:border-white/5">
                   <th className="p-4 font-semibold">Officer Profile</th>
                   <th className="p-4 font-semibold">PNO Number</th>
                   <th className="p-4 font-semibold">Station</th>
                   <th className="p-4 font-semibold">Status</th>
                   <th className="p-4 font-semibold text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="text-sm divide-y divide-gray-100 dark:divide-white/5">
                 {filteredOfficers.map((officer) => (
                   <tr key={officer.id} onClick={() => setSelectedOfficer(officer)}
                     className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedOfficer?.id === officer.id ? 'bg-[#FF9933]/5 dark:bg-[#FF9933]/10' : ''}`}>
                     <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden shrink-0">
                             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${officer.name}&backgroundColor=002147`} alt="" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 dark:text-white">{officer.name}</div>
                            <div className="text-xs text-gray-500 dark:text-white/50">{officer.rank}</div>
                          </div>
                        </div>
                     </td>
                     <td className="p-4 font-mono font-medium text-gray-800 dark:text-white/90">{officer.id}</td>
                     <td className="p-4 text-gray-600 dark:text-white/70">{officer.station}</td>
                     <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(officer.status)}`}>{officer.status}</span></td>
                     <td className="p-4 text-right"><ChevronRight size={18} className="inline-block text-gray-400" /></td>
                   </tr>
                 ))}
               </tbody>
             </table>
             {filteredOfficers.length === 0 && <div className="p-8 text-center text-gray-500 dark:text-white/50">No officers found.</div>}
           </div>
        </div>

        {/* Side Panel */}
        {selectedOfficer && (
          <div className="w-full lg:w-1/3 bg-white dark:bg-[#001229]/90 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden flex flex-col">
             <div className="p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <h3 className="font-heading font-bold text-gray-800 dark:text-white">Officer Dossier</h3>
                <button onClick={() => setSelectedOfficer(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500"><X size={18} /></button>
             </div>
             <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden mb-4 border-4 border-white dark:border-[#001229] shadow-lg">
                     <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedOfficer.name}&backgroundColor=002147`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedOfficer.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-white/60 mb-2">{selectedOfficer.rank} • {selectedOfficer.id}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOfficer.status)}`}>{selectedOfficer.status}</span>
                </div>
                <div className="space-y-4">
                   <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact</h4>
                      <div className="flex items-center gap-3 mb-2 text-sm text-gray-700 dark:text-white/80"><Phone size={16} className="text-[#FF9933]" /> {selectedOfficer.phone}</div>
                      <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-white/80"><MapPin size={16} className="text-[#FF9933]" /> {selectedOfficer.station} Police Station</div>
                   </div>
                   <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Assignment</h4>
                      {selectedOfficer.duty ? (
                        <p className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-2"><Briefcase size={16} className="text-blue-500" /> {selectedOfficer.duty}</p>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-white/50 italic">No active assignment. Available for deployment.</p>
                      )}
                   </div>
                </div>
             </div>
             <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                {selectedOfficer.status === 'Available' ? (
                  <button className="w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#ffaa55] hover:scale-[1.02] text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-all flex justify-center items-center gap-2"><Shield size={16} /> Deploy Immediately</button>
                ) : (
                  <button className="w-full py-3 bg-white dark:bg-[#000a17] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 rounded-xl text-sm font-bold flex justify-center items-center gap-2"><Clock size={16} /> View Schedule</button>
                )}
             </div>
          </div>
        )}
      </div>

      {/* ====== EXCEL UPLOAD MODAL ====== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#001229] w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5 shrink-0">
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="text-[#FF9933]" size={20} /> Excel Upload (एक्सेल अपलोड)
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {/* STEP: Initial Upload */}
              {uploadStep === 'initial' && (
                <div className="animate-fade-in space-y-6">
                  
                  {/* Format Guide */}
                  <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-5">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm flex items-center gap-2 mb-3">
                      <Info size={18} /> Excel Format Guide (एक्सेल फॉर्मेट)
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-200 mb-4">Your Excel file should have these columns in the <strong>first row (header)</strong>:</p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-blue-100 dark:bg-blue-500/20">
                            <th className="p-2 text-left font-bold text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-500/30">Column Name</th>
                            <th className="p-2 text-left font-bold text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-500/30">Required?</th>
                            <th className="p-2 text-left font-bold text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-500/30">Valid Values</th>
                            <th className="p-2 text-left font-bold text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-500/30">Example</th>
                          </tr>
                        </thead>
                        <tbody className="text-blue-800 dark:text-blue-100">
                          <tr><td className="p-2 border border-blue-200 dark:border-blue-500/30 font-bold">Name (नाम)</td><td className="p-2 border border-blue-200 dark:border-blue-500/30 text-red-600 dark:text-red-400">✅ ज़रूरी</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">Full name</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">Ravi Shankar</td></tr>
                          <tr><td className="p-2 border border-blue-200 dark:border-blue-500/30 font-bold">PNO Number (बेल्ट नंबर)</td><td className="p-2 border border-blue-200 dark:border-blue-500/30 text-red-600 dark:text-red-400">✅ ज़रूरी</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">UP-XXXX format</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">UP-5001</td></tr>
                          <tr><td className="p-2 border border-blue-200 dark:border-blue-500/30 font-bold">Rank (पद)</td><td className="p-2 border border-blue-200 dark:border-blue-500/30 text-amber-600 dark:text-amber-400">Optional</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">Constable / Head Constable / Sub Inspector / Inspector</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">Constable</td></tr>
                          <tr><td className="p-2 border border-blue-200 dark:border-blue-500/30 font-bold">Phone (मोबाइल)</td><td className="p-2 border border-blue-200 dark:border-blue-500/30 text-amber-600 dark:text-amber-400">Optional</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">10-digit number</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">9111000001</td></tr>
                          <tr><td className="p-2 border border-blue-200 dark:border-blue-500/30 font-bold">Status (स्थिति)</td><td className="p-2 border border-blue-200 dark:border-blue-500/30 text-amber-600 dark:text-amber-400">Optional</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">Available / On Duty / On Leave / In Training</td><td className="p-2 border border-blue-200 dark:border-blue-500/30">Available</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Download Template */}
                  <button onClick={handleDownloadTemplate}
                    className="w-full px-6 py-4 border-2 border-dashed border-green-400 dark:border-green-500/40 rounded-xl text-green-700 dark:text-green-400 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 transition-all flex items-center justify-center gap-3 font-bold">
                    <Download size={20} /> Download Demo Template (.xlsx) — सैंपल टेम्पलेट डाउनलोड करें
                  </button>

                  {/* Upload Area */}
                  <div onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-10 bg-gray-50 dark:bg-black/20 hover:border-[#FF9933] hover:bg-[#FF9933]/5 cursor-pointer transition-all flex flex-col items-center justify-center">
                    <UploadCloud size={48} className="text-gray-400 dark:text-white/30 mb-4" />
                    <p className="font-bold text-gray-700 dark:text-white/80 mb-1">Click to Upload Excel File (एक्सेल अपलोड करें)</p>
                    <p className="text-xs text-gray-500">.xlsx, .xls, .csv supported</p>
                  </div>
                </div>
              )}

              {/* STEP: Parsing */}
              {uploadStep === 'uploading' && (
                <div className="text-center py-12 animate-fade-in flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-gray-200 dark:border-white/10 border-t-[#FF9933] rounded-full animate-spin mb-6"></div>
                  <h3 className="font-bold text-lg dark:text-white mb-2">Reading "{excelFileName}"...</h3>
                  <p className="text-gray-500 dark:text-white/50 text-sm">Parsing rows and validating data...</p>
                </div>
              )}

              {/* STEP: Error */}
              {uploadStep === 'error' && (
                <div className="animate-fade-in text-center py-8">
                  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Upload Failed (अपलोड विफल)</h3>
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-left mb-6 max-h-40 overflow-y-auto">
                    {excelErrors.map((err, i) => (
                      <p key={i} className="text-sm text-red-700 dark:text-red-300 mb-1 flex items-start gap-2">
                        <X size={14} className="shrink-0 mt-0.5" /> {err}
                      </p>
                    ))}
                  </div>
                  <button onClick={() => { setUploadStep('initial'); setExcelErrors([]); }}
                    className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold">Try Again (दुबारा कोशिश करें)</button>
                </div>
              )}

              {/* STEP: Preview */}
              {uploadStep === 'ready' && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shrink-0"><FileSpreadsheet size={24} /></div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">✅ {excelParsedData.length} officers parsed from "{excelFileName}"</h3>
                      {excelErrors.length > 0 && <p className="text-xs text-amber-600 dark:text-amber-400">{excelErrors.length} rows skipped (errors below)</p>}
                    </div>
                  </div>

                  {/* Warnings */}
                  {excelErrors.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 mb-4 max-h-28 overflow-y-auto">
                      {excelErrors.map((err, i) => (
                        <p key={i} className="text-xs text-amber-700 dark:text-amber-300 mb-1">⚠️ {err}</p>
                      ))}
                    </div>
                  )}
                  
                  {/* Preview Table */}
                  <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden mb-5">
                    <div className="bg-gray-50 dark:bg-white/5 px-4 py-2 border-b border-gray-200 dark:border-white/10">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preview — Officers to Add</h4>
                    </div>
                    <div className="overflow-x-auto max-h-56 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="sticky top-0">
                          <tr className="text-[10px] uppercase text-gray-400 bg-gray-50 dark:bg-[#001229] border-b border-gray-100 dark:border-white/5">
                            <th className="p-2 font-semibold">#</th>
                            <th className="p-2 font-semibold">Name</th>
                            <th className="p-2 font-semibold">PNO</th>
                            <th className="p-2 font-semibold">Rank</th>
                            <th className="p-2 font-semibold">Phone</th>
                            <th className="p-2 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                          {excelParsedData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-green-50 dark:hover:bg-green-500/5">
                              <td className="p-2 text-gray-400">{idx + 1}</td>
                              <td className="p-2 font-bold text-gray-800 dark:text-white">{row.name}</td>
                              <td className="p-2 font-mono text-gray-600 dark:text-white/70">{row.id}</td>
                              <td className="p-2 text-gray-600 dark:text-white/70">{row.rank}</td>
                              <td className="p-2 text-gray-500 dark:text-white/50">{row.phone}</td>
                              <td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(row.status)}`}>{row.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button onClick={handleConfirmUpload}
                    className="w-full py-4 bg-gradient-to-r from-[#002147] to-[#0d386b] dark:from-[#FF9933] dark:to-[#ffaa55] hover:opacity-90 text-white dark:text-[#001229] rounded-xl font-black text-base shadow-xl transition-all flex justify-center items-center gap-2">
                    <Check size={22} /> CONFIRM & ADD {excelParsedData.length} OFFICERS (पुष्टि करें)
                  </button>
                </div>
              )}

              {/* STEP: Processing */}
              {uploadStep === 'processing' && (
                <div className="text-center py-12 animate-fade-in flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center"><Cpu size={40} className="text-blue-500 animate-pulse" /></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="font-bold text-xl dark:text-white mb-2 text-blue-500">Adding Officers...</h3>
                  <div className="text-left max-w-sm mx-auto space-y-2 mt-4 text-sm text-gray-600 dark:text-white/60">
                    <p className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Validating PNO numbers...</p>
                    <p className="flex items-center gap-2 animate-pulse text-blue-500"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span> Creating profiles...</p>
                  </div>
                </div>
              )}

              {/* STEP: Success */}
              {uploadStep === 'success' && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"><Check size={40} /></div>
                  <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">✅ Officers Added Successfully!</h3>
                  <p className="text-gray-500 dark:text-white/60 mb-6">{excelParsedData.length} officers added to <strong>{storedThana}</strong>.</p>
                  <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                     <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                       <p className="text-xs text-gray-500 uppercase font-bold">New Officers</p>
                       <p className="text-xl font-bold text-green-500 mt-1">+{excelParsedData.length}</p>
                     </div>
                     <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                       <p className="text-xs text-gray-500 uppercase font-bold">Total Force</p>
                       <p className="text-xl font-bold text-blue-500 mt-1">{officers.length}</p>
                     </div>
                  </div>
                  <button onClick={() => setIsUploadModalOpen(false)} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold">View Updated Roster</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====== MANUAL ENTRY MODAL ====== */}
      {isManualEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#001229] w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="text-[#FF9933]" size={20} /> Register New Officer (नया कर्मचारी)
              </h3>
              <button onClick={() => setIsManualEntryOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Officer Name *</label>
                   <input type="text" placeholder="e.g. Rahul Singh" value={manualForm.name} onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
                     className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] text-gray-900 dark:text-white" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">PNO Number *</label>
                   <input type="text" placeholder="e.g. UP-1029" value={manualForm.id} onChange={(e) => setManualForm({...manualForm, id: e.target.value})}
                     className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] text-gray-900 dark:text-white" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rank</label>
                   <select value={manualForm.rank} onChange={(e) => setManualForm({...manualForm, rank: e.target.value})}
                     className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] text-gray-900 dark:text-white">
                     <option>Constable</option><option>Head Constable</option><option>Sub Inspector</option><option>Inspector</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                   <select value={manualForm.status} onChange={(e) => setManualForm({...manualForm, status: e.target.value})}
                     className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] text-gray-900 dark:text-white">
                     <option>Available</option><option>On Duty</option><option>On Leave</option><option>In Training</option>
                   </select>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Number</label>
                   <input type="tel" placeholder="+91 9999999999" value={manualForm.phone} onChange={(e) => setManualForm({...manualForm, phone: e.target.value})}
                     className="w-full p-3 bg-gray-50 dark:bg-[#000a17] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#FF9933] text-gray-900 dark:text-white" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Posting Station</label>
                   <input disabled value={storedThana} className="w-full p-3 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-500 dark:text-white/50 cursor-not-allowed" />
                 </div>
               </div>
               <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
                 <button onClick={() => setIsManualEntryOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 text-sm">Cancel</button>
                 <button onClick={handleManualSave} disabled={!manualForm.name || !manualForm.id}
                   className={`px-5 py-2.5 rounded-xl font-bold shadow-lg text-sm flex items-center gap-2 ${manualForm.name && manualForm.id ? 'bg-[#FF9933] hover:bg-[#ffaa55] text-[#001229]' : 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'}`}>
                   <Check size={16} /> Save Officer
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
