import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  ChevronDown, 
  Search, 
  MoreHorizontal, 
  TrendingUp,
  Upload,
  AlertCircle,
  Database,
  Github,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- Zero State Data ---
const ZERO_STATE = {
  metrics: { totalApplicants: 0, offersAccepted: 0, newHires: 0 },
  monthlyApplicants: Array(6).fill(0).map((_, i) => ({ name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i], value: 0 })),
  funnelData: [
    { stage: "Applied", count: 0, color: "#00f2ff" },
    { stage: "Screened", count: 0, color: "#bd00ff" },
    { stage: "Interviewed", count: 0, color: "#ff8c00" },
    { stage: "Offered", count: 0, color: "#00ff8c" },
    { stage: "Hired", count: 0, color: "#ff008c" },
  ],
  pieData: [
    { name: "Software Engineer", value: 0 },
    { name: "Product Manager", value: 0 },
    { name: "UI/UX Designer", value: 0 },
    { name: "Data Analyst", value: 0 },
  ],
  timeToHire: Array(5).fill(0).map((_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i], value: 0 })),
  candidates: []
};

const COLORS = ['#00f2ff', '#bd00ff', '#ff8c00', '#00ff8c', '#ff008c'];

const App = () => {
  const [data, setData] = useState(ZERO_STATE);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://recruitment-analytics-dashboard-2.onrender.com/api/upload', formData);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.4, 0, 0.2, 1] 
      } 
    }
  };

  return (
    <div className="min-h-screen relative flex selection:bg-cyan-500/30">
      {/* Animated Mesh Background */}
      <div className="mesh-container">
        <div className="mesh-gradient" />
      </div>

      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-all duration-500 z-40 h-screen sticky top-0">
        <div className="p-8 flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"
          >
            <TrendingUp className="text-white w-6 h-6" />
          </motion.div>
          <span className="font-black text-xl hidden lg:block tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">ANALYTICS</span>
        </div>
        
        <nav className="flex-1 px-4 mt-10 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <NavItem icon={<Users />} label="Candidates" active={activeTab === 'Candidates'} onClick={() => setActiveTab('Candidates')} />
          <NavItem icon={<FileText />} label="Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
          <NavItem icon={<Settings />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-x-hidden min-h-screen">
        {/* Header */}
        <header className="p-6 px-10 flex justify-between items-center sticky top-0 bg-black/40 backdrop-blur-2xl z-30 border-b border-white/5">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>
            <h1 className="text-3xl font-black tracking-tighter neon-text-white uppercase">RECRUITMENT ANALYTICS</h1>
            <div className="flex items-center gap-2 text-white/40 text-[10px] mt-1 font-black tracking-widest">
              <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors uppercase">
                NODE_STATION: 01 <ChevronDown size={10} />
              </span>
            </div>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
              <input 
                type="text" 
                placeholder="Query datasets..." 
                className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 w-72 transition-all duration-500 font-medium text-sm"
              />
            </div>
            
            <motion.label 
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-3 rounded-2xl flex items-center gap-3 transition-all font-black shadow-xl shadow-cyan-900/20 text-xs tracking-widest"
            >
              <Upload size={16} />
              <span>UPLOAD DATA</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </motion.label>
          </div>
        </header>

        {/* Dynamic Content Rendering */}
        <div className="p-10 pb-40 max-w-[1700px] mx-auto w-full flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' ? (
              <motion.div
                key="dashboard"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: 20, transition: { duration: 0.5 } }}
                className="space-y-10"
              >
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-center gap-4 text-red-400 backdrop-blur-md"
                  >
                    <AlertCircle size={20} />
                    <span className="font-bold text-sm tracking-tight">{error}</span>
                  </motion.div>
                )}

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div variants={itemVariants}>
                    <MetricCard 
                      title="TOTAL APPLICANTS" 
                      value={data.metrics.totalApplicants} 
                      sub="Aggregate Growth"
                      chart={
                        <ResponsiveContainer width="100%" height={60}>
                          <BarChart data={data.monthlyApplicants}>
                            <Bar dataKey="value" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} animationDuration={1500} />
                            <defs>
                              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00f2ff" />
                                <stop offset="100%" stopColor="#0066ff" />
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      }
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <MetricCard 
                      title="OFFERS ACCEPTED" 
                      value={data.metrics.offersAccepted} 
                      sub="Efficiency Rate"
                      accent="#ff8c00"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <MetricCard 
                      title="NEW HIRES" 
                      value={data.metrics.newHires} 
                      sub="Net Acquisition"
                      accent="#00ff8c"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* The Funnel */}
                  <motion.div variants={itemVariants} className="lg:col-span-7 glass-panel p-10 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-12">
                      <div>
                        <h3 className="font-black text-white/80 uppercase tracking-[0.3em] text-[10px]">Strategic Funnel</h3>
                        <p className="text-[10px] text-white/20 font-black mt-1 uppercase tracking-widest">Candidate Velocity</p>
                      </div>
                      <div className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-black text-white/30 tracking-tighter">PERIOD: Q1-Q2</div>
                    </div>
                    
                    <div className="flex flex-col gap-4 items-center">
                      {data.funnelData.map((item, idx) => (
                        <div key={item.stage} className="flex items-center w-full gap-8 group/row">
                          <div className="w-28 text-right text-[10px] font-black text-white/30 group-hover/row:text-cyan-400 transition-all duration-500 uppercase tracking-widest">{item.stage}</div>
                          <div className="flex-1 relative h-14">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.count / (data.funnelData[0].count || 1)) * 100}%` }}
                              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: idx * 0.1 }}
                              className="funnel-layer h-full rounded-r-2xl shadow-lg"
                              style={{ 
                                backgroundColor: item.color,
                                opacity: 1 - (idx * 0.1),
                                boxShadow: `inset 0 0 30px rgba(0,0,0,0.1), 0 0 40px ${item.color}15`
                              }}
                            />
                            <div className="absolute inset-0 flex items-center px-8 font-black text-black/80 text-base tracking-tighter">
                              {item.count.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Pie Chart */}
                  <motion.div variants={itemVariants} className="lg:col-span-5 glass-panel p-10 group">
                    <h3 className="font-black text-white/80 uppercase tracking-[0.3em] text-[10px] mb-10">Department Distribution</h3>
                    <div className="h-[320px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                            animationDuration={1500}
                          >
                            {data.pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-70 transition-all duration-500 cursor-pointer outline-none" />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', backdropFilter: 'blur(20px)', padding: '12px 16px' }}
                            itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">Active</p>
                        <p className="text-3xl font-black text-white/90 tracking-tighter">
                          {data.pieData.reduce((acc, curr) => acc + curr.value, 0)}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-10">
                      {data.pieData.map((item, idx) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shadow-lg shadow-black" style={{ background: COLORS[idx % COLORS.length] }} />
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{item.name}</span>
                          </div>
                          <span className="text-[10px] font-black text-white/70">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Line Chart */}
                  <motion.div variants={itemVariants} className="lg:col-span-8 glass-panel p-10">
                    <h3 className="font-black text-white/80 uppercase tracking-[0.3em] text-[10px] mb-12">Hiring Latency Map</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.timeToHire}>
                          <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00f2ff" stopOpacity={0.3}/>
                              <stop offset="100%" stopColor="#00f2ff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="15 15" stroke="#ffffff03" vertical={false} />
                          <XAxis dataKey="day" stroke="#ffffff15" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} tickMargin={15} />
                          <YAxis stroke="#ffffff15" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} tickMargin={15} />
                          <Tooltip 
                            contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', backdropFilter: 'blur(20px)' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#00f2ff" 
                            strokeWidth={5} 
                            fill="url(#areaGradient)" 
                            animationDuration={2500}
                            dot={{ fill: '#00f2ff', strokeWidth: 3, r: 5, stroke: '#000' }}
                            activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Top Candidates */}
                  <motion.div variants={itemVariants} className="lg:col-span-4 glass-panel p-10">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="font-black text-white/80 uppercase tracking-[0.3em] text-[10px]">Elite Profiles</h3>
                      <MoreHorizontal size={20} className="text-white/10 cursor-pointer hover:text-white transition-all duration-500" />
                    </div>
                    <div className="space-y-4">
                      {data.candidates.length > 0 ? (
                        data.candidates.map((c, i) => (
                          <motion.div 
                            key={i} 
                            whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.04)' }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            className="flex items-center justify-between p-4 rounded-2xl border border-white/5 transition-all"
                          >
                            <div className="flex items-center gap-5">
                              <img src={c.avatar} className="w-12 h-12 rounded-2xl bg-white/5 p-1 shadow-inner" alt="" />
                              <div>
                                <p className="font-black text-sm tracking-tight text-white/90">{c.name}</p>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Verified Node</p>
                              </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              i % 2 === 0 ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            }`}>
                              {c.status}
                            </span>
                          </motion.div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-white/5 space-y-5">
                          <Users size={56} strokeWidth={1} />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">System Standby</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* About Section */}
                <motion.section variants={itemVariants} className="pt-10">
                  <div className="glass-panel p-10 group border-white/5 hover:border-cyan-500/20">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all duration-700">
                        <Info className="text-cyan-400" size={24} />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-xl font-black tracking-tight uppercase italic text-white/90">About This Platform</h2>
                        <p className="text-sm text-white/40 font-medium leading-relaxed max-w-4xl tracking-tight">
                          An enterprise-grade Recruitment Analytics tool. Upload your ATS/HR CSV data to instantly visualize your hiring funnel, candidate sources, and tracking metrics in a dynamic 3D environment. Designed for high-velocity talent acquisition teams requiring precision data mapping and real-time lifecycle monitoring.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.section>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -20 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="h-[75vh] flex flex-col items-center justify-center"
              >
                <div className="glass-panel p-24 flex flex-col items-center text-center max-w-xl relative overflow-hidden group">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="mb-10 p-8 rounded-[2.5rem] bg-cyan-500/5 border border-cyan-500/10 group-hover:bg-cyan-500/10 transition-all duration-700"
                  >
                    <Database size={72} className="text-cyan-500/40" />
                  </motion.div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase mb-6 neon-text-white italic">{activeTab} Protocol</h2>
                  <p className="text-white/30 font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Secure Datastreams...</p>
                  
                  <div className="w-72 h-1 bg-white/5 rounded-full mt-12 overflow-hidden relative">
                    <motion.div 
                      animate={{ x: [-288, 288] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Creator Badge */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <motion.a 
            href="https://github.com/bhakrevishal2-cpu" 
            target="_blank" 
            rel="noopener noreferrer"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ scale: 1.05, translateY: -8 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-5 px-10 py-4 rounded-full premium-badge-glow backdrop-blur-3xl group transition-all"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap text-white/80 group-hover:text-white transition-colors">
              Principal Architect: <span className="rgb-glow-text">Vishal</span>
            </span>
            <div className="w-px h-5 bg-white/10 group-hover:bg-cyan-500/40 transition-all duration-700" />
            <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full group-hover:bg-white/10 transition-all duration-700 border border-white/5">
              <Github size={16} className="text-white/40 group-hover:text-cyan-400 transition-all duration-700" />
              <ArrowUpRight size={14} className="text-white/20 group-hover:text-cyan-400 transition-all duration-700" />
            </div>
          </motion.a>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <motion.div 
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all duration-500 relative group ${
      active 
      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-xl shadow-cyan-500/5' 
      : 'text-white/20 hover:text-white hover:bg-white/5 border border-transparent'
    }`}
  >
    {React.cloneElement(icon, { size: 24, strokeWidth: active ? 3 : 2, className: "transition-all duration-500" })}
    <span className="font-black text-[10px] hidden lg:block uppercase tracking-[0.2em]">{label}</span>
    {active && (
      <motion.div 
        layoutId="activeGlow"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute left-0 w-1 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_20px_#00f2ff]"
      />
    )}
  </motion.div>
);

const MetricCard = ({ title, value, sub, chart, accent = "#00f2ff" }) => (
  <div className="glass-panel p-10 overflow-hidden relative group h-full">
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div>
        <h4 className="text-[10px] font-black tracking-[0.4em] text-white/20 mb-5 uppercase">{title}</h4>
        <div className="flex items-baseline gap-3">
          <span className="text-6xl font-black tracking-tighter neon-text-white italic">
            {value === 0 ? "000" : value.toLocaleString()}
          </span>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-lg" style={{ background: accent, boxShadow: `0 0 15px ${accent}` }} />
        </div>
      </div>
      
      <div className="mt-12 flex items-end justify-between">
        <div className="flex-1 max-w-[140px]">
          {chart || (
             <div className="flex items-center gap-1.5">
               {[0.5, 0.8, 0.4, 1.0, 0.7].map((h, i) => (
                 <motion.div 
                   key={i}
                   initial={{ height: 0 }}
                   animate={{ height: `${h * 32}px` }}
                   transition={{ delay: i * 0.1, duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
                   className="w-2 rounded-full"
                   style={{ background: accent, opacity: 0.2 + (i * 0.15) }}
                 />
               ))}
             </div>
          )}
        </div>
        <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.3em] italic">{sub}</p>
      </div>
    </div>
    
    {/* Background dynamic glow */}
    <div 
      className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[120px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000"
      style={{ backgroundColor: accent }}
    />
  </div>
);

export default App;
