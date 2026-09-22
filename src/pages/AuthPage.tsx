import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import {
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers,
  Zap,
  Globe
} from 'lucide-react';

interface AuthPageProps {
  defaultMode?: 'login' | 'signup';
}

const STARTER_DNA_TOPICS = [
  'Reasoning Models & PRMs',
  'Distributed Event Meshes',
  'Three.js & WebGPU Shaders',
  'High-Scale System Design',
  'eBPF Kernel Tracing',
  'Autonomous Agent Architectures'
];

export const AuthPage: React.FC<AuthPageProps> = ({ defaultMode = 'login' }) => {
  const navigate = useNavigate();
  const { login, signup, demoLogin, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('bhargav_code');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [chosenRole, setChosenRole] = useState<'student' | 'creator'>('student');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Reasoning Models & PRMs',
    'Distributed Event Meshes'
  ]);

  const toggleTopic = (topic: string) => {
    sounds.playClick();
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const res = await login(loginIdentifier, loginPassword);
    if (res.success) {
      navigate('/feed');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const res = await signup({
      fullName,
      username: username.replace(/^@/, ''),
      email,
      password: signupPassword,
      role: chosenRole,
      selectedInterests: selectedTopics
    });
    if (res.success) {
      navigate('/feed');
    }
  };

  const handleDemoPersona = (persona: 'learner' | 'creator' | 'architect') => {
    demoLogin(persona);
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Dynamic Cyber-Luxury Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="px-6 py-6 flex items-center justify-between z-10 max-w-6xl mx-auto w-full">
        <Link
          to="/feed"
          onClick={() => sounds.playClick()}
          className="flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-purple group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#07080D] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent block">
              InfoNest
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 -mt-1 block">
              Your Knowledge Universe
            </span>
          </div>
        </Link>

        <Link
          to="/feed"
          onClick={() => sounds.playClick()}
          className="text-xs font-mono text-slate-400 hover:text-white px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5"
        >
          <span>Continue as Guest</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-4">
        <div className="w-full max-w-xl glass-panel rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          {/* Subtle Cyber Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-purple-500" />

          {/* Mode Tabs */}
          <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 mb-8">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setMode('login');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In to Nest
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setMode('signup');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account (+500 KT)
            </button>
          </div>

          {/* ======================= LOGIN FORM ======================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Welcome Back to Cosmos
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Authenticate your credentials to access drops, missions, and vault
                </p>
              </div>

              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-300 block uppercase tracking-wider">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="name@cosmos.io or @username"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-slate-300 block uppercase tracking-wider">
                    Security Key / Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      showToast('Demo password reset link dispatched.', 'info');
                    }}
                    className="text-[11px] font-mono text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot Key?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your security phrase"
                    className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/30"
                />
                <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer">
                  Persist session in local vault
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-glow-purple hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Authenticate & Enter The Nest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ======================= SIGN UP FORM ======================= */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="text-center space-y-1 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  +500 Welcome Knowledge Tokens
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Initialize Your Cosmos Node
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Join the frontier network of learners, researchers, and creators
                </p>
              </div>

              {/* Path / Role Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-300 block uppercase tracking-wider">
                  Choose Your Cosmos Trajectory
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setChosenRole('student');
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      chosenRole === 'student'
                        ? 'bg-purple-600/20 border-purple-500/60 shadow-glow-purple text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block text-white">Learner / Explorer</span>
                      <span className="text-[10px] font-mono text-slate-400">Study roadmaps & earn KT</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setChosenRole('creator');
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      chosenRole === 'creator'
                        ? 'bg-cyan-500/20 border-cyan-500/60 shadow-glow-cyan text-white'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block text-white">Frontier Creator</span>
                      <span className="text-[10px] font-mono text-slate-400">Publish courses & host rooms</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name & Username in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-300 block uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-300 block uppercase">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="@alex_code"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-300 block uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@frontier.io"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-300 block uppercase">Password</label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Learning DNA Initial Starter Chips */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-mono text-slate-300 block uppercase">
                  Seed Your Learning DNA (Select 2+)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STARTER_DNA_TOPICS.map(topic => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-glow-cyan'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Sign Up Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-glow-cyan hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-3"
              >
                <span>Initialize Knowledge Account (+500 KT)</span>
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </button>
            </form>
          )}

          {/* ======================= 1-CLICK DEMO PERSONAS ======================= */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                1-Click Instant Demo Logins
              </span>
              <span className="text-[10px] font-mono text-purple-400">Instant Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoPersona('learner')}
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-purple-600/15 border border-white/5 hover:border-purple-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xs text-purple-300 font-bold">
                    BS
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block truncate group-hover:text-purple-300">
                      Bhargav Sai
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      Learner · 4.2K KT
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoPersona('creator')}
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/5 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs text-cyan-300 font-bold">
                    ER
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block truncate group-hover:text-cyan-300">
                      Dr. Elena R.
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      Creator · KS 985
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoPersona('architect')}
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xs text-emerald-300 font-bold">
                    MV
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block truncate group-hover:text-emerald-300">
                      Marcus Vance
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      Architect · Kafka
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="px-6 py-4 text-center text-xs font-mono text-slate-500 z-10">
        <span>InfoNest Cryptographic Auth Protocol · Protected by Zero-Knowledge Proofs</span>
      </footer>
    </div>
  );
};
