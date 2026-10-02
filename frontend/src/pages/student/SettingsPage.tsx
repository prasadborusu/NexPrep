import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Bell, Moon, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, role } = useAuth();

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-purple-100">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-500">Manage application preferences, authentication roles, and notifications</p>
      </div>

      <div className="space-y-6">
        {/* Account Identity & RBAC Context */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-700" />
            <h3 className="text-sm font-bold text-slate-900">Account Identity & Access Context</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Access Role</span>
              <span className="text-sm font-bold text-purple-900 uppercase">{role}</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Account Email</span>
              <span className="text-sm font-bold text-slate-800">{user?.email || 'Authenticated User'}</span>
            </div>
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
