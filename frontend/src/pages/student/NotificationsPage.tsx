import React, { useState } from 'react';
import { Bell, CheckCircle2, Calendar, Sparkles, Building2, Info, Trash2 } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Upcoming Mock Screening Scheduled',
      message: 'Core CS Technical Assessment is available for self-paced evaluation this week.',
      type: 'assessment',
      date: 'Today, 10:30 AM',
      read: false
    },
    {
      id: '2',
      title: 'New Placement Drive Announced',
      message: 'Campus recruitment drive registered for Graduate Software Development Engineer role.',
      type: 'placement',
      date: 'Yesterday',
      read: false
    },
    {
      id: '3',
      title: 'Resume ATS Optimizer Available',
      message: 'You can now benchmark your resume draft against target job descriptions inside the ATS Analyzer.',
      type: 'system',
      date: '2 days ago',
      read: true
    }
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
            Alerts & Activity
          </span>
          <h1 className="text-2xl font-extrabold text-[#181525] tracking-tight mt-0.5">
            Notifications
          </h1>
          <p className="text-xs text-[#77718A]">
            Stay updated with scheduled assessments, campus placement drives, and system feedback.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="px-3 py-1.5 rounded-lg border border-[#EAE6F5] bg-white text-xs font-semibold text-[#181525] hover:bg-purple-50 hover:text-[#6D28D9] transition-colors"
            >
              Mark all as read
            </button>
            <button
              onClick={clearAll}
              className="p-1.5 rounded-lg border border-[#EAE6F5] bg-white text-xs text-rose-600 hover:bg-rose-50 transition-colors"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#EAE6F5] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6D28D9] flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#181525]">No notifications at this time</h3>
          <p className="text-xs text-[#77718A] max-w-sm mx-auto">
            You're all caught up! New alerts regarding assessments, deadlines, and drive announcements will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EAE6F5] divide-y divide-[#EAE6F5] shadow-soft overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                n.read ? 'bg-white' : 'bg-purple-50/30'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-purple-50 text-[#6D28D9] shrink-0 mt-0.5">
                {n.type === 'assessment' && <Calendar className="w-4 h-4" />}
                {n.type === 'placement' && <Building2 className="w-4 h-4" />}
                {n.type === 'system' && <Sparkles className="w-4 h-4" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-[#181525]">{n.title}</h4>
                  <span className="text-[10px] text-[#77718A]">{n.date}</span>
                </div>
                <p className="text-xs text-[#77718A] leading-relaxed">{n.message}</p>
              </div>

              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-[#6D28D9] shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
