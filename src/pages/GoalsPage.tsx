import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import {
  Target,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  Plus,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Check,
  ChevronRight,
  BookOpen,
  Zap,
  Eye
} from 'lucide-react';
import { CreateGoalModal } from '../components/goals/CreateGoalModal';
import { GoalDetailModal } from '../components/goals/GoalDetailModal';
import { GoalCompletionModal } from '../components/goals/GoalCompletionModal';
import { UserGoal } from '../types';

export const GoalsPage: React.FC = () => {
  const {
    goals,
    logStudyHours,
    currentUser,
    completedGoalForCelebration,
    setCompletedGoalForCelebration,
    showToast
  } = useApp();

  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [selectedDetailGoal, setSelectedDetailGoal] = useState<UserGoal | null>(null);

  const primaryGoal = goals[0];

  const progressPercent = primaryGoal
    ? Math.min(100, Math.round((primaryGoal.loggedHoursThisWeek / (primaryGoal.targetHoursPerWeek || 1)) * 100))
    : 75;

  // Calendar days mock for 28-day heatmap
  const days = Array.from({ length: 28 }, (_, i) => {
    const activeLevel = (i % 4 === 0 || i % 7 === 2) ? 3 : (i % 3 === 0) ? 2 : (i % 5 === 0) ? 1 : 0;
    return { day: i + 1, level: activeLevel };
  });

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-8">
        {/* Header Banner with "+ Create New Goal" CTA */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Target className="w-3.5 h-3.5" />
              <span>Personal Learning Rhythm & Velocity</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Goals & Progress
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Turn your intentions into executable learning missions. Track weekly study hours, advance milestone checklists, and mint verified Knowledge Proofs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {/* Active Streak Pill */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <Flame className="w-7 h-7 text-amber-400 fill-amber-400 animate-bounce" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                  Active Streak
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-mono">{currentUser.streakDays} Days</h3>
              </div>
            </div>

            {/* "+ Create New Goal" Primary Trigger */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowCreateGoalModal(true);
              }}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-600 text-white font-mono font-bold text-xs shadow-glow-cyan hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New Goal</span>
            </button>
          </div>
        </div>

        {/* Top KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Weekly Study Pace',
              value: `${primaryGoal?.loggedHoursThisWeek || 9.5}h / ${primaryGoal?.targetHoursPerWeek || 12}h`,
              icon: Clock,
              color: 'purple'
            },
            {
              label: 'Knowledge Tokens',
              value: `${currentUser.knowledgeTokens.toLocaleString()} KT`,
              icon: Award,
              color: 'gold'
            },
            {
              label: 'Active Goals in Orbit',
              value: `${goals.length} Goals`,
              icon: Target,
              color: 'cyan'
            },
            {
              label: 'Completed Milestones',
              value: `${primaryGoal?.completedTasks || 8} / ${primaryGoal?.totalTasks || 15}`,
              icon: CheckCircle2,
              color: 'emerald'
            }
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{kpi.label}</span>
                  <div className="p-2 rounded-xl bg-white/5 text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white font-mono">{kpi.value}</h3>
              </div>
            );
          })}
        </div>

        {/* SECTION: ACTIVE LEARNING GOALS CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Active Learning Goals ({goals.length})
              </h2>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setShowCreateGoalModal(true);
              }}
              className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
            >
              <span>+ Add Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map((g) => {
              const totalM = g.milestones?.length || g.totalTasks || 1;
              const compM = g.milestones
                ? g.milestones.filter(m => m.status === 'completed').length
                : g.completedTasks || 0;
              const gProgress = Math.round((compM / totalM) * 100);

              return (
                <div
                  key={g.id}
                  className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group shadow-lg"
                >
                  {/* Subtle top gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 opacity-60" />

                  <div className="space-y-3">
                    {/* Header badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold uppercase">
                          {g.category || 'Learning Path'}
                        </span>
                        {g.priority && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                              g.priority === 'critical'
                                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                                : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                            }`}
                          >
                            {g.priority}
                          </span>
                        )}
                      </div>

                      {g.isCompleted ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Mastered
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono font-bold text-cyan-300">
                          {gProgress}%
                        </span>
                      )}
                    </div>

                    {/* Goal Title */}
                    <div>
                      <h3
                        onClick={() => {
                          sounds.playClick();
                          setSelectedDetailGoal(g);
                        }}
                        className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors cursor-pointer"
                      >
                        🎯 {g.roadmapTitle}
                      </h3>
                      {g.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {g.description}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-700 rounded-full"
                          style={{ width: `${gProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{compM} of {totalM} milestones</span>
                        <span>{g.targetCompletionDate}</span>
                      </div>
                    </div>

                    {/* Weekly hours & streak summary */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Weekly Pace</span>
                        <span className="text-slate-200 font-bold">
                          {g.loggedHoursThisWeek} / {g.targetHoursPerWeek} hrs
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Streak</span>
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          {g.streakDays} Days
                        </span>
                      </div>
                    </div>

                    {/* Milestones Preview (first 2) */}
                    {g.milestones && g.milestones.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-mono uppercase text-slate-500 block">Current Focus:</span>
                        {g.milestones.slice(0, 2).map((m) => (
                          <div key={m.id} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                            <span
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${
                                m.status === 'completed'
                                  ? 'bg-emerald-500 text-black font-bold'
                                  : 'border border-cyan-400 text-transparent'
                              }`}
                            >
                              ✓
                            </span>
                            <span className={`truncate ${m.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                              {m.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Goal Card Actions */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs font-mono">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        logStudyHours(g.id, 1);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/30 text-purple-300 hover:text-purple-200 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+1h Study</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setSelectedDetailGoal(g);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Goal</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Circular Target Gauge & 28-Day Heatmap Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Circular Progress Gauge */}
          <div className="lg:col-span-1 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Primary Goal Velocity
            </h3>

            <div className="relative w-48 h-48 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-purple-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black font-mono text-white">{progressPercent}%</span>
                <span className="text-[11px] font-mono text-purple-300">weekly target</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 truncate max-w-[240px]">
              {primaryGoal?.roadmapTitle}
            </p>
          </div>

          {/* Right 2 Cols: Quick Study Session Logger & Heatmap */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Log Buttons */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 bg-gradient-to-r from-purple-950/30 to-indigo-950/20">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold block">
                  Log Study Time Today
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Record your dedicated study session to advance your goal pace and earn Knowledge Tokens.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0.5, 1, 2, 3].map((hrs) => (
                  <button
                    key={hrs}
                    onClick={() => {
                      if (primaryGoal) logStudyHours(primaryGoal.id, hrs);
                    }}
                    className="py-3 bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 rounded-2xl text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-purple-400" />
                    <span>+{hrs} hr session</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4-Week Study Heatmap */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>28-Day Study Activity Heatmap</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-400">14-Day Streak Active</span>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-2">
                {days.map((item) => (
                  <div
                    key={item.day}
                    title={`Day ${item.day}: ${item.level > 0 ? `${item.level * 1.5}h studied` : 'Rest day'}`}
                    className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      item.level === 3
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : item.level === 2
                        ? 'bg-purple-800/80 text-purple-200'
                        : item.level === 1
                        ? 'bg-purple-950/60 text-purple-400 border border-purple-500/20'
                        : 'bg-white/5 text-slate-600'
                    }`}
                  >
                    {item.day}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-slate-500 pt-2">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded bg-white/5" />
                <span className="w-2.5 h-2.5 rounded bg-purple-950" />
                <span className="w-2.5 h-2.5 rounded bg-purple-800" />
                <span className="w-2.5 h-2.5 rounded bg-purple-600" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Modals */}
      <CreateGoalModal
        isOpen={showCreateGoalModal}
        onClose={() => setShowCreateGoalModal(false)}
      />

      <GoalDetailModal
        goal={selectedDetailGoal}
        onClose={() => setSelectedDetailGoal(null)}
      />

      <GoalCompletionModal
        goal={completedGoalForCelebration}
        onClose={() => setCompletedGoalForCelebration(null)}
      />
    </MainLayout>
  );
};
