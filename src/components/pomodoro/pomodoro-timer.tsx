import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Circle, 
  Coffee, Wind, Flame, Brain, Clock, 
  X, ListTodo, Plus, Target, CloudRain, Music, Waves, FileText, CalendarHeart,
  Settings, Trash2
} from 'lucide-react';

// ── Types ──
interface PomodoroProps { initial_focus?: string; }

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';
type AmbientSound = 'rain' | 'cafe' | 'forest' | 'waves' | null;

interface Task { id: string; text: string; completed: boolean; }

interface Deadline { id: string; subject: string; title: string; date: string; }

interface StudyStats {
  todayFocusMinutes: number;
  streakDays: number;
  sessionsCompleted: number;
  focusScore: number;
}

interface CustomDurations { pomodoro: number; shortBreak: number; longBreak: number; }

// ── Helper: Load from sessionStorage ──
function loadSession<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = sessionStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

// ══════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════
export default function PomodoroTimer({ initial_focus: _initial_focus }: PomodoroProps) {

  // ── Custom Durations (user-settable) ──
  const [durations, setDurations] = useState<CustomDurations>(() =>
    loadSession('tasklet_timer_durations', { pomodoro: 25, shortBreak: 5, longBreak: 15 })
  );

  // ── Timer Engine (persisted across page changes) ──
  const [mode, setMode] = useState<TimerMode>(() => {
    return (loadSession<string>('tasklet_timer_mode', 'pomodoro') as TimerMode);
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = loadSession<number>('tasklet_timer_timeLeft', durations.pomodoro * 60);
    const wasActive = loadSession<boolean>('tasklet_timer_isActive', false);
    const savedAt = loadSession<number>('tasklet_timer_savedAt', 0);
    if (wasActive && savedAt > 0) {
      // Calculate elapsed seconds since the user left
      const elapsed = Math.floor((Date.now() - savedAt) / 1000);
      const remaining = savedTime - elapsed;
      return remaining > 0 ? remaining : 0;
    }
    return savedTime;
  });

  const [isActive, setIsActive] = useState(() => {
    const wasActive = loadSession<boolean>('tasklet_timer_isActive', false);
    const savedTime = loadSession<number>('tasklet_timer_timeLeft', durations.pomodoro * 60);
    const savedAt = loadSession<number>('tasklet_timer_savedAt', 0);
    if (wasActive && savedAt > 0) {
      const elapsed = Math.floor((Date.now() - savedAt) / 1000);
      const remaining = savedTime - elapsed;
      return remaining > 0; // Stay active only if time remains
    }
    return false;
  });

  const [isMuted, setIsMuted] = useState(false);
  const [activeSound, setActiveSound] = useState<AmbientSound>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);

  // ── Persisted Data (zero mock data – starts empty) ──
  const [tasks, setTasks] = useState<Task[]>(() => loadSession('tasklet_timer_tasks', []));
  const [notes, setNotes] = useState<string>(() =>
    (typeof window !== 'undefined' ? sessionStorage.getItem('tasklet_timer_notes') : '') || ''
  );
  const [stats, setStats] = useState<StudyStats>(() =>
    loadSession('tasklet_study_stats', { todayFocusMinutes: 0, streakDays: 0, sessionsCompleted: 0, focusScore: 0 })
  );
  const [deadlines, setDeadlines] = useState<Deadline[]>(() => loadSession('tasklet_timer_deadlines', []));

  // ── Form inputs ──
  const [newTaskText, setNewTaskText] = useState('');
  const [dlSubject, setDlSubject] = useState('');
  const [dlTitle, setDlTitle] = useState('');
  const [dlDate, setDlDate] = useState('');

  // ── Settings form temps ──
  const [tempPomodoro, setTempPomodoro] = useState(durations.pomodoro);
  const [tempShort, setTempShort] = useState(durations.shortBreak);
  const [tempLong, setTempLong] = useState(durations.longBreak);

  // ── Refs ──
  const audioCtx = useRef<AudioContext | null>(null);
  const tickRef = useRef<any>(null);

  // ── Persist everything ──
  useEffect(() => { sessionStorage.setItem('tasklet_timer_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { sessionStorage.setItem('tasklet_timer_notes', notes); }, [notes]);
  useEffect(() => { sessionStorage.setItem('tasklet_study_stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { sessionStorage.setItem('tasklet_timer_deadlines', JSON.stringify(deadlines)); }, [deadlines]);
  useEffect(() => { sessionStorage.setItem('tasklet_timer_durations', JSON.stringify(durations)); }, [durations]);

  // ── Persist timer state on every change so it survives page navigation ──
  useEffect(() => {
    sessionStorage.setItem('tasklet_timer_mode', JSON.stringify(mode));
    sessionStorage.setItem('tasklet_timer_timeLeft', JSON.stringify(timeLeft));
    sessionStorage.setItem('tasklet_timer_isActive', JSON.stringify(isActive));
    sessionStorage.setItem('tasklet_timer_savedAt', JSON.stringify(Date.now()));
  }, [mode, timeLeft, isActive]);

  // ── Audio ──
  const playBeep = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtx.current;
      // Play two pleasant tones
      [800, 1000].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.25);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.25);
        osc.start(ctx.currentTime + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.25 + 0.8);
        osc.stop(ctx.currentTime + i * 0.25 + 0.8);
      });
    } catch (_) {}
  }, [isMuted]);

  // ── Mode Switching ──
  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    const dur = newMode === 'pomodoro' ? durations.pomodoro : newMode === 'shortBreak' ? durations.shortBreak : durations.longBreak;
    setTimeLeft(dur * 60);
    setIsActive(false);
  }, [durations]);

  // ── Session End ──
  const handleSessionEnd = useCallback(() => {
    playBeep();
    if (mode === 'pomodoro') {
      setStats(s => ({
        ...s,
        sessionsCompleted: s.sessionsCompleted + 1,
        todayFocusMinutes: s.todayFocusMinutes + durations.pomodoro,
        focusScore: Math.min(100, s.focusScore + 3)
      }));
      switchMode('shortBreak');
    } else {
      switchMode('pomodoro');
    }
  }, [mode, durations, playBeep, switchMode]);

  // ── Tick ──
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      tickRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { handleSessionEnd(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [isActive, timeLeft, handleSessionEnd]);

  // ── Keyboard ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); setIsActive(p => !p); }
      else if (e.code === 'KeyR') { e.preventDefault(); switchMode(mode); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, switchMode]);

  // ── Task CRUD ──
  const toggleTask = (id: string) => setTasks(p => p.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const removeTask = (id: string) => setTasks(p => p.filter(t => t.id !== id));
  const addTask = (e: any) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(p => [...p, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
  };
  const clearCompletedTasks = () => setTasks(p => p.filter(t => !t.completed));

  // ── Deadline CRUD ──
  const addDeadline = (e: any) => {
    e.preventDefault();
    if (!dlTitle.trim() || !dlDate) return;
    setDeadlines(p => [...p, { id: Date.now().toString(), subject: dlSubject.trim() || 'General', title: dlTitle.trim(), date: dlDate }]);
    setDlSubject(''); setDlTitle(''); setDlDate(''); setShowDeadlineForm(false);
  };
  const removeDeadline = (id: string) => setDeadlines(p => p.filter(d => d.id !== id));

  // ── Settings Save ──
  const saveSettings = () => {
    const newDur = { pomodoro: Math.max(1, tempPomodoro), shortBreak: Math.max(1, tempShort), longBreak: Math.max(1, tempLong) };
    setDurations(newDur);
    // Reset current timer to reflect new durations
    const dur = mode === 'pomodoro' ? newDur.pomodoro : mode === 'shortBreak' ? newDur.shortBreak : newDur.longBreak;
    setTimeLeft(dur * 60);
    setIsActive(false);
    setShowSettings(false);
  };

  const resetTimer = () => switchMode(mode);

  // ── Derived ──
  const currentDuration = mode === 'pomodoro' ? durations.pomodoro : mode === 'shortBreak' ? durations.shortBreak : durations.longBreak;
  const totalSeconds = currentDuration * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  const modeColors: Record<TimerMode, { color: string; bg: string; ring: string; shadow: string }> = {
    pomodoro:   { color: 'from-indigo-600 to-violet-700', bg: 'bg-indigo-600',  ring: 'text-indigo-600',  shadow: 'shadow-indigo-600/20' },
    shortBreak: { color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-500', ring: 'text-emerald-400', shadow: 'shadow-teal-500/20' },
    longBreak:  { color: 'from-blue-500 to-indigo-600',  bg: 'bg-blue-500',    ring: 'text-blue-500',    shadow: 'shadow-blue-500/20' }
  };
  const modeLabels: Record<TimerMode, string> = { pomodoro: 'Deep Focus', shortBreak: 'Short Break', longBreak: 'Rest & Recover' };
  const ac = modeColors[mode];

  // ── Deadline helper ──
  const getDaysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    if (diff < 0) return 'Overdue!';
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  };


  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════
  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen w-full bg-[#f4f7fa] text-slate-800 font-sans p-4 overflow-y-auto lg:overflow-hidden flex flex-col">

      {/* ── TOP HEADER ── */}
      <div className="flex items-center justify-between mb-4 px-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${ac.color} text-white shadow-sm`}>
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-800">Tasklet Flow</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{modeLabels[mode]} · {durations[mode === 'pomodoro' ? 'pomodoro' : mode === 'shortBreak' ? 'shortBreak' : 'longBreak']} min</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setTempPomodoro(durations.pomodoro); setTempShort(durations.shortBreak); setTempLong(durations.longBreak); setShowSettings(true); }} className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-slate-500 transition-colors" title="Timer Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className={`p-2.5 border rounded-xl shadow-sm transition-colors ${isMuted ? 'bg-indigo-50 border-indigo-200 text-indigo-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── MAIN 3-COL GRID ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 mx-auto max-w-[1500px] w-full pb-10 lg:pb-0">

        {/* ═══ LEFT PANEL (Col 3) ═══ */}
        <div className="flex flex-col lg:col-span-3 gap-4 min-h-0 order-2 lg:order-1">

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex flex-col shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Minutes</span>
              </div>
              <span className="text-xl font-black text-slate-800">{stats.todayFocusMinutes}</span>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex flex-col shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Sessions</span>
              </div>
              <span className="text-xl font-black text-slate-800">{stats.sessionsCompleted}</span>
            </div>
          </div>

          {/* Ambient Sounds */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col shadow-sm shrink-0">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-teal-500" /> Zen Sounds
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {([
                { id: 'rain' as const, label: 'Rain', Icon: CloudRain },
                { id: 'cafe' as const, label: 'Café', Icon: Coffee },
                { id: 'forest' as const, label: 'Forest', Icon: Wind },
                { id: 'waves' as const, label: 'Waves', Icon: Waves },
              ]).map(s => (
                <button key={s.id} onClick={() => setActiveSound(activeSound === s.id ? null : s.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all text-center ${activeSound === s.id ? 'bg-teal-50 border-teal-200 text-teal-600 shadow-sm' : 'bg-slate-50/50 border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-500'}`}>
                  <s.Icon className="w-4 h-4" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl p-4 text-white flex-1 min-h-0 flex flex-col relative overflow-hidden shadow-lg">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-[0.03] rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-3 flex items-center justify-between text-slate-300 relative z-10">
              <span className="flex items-center gap-2"><CalendarHeart className="w-3.5 h-3.5" /> Deadlines</span>
              <button onClick={() => setShowDeadlineForm(true)} className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"><Plus className="w-3 h-3" /></button>
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar relative z-10">
              {deadlines.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-60 py-6">
                  <CalendarHeart className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs font-bold">No deadlines yet</span>
                  <span className="text-[10px] opacity-70">Tap + to add one</span>
                </div>
              ) : (
                [...deadlines].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(dl => (
                  <div key={dl.id} className="group bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/20 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{dl.subject}</span>
                        <h4 className="text-sm font-black leading-tight truncate">{dl.title}</h4>
                      </div>
                      <button onClick={() => removeDeadline(dl.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-lg transition-all shrink-0"><X className="w-3 h-3" /></button>
                    </div>
                    <span className="mt-1.5 px-2 py-1 bg-white/20 rounded-md text-[10px] font-bold inline-block">{getDaysUntil(dl.date)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ═══ CENTER PANEL – TIMER (Col 6) ═══ */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden flex flex-col order-1 lg:order-2 min-h-[450px] lg:min-h-0">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr ${ac.color} opacity-[0.03] blur-[100px] rounded-full pointer-events-none transition-all duration-1000 ${isActive ? 'animate-pulse scale-105' : ''}`} />

          <div className="flex-1 flex flex-col items-center justify-center relative p-6">

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-50 p-1.5 rounded-full shadow-inner border border-slate-200/50 mb-10 z-10 w-full max-w-sm">
              {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map(m => (
                <button key={m} onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 px-3 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${mode === m ? `${modeColors[m].bg} text-white shadow-md` : 'text-slate-400 hover:text-slate-600'}`}>
                  {modeLabels[m]}
                </button>
              ))}
            </div>

            {/* Circular Timer */}
            <div className="relative mb-12 flex items-center justify-center">
              <svg className="w-[280px] h-[280px] xl:w-[340px] xl:h-[340px] -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="47" fill="none" className="stroke-slate-100" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"
                  className={`transition-all duration-1000 ease-linear ${ac.ring}`}
                  strokeDasharray="295.31" strokeDashoffset={295.31 - (295.31 * progress) / 100} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl xl:text-7xl font-black text-slate-800 tracking-tighter leading-none tabular-nums select-none">
                  {mins}:{secs}
                </span>
                <span className={`mt-4 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transition-colors ${isActive ? `${ac.bg} text-white` : 'bg-slate-100 text-slate-400'}`}>
                  {isActive ? 'Deep Session' : 'Standby'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 z-10">
              <button onClick={() => setIsActive(!isActive)}
                className={`w-40 py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 active:translate-y-0 shadow-lg ${isActive ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20' : `bg-gradient-to-br ${ac.color} ${ac.shadow}`}`}>
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                {isActive ? 'Pause' : 'Start'}
              </button>
              <button onClick={resetTimer} className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm group" title="Reset Timer (R)">
                <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <p className="mt-6 text-[10px] font-bold text-slate-400 tracking-wider">Space: Play/Pause · R: Reset</p>
          </div>
        </div>

        {/* ═══ RIGHT PANEL – Tasks & Notes (Col 3) ═══ */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0 order-3">

          {/* Action Plan */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col flex-1 min-h-[300px] lg:min-h-0 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2"><Target className="w-3.5 h-3.5 text-emerald-500" /> Action Plan</span>
              <div className="flex items-center gap-1.5">
                {tasks.some(t => t.completed) && (
                  <button onClick={clearCompletedTasks} title="Clear completed" className="p-1 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-md transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
              </div>
            </h3>

            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 no-scrollbar">
              {tasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 py-6">
                  <ListTodo className="w-7 h-7 mb-2" />
                  <span className="text-[10px] font-bold">No tasks yet. Add one below!</span>
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={`group flex items-start gap-2.5 p-2.5 rounded-xl border transition-all ${task.completed ? 'bg-slate-50/50 border-transparent opacity-50' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                    <button onClick={() => toggleTask(task.id)} className={`mt-0.5 shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'}`}>
                      {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </button>
                    <span className={`flex-1 text-[11px] font-bold truncate pt-0.5 ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.text}</span>
                    <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity p-0.5 shrink-0"><X className="w-3 h-3" /></button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={addTask} className="mt-2 relative shrink-0">
              <input type="text" value={newTaskText} onChange={e => setNewTaskText(e.target.value)} placeholder="Add a study task..."
                className="w-full bg-slate-50 border border-slate-200 text-[11px] font-bold rounded-xl py-2.5 pl-3 pr-10 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all placeholder:text-slate-400" />
              <button type="submit" disabled={!newTaskText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 text-white rounded-lg disabled:opacity-40 hover:bg-slate-900 transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* Brain Dump Notes */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col flex-1 min-h-[250px] lg:min-h-0 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-amber-500" /> Brain Dump</span>
              {notes.length > 0 && (
                <button onClick={() => setNotes('')} title="Clear notes" className="p-1 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-md transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Jot down quick thoughts so you don't lose focus..."
              className="w-full flex-1 resize-none bg-amber-50/30 border border-amber-100/50 rounded-2xl p-3 text-[11px] font-medium text-slate-600 focus:outline-none focus:border-amber-300 transition-all placeholder:text-slate-400 placeholder:italic leading-relaxed no-scrollbar" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          SETTINGS MODAL (Custom Durations)
         ══════════════════════════════════ */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200/60 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30">
              <div>
                <h3 className="text-lg font-black text-slate-800">Timer Settings</h3>
                <p className="text-slate-500 text-xs mt-0.5">Set your own study & break durations</p>
              </div>
              <button onClick={() => setShowSettings(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Focus Duration', value: tempPomodoro, setter: setTempPomodoro, unit: 'min', color: 'text-indigo-600' },
                { label: 'Short Break', value: tempShort, setter: setTempShort, unit: 'min', color: 'text-emerald-500' },
                { label: 'Long Break', value: tempLong, setter: setTempLong, unit: 'min', color: 'text-blue-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className={`text-xs font-bold ${item.color}`}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => item.setter(Math.max(1, item.value - 5))} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-colors flex items-center justify-center">−</button>
                    <input type="number" min={1} max={120} value={item.value} onChange={e => item.setter(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 text-center bg-white border border-slate-200 rounded-lg py-1.5 text-sm font-black text-slate-800 focus:outline-none focus:border-blue-400" />
                    <button onClick={() => item.setter(Math.min(120, item.value + 5))} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-colors flex items-center justify-center">+</button>
                    <span className="text-[10px] font-bold text-slate-400 w-6">{item.unit}</span>
                  </div>
                </div>
              ))}
              <button onClick={saveSettings}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]">
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          DEADLINE MODAL (Add Deadline)
         ══════════════════════════════════ */}
      {showDeadlineForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowDeadlineForm(false)}>
          <form onSubmit={addDeadline} onClick={e => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200/60 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-violet-50/30">
              <div>
                <h3 className="text-lg font-black text-slate-800">Add Deadline</h3>
                <p className="text-slate-500 text-xs mt-0.5">Track your upcoming exams & assignments</p>
              </div>
              <button type="button" onClick={() => setShowDeadlineForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Subject (optional)</label>
                <input type="text" value={dlSubject} onChange={e => setDlSubject(e.target.value)} placeholder="e.g. Mathematics"
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl py-3 px-3 focus:outline-none focus:border-violet-400 focus:bg-white transition-all placeholder:text-slate-400" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Title *</label>
                <input type="text" value={dlTitle} onChange={e => setDlTitle(e.target.value)} placeholder="e.g. Calculus Midterm" required
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl py-3 px-3 focus:outline-none focus:border-violet-400 focus:bg-white transition-all placeholder:text-slate-400" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Date *</label>
                <input type="date" value={dlDate} onChange={e => setDlDate(e.target.value)} required
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl py-3 px-3 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-slate-700" />
              </div>
              <button type="submit" disabled={!dlTitle.trim() || !dlDate}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-black text-sm shadow-lg shadow-violet-500/20 transition-all active:scale-[0.98] disabled:opacity-50">
                Add Deadline
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
