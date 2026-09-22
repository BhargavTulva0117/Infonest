import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Calendar,
  Clock,
  BookOpen,
  Compass,
  Code,
  Brain,
  Database,
  Shield,
  Layout,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Zap,
  CheckCircle2,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import { UserGoal } from '../../types';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'Programming', label: 'Programming', icon: Code, color: 'from-blue-500 to-indigo-600' },
  { id: 'AI / ML', label: 'AI / ML', icon: Brain, color: 'from-purple-500 to-cyan-500' },
  { id: 'Data Science', label: 'Data Science', icon: Database, color: 'from-emerald-500 to-teal-600' },
  { id: 'Web Development', label: 'Web Dev', icon: Layout, color: 'from-amber-500 to-orange-600' },
  { id: 'System Design', label: 'System Design', icon: Zap, color: 'from-violet-600 to-purple-800' },
  { id: 'Cybersecurity', label: 'Cybersecurity', icon: Shield, color: 'from-rose-500 to-red-600' },
  { id: 'DSA', label: 'DSA & Algos', icon: Code, color: 'from-cyan-500 to-blue-600' },
  { id: 'Cloud', label: 'Cloud & DevOps', icon: Compass, color: 'from-sky-500 to-indigo-500' },
  { id: 'UI/UX', label: 'UI/UX Design', icon: Layout, color: 'from-pink-500 to-rose-500' },
  { id: 'Career', label: 'Career Growth', icon: Briefcase, color: 'from-yellow-500 to-amber-600' },
  { id: 'Academic', label: 'Academic & Exams', icon: GraduationCap, color: 'from-teal-500 to-emerald-600' },
  { id: 'Personal Project', label: 'Personal Project', icon: FolderGit2, color: 'from-fuchsia-500 to-purple-600' },
];

const PRESET_GOALS = [
  'Master Generative AI',
  'Complete DSA Preparation',
  'Master React & Next.js',
  'Build a Full-Stack Project',
  'Become a System Design Engineer',
  'Prepare for DBMS & Distributed Systems'
];

