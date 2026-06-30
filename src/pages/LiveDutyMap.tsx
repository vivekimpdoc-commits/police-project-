import React, { useState } from 'react';
import { 
  MapPin, Search, Filter, Shield, AlertTriangle, Car, Users, Crosshair, Map as MapIcon, 
  Layers, Navigation, ChevronRight, X
} from 'lucide-react';

// Mock data for map markers
const MAP_MARKERS = [
  // Hazratganj
  { id: '1', type: 'vip', lat: '45%', lng: '55%', title: 'CM Escort Route', status: 'Active', officers: 12, vehicle: 'PCR-442', station: 'Hazratganj' },
  { id: '2', type: 'emergency', lat: '30%', lng: '40%', title: 'Mob Gathered - Hazratganj', status: 'Critical', officers: 8, vehicle: 'Riot Van 2', station: 'Hazratganj' },
  { id: '3', type: 'patrol', lat: '60%', lng: '70%', title: 'Park Road Patrol', status: 'Routine', officers: 4, vehicle: 'Interceptor 1', station: 'Hazratganj' },
  { id: '4', type: 'traffic', lat: '50%', lng: '30%', title: 'Hazratganj Chauraha', status: 'Active', officers: 6, vehicle: 'Traffic Bike', station: 'Hazratganj' },
  { id: '5', type: 'patrol', lat: '20%', lng: '60%', title: 'Janpath Market Beat', status: 'Routine', officers: 2, vehicle: 'Foot Patrol', station: 'Hazratganj' },
  
  // Gomti Nagar
  { id: '6', type: 'vip', lat: '70%', lng: '50%', title: 'Minister Route Security', status: 'Active', officers: 15, vehicle: 'Static Guard', station: 'Gomti Nagar' },
  { id: '7', type: 'emergency', lat: '80%', lng: '20%', title: 'Marine Drive Accident', status: 'Critical', officers: 6, vehicle: 'Ambulance & PCR', station: 'Gomti Nagar' },
  { id: '8', type: 'patrol', lat: '10%', lng: '40%', title: '1090 Chauraha Patrol', status: 'Routine', officers: 4, vehicle: 'PCR-112', station: 'Gomti Nagar' },
  
  // Chowk
  { id: '9', type: 'traffic', lat: '85%', lng: '80%', title: 'Old City Checkpost', status: 'Active', officers: 8, vehicle: 'Interceptor 3', station: 'Chowk' },
  { id: '10', type: 'patrol', lat: '35%', lng: '85%', title: 'Ghanta Ghar Beat', status: 'Routine', officers: 2, vehicle: 'Foot Patrol', station: 'Chowk' },
  
  // Alambagh
  { id: '11', type: 'emergency', lat: '45%', lng: '20%', title: 'Highway Collision', status: 'Critical', officers: 8, vehicle: 'PCR-200', station: 'Alambagh' },
  { id: '12', type: 'patrol', lat: '65%', lng: '80%', title: 'Bus Stand Patrol', status: 'Routine', officers: 6, vehicle: 'Interceptor 5', station: 'Alambagh' },
];

