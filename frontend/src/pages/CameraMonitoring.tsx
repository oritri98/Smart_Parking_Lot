import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Wifi, WifiOff, Eye, ScanLine, Cpu, AlertTriangle, Video } from 'lucide-react';
import { PageHeader } from '../components/index';
import { cameraService } from '../services/cameraService';
import type { CameraFeed } from '../types';

function CameraCard({ camera, index, isActive, onClick }: { camera: CameraFeed; index: number; isActive: boolean; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      className={`card overflow-hidden group cursor-pointer transition-all duration-300 border ${
        isActive 
          ? 'ring-2 ring-[var(--accent)] scale-[1.02]' 
          : 'hover:scale-[1.02]'
      }`}
      style={{ borderColor: isActive ? 'var(--accent)' : 'var(--border-soft)' }}
    >
      {/* Camera "feed" area */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid var(--border-soft)' }}>
        {/* Animated scan line */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        {/* Center icon */}
        <div className="relative z-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-soft)' }}>
            <Video size={24} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
          </div>
          <p className="text-xs font-semibold" style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
            {isActive ? 'Active Preview' : 'Feed Offline'}
          </p>
        </div>

        {/* Status dot */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(100,116,139,0.3)' }}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-400'}`} />
          <span className="text-xs text-white/70">{isActive ? 'Simulated' : 'Offline'}</span>
        </div>

        {/* Basement badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-bold"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
          {camera.basement}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{camera.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{camera.location}</p>
          </div>
          <WifiOff size={14} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-soft)' }}>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={isActive
              ? { background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }
              : { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }
            }>
            {isActive ? 'Simulated Demo' : camera.detectionStatus}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{camera.position}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function CameraMonitoring() {
  const [cameras, setCameras] = useState<CameraFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showEmptySlots, setShowEmptySlots] = useState(true);
  const [showLPR, setShowLPR] = useState(true);
  const [selectedCam, setSelectedCam] = useState<CameraFeed | null>(null);

  useEffect(() => {
    cameraService.getCameraFeeds().then(data => {
      setCameras(data);
      if (data.length > 0) {
        const active = data.find(c => c.id === 'cam-002') || data[0];
        setSelectedCam(active);
      }
      setLoading(false);
    });
  }, []);

  const futureFeatures = [
    { icon: <Eye size={20} />, title: 'Vehicle Detection', desc: 'AI-powered computer vision to detect vehicles entering and exiting parking zones in real-time.' },
    { icon: <ScanLine size={20} />, title: 'Parking Slot Detection', desc: 'Automated detection of available and occupied slots using overhead camera feeds.' },
    { icon: <Camera size={20} />, title: 'License Plate Recognition', desc: 'LPR/ANPR system to automatically identify vehicle plates for access control and logging.' },
    { icon: <Wifi size={20} />, title: 'Real-Time Basement Monitoring', desc: 'Live streaming from all 8 basement cameras integrated into the monitoring dashboard.' },
    { icon: <Cpu size={20} />, title: 'AI Event Detection', desc: 'Intelligent detection of unauthorized parking, wrong-zone vehicles, and security events.' },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Camera Monitoring"
        subtitle="Future live monitoring center for AUST's basement camera network. Currently pending hardware deployment."
        badge="Coming Soon"
      />

      {/* ── AI DETECTION SIMULATOR ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="card p-6 relative overflow-hidden border" style={{ borderColor: 'var(--border-soft)' }}>
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-5 pointer-events-none"
            style={{ background: 'var(--accent)' }} />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            {/* Left Column: Controls & Metrics */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">YOLOv8 CV Engine</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                  AI Dataset & Detection Showcase
                </h2>
                <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                  A visual simulator demonstrating how AUST-IPMS processes camera feeds in real-time. Toggle the detection layers below to visualize bounding boxes and OCR results.
                </p>
              </div>

              {/* Switches */}
              <div className="space-y-3">
                {[
                  { state: showVehicles, setter: setShowVehicles, label: 'Vehicle Bounding Boxes', desc: 'Detects cars & bikes (YOLOv8-nano)', color: '#ef4444' },
                  { state: showEmptySlots, setter: setShowEmptySlots, label: 'Empty Slot Indicators', desc: 'Identifies open spaces (YOLOv8-OBB)', color: '#10b981' },
                  { state: showLPR, setter: setShowLPR, label: 'License Plate Recognition', desc: 'Extracts license plates (YOLO-LPR + OCR)', color: '#fb923c' },
                ].map(t => (
                  <button
                    key={t.label}
                    onClick={() => t.setter(!t.state)}
                    className="w-full flex items-center justify-between p-3 rounded-xl transition-all text-left border"
                    style={t.state
                      ? { background: 'var(--bg-elevated)', borderColor: `${t.color}35` }
                      : { background: 'transparent', borderColor: 'var(--border-soft)' }}
                  >
                    <div>
                      <p className="text-xs font-bold" style={{ color: t.state ? t.color : 'var(--text-primary)' }}>{t.label}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                    </div>
                    {/* Toggle pill */}
                    <div className="w-8 h-4 rounded-full p-0.5 relative transition-colors duration-200"
                      style={{ background: t.state ? t.color : 'var(--border-soft)' }}>
                      <motion.div
                        layout
                        className="w-3 h-3 rounded-full bg-white shadow-sm"
                        animate={{ x: t.state ? 16 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-5 p-3 rounded-xl text-[10px]"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)' }}>mAP@50-95</p>
                  <p className="font-bold text-cyan-400 text-xs sm:text-sm">94.6%</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)' }}>Inference Speed</p>
                  <p className="font-bold text-cyan-400 text-xs sm:text-sm">8.2ms</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)' }}>Precision</p>
                  <p className="font-bold text-emerald-400 text-xs sm:text-sm">96.8%</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)' }}>Recall</p>
                  <p className="font-bold text-emerald-400 text-xs sm:text-sm">93.5%</p>
                </div>
              </div>
            </div>

            {/* Right Column: CCTV Monitor Screen */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-1">
                {/* CCTV Frame */}
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

                  {/* Scan line overlay */}
                  <div className="absolute inset-0 overflow-hidden opacity-[0.05] pointer-events-none">
                    <motion.div
                      className="absolute left-0 right-0 h-px bg-cyan-400"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>

                  {/* Header info overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 text-[10px] font-mono text-slate-400 bg-slate-950/70 py-1.5 px-3 rounded-lg backdrop-blur-md border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedCam?.id === 'cam-002' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span>{selectedCam?.name ? selectedCam.name.toUpperCase().replace(/[\s—-]+/g, '_') : 'CAMERA_FEED'}</span>
                    </div>
                    <div>
                      {selectedCam?.id === 'cam-002' ? 'FPS: 30.0 · INFERENCE: 8.2ms' : 'SIGNAL: PENDING DEPLOYMENT'}
                    </div>
                    <div>2026-06-04 18:30:12</div>
                  </div>

                  {/* Dynamic Stream rendering */}
                  {selectedCam?.id === 'cam-002' ? (
                    /* Parking Bay Lanes Rendering (Active CV Model) */
                    <div className="absolute inset-0 flex items-center justify-around px-4 sm:px-8 pt-10 pb-6">
                      {/* Bay 1: Occupied by a red car */}
                      <div className="relative w-[22%] h-full flex flex-col items-center justify-center border-l-2 border-r-2 border-dashed border-slate-700/60">
                        {/* Car vector */}
                        <svg className="w-12 sm:w-16 h-24 sm:h-28 opacity-90" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="3" width="20" height="34" rx="4" fill="#ef4444" />
                          <rect x="4.5" y="10" width="15" height="18" rx="2" fill="#111827" />
                          <path d="M5.5 12L6.5 16H17.5L18.5 12H5.5Z" fill="#374151" />
                          <path d="M5.5 25L6.5 23H17.5L18.5 25H5.5Z" fill="#374151" />
                          <circle cx="6" cy="5" r="1.5" fill="#fef08a" />
                          <circle cx="18" cy="5" r="1.5" fill="#fef08a" />
                        </svg>

                        {/* Bounding Box: Vehicle */}
                        <AnimatePresence>
                          {showVehicles && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute -inset-1 sm:-inset-2 border-2 border-red-500/80 rounded-lg flex flex-col justify-between"
                              style={{ boxShadow: '0 0 8px rgba(239,68,68,0.3)' }}
                            >
                              <span className="absolute -top-3.5 left-0 bg-red-500 text-white text-[8px] px-1 rounded font-bold uppercase tracking-wider font-mono">
                                Car 99%
                              </span>
                              {/* Bounding Box corner brackets */}
                              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white -mt-0.5 -ml-0.5" />
                              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white -mt-0.5 -mr-0.5" />
                              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white -mb-0.5 -ml-0.5" />
                              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white -mb-0.5 -mr-0.5" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Bounding Box: LPR */}
                        <AnimatePresence>
                          {showLPR && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute bottom-2 bg-[#fb923c] text-slate-950 font-bold font-mono text-[7px] py-0.5 px-1.5 rounded shadow-lg border border-[#fb923c]/40"
                              style={{ boxShadow: '0 0 6px rgba(251,146,60,0.5)' }}
                            >
                              DM-GA-12-9088
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Bay 2: Empty slot */}
                      <div className="relative w-[22%] h-full flex flex-col items-center justify-center border-l-2 border-r-2 border-dashed border-slate-700/60">
                        {/* Bounding Box: Empty Slot */}
                        <AnimatePresence>
                          {showEmptySlots && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 border-2 border-dashed border-emerald-500/80 rounded-lg"
                              style={{ boxShadow: 'inset 0 0 10px rgba(16,185,129,0.1), 0 0 8px rgba(16,185,129,0.2)' }}
                            >
                              <span className="absolute -top-3.5 left-0 bg-emerald-500 text-white text-[8px] px-1 rounded font-bold uppercase tracking-wider font-mono">
                                Empty 97%
                              </span>
                              {/* Bounding Box corner brackets */}
                              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white -mt-0.5 -ml-0.5" />
                              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white -mt-0.5 -mr-0.5" />
                              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white -mb-0.5 -ml-0.5" />
                              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white -mb-0.5 -mr-0.5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Bay 3: Occupied by a blue car */}
                      <div className="relative w-[22%] h-full flex flex-col items-center justify-center border-l-2 border-r-2 border-dashed border-slate-700/60">
                        {/* Car vector */}
                        <svg className="w-12 sm:w-16 h-24 sm:h-28 opacity-90" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="3" width="20" height="34" rx="4" fill="#38bdf8" />
                          <rect x="4.5" y="10" width="15" height="18" rx="2" fill="#111827" />
                          <path d="M5.5 12L6.5 16H17.5L18.5 12H5.5Z" fill="#374151" />
                          <path d="M5.5 25L6.5 23H17.5L18.5 25H5.5Z" fill="#374151" />
                          <circle cx="6" cy="5" r="1.5" fill="#fef08a" />
                          <circle cx="18" cy="5" r="1.5" fill="#fef08a" />
                        </svg>

                        {/* Bounding Box: Vehicle */}
                        <AnimatePresence>
                          {showVehicles && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute -inset-1 sm:-inset-2 border-2 border-red-500/80 rounded-lg flex flex-col justify-between"
                              style={{ boxShadow: '0 0 8px rgba(239,68,68,0.3)' }}
                            >
                              <span className="absolute -top-3.5 left-0 bg-red-500 text-white text-[8px] px-1 rounded font-bold uppercase tracking-wider font-mono">
                                Car 98%
                              </span>
                              {/* Bounding Box corner brackets */}
                              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white -mt-0.5 -ml-0.5" />
                              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white -mt-0.5 -mr-0.5" />
                              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white -mb-0.5 -ml-0.5" />
                              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white -mb-0.5 -mr-0.5" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Bounding Box: LPR */}
                        <AnimatePresence>
                          {showLPR && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute bottom-2 bg-[#fb923c] text-slate-950 font-bold font-mono text-[7px] py-0.5 px-1.5 rounded shadow-lg border border-[#fb923c]/40"
                              style={{ boxShadow: '0 0 6px rgba(251,146,60,0.5)' }}
                            >
                              DM-HA-22-3112
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Bay 4: Empty slot */}
                      <div className="relative w-[22%] h-full flex flex-col items-center justify-center border-l-2 border-r-2 border-dashed border-slate-700/60">
                        {/* Bounding Box: Empty Slot */}
                        <AnimatePresence>
                          {showEmptySlots && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 border-2 border-dashed border-emerald-500/80 rounded-lg"
                              style={{ boxShadow: 'inset 0 0 10px rgba(16,185,129,0.1), 0 0 8px rgba(16,185,129,0.2)' }}
                            >
                              <span className="absolute -top-3.5 left-0 bg-emerald-500 text-white text-[8px] px-1 rounded font-bold uppercase tracking-wider font-mono">
                                Empty 96%
                              </span>
                              {/* Bounding Box corner brackets */}
                              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white -mt-0.5 -ml-0.5" />
                              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white -mt-0.5 -mr-0.5" />
                              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white -mb-0.5 -ml-0.5" />
                              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white -mb-0.5 -mr-0.5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ) : (
                    /* Channel Pending Deployment (Coming Soon) Screen */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 z-10">
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex flex-col justify-around">
                        <div className="h-4 bg-white w-full" />
                        <div className="h-4 bg-red-600 w-full" />
                        <div className="h-4 bg-blue-600 w-full" />
                        <div className="h-4 bg-yellow-600 w-full" />
                      </div>

                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative mb-4"
                      >
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-900/80 border border-slate-800 text-amber-500/80">
                          <WifiOff size={28} />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                      </motion.div>

                      <h4 className="text-sm font-bold text-slate-200 mb-1 font-mono tracking-wide">
                        HARDWARE PENDING DEPLOYMENT
                      </h4>
                      <p className="max-w-md text-[10px] text-slate-400 leading-relaxed mb-4 font-mono">
                        Feed offline from <strong className="text-amber-400">{selectedCam?.name}</strong>.
                        Model endpoints are ready; streaming will initialize once local network bridges are deployed.
                      </p>

                      <button
                        onClick={() => {
                          const demo = cameras.find(c => c.id === 'cam-002');
                          if (demo) setSelectedCam(demo);
                        }}
                        className="px-4 py-1.5 rounded-lg text-[10px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-lg hover:shadow-cyan-400/20 active:scale-95 font-mono"
                      >
                        RUN YOLO SIMULATION DEMO
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
            Planned Camera Positions
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-soft)' }}>
            All Offline — Pending Deployment
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cameras.map((cam, i) => (
              <CameraCard
                key={cam.id}
                camera={cam}
                index={i}
                isActive={selectedCam?.id === cam.id}
                onClick={() => {
                  setSelectedCam(cam);
                  // Scroll to CCTV simulator smoothly
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Future features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle size={18} style={{ color: '#c084fc' }} />
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
            Future Detection Capabilities
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
            Coming Soon
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {futureFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
