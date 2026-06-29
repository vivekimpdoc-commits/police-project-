import React, { useState } from 'react';
import { 
  MapPin, Search, Filter, Shield, AlertTriangle, Car, Users, Crosshair, Map as MapIcon, 
  Layers, Navigation, ChevronRight, X
} from 'lucide-react';

// Mock data for map markers
const MAP_MARKERS = [
  { id: '1', type: 'vip', lat: '45%', lng: '55%', title: 'CM Escort Route', status: 'Active', officers: 12, vehicle: 'PCR-442' },
  { id: '2', type: 'emergency', lat: '30%', lng: '40%', title: 'Mob Gathered - Hazratganj', status: 'Critical', officers: 8, vehicle: 'Riot Van 2' },
  { id: '3', type: 'patrol', lat: '60%', lng: '70%', title: 'Park Road Patrol', status: 'Routine', officers: 4, vehicle: 'Interceptor 1' },
  { id: '4', type: 'traffic', lat: '50%', lng: '30%', title: 'Hazratganj Chauraha', status: 'Active', officers: 6, vehicle: 'Traffic Bike' },
  { id: '5', type: 'patrol', lat: '20%', lng: '60%', title: 'Janpath Market Beat', status: 'Routine', officers: 2, vehicle: 'Foot Patrol' },
  { id: '6', type: 'vip', lat: '70%', lng: '50%', title: 'Governor House', status: 'Active', officers: 15, vehicle: 'Static Guard' },
  { id: '7', type: 'emergency', lat: '80%', lng: '20%', title: 'Ashok Marg Accident', status: 'Critical', officers: 6, vehicle: 'Ambulance & PCR' },
  { id: '8', type: 'patrol', lat: '10%', lng: '40%', title: 'Vidhan Sabha Patrol', status: 'Routine', officers: 4, vehicle: 'PCR-112' },
  { id: '9', type: 'traffic', lat: '85%', lng: '80%', title: 'GPO Checkpost', status: 'Active', officers: 8, vehicle: 'Interceptor 3' },
  { id: '10', type: 'patrol', lat: '35%', lng: '85%', title: 'Sikandar Bagh Beat', status: 'Routine', officers: 2, vehicle: 'Foot Patrol' },
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

  const filteredMarkers = MAP_MARKERS.filter(m => activeFilter === 'all' || m.type === activeFilter);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-[#000a17] relative overflow-hidden">
      
      {/* Top Floating Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pointer-events-none">
         <div className="bg-white/90 dark:bg-[#001229]/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 pointer-events-auto flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF9933]/20 rounded-full flex items-center justify-center">
              <MapIcon size={24} className="text-[#FF9933]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading dark:text-white leading-tight">Live Deployment Map</h1>
              <p className="text-xs text-gray-500 dark:text-white/60">Lucknow District • Real-time Tracking</p>
            </div>
         </div>
         
         <div className="bg-white/90 dark:bg-[#001229]/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 pointer-events-auto flex gap-2">
            {[
              { id: 'all', label: 'All Units', icon: Layers },
              { id: 'vip', label: 'VIP Security', icon: Shield },
              { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
              { id: 'patrol', label: 'Patrol', icon: Users },
            ].map(f => (
              <button 
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeFilter === f.id ? 'bg-[#002147] dark:bg-[#FF9933] text-white dark:text-[#001229]' : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10'}`}
              >
                <f.icon size={16} /> <span className="hidden sm:inline">{f.label}</span>
              </button>
            ))}
         </div>
      </div>

      {/* Map Container (Mocked with absolute positioning over a static map image) */}
      <div className="absolute inset-0 z-0 bg-[#e5e3df] dark:bg-[#000a17]">
         <div className="w-full h-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Lucknow,UP&zoom=13&size=1920x1080&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x333333&style=feature:water|element:geometry|color:0x1b2c45&style=feature:landscape|element:geometry|color:0x000a17&sensor=false')] bg-cover bg-center opacity-80 mix-blend-luminosity"></div>
         
         {/* Map Overlay for Dark Mode */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#000a17] via-transparent to-[#000a17] opacity-60"></div>

         {/* Markers */}
         {filteredMarkers.map(marker => (
           <div 
             key={marker.id} 
             onClick={() => setSelectedMarker(marker)}
             className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group z-10"
             style={{ top: marker.lat, left: marker.lng }}
           >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {marker.title}
              </div>
              
              {/* Pin */}
              <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform hover:scale-125 ${getMarkerColor(marker.type)}`}>
                 <div className="bg-white dark:bg-[#001229] w-full h-full rounded-full flex items-center justify-center">
                   {getMarkerIcon(marker.type)}
                 </div>
              </div>
              {/* Pin Shadow/Stem */}
              <div className="w-1 h-4 bg-gray-900/50 dark:bg-white/30 mx-auto -mt-1 rounded-full"></div>
              <div className="w-4 h-1 bg-black/40 blur-[2px] mx-auto rounded-full mt-0.5"></div>
           </div>
         ))}
      </div>

      {/* Crosshair Center indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 z-0">
        <Crosshair size={100} className="text-gray-900 dark:text-white" strokeWidth={1} />
      </div>

      {/* Floating Controls Right */}
      <div className="absolute right-4 bottom-8 z-20 flex flex-col gap-2 pointer-events-none">
         <button className="w-12 h-12 bg-white dark:bg-[#001229] rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white/70 hover:text-[#FF9933] hover:border-[#FF9933] pointer-events-auto transition-colors">
           <Navigation size={20} />
         </button>
         <button className="w-12 h-12 bg-white dark:bg-[#001229] rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white/70 hover:text-[#FF9933] pointer-events-auto transition-colors text-xl font-light">
           +
         </button>
         <button className="w-12 h-12 bg-white dark:bg-[#001229] rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white/70 hover:text-[#FF9933] pointer-events-auto transition-colors text-xl font-light">
           -
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
  );
};