const LEARNING_METHODS = [
  { id: 'roadmap', label: 'Roadmap', desc: 'Guided curriculum with step-by-step milestones' },
  { id: 'course', label: 'Course', desc: 'Video lectures, notes, and interactive quizzes' },
  { id: 'trail', label: 'Knowledge Trail', desc: 'Community synthesized drops & takeaways' },
  { id: 'practice', label: 'Daily Practice', desc: 'Consistent problem solving and code katas' },
  { id: 'project', label: 'Project', desc: 'Hands-on capstone build from scratch' },
  { id: 'mixed', label: 'Mixed Learning', desc: 'Blended mix of courses, roadmaps, and builds' },
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ isOpen, onClose }) => {
  const { createLearningGoal, roadmaps, courses } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Define
  const [goalName, setGoalName] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('AI / ML');

  // Step 2: Plan
  const [learningMethod, setLearningMethod] = useState<'roadmap' | 'course' | 'trail' | 'practice' | 'project' | 'mixed'>('roadmap');
  const [attachedRoadmapId, setAttachedRoadmapId] = useState<string>(roadmaps[0]?.id || '');
  const [attachedCourseId, setAttachedCourseId] = useState<string>(courses[0]?.id || '');

  // Step 3: Target
  const [targetDate, setTargetDate] = useState('30 December 2026');
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [dailyMinutes, setDailyMinutes] = useState(45);
  const [priority, setPriority] = useState<'normal' | 'important' | 'critical'>('important');

  // Step 4: Schedule
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Thursday', 'Saturday']);
  const [studyTime, setStudyTime] = useState<'morning' | 'afternoon' | 'evening' | 'night' | 'custom'>('evening');

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    sounds.playClick();
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.length > 1
          ? prev.filter(d => d !== day)
          : prev
        : [...prev, day]
    );
  };

  const handleNext = () => {
    sounds.playClick();
    if (step < 5) {
      setStep((step + 1) as any);
    }
  };

  const handleBack = () => {
    sounds.playClick();
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const handleFinish = () => {
    const finalGoalName = goalName.trim() || 'Master Generative AI';
    createLearningGoal({
      roadmapTitle: finalGoalName,
      description: goalDescription.trim() || `Turn intention into mastery for ${finalGoalName}.`,
      category: selectedCategory,
      learningMethod,
      roadmapId: learningMethod === 'roadmap' ? attachedRoadmapId : undefined,
      attachedCourseIds: learningMethod === 'course' || learningMethod === 'mixed' ? [attachedCourseId] : [],
      targetHoursPerWeek: weeklyHours,
      dailyTargetMinutes: dailyMinutes,
      targetCompletionDate: targetDate,
      priority,
      preferredDays: selectedDays,
      preferredTime: studyTime
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090C16]/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(168,85,247,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Subtle Ambient Nebula Glows */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 text-white">
                <Target className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Create a New Learning Goal
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Turn your intention into a learning mission.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Step Progress Tracker */}
        <div className="py-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            {[
              { num: 1, label: 'Define' },
              { num: 2, label: 'Plan' },
              { num: 3, label: 'Target' },
              { num: 4, label: 'Schedule' },
              { num: 5, label: 'Review' }
            ].map(s => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 ${
                  step === s.num
                    ? 'text-cyan-300 font-bold'
                    : step > s.num
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step === s.num
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-glow-cyan'
                      : step > s.num
                      ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-400'
                      : 'bg-white/5 border border-white/10 text-slate-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Shimmer Progress Track */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-5 scrollbar-thin">
          {/* STEP 1: DEFINE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  What do you want to achieve?
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  placeholder="e.g. Master Generative AI or Complete DSA Preparation"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {PRESET_GOALS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setGoalName(preset);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-[11px] text-slate-300 hover:text-cyan-300 transition-all"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  What does success look like? (Goal Description)
                </label>
                <textarea
                  value={goalDescription}
                  onChange={e => setGoalDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe the tangible milestone: e.g. Deploy 2 production AI agents and achieve 95%+ precision on evaluation benchmarks."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Select Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setSelectedCategory(cat.id);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-950/60 to-cyan-950/40 border-cyan-400 text-white shadow-glow-cyan'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${cat.color} text-white shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PLAN */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  How do you want to achieve it? (Learning Method)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {LEARNING_METHODS.map(method => {
                    const isSelected = learningMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setLearningMethod(method.id as any);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-purple-900/30 border-purple-400 shadow-glow-purple text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{method.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">{method.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Attach Existing Curriculum */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-mono uppercase text-slate-300 font-semibold block flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Attach Existing Universe Paths (Optional)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 block">Attach Roadmap</label>
                    <select
                      value={attachedRoadmapId}
                      onChange={e => setAttachedRoadmapId(e.target.value)}
                      className="w-full bg-[#0B0E1B] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      {roadmaps.map(rm => (
                        <option key={rm.id} value={rm.id}>{rm.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 block">Attach Course</label>
                    <select
                      value={attachedCourseId}
                      onChange={e => setAttachedCourseId(e.target.value)}
                      className="w-full bg-[#0B0E1B] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TARGET */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Completion Date
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    placeholder="e.g. 30 December 2026"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  {['1 Month', '3 Months', '6 Months'].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        const d = new Date();
                        d.setMonth(d.getMonth() + (idx === 0 ? 1 : idx === 1 ? 3 : 6));
                        setTargetDate(d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-300 shrink-0"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Weekly Study Target: <span className="text-cyan-300 font-bold">{weeklyHours} hours/week</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 5, 8, 10, 12, 15].map(hrs => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setWeeklyHours(hrs);
                      }}
                      className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                        weeklyHours === hrs
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-glow-purple'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {hrs}h / wk
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Daily Target: <span className="text-purple-300 font-bold">{dailyMinutes} minutes/day</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[15, 30, 45, 60, 90, 120].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setDailyMinutes(mins);
                      }}
                      className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                        dailyMinutes === mins
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Normal', badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' },
                    { id: 'important', label: 'Important', badge: 'bg-amber-500/10 border-amber-500/30 text-amber-300' },
                    { id: 'critical', label: 'Critical', badge: 'bg-rose-500/10 border-rose-500/30 text-rose-300' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setPriority(p.id as any);
                      }}
                      className={`py-2.5 rounded-xl border text-xs font-mono font-bold transition-all text-center ${
                        priority === p.id
                          ? `${p.badge} ring-1 ring-white/20`
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SCHEDULE */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Select Preferred Learning Days ({selectedDays.length} days selected)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-900/40 to-cyan-950/40 border-cyan-400 text-white shadow-glow-cyan'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xs font-mono font-semibold">{day}</span>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                            isSelected
                              ? 'bg-cyan-400 border-cyan-400 text-black font-bold'
                              : 'border-white/20 text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Preferred Study Time of Day
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'morning', label: 'Morning', desc: '6 AM - 12 PM' },
                    { id: 'afternoon', label: 'Afternoon', desc: '12 PM - 5 PM' },
                    { id: 'evening', label: 'Evening', desc: '5 PM - 9 PM' },
                    { id: 'night', label: 'Night', desc: '9 PM - 2 AM' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setStudyTime(t.id as any);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        studyTime === t.id
                          ? 'bg-purple-900/30 border-purple-400 text-white shadow-glow-purple'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">{t.label}</span>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SMART GOAL SUMMARY */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="glass-panel rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                    YOUR NEW LEARNING DESTINATION
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> +20 KT Launch Bonus
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    {goalName.trim() || 'Master Generative AI'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {goalDescription.trim() || 'Dedicated mastery path with interactive milestones, study tracking, and verified proofs.'}
                  </p>
                </div>

                {/* Grid Spec */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Category</span>
                    <span className="font-bold text-cyan-300">{selectedCategory}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target Date</span>
                    <span className="font-bold text-slate-200">{targetDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Weekly Pace</span>
                    <span className="font-bold text-purple-300">{weeklyHours} hrs / week</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Daily Mission</span>
                    <span className="font-bold text-emerald-300">{dailyMinutes} min session</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block mb-1">Learning Days</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDays.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] text-slate-300">
                        {d.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Milestones Preview */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-slate-300 font-semibold block">
                  Generated Core Milestones (Preview)
                </span>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>1. Foundations, Math & Conceptual Grounding (4h)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>2. Core System Implementation & Architecture Exploration (6h)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>3. Practical Hands-On Project Build (8h)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>4. Capstone Mastery Verification & Proof Minting (10h)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-mono font-bold shadow-glow-purple hover:scale-105 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 text-slate-950 font-bold text-xs font-mono shadow-glow-cyan hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Create Learning Goal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
