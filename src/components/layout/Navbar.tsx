import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Radio,
  PlusCircle,
  Zap,
  GraduationCap,
  Bell,
  SlidersHorizontal,
  Bot,
  LogOut,
  LogIn,
  User as UserIcon,
  Bookmark,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import { InfoNestLogo } from '../brand/InfoNestLogo';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    role,
    setRole,
    currentUser,
    isMuted,
    toggleMute,
    isAmbientPlaying,
    toggleAmbient,
    unreadNotificationsCount,
    isAuthenticated,
    logout,
    toggleAiChat,
    isAiChatOpen,
    showToast
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      sounds.playClick();
      navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  const handleRoleToggle = (newRole: 'student' | 'creator') => {
    setRole(newRole);
    if (newRole === 'creator') {
      navigate('/creator/dashboard');
    } else {
      navigate('/feed');
    }
  };

  const handleSignOut = () => {
    sounds.playPop();
    logout();
    setIsProfileDropdownOpen(false);
    showToast('Signed out of InfoNest Cosmos session', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-white/10 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/feed"
          onClick={() => sounds.playClick()}
          className="flex items-center group select-none shrink-0"
        >
          <InfoNestLogo variant="full" size="sm" interactive />
        </Link>

        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search knowledge, creators, courses, roadmaps..."
              className="w-full pl-10 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              ↵ Enter
            </div>
          </div>
        </form>

        {/* Right HUD Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Ask Cosmos AI Button */}
          <button
            onClick={() => {
              sounds.playClick();
              toggleAiChat();
            }}
            title="Ask Cosmos AI Assistant (ChatGPT) • Ctrl+K"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              isAiChatOpen
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                : 'bg-white/5 border-white/10 text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline font-semibold">Cosmos AI</span>
            <span className="hidden lg:inline text-[9px] text-cyan-400/70 bg-white/10 px-1 py-0.2 rounded">Ctrl+K</span>
          </button>

          {/* Ambient Cosmic Sound Visualizer */}
          <button
            onClick={() => {
              sounds.playClick();
              toggleAmbient();
            }}
            title={isAmbientPlaying ? 'Mute Space Drone' : 'Play Ambient Space Drone'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              isAmbientPlaying
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-glow-cyan'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isAmbientPlaying ? 'animate-pulse text-cyan-400' : ''}`} />
            <span className="hidden xl:inline">Space Drone</span>
            {isAmbientPlaying && (
              <span className="flex items-end gap-[2px] h-3">
                <span className="w-[2px] h-2 bg-cyan-400 animate-[pulse_0.6s_ease-in-out_infinite]" />
                <span className="w-[2px] h-3 bg-cyan-400 animate-[pulse_0.9s_ease-in-out_infinite_0.2s]" />
                <span className="w-[2px] h-1.5 bg-cyan-400 animate-[pulse_0.7s_ease-in-out_infinite_0.4s]" />
              </span>
            )}
          </button>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={() => {
              toggleMute();
              if (isMuted) sounds.playClick();
            }}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
          </button>

          {/* Role Switcher (Learner ↔ Creator) */}
          <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => handleRoleToggle('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                role === 'student'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Learner</span>
            </button>
            <button
              onClick={() => handleRoleToggle('creator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                role === 'creator'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Creator</span>
            </button>
          </div>

          {/* Create Shortcut for Creators */}
          {role === 'creator' && (
            <Link
              to="/create/post"
              onClick={() => sounds.playClick()}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-xl text-xs font-semibold hover:opacity-90 shadow-glow-cyan transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Drop</span>
            </Link>
          )}

          {/* Knowledge Tokens Pill */}
          <Link
            to="/goals"
            onClick={() => sounds.playClick()}
            title="Knowledge Tokens earned from learning. View personal goals."
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono hover:bg-amber-500/20 transition-colors"
          >
            <span className="text-sm">💎</span>
            <span className="font-bold">{currentUser.knowledgeTokens.toLocaleString()}</span>
            <span className="text-[10px] text-amber-400/70">KT</span>
          </Link>

          {/* Notifications Bell */}
          <Link
            to="/notifications"
            onClick={() => sounds.playClick()}
            title="Notifications"
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white flex items-center justify-center ring-2 ring-[#08090E]">
                {unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* Authentication State: Sign In vs User Profile Dropdown */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              onClick={() => sounds.playClick()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold shadow-glow-purple hover:scale-105 transition-all shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                }}
                title="Account Menu"
                className="relative group shrink-0 flex items-center focus:outline-none"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/40 group-hover:ring-purple-400 transition-all cursor-pointer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#08090E]" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#0B0F1E]/95 backdrop-blur-2xl border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.7)] p-3 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User identity header */}
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 mb-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">@{currentUser.username}</div>
                      <div className="text-[10px] font-mono text-purple-300 mt-0.5 capitalize flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {currentUser.role}
                      </div>
                    </div>
                  </div>

                  {/* Token Balance */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono mb-2">
                    <span className="text-[11px]">Knowledge Tokens</span>
                    <span className="font-bold text-xs">💎 {currentUser.knowledgeTokens.toLocaleString()} KT</span>
                  </div>

                  {/* Nav Links */}
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => {
                        sounds.playClick();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-purple-400" />
                      <span>Learner Profile</span>
                    </Link>

                    <Link
                      to="/saved"
                      onClick={() => {
                        sounds.playClick();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-cyan-400" />
                      <span>Knowledge Vault</span>
                    </Link>

                    <Link
                      to="/goals"
                      onClick={() => {
                        sounds.playClick();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-emerald-400" />
                      <span>Learning DNA & Goals</span>
                    </Link>

                    <Link
                      to="/creator/dashboard"
                      onClick={() => {
                        sounds.playClick();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Creator Studio</span>
                    </Link>
                  </div>

                  <div className="my-2 border-t border-white/10" />

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
