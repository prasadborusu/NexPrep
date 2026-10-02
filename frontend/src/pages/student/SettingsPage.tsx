import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Bell, Moon, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, role, switchRole } = useAuth();

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-purple-100">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-500">Manage application preferences, authentication roles, and notifications</p>
      </div>

      <div className="space-y-6">
        {/* Role Persona Switcher */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-700" />
            <h3 className="text-sm font-bold text-slate-900">Active Persona & RBAC Context</h3>
          </div>
          <p className="text-xs text-slate-600">
            Current active role: <strong className="text-purple-700 uppercase">{role}</strong>. For hackathon evaluation and demonstration, you can toggle your access level immediately:
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => switchRole('student')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                role === 'student'
                  ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Student Persona
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                role === 'admin'
                  ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Administrator / TPO Persona
            </button>
          </div>
        </div>

        {/* Database & API Configuration Status */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-700" />
            <h3 className="text-sm font-bold text-slate-900">Architecture & Backend Connectivity</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Compiler API</span>
              <span className="font-semibold text-emerald-600">Piston Sandboxed Runtime (Port 5000 Proxy)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">AI Model Inference</span>
              <span className="font-semibold text-purple-700">Qwen/Qwen3-8B Engine</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Database Layer</span>
              <span className="font-semibold text-slate-800">Supabase PostgreSQL + Memory Persistence</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Security Architecture</span>
              <span className="font-semibold text-slate-800">Row Level Security (RLS) Enabled</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-700" />
            <h3 className="text-sm font-bold text-slate-900">Communication Alerts</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
              <span>Receive placement drive alerts matching my eligibility criteria</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
              <span>Notify me 2 hours prior to scheduled proctored assessments</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
              <span>Weekly roadmap milestone reminders and skill gap updates</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
