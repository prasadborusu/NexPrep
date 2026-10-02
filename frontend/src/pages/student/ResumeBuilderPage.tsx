import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ResumeData } from '../../types';
import jsPDF from 'jspdf';
import {
  FileText,
  Sparkles,
  Download,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Wand2,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Layers
} from 'lucide-react';

export const ResumeBuilderPage: React.FC = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingBullets, setIsGeneratingBullets] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchResume = async () => {
      try {
        const data = await api.resume.get(user.id);
        setResume(data);
      } catch (err) {
        console.error('Error fetching resume:', err);
      }
    };
    fetchResume();
  }, [user]);

  // AI Summary Generation (Qwen3-8B)
  const handleGenerateSummary = async () => {
    if (!resume) return;
    setIsGeneratingSummary(true);
    try {
      const res = await api.resume.generateSummary({
        fullName: resume.personal_info.full_name,
        targetRole: resume.target_role,
        skills: [
          ...resume.skills.languages,
          ...resume.skills.frameworks,
          ...resume.skills.tools_databases
        ],
        education: resume.education[0]?.degree
      });
      setResume({
        ...resume,
        summary: res.summary
      });
    } catch (err) {
      console.error('AI Summary error:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // AI Project Bullets Generation (Qwen3-8B)
  const handleGenerateProjectBullets = async (projectId: string) => {
    if (!resume) return;
    const proj = resume.projects.find(p => p.id === projectId);
    if (!proj) return;

    setIsGeneratingBullets(projectId);
    try {
      const res = await api.resume.generateBullets({
        title: proj.title,
        technologies: proj.technologies,
        description: proj.bullets.join('. ')
      });

      setResume({
        ...resume,
        projects: resume.projects.map(p => p.id === projectId ? { ...p, bullets: res.bullets } : p)
      });
    } catch (err) {
      console.error('AI Bullets error:', err);
    } finally {
      setIsGeneratingBullets(null);
    }
  };

  // Save Resume to API
  const handleSave = async () => {
    if (!resume) return;
    setIsSaving(true);
    try {
      await api.resume.save(resume);
      setSaveMessage('Resume saved successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Error saving resume:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Export to ATS Standard PDF
  const handleExportPDF = () => {
    if (!resume) return;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const margin = 40;
    let y = 45;

    // Header: Full Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(resume.personal_info.full_name.toUpperCase(), margin, y);
    y += 18;

    // Coordinates
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const coords = [
      resume.personal_info.email,
      resume.personal_info.phone,
      resume.personal_info.location,
      resume.personal_info.linkedin_url,
      resume.personal_info.github_url
    ].filter(Boolean).join('  |  ');
    doc.text(coords, margin, y);
    y += 12;

    // Horizontal Rule
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 595 - margin, y);
    y += 16;

    // Professional Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('PROFESSIONAL SUMMARY', margin, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitSummary = doc.splitTextToSize(resume.summary, 595 - (margin * 2));
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 11 + 10;

    // Technical Skills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TECHNICAL SKILLS', margin, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Languages: ${resume.skills.languages.join(', ')}`, margin, y);
    y += 11;
    doc.text(`Frameworks & Libraries: ${resume.skills.frameworks.join(', ')}`, margin, y);
    y += 11;
    doc.text(`Databases & Tools: ${resume.skills.tools_databases.join(', ')}`, margin, y);
    y += 11;
    doc.text(`Core Competencies: ${resume.skills.core_concepts.join(', ')}`, margin, y);
    y += 18;

    // Experience
    if (resume.experience.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('EXPERIENCE', margin, y);
      y += 12;

      for (const exp of resume.experience) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text(`${exp.role} - ${exp.company}`, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${exp.start_date} - ${exp.end_date}`, 595 - margin - 80, y);
        y += 12;

        for (const bullet of exp.bullets) {
          const splitBullet = doc.splitTextToSize(`•  ${bullet}`, 595 - (margin * 2) - 10);
          doc.text(splitBullet, margin + 8, y);
          y += splitBullet.length * 10.5;
        }
        y += 6;
      }
      y += 6;
    }

    // Technical Projects
    if (resume.projects.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('TECHNICAL PROJECTS', margin, y);
      y += 12;

      for (const proj of resume.projects) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text(`${proj.title}  |  ${proj.technologies.join(', ')}`, margin, y);
        y += 12;

        for (const bullet of proj.bullets) {
          const splitBullet = doc.splitTextToSize(`•  ${bullet}`, 595 - (margin * 2) - 10);
          doc.text(splitBullet, margin + 8, y);
          y += splitBullet.length * 10.5;
        }
        y += 6;
      }
      y += 6;
    }

    // Education
    if (resume.education.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('EDUCATION', margin, y);
      y += 12;

      for (const edu of resume.education) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(`${edu.institution}`, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${edu.start_date} - ${edu.end_date}`, 595 - margin - 80, y);
        y += 11;
        doc.text(`${edu.degree} in ${edu.field}  |  Score: ${edu.score}`, margin, y);
        y += 16;
      }
    }

    doc.save(`${resume.personal_info.full_name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  if (!resume) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading AI Resume Builder...</div>;
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header with Save & PDF export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Resume Builder</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
              Qwen3-8B AI Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">Draft ATS-standard, high-impact resumes tailored to tech placement benchmarks</p>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveMessage}
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl border border-purple-200 text-purple-700 bg-white hover:bg-purple-50 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={handleExportPDF}
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Generate PDF
          </button>
        </div>
      </div>

      {/* 2-Column: Editor Controls vs Live ATS Preview */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7/12): Interactive Form Sections */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Role & Personal Info */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              Target Role & Contact Coordinates
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Career Role</label>
                <input
                  type="text"
                  value={resume.target_role}
                  onChange={(e) => setResume({ ...resume, target_role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.personal_info.full_name}
                  onChange={(e) => setResume({
                    ...resume,
                    personal_info: { ...resume.personal_info, full_name: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={resume.personal_info.email}
                  onChange={(e) => setResume({
                    ...resume,
                    personal_info: { ...resume.personal_info, email: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={resume.personal_info.phone}
                  onChange={(e) => setResume({
                    ...resume,
                    personal_info: { ...resume.personal_info, phone: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary with AI Generator */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Professional Summary
              </h3>

              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                {isGeneratingSummary ? 'Qwen AI Generating...' : 'Generate with Qwen3-8B'}
              </button>
            </div>

            <textarea
              rows={4}
              value={resume.summary}
              onChange={(e) => setResume({ ...resume, summary: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed focus:border-purple-600 focus:outline-none"
            />
          </div>

          {/* Technical Projects with AI Bullet Point Generator */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-purple-600" />
                Technical Projects
              </h3>

              <button
                type="button"
                onClick={() => {
                  const newProj = {
                    id: `proj-${Date.now()}`,
                    title: 'New Project',
                    technologies: ['React', 'Node.js'],
                    bullets: ['Architected responsive web application solving core problem.']
                  };
                  setResume({ ...resume, projects: [...resume.projects, newProj] });
                }}
                className="px-3 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            <div className="space-y-4">
              {resume.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-4 rounded-xl border border-purple-100 bg-[#FBFAFF] space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[pIdx].title = e.target.value;
                        setResume({ ...resume, projects: updated });
                      }}
                      className="font-bold text-xs text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-purple-600"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleGenerateProjectBullets(proj.id)}
                        disabled={isGeneratingBullets === proj.id}
                        className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Wand2 className="w-3 h-3" />
                        {isGeneratingBullets === proj.id ? 'Optimizing...' : 'AI Google X-Y-Z Bullets'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setResume({
                            ...resume,
                            projects: resume.projects.filter(p => p.id !== proj.id)
                          });
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={proj.technologies.join(', ')}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[pIdx].technologies = e.target.value.split(',').map(s => s.trim());
                        setResume({ ...resume, projects: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-500">Quantifiable Achievement Bullets</label>
                    {proj.bullets.map((b, bIdx) => (
                      <textarea
                        key={bIdx}
                        rows={2}
                        value={b}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[pIdx].bullets[bIdx] = e.target.value;
                          setResume({ ...resume, projects: updated });
                        }}
                        className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white leading-relaxed focus:outline-none"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5/12): Real-Time ATS Paper View */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-soft-lg sticky top-24 font-serif text-[11px] text-slate-800 space-y-4">
          <div className="text-center space-y-1 pb-3 border-b border-slate-300">
            <h2 className="text-base font-bold tracking-wider text-slate-900">{resume.personal_info.full_name.toUpperCase()}</h2>
            <p className="text-[10px] text-slate-600 font-sans">
              {resume.personal_info.email} • {resume.personal_info.phone} • {resume.personal_info.location}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-sans font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Professional Summary
            </h4>
            <p className="text-slate-700 leading-relaxed font-sans text-[10.5px]">{resume.summary}</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-sans font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Technical Skills
            </h4>
            <div className="font-sans text-[10px] text-slate-700 space-y-0.5">
              <p><strong>Languages:</strong> {resume.skills.languages.join(', ')}</p>
              <p><strong>Frameworks:</strong> {resume.skills.frameworks.join(', ')}</p>
              <p><strong>Tools & DBs:</strong> {resume.skills.tools_databases.join(', ')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-sans font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Technical Projects
            </h4>
            {resume.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5 font-sans">
                <div className="flex items-center justify-between font-bold text-[10.5px]">
                  <span>{proj.title}</span>
                  <span className="text-[9px] text-slate-500 font-normal">({proj.technologies.slice(0, 3).join(', ')})</span>
                </div>
                <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-0.5">
                  {proj.bullets.map((b, i) => (
                    <li key={i} className="leading-relaxed">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <h4 className="font-sans font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Education
            </h4>
            {resume.education.map((edu) => (
              <div key={edu.id} className="font-sans text-[10px] flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{edu.institution}</p>
                  <p className="text-slate-600">{edu.degree} in {edu.field} • {edu.score}</p>
                </div>
                <span className="text-slate-500">{edu.start_date} - {edu.end_date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
