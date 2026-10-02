import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { BulkEmailLog } from '../../types';
import {
  Mail,
  UploadCloud,
  Send,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  History,
  Check,
  ChevronRight
} from 'lucide-react';

export const AdminBulkEmailPage: React.FC = () => {
  const [templates, setTemplates] = useState<Record<string, { subject: string; body: string }>>({});
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('drive_announcement');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRecipients, setParsedRecipients] = useState<any[]>([]);

  const [previewSubject, setPreviewSubject] = useState('');
  const [previewBody, setPreviewBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [logs, setLogs] = useState<BulkEmailLog[]>([]);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplatesAndLogs();
  }, []);

  const fetchTemplatesAndLogs = async () => {
    try {
      const [tpls, logList, studentList] = await Promise.all([
        api.bulkEmail.getTemplates(),
        api.bulkEmail.getLogs(),
        api.admin.getStudents().catch(() => [])
      ]);
      setTemplates(tpls);
      setLogs(logList);
      if (studentList && studentList.length > 0) {
        setParsedRecipients(studentList.map((s: any) => ({ email: s.email, name: s.full_name })));
      }
      updatePreview('drive_announcement', tpls);
    } catch (err) {
      console.error(err);
    }
  };

  const updatePreview = async (templateKey: string, tpls = templates) => {
    try {
      const res = await api.bulkEmail.preview({
        template_key: templateKey,
        variables: {
          name: parsedRecipients[0]?.name || 'Candidate Name',
          company: 'Enterprise Partner',
          role: 'Associate Software Engineer',
          cgpa: '7.5',
          deadline: 'In 14 days',
          assessment_title: 'Institutional Screening Assessment'
        }
      });
      setPreviewSubject(res.subject);
      setPreviewBody(res.body);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTemplateChange = (key: string) => {
    setSelectedTemplateKey(key);
    updatePreview(key);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    try {
      const res = await api.bulkEmail.parseCsv(file);
      setParsedRecipients(res.recipients);
      updatePreview(selectedTemplateKey);
    } catch (err: any) {
      alert('CSV Parse failed: ' + err.message);
    }
  };

  const handleSend = async () => {
    if (parsedRecipients.length === 0) {
      alert('Please upload or provide recipients');
      return;
    }
    setIsSending(true);
    setSendSuccessMessage(null);
    try {
      const res = await api.bulkEmail.send({
        template_name: selectedTemplateKey,
        subject: previewSubject,
        recipients: parsedRecipients
      });
      setLogs([res.log, ...logs]);
      setSendSuccessMessage(`Dispatched to ${res.log.recipients_count} candidates successfully.`);
      setTimeout(() => setSendSuccessMessage(null), 4000);
    } catch (err: any) {
      alert('Failed to send bulk email: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bulk Email Automation</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
              Institutional Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Upload CSV rosters, customize standardized placement templates, preview dynamic tokens, and track execution logs.
          </p>
        </div>

        {sendSuccessMessage && (
          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {sendSuccessMessage}
          </span>
        )}
      </div>

      {/* Grid: Setup / CSV Upload vs Live Preview */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5/12): Template Selection & CSV Upload */}
        <div className="lg:col-span-5 space-y-5">
          {/* Template Selector */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Choose Email Template</label>
            <div className="space-y-2">
              {[
                { key: 'drive_announcement', label: 'Campus Placement Drive Announcement' },
                { key: 'assessment_reminder', label: 'Upcoming Assessment Proctored Reminder' },
                { key: 'shortlist_notification', label: 'Technical Shortlist & Interview Call' }
              ].map((tpl) => (
                <button
                  key={tpl.key}
                  type="button"
                  onClick={() => handleTemplateChange(tpl.key)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedTemplateKey === tpl.key
                      ? 'bg-purple-50 border-purple-600 text-purple-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{tpl.label}</span>
                  {selectedTemplateKey === tpl.key && <Check className="w-4 h-4 text-purple-700" />}
                </button>
              ))}
            </div>
          </div>

          {/* CSV File Uploader */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Upload Candidates CSV</span>
              <span className="text-[11px] text-purple-700 font-semibold">{parsedRecipients.length} Loaded</span>
            </div>

            <div className="p-6 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/30 text-center space-y-2">
              <FileSpreadsheet className="w-8 h-8 text-purple-600 mx-auto" />
              <p className="text-xs font-bold text-slate-800">
                {csvFile ? csvFile.name : 'Upload .csv with "email", "name" columns'}
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                id="csvInput"
                className="hidden"
              />
              <label
                htmlFor="csvInput"
                className="inline-block px-4 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-semibold cursor-pointer hover:bg-purple-800 shadow-xs"
              >
                Browse CSV
              </label>
            </div>

            {/* Recipient Roster Preview */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Recipient Roster Preview</span>
              <div className="max-h-36 overflow-y-auto space-y-1 rounded-xl border border-slate-100 p-2 bg-[#FBFAFF] text-xs">
                {parsedRecipients.length === 0 ? (
                  <p className="text-center py-4 text-slate-400 text-[11px]">
                    No candidates loaded. Upload a CSV roster or register students.
                  </p>
                ) : (
                  parsedRecipients.map((r, i) => (
                    <div key={i} className="flex justify-between text-slate-600 py-0.5 px-1">
                      <span className="font-semibold text-slate-800">{r.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{r.email}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={isSending || parsedRecipients.length === 0}
            className="w-full py-3.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
            {isSending ? 'Sending in progress...' : `Send to ${parsedRecipients.length} Candidates`}
          </button>
        </div>

        {/* Right Column (7/12): Live Email Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-700" />
                Live Candidate Email Preview
              </span>
              <span className="text-[10px] text-slate-400">Tokens Evaluated</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Subject</label>
                <div className="p-3 rounded-xl bg-[#FBFAFF] border border-slate-200 font-bold text-slate-900 mt-1">
                  {previewSubject || 'Subject preview'}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Message Body</label>
                <div className="p-4 rounded-xl bg-[#FBFAFF] border border-slate-200 text-slate-800 leading-relaxed font-sans whitespace-pre-wrap mt-1">
                  {previewBody || 'Body preview'}
                </div>
              </div>
            </div>
          </div>

          {/* Historical Logs Table */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <History className="w-4 h-4 text-purple-700" />
                Recent Communication Logs
              </h4>
              <span className="text-[11px] text-slate-400">{logs.length} Total Dispatches</span>
            </div>

            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No emails dispatched yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {logs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{log.subject}</span>
                      <p className="text-[10px] text-slate-400">
                        {log.template_name} • Sent on {new Date(log.sent_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {log.success_count} Delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