export const LiveDutyMap: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getMarkerIcon = (type: string) => {
    switch(type) {
      case 'vip': return <Shield className="text-amber-500" size={16} />;
      case 'emergency': return <AlertTriangle className="text-red-500" size={16} />;
      case 'traffic': return <Car className="text-blue-500" size={16} />;
      default: return <Users className="text-emerald-500" size={16} />;
    }
  };

  const getMarkerColor = (type: string) => {
    switch(type) {
      case 'vip': return 'bg-amber-500 border-amber-200 shadow-amber-500/50';
      case 'emergency': return 'bg-red-500 border-red-200 shadow-red-500/50 animate-pulse';
      case 'traffic': return 'bg-blue-500 border-blue-200 shadow-blue-500/50';
      default: return 'bg-emerald-500 border-emerald-200 shadow-emerald-500/50';
    }
  };

  const storedThana = localStorage.getItem('demoThana') || 'Hazratganj';
  // TRUE FILTERING: Only show markers for the logged-in Thana
  const filteredMarkers = MAP_MARKERS.filter(m => 
    m.station === storedThana && (activeFilter === 'all' || m.type === activeFilter)
  );

  return (
    <div className="flex-1 w-full h-full flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="flex-1 w-full h-full bg-gradient-to-b from-[#1a1c29] to-[#0a0a0f] relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col">
      
      {/* Top Floating Bar */}
      <div className="absolute top-6 left-6 right-6 z-20 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pointer-events-none">
         <div className="bg-[#0f172a]/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white/10 pointer-events-auto flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF9933]/20 rounded-full flex items-center justify-center border border-[#FF9933]/30 shadow-[0_0_15px_rgba(255,153,51,0.2)]">
              <MapIcon size={24} className="text-[#FF9933]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading text-white leading-tight">Live Deployment Map</h1>
              <p className="text-[11px] text-[#FF9933] font-bold tracking-wider mt-1 uppercase">{storedThana} • Real-time Tracking</p>
            </div>
         </div>
         
         <div className="bg-[#0f172a]/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/10 pointer-events-auto flex gap-2">
            {[
              { id: 'all', label: 'All Units', icon: Layers },
              { id: 'vip', label: 'VIP Security', icon: Shield },
              { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
              { id: 'patrol', label: 'Patrol', icon: Users },
            ].map(f => (
              <button 
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeFilter === f.id ? 'bg-[#FF9933] text-[#0a0a0f] shadow-[0_0_15px_rgba(255,153,51,0.4)]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <f.icon size={16} /> <span className="hidden sm:inline">{f.label}</span>
              </button>
            ))}
         </div>
      </div>

      {/* Tactical Radar Map Container */}
      <div className="absolute inset-0 z-0 bg-[#020d1a] overflow-hidden">
         {/* Cyber Grid */}
         <div className="absolute inset-0 opacity-30" 
              style={{
                backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}>
         </div>
         
         {/* Glowing Ambient Orbs */}
         <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF9933]/10 rounded-full blur-[120px] pointer-events-none"></div>
         
         {/* Radar Concentric Circles */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/10 rounded-full pointer-events-none"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/15 rounded-full pointer-events-none"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-blue-500/20 rounded-full pointer-events-none bg-blue-500/5 shadow-[inset_0_0_50px_rgba(59,130,246,0.1)]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-blue-500/30 rounded-full pointer-events-none"></div>
         
         {/* Sweeping Radar Scanner */}
         <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-tl-full origin-bottom-right bg-gradient-to-br from-blue-500/40 to-transparent animate-[spin_4s_linear_infinite] -ml-[400px] -mt-[400px] border-l-2 border-t-2 border-blue-400 pointer-events-none shadow-[0_0_30px_rgba(59,130,246,0.5)]"></div>
         
         {/* Vignette Overlay to darken edges */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#020d1a_100%)] pointer-events-none"></div>
         <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

         {/* Crosshair Center indicator */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 z-0">
           <Crosshair size={40} className="text-blue-400" strokeWidth={1} />
         </div>

         {/* Map Markers */}
         {filteredMarkers.map(marker => (
           <div 
             key={marker.id} 
             onClick={() => setSelectedMarker(marker)}
             className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
             style={{ top: marker.lat, left: marker.lng }}
           >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max px-3 py-1.5 bg-[#001229]/95 backdrop-blur-md border border-[#FF9933]/40 rounded-lg text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-[0_4px_15px_rgba(0,0,0,0.5)] translate-y-2 group-hover:translate-y-0">
                {marker.title}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#FF9933]/40"></div>
              </div>
              
              {/* Radar Ping Animation */}
              <div className="relative flex items-center justify-center">
                 {/* Ripple effect */}
                 <div className={`absolute inset-0 rounded-full border-2 ${getMarkerColor(marker.type).split(' ')[0].replace('bg-', 'border-')} animate-ping opacity-60 scale-150`}></div>
                 <div className={`absolute inset-0 rounded-full border-2 ${getMarkerColor(marker.type).split(' ')[0].replace('bg-', 'border-')} animate-pulse opacity-40 scale-[2]`}></div>
                 
                 {/* Solid Pin */}
                 <div className={`w-12 h-12 rounded-full border-2 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${activeFilter === 'all' || activeFilter === marker.type ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} ${
                      selectedMarker?.id === marker.id ? 'ring-4 ring-[#FF9933] ring-offset-2 ring-offset-transparent scale-125 z-20' : 'hover:scale-110'
                    }`}>
                    {getMarkerIcon(marker.type)}
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Map Controls */}
         <div className="absolute right-6 bottom-6 flex flex-col gap-2 z-10">
            <button className="w-12 h-12 bg-[#0f172a]/90 backdrop-blur-md rounded-xl flex items-center justify-center text-white/70 hover:text-[#FF9933] shadow-2xl border border-white/10 transition-colors">
              <Navigation size={20} />
            </button>
            <button className="w-12 h-12 bg-[#0f172a]/90 backdrop-blur-md rounded-xl flex items-center justify-center text-white/70 hover:text-[#FF9933] shadow-2xl border border-white/10 transition-colors mt-2">
              <span className="font-bold text-xl leading-none">+</span>
            </button>
            <button className="w-12 h-12 bg-[#0f172a]/90 backdrop-blur-md rounded-xl flex items-center justify-center text-white/70 hover:text-[#FF9933] shadow-2xl border border-white/10 transition-colors">
              <span className="font-bold text-xl leading-none">-</span>
            </button>
         </div>

      {/* Selected Marker Details Panel */}
      {selectedMarker && (
        <div className="absolute bottom-8 left-4 z-30 w-80 bg-white/95 dark:bg-[#001229]/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden animate-slide-up">
           <div className={`h-2 w-full ${getMarkerColor(selectedMarker.type).split(' ')[0]}`}></div>
           <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-white/50">{selectedMarker.type} DUTY</span>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{selectedMarker.title}</h3>
                </div>
                <button onClick={() => setSelectedMarker(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                 <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-black/20 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-white/80">
                       <Users size={16} className="text-blue-500" /> Force Deployed
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">{selectedMarker.officers}</div>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-black/20 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-white/80">
                       <Car size={16} className="text-amber-500" /> Vehicle
                    </div>
                    <div className="font-bold font-mono text-xs text-gray-900 dark:text-white">{selectedMarker.vehicle}</div>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-red-500/20">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-white/80">
                       <AlertTriangle size={16} className={selectedMarker.type === 'emergency' ? 'text-red-500' : 'text-green-500'} /> Status
                    </div>
                    <div className={`font-bold text-xs ${selectedMarker.type === 'emergency' ? 'text-red-500' : 'text-green-500'}`}>{selectedMarker.status}</div>
                 </div>
              </div>

              <button onClick={() => setShowDetailsModal(true)} className="w-full py-3 bg-[#002147] dark:bg-white text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2">
                 View Duty Details <ChevronRight size={16} />
              </button>
           </div>
        </div>
      )}

      {/* Duty Details Full Modal */}
      {showDetailsModal && selectedMarker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)}></div>
           
           <div className="relative w-full max-w-3xl bg-white dark:bg-[#001229] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-full animate-scale-up">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-start bg-gray-50/50 dark:bg-white/5 shrink-0">
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                     <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getMarkerColor(selectedMarker.type).replace('shadow', '')}`}>
                       {selectedMarker.type} DUTY
                     </span>
                     <span className="text-xs font-mono font-bold text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded bg-white dark:bg-black/20">
                       ID: DTY-8{selectedMarker.id}42
                     </span>
                   </div>
                   <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">{selectedMarker.title}</h2>
                 </div>
                 <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-500 transition-colors">
                   <X size={20} />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                       <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">Commander In-Charge</p>
                       <p className="font-bold text-blue-900 dark:text-white text-lg">Insp. R.K. Sharma</p>
                       <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 flex items-center gap-1">📞 +91 9876543210</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                       <p className="text-xs text-gray-500 dark:text-white/40 font-bold uppercase tracking-wider mb-1">Time Window</p>
                       <p className="font-bold text-gray-900 dark:text-white text-lg">08:00 - 18:00</p>
                       <p className="text-xs text-gray-500 dark:text-white/50 mt-1">Today (10 Hours)</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                       <p className="text-xs text-gray-500 dark:text-white/40 font-bold uppercase tracking-wider mb-1">Hierarchy Status</p>
                       <p className="font-bold text-green-600 dark:text-green-400 text-lg flex items-center gap-2">Active</p>
                       <p className="text-xs text-gray-500 dark:text-white/50 mt-1">Approved by HQ</p>
                    </div>
                 </div>

                 <div className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 dark:bg-white/5 p-3 border-b border-gray-100 dark:border-white/10 font-bold text-sm text-gray-700 dark:text-white/80">
                      Force Roster ({selectedMarker.officers} Personnel)
                    </div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white dark:bg-[#000a17]">
                       {[...Array(selectedMarker.officers > 6 ? 6 : selectedMarker.officers)].map((_, i) => (
                         <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0">
                               <img src={`https://api.dicebear.com/7.x/initials/svg?seed=Officer${i}&backgroundColor=002147`} alt="Officer" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-gray-800 dark:text-white truncate">Constable {i+1}</p>
                              <p className="text-[10px] text-gray-500 truncate">UP-{1000+i}</p>
                            </div>
                         </div>
                       ))}
                       {selectedMarker.officers > 6 && (
                         <div className="flex items-center justify-center p-2 rounded-lg border border-dashed border-gray-300 dark:border-white/20 text-xs font-bold text-gray-500 dark:text-white/50">
                           + {selectedMarker.officers - 6} More
                         </div>
                       )}
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                     <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2 border-b border-gray-100 dark:border-white/10 pb-2">
                       <Car size={16} className="text-[#FF9933]" /> Logistics Deployed
                     </h4>
                     <ul className="space-y-2 text-sm text-gray-600 dark:text-white/70">
                        <li className="flex justify-between border-b border-dashed border-gray-200 dark:border-white/5 pb-1">
                          <span>Primary Vehicle</span> <strong>{selectedMarker.vehicle}</strong>
                        </li>
                        <li className="flex justify-between border-b border-dashed border-gray-200 dark:border-white/5 pb-1">
                          <span>Comms Sets</span> <strong>{Math.max(2, Math.floor(selectedMarker.officers/2))} Walkie-Talkies</strong>
                        </li>
                        <li className="flex justify-between border-b border-dashed border-gray-200 dark:border-white/5 pb-1">
                          <span>Special Gear</span> <strong>Standard Kit</strong>
                        </li>
                     </ul>
                   </div>
                   
                   <div>
                     <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2 border-b border-gray-100 dark:border-white/10 pb-2">
                       <AlertTriangle size={16} className="text-[#FF9933]" /> Special Instructions
                     </h4>
                     <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed bg-amber-50 dark:bg-amber-500/5 p-3 rounded-xl border border-amber-100 dark:border-amber-500/10 italic">
                       Maintain strict vigilance. No unauthorized vehicles allowed in the perimeter. Report to control room every 2 hours via wireless set channel 4.
                     </p>
                   </div>
                 </div>

              </div>
              
              {/* Modal Footer */}
              <div className="p-5 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0 flex justify-end gap-3">
                 <button className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-white/70 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
                    <Navigation size={16} /> Open in Navigation
                 </button>
                 <button className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#002147] dark:bg-[#FF9933] dark:text-[#001229] shadow-lg hover:opacity-90 transition-opacity">
                    Export Full Roster (PDF)
                 </button>
              </div>
           </div>
        </div>
      )}

      </div>
    </div>
  );
};
