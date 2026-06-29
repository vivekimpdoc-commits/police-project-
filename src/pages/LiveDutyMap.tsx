import React, { useState } from 'react';
import { 
  MapPin, Search, Filter, Shield, AlertTriangle, Car, Users, Crosshair, Map as MapIcon, 
  Layers, Navigation, ChevronRight, X
} from 'lucide-react';

// Mock data for map markers
const MAP_MARKERS = [
  { id: '1', type: 'vip', lat: '45%', lng: '55%', title: 'CM Escort Route', status: 'Active', officers: 12, vehicle: 'PCR-442' },
  { id: '2', type: 'emergency', lat: '30%', lng: '40%', title: 'Mob Gathered - Aminabad', status: 'Critical', officers: 8, vehicle: 'Riot Van 2' },
  { id: '3', type: 'patrol', lat: '60%', lng: '70%', title: 'Gomti Nagar Patrol', status: 'Routine', officers: 4, vehicle: 'Interceptor 1' },
  { id: '4', type: 'traffic', lat: '50%', lng: '30%', title: 'Hazratganj Chauraha', status: 'Active', officers: 6, vehicle: 'Traffic Bike' },
  { id: '5', type: 'patrol', lat: '20%', lng: '60%', title: 'Sector 4 Beat', status: 'Routine', officers: 2, vehicle: 'Foot Patrol' },
];

export const LiveDutyMap: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

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
                  <h3 className="font-bold text-lg dark:text-white leading-tight">{selectedMarker.title}</h3>
                </div>
                <button onClick={() => setSelectedMarker(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                 <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-black/20 rounded-xl">
                    <div className="flex items-center gap-2 text-sm dark:text-white/80">
                       <Users size={16} className="text-blue-500" /> Force Deployed
                    </div>
                    <div className="font-bold dark:text-white">{selectedMarker.officers}</div>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-black/20 rounded-xl">
                    <div className="flex items-center gap-2 text-sm dark:text-white/80">
                       <Car size={16} className="text-amber-500" /> Vehicle
                    </div>
                    <div className="font-bold font-mono text-xs dark:text-white">{selectedMarker.vehicle}</div>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-red-500/20">
                    <div className="flex items-center gap-2 text-sm dark:text-white/80">
                       <AlertTriangle size={16} className={selectedMarker.type === 'emergency' ? 'text-red-500' : 'text-green-500'} /> Status
                    </div>
                    <div className={`font-bold text-xs ${selectedMarker.type === 'emergency' ? 'text-red-500' : 'text-green-500'}`}>{selectedMarker.status}</div>
                 </div>
              </div>

              <button className="w-full py-3 bg-[#002147] dark:bg-white text-white dark:text-[#001229] rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2">
                 View Duty Details <ChevronRight size={16} />
              </button>
           </div>
        </div>
      )}

    </div>
  );
};
