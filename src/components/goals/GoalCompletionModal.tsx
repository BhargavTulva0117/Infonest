import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Sparkles,
  ShieldCheck,
  Share2,
  ArrowRight,
  X,
  CheckCircle2,
  Clock,
  BookOpen,
  FolderGit2,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import { UserGoal } from '../../types';

interface GoalCompletionModalProps {
  goal: UserGoal | null;
  onClose: () => void;
}

export const GoalCompletionModal: React.FC<GoalCompletionModalProps> = ({ goal, onClose }) => {
  const navigate = useNavigate();
  const { knowledgeProofs, showToast } = useApp();

  if (!goal) return null;

  const proof = knowledgeProofs.find(p => p.id === goal.completionProofId) || knowledgeProofs[0];

  const handleShare = () => {
    sounds.playClick();
    if (navigator.share) {
      navigator.share({
        title: `I completed "${goal.roadmapTitle}" on InfoNest!`,
        text: `Verified mastery proof on InfoNest — Your Knowledge Universe.`,
        url: window.location.origin
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `🏆 I completed "${goal.roadmapTitle}" on InfoNest! Verified mastery proof #${proof?.proofNumber || '1024'}.`
      );
      showToast('Achievement copied to clipboard!', 'info');
    }
  };

  const handleViewProof = () => {
    sounds.playClick();
    onClose();
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0A0D1B]/95 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(6,182,212,0.35)] flex flex-col text-center items-center overflow-hidden">
        {/* Animated Rotating Orbital Halo */}
        <div className="absolute top-1/4 w-72 h-72 rounded-full border border-purple-500/20 border-t-cyan-400 animate-[spin_8s_linear_infinite] pointer-events-none -z-10" />
        <div className="absolute top-1/4 w-56 h-56 rounded-full border border-cyan-500/20 border-b-amber-400 animate-[spin_6s_linear_infinite_reverse] pointer-events-none -z-10" />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Triumphant Badge */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 p-[2px] shadow-[0_0_40px_rgba(6,182,212,0.5)] animate-[pulse_2.5s_ease-in-out_infinite]">
            <div className="w-full h-full bg-[#080914] rounded-[22px] flex items-center justify-center">
              <Award className="w-10 h-10 text-amber-300 animate-bounce" />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full ring-2 ring-[#080914] animate-ping" />
        </div>

        {/* Celebration Header */}
        <div className="space-y-1 mb-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-300 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
            GOAL MASTERED • 100% COMPLETE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-2">
            {goal.roadmapTitle}
          </h2>
          <p className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+250 Knowledge Tokens Minted to Your Wallet</span>
          </p>
        </div>

        {/* The Minted Knowledge Proof Card */}
        <div className="w-full rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.02] border border-cyan-500/30 p-5 text-left shadow-inner space-y-3 mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-bold font-mono text-white">KNOWLEDGE PROOF</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              #{proof?.proofNumber || '1024'}
            </span>
          </div>

          <div className="border-t border-white/10 pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Completed</span>
              <span className="text-slate-200 font-bold">{proof?.completedDate || '2026'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Study Hours</span>
              <span className="text-purple-300 font-bold">{proof?.totalHours || 48}h</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Lectures</span>
              <span className="text-cyan-300 font-bold">{proof?.lecturesCount || 8}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Projects</span>
              <span className="text-amber-300 font-bold">{proof?.projectsCount || 2}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="truncate">Hash: {proof?.verificationHash?.slice(0, 20) || '0x4f82a9...'}...</span>
            <span className="text-emerald-400">✓ Cryptographically Signed</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={handleViewProof}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-mono font-bold shadow-glow-purple hover:scale-105 transition-all"
          >
            <span>View Knowledge Proof</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-mono font-bold transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Share Achievement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
