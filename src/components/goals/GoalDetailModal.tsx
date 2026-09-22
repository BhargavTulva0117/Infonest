import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Award,
  Flame,
  BookOpen,
  Compass,
  Trash2,
  X,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import { UserGoal } from '../../types';

interface GoalDetailModalProps {
  goal: UserGoal | null;
  onClose: () => void;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({ goal, onClose }) => {
  const {
    toggleGoalMilestone,
    logStudyHours,
    deleteLearningGoal,
    completeGoal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'schedule'>('overview');

  if (!goal) return null;

  const totalMilestones = goal.milestones?.length || goal.totalTasks || 1;
  const completedMilestones = goal.milestones
    ? goal.milestones.filter(m => m.status === 'completed').length
    : goal.completedTasks || 0;
  const progressPercent = Math.round((completedMilestones / totalMilestones) * 100);

  const weeklyPacePercent = Math.min(
    100,
    Math.round((goal.loggedHoursThisWeek / (goal.targetHoursPerWeek || 1)) * 100)
  );

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove the goal "${goal.roadmapTitle}"?`)) {
      deleteLearningGoal(goal.id);
      onClose();
    }
  };

  const handleManualComplete = () => {
    completeGoal(goal.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#090C16]/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(168,85,247,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Subtle Ambient Nebula Glows */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold uppercase">
                {goal.category || 'Domain Goal'}
              </span>
              {goal.priority && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                    goal.priority === 'critical'
                      ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                  }`}
                >
                  {goal.priority}
                </span>
              )}
              {goal.isCompleted && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> COMPLETED
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {goal.roadmapTitle}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              {goal.description || 'Master this domain through dedicated focus and practice.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDelete}
              title="Delete Goal"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

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
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 pt-3 border-b border-white/10">
          {[
            { id: 'overview', label: 'Goal Overview & Stats' },
            { id: 'milestones', label: `Milestones (${completedMilestones}/${totalMilestones})` },
            { id: 'schedule', label: 'Rhythm & Schedule' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-2 text-xs font-mono font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-white/[0.02]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-5 scrollbar-thin">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Progress Gauges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Mastery Gauge */}
                <div className="glass-panel rounded-2xl p-4 border border-white/10 flex items-center gap-4 bg-purple-950/20">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-white/10" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-purple-400 transition-all duration-700 ease-out" strokeDasharray={`${progressPercent}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold text-white">{progressPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Milestone Progress</span>
                    <span className="text-sm font-black text-white font-mono">{completedMilestones} / {totalMilestones} Completed</span>
                  </div>
                </div>

                {/* Weekly Target Gauge */}
                <div className="glass-panel rounded-2xl p-4 border border-white/10 flex items-center gap-4 bg-cyan-950/20">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-white/10" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-cyan-400 transition-all duration-700 ease-out" strokeDasharray={`${weeklyPacePercent}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold text-white">{weeklyPacePercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">This Week's Pace</span>
                    <span className="text-sm font-black text-white font-mono">{goal.loggedHoursThisWeek}h / {goal.targetHoursPerWeek}h</span>
                  </div>
                </div>

                {/* Target & Streak */}
                <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1 bg-amber-950/20">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{goal.streakDays} Day Learning Streak</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block pt-1">Target Completion</span>
                  <span className="text-xs font-bold text-slate-200 font-mono">{goal.targetCompletionDate}</span>
                </div>
              </div>

              {/* Quick Study Logger Inside Goal */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-mono uppercase text-slate-300 font-semibold block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Log Dedicated Study Hours to this Goal
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[0.5, 1, 2, 3].map(hrs => (
                    <button
                      key={hrs}
                      onClick={() => logStudyHours(goal.id, hrs)}
                      className="py-2.5 bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 rounded-xl text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-cyan-400" />
                      <span>+{hrs} hr</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!goal.isCompleted && (
                  <button
                    onClick={handleManualComplete}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-mono text-xs font-bold shadow-glow-emerald hover:scale-105 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Goal Complete (100%)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sounds.playClick();
                    showToast('Milestone reminders synced to your notifications', 'info');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all"
                >
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Sync to Calendar</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span>Click any milestone to mark as completed or in-progress</span>
                <span>{completedMilestones} of {totalMilestones} done</span>
              </div>

              {goal.milestones && goal.milestones.length > 0 ? (
                goal.milestones.map((milestone, idx) => {
                  const isDone = milestone.status === 'completed';
                  return (
                    <div
                      key={milestone.id || idx}
                      onClick={() => toggleGoalMilestone(goal.id, milestone.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                          : 'bg-white/5 border-white/10 hover:border-cyan-500/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] shrink-0 transition-all ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-400 text-black font-bold'
                              : 'border-white/20 text-transparent hover:border-cyan-400'
                          }`}
                        >
                          ✓
                        </div>
                        <div className="min-w-0">
                          <span className={`text-xs font-semibold block truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                            {milestone.title}
                          </span>
                          {milestone.relatedContent && (
                            <span className="text-[10px] font-mono text-cyan-400/80 block mt-0.5">
                              {milestone.relatedContent}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-slate-400">
                        <span>~{milestone.estimatedHours || 6}h</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase ${
                            isDone
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'bg-cyan-500/10 text-cyan-300'
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 font-mono">
                  No custom milestones attached to this goal.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-slate-300 font-semibold block">
                  Active Study Rhythm
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Weekly Commitment</span>
                    <span className="text-slate-200 font-bold">{goal.targetHoursPerWeek} Hours</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Daily Target</span>
                    <span className="text-slate-200 font-bold">{goal.dailyTargetMinutes || 45} Minutes</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Preferred Time</span>
                    <span className="text-cyan-300 font-bold capitalize">{goal.preferredTime || 'Evening'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Priority Level</span>
                    <span className="text-amber-300 font-bold capitalize">{goal.priority || 'Important'}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-slate-400 block mb-2">
                  Designated Study Days
                </span>
                <div className="flex flex-wrap gap-2">
                  {goal.preferredDays && goal.preferredDays.length > 0 ? (
                    goal.preferredDays.map(d => (
                      <span
                        key={d}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300 font-bold"
                      >
                        ✓ {d}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">Every day</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
