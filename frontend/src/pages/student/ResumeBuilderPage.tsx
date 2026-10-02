import React, { useEffect, useState, useRef, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  ResumeData,
  ResumeVersion,
  EducationItem,
  ProjectItem,
  ExperienceItem,
  CertificationItem,
  AchievementItem,
  ResumeLinkItem,
  CategorizedSkills,
  JobMatchAnalysis
} from '../../types';
import jsPDF from 'jspdf';
import {
  FileText,
  Sparkles,
  Download,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  History,
  Layers,
  ScanSearch,
  RotateCcw,
  Check,
  X,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Link2,
  Code2,
  Wand2,
  Info,
  HelpCircle,
  Eye,
  Sliders,
  FileCode2
} from 'lucide-react';

const SKILL_CATEGORIES: Array<{ key: keyof CategorizedSkills; label: string; placeholder: string }> = [
  { key: 'languages', label: 'Programming Languages', placeholder: 'e.g. Java, Python, TypeScript, SQL' },
  { key: 'frameworks', label: 'Frameworks', placeholder: 'e.g. React, Next.js, Node.js, Spring Boot' },
  { key: 'libraries', label: 'Libraries', placeholder: 'e.g. Redux, TailwindCSS, Express, Pandas' },
  { key: 'databases', label: 'Databases', placeholder: 'e.g. PostgreSQL, MongoDB, Redis, MySQL' },
  { key: 'tools', label: 'Developer Tools', placeholder: 'e.g. Git, Docker, Postman, Linux, VS Code' },
  { key: 'cloud', label: 'Cloud & Infrastructure', placeholder: 'e.g. AWS (S3, EC2), Vercel, Supabase' },
  { key: 'other', label: 'Other Competencies', placeholder: 'e.g. Agile, REST APIs, System Design' }
];

export const ResumeBuilderPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active Resume State
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [activeSection, setActiveSection] = useState<number>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'minimal' | 'technical'>('minimal');

  // Autosave Status: 'saved' | 'saving' | 'unsaved'
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile / Tablet Tab: 'edit' | 'preview' | 'ai'
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview' | 'ai'>('edit');

  // AI Modal / Review Card States
  const [aiSummaryProposal, setAiSummaryProposal] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Project AI Suggestion State
  const [activeAiProject, setActiveAiProject] = useState<{
    projectId: string;
    improvedDesc: string;
    bullets: string[];
    explanation: string;
  } | null>(null);
  const [isImprovingProject, setIsImprovingProject] = useState<string | null>(null);

  // Experience AI Suggestion State
  const [activeAiExp, setActiveAiExp] = useState<{
    expId: string;
    improvedDesc: string;
    bullets: string[];
    explanation: string;
  } | null>(null);
  const [isImprovingExp, setIsImprovingExp] = useState<string | null>(null);

  // AI Assistant Panel State
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [jobMatch, setJobMatch] = useState<JobMatchAnalysis | null>(null);
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [structureAudit, setStructureAudit] = useState<Array<{ section: string; status: 'good' | 'warning' | 'tip'; message: string }> | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [keywordSuggestions, setKeywordSuggestions] = useState<Array<{ keyword: string; category: string; reason: string }> | null>(null);
  const [isSuggestingKeywords, setIsSuggestingKeywords] = useState(false);

  // Version History State
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionNameInput, setVersionNameInput] = useState('');
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);

  // Skill Input Helpers
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({});

  // 1. Initial Load
  useEffect(() => {
    if (!user) return;
    const loadResume = async () => {
      try {
        const data = await api.resume.get(user.id);
        // Ensure defaults if any property is empty
        if (!data.template) data.template = 'minimal';
        setSelectedTemplate(data.template as any);
        setResume(data);
        setVersions(data.versions || []);
      } catch (err) {
        console.error('Failed to load resume:', err);
      }
    };
    loadResume();
  }, [user]);

  // 2. Debounced Autosave (3 seconds after last change)
  const triggerAutoSave = (updated: ResumeData) => {
    setSaveStatus('unsaved');
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    autosaveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await api.resume.save(updated);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('unsaved');
      }
    }, 2500);
  };

  // Immediate Save Draft
  const handleSaveDraft = async () => {
    if (!resume) return;
    setSaveStatus('saving');
    try {
      await api.resume.save(resume);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Error saving resume draft:', err);
      setSaveStatus('unsaved');
    }
  };

  // Update Resume Helper
  const updateResume = (updater: (prev: ResumeData) => ResumeData) => {
    if (!resume) return;
    const updated = updater(resume);
    setResume(updated);
    triggerAutoSave(updated);
  };

  // 3. AI Summary Generator
  const handleGenerateSummary = async (action: 'generate' | 'improve' = 'generate') => {
    if (!resume) return;
    setIsGeneratingSummary(true);
    setAiSummaryProposal(null);
    try {
      const allSkills = [
        ...(resume.skills.languages || []),
        ...(resume.skills.frameworks || []),
        ...(resume.skills.databases || []),
        ...(resume.skills.tools || [])
      ];

      const res = await api.resume.generateSummary({
        fullName: resume.personal_info.full_name,
        targetRole: resume.target_role,
        skills: allSkills,
        education: resume.education[0]?.degree ? `${resume.education[0].degree} in ${resume.education[0].field}` : undefined,
        projects: resume.projects.map(p => p.title),
        experience: resume.experience.map(e => `${e.role} at ${e.company}`)
      });

      setAiSummaryProposal(res.summary);
    } catch (err) {
      console.error('AI summary error:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const acceptSummaryProposal = () => {
    if (!aiSummaryProposal) return;
    updateResume(prev => ({ ...prev, summary: aiSummaryProposal }));
    setAiSummaryProposal(null);
  };

  const rejectSummaryProposal = () => {
    setAiSummaryProposal(null);
  };

  // 4. AI Project Improver
  const handleImproveProject = async (projectId: string) => {
    if (!resume) return;
    const proj = resume.projects.find(p => p.id === projectId);
    if (!proj) return;

    setIsImprovingProject(projectId);
    try {
      const res = await api.resume.improveProject({
        title: proj.title,
        currentDescription: proj.description,
        technologies: proj.technologies,
        contributions: proj.contributions
      });

      setActiveAiProject({
        projectId,
        improvedDesc: res.improvedDescription,
        bullets: res.bullets,
        explanation: res.explanation
      });
    } catch (err) {
      console.error('AI improve project error:', err);
    } finally {
      setIsImprovingProject(null);
    }
  };

  const acceptProjectImprovement = () => {
    if (!activeAiProject || !resume) return;
    updateResume(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === activeAiProject.projectId
          ? {
              ...p,
              description: activeAiProject.improvedDesc,
              bullets: activeAiProject.bullets
            }
          : p
      )
    }));
    setActiveAiProject(null);
  };

  // 5. AI Experience Improver
  const handleImproveExperience = async (expId: string) => {
    if (!resume) return;
    const exp = resume.experience.find(e => e.id === expId);
    if (!exp) return;

    setIsImprovingExp(expId);
    try {
      const res = await api.resume.improveExperience({
        company: exp.company,
        role: exp.role,
        currentDescription: exp.description || '',
        responsibilities: exp.responsibilities,
        achievements: exp.achievements
      });

      setActiveAiExp({
        expId,
        improvedDesc: res.improvedDescription,
        bullets: res.bullets,
        explanation: res.explanation
      });
    } catch (err) {
      console.error('AI improve experience error:', err);
    } finally {
      setIsImprovingExp(null);
    }
  };

  const acceptExpImprovement = () => {
    if (!activeAiExp || !resume) return;
    updateResume(prev => ({
      ...prev,
      experience: prev.experience.map(e =>
        e.id === activeAiExp.expId
          ? {
              ...e,
              description: activeAiExp.improvedDesc,
              bullets: activeAiExp.bullets
            }
          : e
      )
    }));
    setActiveAiExp(null);
  };

  // 6. Job Description Matcher
  const handleAnalyzeJobMatch = async () => {
    if (!resume || !resume.job_description) return;
    setIsAnalyzingJob(true);
    try {
      const res = await api.resume.analyzeJobMatch({
        job_description: resume.job_description,
        resume_data: resume
      });
      setJobMatch(res);
    } catch (err) {
      console.error('Job match analysis error:', err);
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  // 7. Structure Audit
  const handleCheckStructure = async () => {
    if (!resume) return;
    setIsAuditing(true);
    try {
      const res = await api.resume.checkStructure({ resume_data: resume });
      setStructureAudit(res.audit);
    } catch (err) {
      console.error('Structure check error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // 8. Keyword Suggestions
  const handleSuggestKeywords = async () => {
    if (!resume) return;
    setIsSuggestingKeywords(true);
    try {
      const allCurrentSkills = [
        ...(resume.skills.languages || []),
        ...(resume.skills.frameworks || []),
        ...(resume.skills.databases || []),
        ...(resume.skills.tools || [])
      ];

      const res = await api.resume.suggestKeywords({
        target_role: resume.target_role,
        job_description: resume.job_description,
        current_skills: allCurrentSkills
      });
      setKeywordSuggestions(res.suggestions);
    } catch (err) {
      console.error('Keyword suggestion error:', err);
    } finally {
      setIsSuggestingKeywords(false);
    }
  };

  // 9. Version Management
  const handleSaveVersion = async () => {
    if (!resume || !user) return;
    setIsSavingVersion(true);
    try {
      const res = await api.resume.saveVersion({
        student_id: user.id,
        version_name: versionNameInput.trim() || undefined,
        resume_data: resume
      });
      setVersions([res.version, ...versions]);
      setVersionNameInput('');
    } catch (err) {
      console.error('Error saving version snapshot:', err);
    } finally {
      setIsSavingVersion(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!user) return;
    if (!window.confirm('Restore this version into your active editor? Any unsaved changes in your current draft will be replaced.')) {
      return;
    }
    try {
      const res = await api.resume.restoreVersion(user.id, versionId);
      setResume(res.resume);
      setSelectedTemplate((res.resume.template as any) || 'minimal');
      setIsVersionModalOpen(false);
      alert('Version restored successfully.');
    } catch (err) {
      console.error('Error restoring version:', err);
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (!user) return;
    try {
      const res = await api.resume.deleteVersion(user.id, versionId);
      setVersions(res.remaining_versions);
    } catch (err) {
      console.error('Error deleting version:', err);
    }
  };

  // 10. Add Skill to Category
  const handleAddSkill = (category: keyof CategorizedSkills) => {
    const val = (skillInputs[category] || '').trim();
    if (!val || !resume) return;

    if (!resume.skills[category].includes(val)) {
      updateResume(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], val]
        }
      }));
    }
    setSkillInputs({ ...skillInputs, [category]: '' });
  };

  const handleRemoveSkill = (category: keyof CategorizedSkills, skillName: string) => {
    if (!resume) return;
    updateResume(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter(s => s !== skillName)
      }
    }));
  };

  // 11. PDF Generation
  const handleExportPDF = () => {
    if (!resume) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const margin = 40;
    const pageWidth = 595.28;
    const contentWidth = pageWidth - margin * 2;
    let y = 45;

    // Helper for page break
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > 800) {
        doc.addPage();
        y = 45;
      }
    };

    // Color definitions based on template
    const isClassic = selectedTemplate === 'classic';
    const isModern = selectedTemplate === 'modern';
    const isTechnical = selectedTemplate === 'technical';

    const primaryColor: [number, number, number] = isModern
      ? [109, 40, 217] // Purple
      : isTechnical
      ? [30, 41, 59] // Slate Dark
      : [24, 21, 37]; // Neutral Dark

    const accentColor: [number, number, number] = isModern ? [236, 72, 153] : [100, 116, 139];

    // 1. Header: Name & Role
    doc.setFont(isClassic ? 'times' : 'helvetica', 'bold');
    doc.setFontSize(isClassic ? 20 : 18);
    doc.setTextColor(...primaryColor);

    const fullName = (resume.personal_info.full_name || 'Candidate Name').toUpperCase();
    if (isClassic) {
      // Centered classic header
      doc.text(fullName, pageWidth / 2, y, { align: 'center' });
      y += 18;
    } else {
      doc.text(fullName, margin, y);
      y += 16;
    }

    // Target Role Subtitle
    if (resume.target_role) {
      doc.setFont(isClassic ? 'times' : 'helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(isModern ? 109 : 100, isModern ? 40 : 116, isModern ? 217 : 139);
      if (isClassic) {
        doc.text(resume.target_role, pageWidth / 2, y, { align: 'center' });
        y += 14;
      } else {
        doc.text(resume.target_role, margin, y);
        y += 14;
      }
    }

    // Contact Coordinates
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);

    const coords = [
      resume.personal_info.email,
      resume.personal_info.phone,
      resume.personal_info.location,
      resume.personal_info.linkedin_url,
      resume.personal_info.github_url,
      resume.personal_info.portfolio_url
    ].filter(Boolean).join('  •  ');

    if (coords) {
      if (isClassic) {
        doc.text(coords, pageWidth / 2, y, { align: 'center' });
      } else {
        doc.text(coords, margin, y);
      }
      y += 14;
    }

    // Section Divider Helper
    const drawSectionHeader = (title: string) => {
      checkPageBreak(35);
      y += 6;
      doc.setFont(isClassic ? 'times' : 'helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...primaryColor);
      doc.text(title.toUpperCase(), margin, y);
      y += 5;

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.75);
      doc.line(margin, y, margin + contentWidth, y);
      y += 12;
    };

    // 2. Summary Section
    if (resume.summary && resume.summary.trim()) {
      drawSectionHeader('Professional Summary');
      doc.setFont(isClassic ? 'times' : 'helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const splitSum = doc.splitTextToSize(resume.summary.trim(), contentWidth);
      doc.text(splitSum, margin, y);
      y += splitSum.length * 11 + 6;
    }

    // 3. Education Section
    if (resume.education && resume.education.length > 0) {
      drawSectionHeader('Education');
      resume.education.forEach(edu => {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        const deg = `${edu.degree || 'Degree'}${edu.field ? ` in ${edu.field}` : ''}`;
        doc.text(deg, margin, y);

        // Date right-aligned
        const dateRange = [edu.start_year, edu.end_year].filter(Boolean).join(' - ');
        if (dateRange) {
          doc.setFont('helvetica', 'normal');
          doc.text(dateRange, margin + contentWidth, y, { align: 'right' });
        }
        y += 11;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        const instLine = [edu.institution, edu.location, edu.score].filter(Boolean).join(' | ');
        doc.text(instLine, margin, y);
        y += 13;
      });
    }

    // 4. Technical Skills
    const allSkillGroups = SKILL_CATEGORIES
      .map(cat => ({ label: cat.label, skills: resume.skills[cat.key] || [] }))
      .filter(g => g.skills.length > 0);

    if (allSkillGroups.length > 0) {
      drawSectionHeader('Technical Skills');
      allSkillGroups.forEach(group => {
        checkPageBreak(16);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const labelText = `${group.label}: `;
        doc.text(labelText, margin, y);

        const labelWidth = doc.getTextWidth(labelText);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const splitSkills = doc.splitTextToSize(group.skills.join(', '), contentWidth - labelWidth);
        doc.text(splitSkills, margin + labelWidth, y);
        y += splitSkills.length * 10 + 3;
      });
      y += 4;
    }

    // 5. Projects Section
    if (resume.projects && resume.projects.length > 0) {
      drawSectionHeader('Technical Projects');
      resume.projects.forEach(proj => {
        checkPageBreak(40);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(proj.title, margin, y);

        if (proj.duration) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(proj.duration, margin + contentWidth, y, { align: 'right' });
        }
        y += 11;

        if (proj.technologies && proj.technologies.length > 0) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(109, 40, 217);
          doc.text(`Tech: ${proj.technologies.join(', ')}`, margin, y);
          y += 10;
        }

        if (proj.description) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          const splitDesc = doc.splitTextToSize(proj.description, contentWidth);
          doc.text(splitDesc, margin, y);
          y += splitDesc.length * 10 + 3;
        }

        // Project Bullets
        if (proj.bullets && proj.bullets.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          proj.bullets.forEach(b => {
            const splitBullet = doc.splitTextToSize(`•  ${b}`, contentWidth - 8);
            checkPageBreak(splitBullet.length * 10);
            doc.text(splitBullet, margin + 8, y);
            y += splitBullet.length * 10 + 2;
          });
        }
        y += 6;
      });
    }

    // 6. Experience Section
    if (resume.experience && resume.experience.length > 0) {
      drawSectionHeader('Experience');
      resume.experience.forEach(exp => {
        checkPageBreak(40);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`${exp.role} — ${exp.company}`, margin, y);

        const dateRange = [exp.start_date, exp.is_current ? 'Present' : exp.end_date].filter(Boolean).join(' - ');
        if (dateRange) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(dateRange, margin + contentWidth, y, { align: 'right' });
        }
        y += 11;

        if (exp.location || exp.employment_type) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text([exp.employment_type, exp.location].filter(Boolean).join(' • '), margin, y);
          y += 10;
        }

        if (exp.description) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          const splitDesc = doc.splitTextToSize(exp.description, contentWidth);
          doc.text(splitDesc, margin, y);
          y += splitDesc.length * 10 + 3;
        }

        if (exp.bullets && exp.bullets.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          exp.bullets.forEach(b => {
            const splitBullet = doc.splitTextToSize(`•  ${b}`, contentWidth - 8);
            checkPageBreak(splitBullet.length * 10);
            doc.text(splitBullet, margin + 8, y);
            y += splitBullet.length * 10 + 2;
          });
        }
        y += 6;
      });
    }

    // 7. Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      drawSectionHeader('Certifications');
      resume.certifications.forEach(cert => {
        checkPageBreak(18);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`•  ${cert.name}`, margin + 4, y);

        const issuerLine = [cert.issuer, cert.issue_date].filter(Boolean).join(' | ');
        if (issuerLine) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 116, 139);
          doc.text(issuerLine, margin + contentWidth, y, { align: 'right' });
        }
        y += 11;
      });
      y += 4;
    }

    // 8. Achievements
    if (resume.achievements && resume.achievements.length > 0) {
      drawSectionHeader('Achievements & Recognition');
      resume.achievements.forEach(ach => {
        checkPageBreak(25);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`•  ${ach.title}`, margin + 4, y);

        if (ach.date || ach.organization) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 116, 139);
          doc.text([ach.organization, ach.date].filter(Boolean).join(' | '), margin + contentWidth, y, { align: 'right' });
        }
        y += 11;

        if (ach.description) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          const splitDesc = doc.splitTextToSize(ach.description, contentWidth - 12);
          doc.text(splitDesc, margin + 12, y);
          y += splitDesc.length * 9.5 + 3;
        }
      });
      y += 4;
    }

    // 9. Links
    if (resume.links && resume.links.length > 0) {
      drawSectionHeader('Profiles & Portfolios');
      const linkLine = resume.links.map(l => `${l.platform}: ${l.url}`).join('  |  ');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(109, 40, 217);
      const splitLinks = doc.splitTextToSize(linkLine, contentWidth);
      doc.text(splitLinks, margin, y);
      y += splitLinks.length * 10;
    }

    // Save PDF
    const cleanStudentName = (resume.personal_info.full_name || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`NexPrep_Resume_${cleanStudentName}.pdf`);
  };

  if (!resume) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading production resume editor...
      </div>
    );
  }

  const sectionsProgress = [
    { num: 1, name: 'Personal' },
    { num: 2, name: 'Target Role' },
    { num: 3, name: 'Summary' },
    { num: 4, name: 'Education' },
    { num: 5, name: 'Skills' },
    { num: 6, name: 'Projects' },
    { num: 7, name: 'Experience' },
    { num: 8, name: 'Certifications' },
    { num: 9, name: 'Achievements' },
    { num: 10, name: 'Links' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">AI Resume Builder</h1>
              <p className="text-xs text-slate-500">Build a professional resume tailored to your target role.</p>
            </div>
          </div>
        </div>

        {/* Top-Right Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Autosave Status Pill */}
          <div className="px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-semibold flex items-center gap-1.5 text-slate-600 bg-slate-50">
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <Clock className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Unsaved changes</span>
              </>
            )}
          </div>

          {/* Versions Button */}
          <button
            onClick={() => setIsVersionModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-purple-200 hover:bg-purple-50/50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-purple-600" />
            <span>Versions ({versions.length})</span>
          </button>

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Analyze Resume Button */}
          <button
            onClick={() => navigate('/student/resume/analyzer')}
            className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100/70 text-purple-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <ScanSearch className="w-3.5 h-3.5 text-pink-600" />
            <span>Analyze Resume</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Progress & Section Navigation Bar */}
      <div className="bg-white rounded-2xl p-3 border border-purple-100 shadow-soft overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2 text-xs">
          {sectionsProgress.map(sec => {
            const isActive = activeSection === sec.num;
            return (
              <button
                key={sec.num}
                onClick={() => setActiveSection(sec.num)}
                className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all font-semibold ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-purple-50/60 hover:text-purple-800'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  isActive ? 'bg-white text-purple-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {sec.num}
                </span>
                <span className="truncate">{sec.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile / Tablet Tab Switcher */}
      <div className="lg:hidden flex rounded-2xl bg-white border border-purple-100 p-1 shadow-soft">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileTab === 'edit' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Editor Form
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileTab === 'preview' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Live Preview
        </button>
        <button
          onClick={() => setMobileTab('ai')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileTab === 'ai' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          AI Assistant
        </button>
      </div>

      {/* Main 2-Column Split Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* CENTER COLUMN: Resume Editor Form                        */}
        {/* ======================================================== */}
        <div className={`lg:col-span-7 space-y-6 ${mobileTab !== 'edit' ? 'hidden lg:block' : ''}`}>
          {/* SECTION 1: Personal Information */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">1</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                  <p className="text-[11px] text-slate-500">Contact details and portfolio links for recruiters</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={resume.personal_info.full_name}
                  onChange={(e) => updateResume(prev => ({
                    ...prev,
                    personal_info: { ...prev.personal_info, full_name: e.target.value }
                  }))}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={resume.personal_info.email}
                  onChange={(e) => updateResume(prev => ({
                    ...prev,
                    personal_info: { ...prev.personal_info, email: e.target.value }
                  }))}
                  placeholder="e.g. candidate@university.edu"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resume.personal_info.phone}
                  onChange={(e) => updateResume(prev => ({
                    ...prev,
                    personal_info: { ...prev.personal_info, phone: e.target.value }
                  }))}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / City</label>
                <input
                  type="text"
                  value={resume.personal_info.location}
                  onChange={(e) => updateResume(prev => ({
                    ...prev,
                    personal_info: { ...prev.personal_info, location: e.target.value }
                  }))}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={resume.personal_info.linkedin_url || ''}
                  onChange={(e) => updateResume(prev => ({
                    ...prev,
                    personal_info: { ...prev.personal_info, linkedin_url: e.target.value }
                  }))}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GitHub Profile</label>
                <input
                  type="text"
                  value={resume.personal_info.github_url || ''}
                  onChange={(e) => updateResume(prev => ({
                    ...prev,
                    personal_info: { ...prev.personal_info, github_url: e.target.value }
                  }))}
                  placeholder="github.com/username"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Personal Portfolio / Website</label>
                <input
                  type="text"
                  value={resume.personal_info.portfolio_url || ''}
                  onChange={(e) => updateResume(prev => ({
                    ...prev,
                    personal_info: { ...prev.personal_info, portfolio_url: e.target.value }
                  }))}
                  placeholder="https://myportfolio.dev"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Target Role & Job Context */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">2</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Target Role & Opportunity Context</h3>
                  <p className="text-[11px] text-slate-500">Guides AI summary synthesis and keyword matching</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Job Role</label>
                <input
                  type="text"
                  value={resume.target_role}
                  onChange={(e) => updateResume(prev => ({ ...prev, target_role: e.target.value }))}
                  placeholder="e.g. Full Stack Engineer"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Industry / Domain</label>
                <input
                  type="text"
                  value={resume.target_industry || ''}
                  onChange={(e) => updateResume(prev => ({ ...prev, target_industry: e.target.value }))}
                  placeholder="e.g. Enterprise SaaS, FinTech"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">Paste Target Job Description (Optional)</label>
                  <span className="text-[10px] text-purple-700 font-semibold">Powers AI Gap Analysis</span>
                </div>
                <textarea
                  rows={4}
                  value={resume.job_description || ''}
                  onChange={(e) => updateResume(prev => ({ ...prev, job_description: e.target.value }))}
                  placeholder="Paste the key requirements or role summary from the job posting to analyze skill matching..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Professional Summary */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">3</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
                  <p className="text-[11px] text-slate-500">Concise 3-4 sentence elevator pitch synthesized from your real credentials</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerateSummary('generate')}
                  disabled={isGeneratingSummary}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                  {isGeneratingSummary ? 'Synthesizing...' : 'Generate with AI'}
                </button>
              </div>
            </div>

            {/* AI Review Proposal Card (Never auto-overwrites) */}
            {aiSummaryProposal && (
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                    AI Proposed Summary (Review & Accept)
                  </span>
                  <span className="text-[10px] text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200 font-medium">
                    Safe Synthesis
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-normal bg-white p-3 rounded-xl border border-purple-100">
                  {aiSummaryProposal}
                </p>
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <button
                    onClick={() => handleGenerateSummary('generate')}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-purple-100/50 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Regenerate
                  </button>
                  <button
                    onClick={rejectSummaryProposal}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={acceptSummaryProposal}
                    className="px-3.5 py-1 rounded-lg text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3 h-3" /> Accept & Apply
                  </button>
                </div>
              </div>
            )}

            <textarea
              rows={4}
              value={resume.summary}
              onChange={(e) => updateResume(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="A brief executive overview highlighting your target role, core technical competencies, and development approach..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none leading-relaxed"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Recommended: 40 - 75 words</span>
              <span>{resume.summary.trim().split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>

          {/* SECTION 4: Education */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">4</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Education</h3>
                  <p className="text-[11px] text-slate-500">Degree, university, branch, CGPA, and timeline</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newEdu: EducationItem = {
                    id: `edu-${Date.now()}`,
                    institution: '',
                    degree: 'B.Tech',
                    field: '',
                    start_year: '',
                    end_year: '',
                    score: '',
                    location: ''
                  };
                  updateResume(prev => ({ ...prev, education: [...prev.education, newEdu] }));
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>

            {resume.education.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No education added yet. Click "+ Add Education" to add your academic background.
              </div>
            ) : (
              <div className="space-y-4">
                {resume.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-[#FBFAFF] border border-slate-200 space-y-3 text-xs relative">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900">Education Entry #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => updateResume(prev => ({
                          ...prev,
                          education: prev.education.filter(e => e.id !== edu.id)
                        }))}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Institution / University</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            education: prev.education.map(item => item.id === edu.id ? { ...item, institution: e.target.value } : item)
                          }))}
                          placeholder="e.g. National Institute of Technology"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Degree & Major / Branch</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            education: prev.education.map(item => item.id === edu.id ? { ...item, degree: e.target.value } : item)
                          }))}
                          placeholder="e.g. B.Tech in Computer Science"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Year</label>
                          <input
                            type="text"
                            value={edu.start_year || ''}
                            onChange={(e) => updateResume(prev => ({
                              ...prev,
                              education: prev.education.map(item => item.id === edu.id ? { ...item, start_year: e.target.value } : item)
                            }))}
                            placeholder="2022"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">End / Grad Year</label>
                          <input
                            type="text"
                            value={edu.end_year || ''}
                            onChange={(e) => updateResume(prev => ({
                              ...prev,
                              education: prev.education.map(item => item.id === edu.id ? { ...item, end_year: e.target.value } : item)
                            }))}
                            placeholder="2026"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">CGPA / Percentage</label>
                          <input
                            type="text"
                            value={edu.score || ''}
                            onChange={(e) => updateResume(prev => ({
                              ...prev,
                              education: prev.education.map(item => item.id === edu.id ? { ...item, score: e.target.value } : item)
                            }))}
                            placeholder="e.g. 8.75 CGPA"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Campus Location</label>
                          <input
                            type="text"
                            value={edu.location || ''}
                            onChange={(e) => updateResume(prev => ({
                              ...prev,
                              education: prev.education.map(item => item.id === edu.id ? { ...item, location: e.target.value } : item)
                            }))}
                            placeholder="e.g. Bengaluru"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 5: Technical Skills (Categorized) */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">5</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Categorized Technical Skills</h3>
                  <p className="text-[11px] text-slate-500">Organized chips verified from your actual skill set</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {SKILL_CATEGORIES.map(cat => {
                const list = resume.skills[cat.key] || [];
                return (
                  <div key={cat.key} className="p-3.5 rounded-2xl bg-[#FBFAFF] border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{cat.label}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{list.length} added</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {list.map(s => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-900 text-xs font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(cat.key, s)}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInputs[cat.key] || ''}
                        onChange={(e) => setSkillInputs({ ...skillInputs, [cat.key]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill(cat.key);
                          }
                        }}
                        placeholder={cat.placeholder}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:border-purple-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSkill(cat.key)}
                        className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-all shadow-2xs"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 6: Projects */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">6</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Technical Projects</h3>
                  <p className="text-[11px] text-slate-500">Document your applications with real tech stacks and AI-refined descriptions</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newProj: ProjectItem = {
                    id: `proj-${Date.now()}`,
                    title: '',
                    description: '',
                    technologies: [],
                    github_url: '',
                    demo_url: '',
                    duration: '',
                    bullets: []
                  };
                  updateResume(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            {/* AI Review Card for Projects */}
            {activeAiProject && (
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-pink-600" />
                    AI Description Enhancement (Review & Apply)
                  </span>
                  <span className="text-[10px] text-slate-500">{activeAiProject.explanation}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-2 text-xs">
                  <p className="font-semibold text-slate-800">{activeAiProject.improvedDesc}</p>
                  {activeAiProject.bullets.length > 0 && (
                    <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                      {activeAiProject.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveAiProject(null)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={acceptProjectImprovement}
                    className="px-3.5 py-1 rounded-lg text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Apply to Project
                  </button>
                </div>
              </div>
            )}

            {resume.projects.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No projects added yet. Click "+ Add Project" to document your work.
              </div>
            ) : (
              <div className="space-y-4">
                {resume.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-[#FBFAFF] border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900">Project #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleImproveProject(proj.id)}
                          disabled={isImprovingProject === proj.id || !proj.title}
                          className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-pink-600" />
                          {isImprovingProject === proj.id ? 'Improving...' : 'Improve with AI'}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateResume(prev => ({
                            ...prev,
                            projects: prev.projects.filter(p => p.id !== proj.id)
                          }))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => p.id === proj.id ? { ...p, title: e.target.value } : p)
                          }))}
                          placeholder="e.g. Distributed Task Scheduler"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Duration</label>
                        <input
                          type="text"
                          value={proj.duration || ''}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => p.id === proj.id ? { ...p, duration: e.target.value } : p)
                          }))}
                          placeholder="e.g. Jan 2024 - Mar 2024"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Technologies Used (comma-separated)</label>
                        <input
                          type="text"
                          value={proj.technologies.join(', ')}
                          onChange={(e) => {
                            const parsed = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            updateResume(prev => ({
                              ...prev,
                              projects: prev.projects.map(p => p.id === proj.id ? { ...p, technologies: parsed } : p)
                            }));
                          }}
                          placeholder="e.g. React, Node.js, Redis, PostgreSQL"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={proj.github_url || ''}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => p.id === proj.id ? { ...p, github_url: e.target.value } : p)
                          }))}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Live Demo URL</label>
                        <input
                          type="text"
                          value={proj.demo_url || ''}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => p.id === proj.id ? { ...p, demo_url: e.target.value } : p)
                          }))}
                          placeholder="https://myproject.app"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Description</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p)
                          }))}
                          placeholder="Describe the application's purpose and what you built..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 7: Experience */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">7</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Experience / Internships</h3>
                  <p className="text-[11px] text-slate-500">Professional, trainee, or open-source engineering roles</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newExp: ExperienceItem = {
                    id: `exp-${Date.now()}`,
                    company: '',
                    role: '',
                    employment_type: 'Internship',
                    location: '',
                    start_date: '',
                    end_date: '',
                    is_current: false,
                    description: '',
                    bullets: []
                  };
                  updateResume(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            {/* AI Review Card for Experience */}
            {activeAiExp && (
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-pink-600" />
                    AI Experience Polish (Review & Apply)
                  </span>
                  <span className="text-[10px] text-slate-500">{activeAiExp.explanation}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-2 text-xs">
                  <p className="font-semibold text-slate-800">{activeAiExp.improvedDesc}</p>
                  {activeAiExp.bullets.length > 0 && (
                    <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                      {activeAiExp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveAiExp(null)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={acceptExpImprovement}
                    className="px-3.5 py-1 rounded-lg text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Apply to Role
                  </button>
                </div>
              </div>
            )}

            {resume.experience.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No experience added yet. (Omitted from final resume if blank).
              </div>
            ) : (
              <div className="space-y-4">
                {resume.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 rounded-2xl bg-[#FBFAFF] border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900">Experience #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleImproveExperience(exp.id)}
                          disabled={isImprovingExp === exp.id || !exp.company}
                          className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-pink-600" />
                          {isImprovingExp === exp.id ? 'Improving...' : 'Improve with AI'}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateResume(prev => ({
                            ...prev,
                            experience: prev.experience.filter(e => e.id !== exp.id)
                          }))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            experience: prev.experience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item)
                          }))}
                          placeholder="e.g. Acme Tech Labs"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            experience: prev.experience.map(item => item.id === exp.id ? { ...item, role: e.target.value } : item)
                          }))}
                          placeholder="e.g. Software Engineer Intern"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.start_date || ''}
                            onChange={(e) => updateResume(prev => ({
                              ...prev,
                              experience: prev.experience.map(item => item.id === exp.id ? { ...item, start_date: e.target.value } : item)
                            }))}
                            placeholder="May 2024"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">End Date</label>
                          <input
                            type="text"
                            disabled={exp.is_current}
                            value={exp.is_current ? 'Present' : (exp.end_date || '')}
                            onChange={(e) => updateResume(prev => ({
                              ...prev,
                              experience: prev.experience.map(item => item.id === exp.id ? { ...item, end_date: e.target.value } : item)
                            }))}
                            placeholder="Jul 2024"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none disabled:bg-slate-100"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                          <input
                            type="checkbox"
                            checked={exp.is_current || false}
                            onChange={(e) => updateResume(prev => ({
                              ...prev,
                              experience: prev.experience.map(item => item.id === exp.id ? { ...item, is_current: e.target.checked } : item)
                            }))}
                            className="rounded text-purple-600"
                          />
                          Currently working here
                        </label>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description / Key Responsibilities</label>
                        <textarea
                          rows={2}
                          value={exp.description || ''}
                          onChange={(e) => updateResume(prev => ({
                            ...prev,
                            experience: prev.experience.map(item => item.id === exp.id ? { ...item, description: e.target.value } : item)
                          }))}
                          placeholder="Outline your primary duties and what you delivered..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 8: Certifications */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">8</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Certifications</h3>
                  <p className="text-[11px] text-slate-500">Professional credentials and verified badges</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newCert: CertificationItem = {
                    id: `cert-${Date.now()}`,
                    name: '',
                    issuer: '',
                    issue_date: '',
                    credential_url: ''
                  };
                  updateResume(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            {resume.certifications.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No certifications added yet. (Omitted if blank).
              </div>
            ) : (
              <div className="space-y-3">
                {resume.certifications.map((cert) => (
                  <div key={cert.id} className="p-3.5 rounded-2xl bg-[#FBFAFF] border border-slate-200 grid sm:grid-cols-3 gap-3 text-xs items-center">
                    <div>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateResume(prev => ({
                          ...prev,
                          certifications: prev.certifications.map(c => c.id === cert.id ? { ...c, name: e.target.value } : c)
                        }))}
                        placeholder="Certification Title"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateResume(prev => ({
                          ...prev,
                          certifications: prev.certifications.map(c => c.id === cert.id ? { ...c, issuer: e.target.value } : c)
                        }))}
                        placeholder="Issuer (e.g. AWS, Oracle)"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cert.issue_date || ''}
                        onChange={(e) => updateResume(prev => ({
                          ...prev,
                          certifications: prev.certifications.map(c => c.id === cert.id ? { ...c, issue_date: e.target.value } : c)
                        }))}
                        placeholder="Issue Date"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateResume(prev => ({
                          ...prev,
                          certifications: prev.certifications.filter(c => c.id !== cert.id)
                        }))}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 9: Achievements */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">9</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Achievements & Honors</h3>
                  <p className="text-[11px] text-slate-500">Hackathon rankings, academic awards, and publications</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newAch: AchievementItem = {
                    id: `ach-${Date.now()}`,
                    title: '',
                    description: '',
                    date: '',
                    organization: ''
                  };
                  updateResume(prev => ({ ...prev, achievements: [...prev.achievements, newAch] }));
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Achievement
              </button>
            </div>

            {resume.achievements.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No achievements added yet. (Omitted if blank).
              </div>
            ) : (
              <div className="space-y-3">
                {resume.achievements.map((ach) => (
                  <div key={ach.id} className="p-3.5 rounded-2xl bg-[#FBFAFF] border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={ach.title}
                        onChange={(e) => updateResume(prev => ({
                          ...prev,
                          achievements: prev.achievements.map(a => a.id === ach.id ? { ...a, title: e.target.value } : a)
                        }))}
                        placeholder="Achievement Title (e.g. 1st Place National Hackathon)"
                        className="flex-1 font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => updateResume(prev => ({
                          ...prev,
                          achievements: prev.achievements.filter(a => a.id !== ach.id)
                        }))}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={ach.organization || ''}
                        onChange={(e) => updateResume(prev => ({
                          ...prev,
                          achievements: prev.achievements.map(a => a.id === ach.id ? { ...a, organization: e.target.value } : a)
                        }))}
                        placeholder="Organization / Event"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={ach.date || ''}
                        onChange={(e) => updateResume(prev => ({
                          ...prev,
                          achievements: prev.achievements.map(a => a.id === ach.id ? { ...a, date: e.target.value } : a)
                        }))}
                        placeholder="Date (e.g. 2024)"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 10: Links */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">10</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Profiles & Custom Links</h3>
                  <p className="text-[11px] text-slate-500">LeetCode, CodeChef, HackerRank, and online portfolios</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newLink: ResumeLinkItem = {
                    id: `link-${Date.now()}`,
                    platform: 'LeetCode',
                    url: ''
                  };
                  updateResume(prev => ({ ...prev, links: [...prev.links, newLink] }));
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>

            {resume.links.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No custom links added. (Personal GitHub & LinkedIn are in Section 1).
              </div>
            ) : (
              <div className="space-y-3">
                {resume.links.map((link) => (
                  <div key={link.id} className="p-3.5 rounded-2xl bg-[#FBFAFF] border border-slate-200 flex gap-2 items-center text-xs">
                    <select
                      value={link.platform}
                      onChange={(e) => updateResume(prev => ({
                        ...prev,
                        links: prev.links.map(l => l.id === link.id ? { ...l, platform: e.target.value } : l)
                      }))}
                      className="w-36 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold focus:border-purple-600 focus:outline-none"
                    >
                      <option value="LeetCode">LeetCode</option>
                      <option value="CodeChef">CodeChef</option>
                      <option value="HackerRank">HackerRank</option>
                      <option value="Codeforces">Codeforces</option>
                      <option value="Medium / Blog">Medium / Blog</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Other">Other</option>
                    </select>

                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateResume(prev => ({
                        ...prev,
                        links: prev.links.map(l => l.id === link.id ? { ...l, url: e.target.value } : l)
                      }))}
                      placeholder="https://..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => updateResume(prev => ({
                        ...prev,
                        links: prev.links.filter(l => l.id !== link.id)
                      }))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Live Resume Preview & Template Selector   */}
        {/* ======================================================== */}
        <div className={`lg:col-span-5 space-y-6 lg:sticky lg:top-6 ${mobileTab !== 'preview' ? 'hidden lg:block' : ''}`}>
          {/* Template Bar */}
          <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-soft flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-700" />
              Template Layout:
            </span>

            <div className="flex gap-1.5">
              {(['minimal', 'modern', 'classic', 'technical'] as const).map(tmpl => (
                <button
                  key={tmpl}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    updateResume(prev => ({ ...prev, template: tmpl }));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    selectedTemplate === tmpl
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tmpl}
                </button>
              ))}
            </div>
          </div>

          {/* Live Document Container (A4 Proportional Sheet) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-soft-lg space-y-4 text-slate-800 text-[11px] leading-relaxed max-h-[85vh] overflow-y-auto">
            {/* Template Header */}
            <div className={`pb-3 border-b ${
              selectedTemplate === 'classic' ? 'text-center border-slate-400' :
              selectedTemplate === 'modern' ? 'border-purple-200' : 'border-slate-200'
            }`}>
              <h2 className={`font-black text-lg text-slate-900 tracking-tight ${
                selectedTemplate === 'classic' ? 'font-serif text-xl' : ''
              }`}>
                {resume.personal_info.full_name || 'Your Full Name'}
              </h2>
              {resume.target_role && (
                <p className={`font-semibold text-xs ${
                  selectedTemplate === 'modern' ? 'text-purple-700' : 'text-slate-600'
                }`}>
                  {resume.target_role}
                </p>
              )}

              <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-1.5 justify-center sm:justify-start">
                {[
                  resume.personal_info.email,
                  resume.personal_info.phone,
                  resume.personal_info.location,
                  resume.personal_info.linkedin_url,
                  resume.personal_info.github_url
                ].filter(Boolean).map((coord, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span>•</span>}
                    <span>{coord}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            {resume.summary && resume.summary.trim() && (
              <div className="space-y-1">
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${
                  selectedTemplate === 'modern' ? 'text-purple-800' : 'text-slate-900'
                }`}>
                  Professional Summary
                </h4>
                <p className="text-slate-600 leading-normal">{resume.summary}</p>
              </div>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <div className="space-y-2">
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${
                  selectedTemplate === 'modern' ? 'text-purple-800' : 'text-slate-900'
                }`}>
                  Education
                </h4>
                {resume.education.map(edu => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-900 text-xs">
                      <span>{edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''}</span>
                      <span className="text-slate-500 text-[10px] font-normal">
                        {[edu.start_year, edu.end_year].filter(Boolean).join(' - ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>{edu.institution} {edu.location ? `• ${edu.location}` : ''}</span>
                      {edu.score && <span className="font-semibold text-purple-700">{edu.score}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {SKILL_CATEGORIES.some(cat => (resume.skills[cat.key] || []).length > 0) && (
              <div className="space-y-1.5">
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${
                  selectedTemplate === 'modern' ? 'text-purple-800' : 'text-slate-900'
                }`}>
                  Technical Skills
                </h4>
                <div className="space-y-1 text-[10px]">
                  {SKILL_CATEGORIES.map(cat => {
                    const list = resume.skills[cat.key] || [];
                    if (list.length === 0) return null;
                    return (
                      <div key={cat.key} className="flex gap-1.5">
                        <span className="font-bold text-slate-700 shrink-0">{cat.label}:</span>
                        <span className="text-slate-600">{list.join(', ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <div className="space-y-2.5">
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${
                  selectedTemplate === 'modern' ? 'text-purple-800' : 'text-slate-900'
                }`}>
                  Technical Projects
                </h4>
                {resume.projects.map(proj => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 text-xs">
                      <span>{proj.title}</span>
                      {proj.duration && <span className="text-slate-500 text-[10px] font-normal">{proj.duration}</span>}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="text-[10px] text-purple-700 font-medium">
                        {proj.technologies.join(', ')}
                      </p>
                    )}
                    {proj.description && <p className="text-slate-600 text-[10px]">{proj.description}</p>}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc list-inside text-slate-600 text-[10px] space-y-0.5">
                        {proj.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <div className="space-y-2.5">
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${
                  selectedTemplate === 'modern' ? 'text-purple-800' : 'text-slate-900'
                }`}>
                  Experience
                </h4>
                {resume.experience.map(exp => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 text-xs">
                      <span>{exp.role} — {exp.company}</span>
                      <span className="text-slate-500 text-[10px] font-normal">
                        {[exp.start_date, exp.is_current ? 'Present' : exp.end_date].filter(Boolean).join(' - ')}
                      </span>
                    </div>
                    {exp.description && <p className="text-slate-600 text-[10px]">{exp.description}</p>}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-inside text-slate-600 text-[10px] space-y-0.5">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
              <div className="space-y-1.5">
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${
                  selectedTemplate === 'modern' ? 'text-purple-800' : 'text-slate-900'
                }`}>
                  Certifications
                </h4>
                <div className="space-y-1 text-[10px]">
                  {resume.certifications.map(c => (
                    <div key={c.id} className="flex justify-between">
                      <span className="font-semibold text-slate-800">• {c.name}</span>
                      <span className="text-slate-500">{[c.issuer, c.issue_date].filter(Boolean).join(' | ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {resume.achievements && resume.achievements.length > 0 && (
              <div className="space-y-1.5">
                <h4 className={`text-[11px] font-bold uppercase tracking-wider ${
                  selectedTemplate === 'modern' ? 'text-purple-800' : 'text-slate-900'
                }`}>
                  Achievements
                </h4>
                <div className="space-y-1 text-[10px]">
                  {resume.achievements.map(a => (
                    <div key={a.id}>
                      <span className="font-semibold text-slate-800">• {a.title}</span>
                      {a.organization && <span className="text-slate-500"> — {a.organization}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick AI Assistant Trigger Card */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5 text-purple-200 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                AI Resume Intelligence
              </span>
              <button
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                className="text-xs font-semibold text-pink-300 hover:text-white flex items-center gap-1"
              >
                {isAiPanelOpen ? 'Close Tools' : 'Open Assistant'}
                {isAiPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-purple-100">
              Run job description keyword matching and structure audits to maximize ATS clarity.
            </p>
          </div>

          {/* Dedicated AI Panel Content */}
          {isAiPanelOpen && (
            <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">AI Resume Assistant</h4>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleCheckStructure}
                  disabled={isAuditing}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700 font-semibold text-left transition-all"
                >
                  <span className="font-bold block text-purple-900">Check Structure</span>
                  <span className="text-[10px] text-slate-400">Audit section completeness</span>
                </button>

                <button
                  type="button"
                  onClick={handleSuggestKeywords}
                  disabled={isSuggestingKeywords}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700 font-semibold text-left transition-all"
                >
                  <span className="font-bold block text-purple-900">Suggest Keywords</span>
                  <span className="text-[10px] text-slate-400">Target role keywords</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnalyzeJobMatch}
                  disabled={isAnalyzingJob || !resume.job_description}
                  className="col-span-2 p-2.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100/60 text-purple-900 font-semibold text-left transition-all disabled:opacity-50"
                >
                  <span className="font-bold block text-purple-950">Analyze Job Description Match</span>
                  <span className="text-[10px] text-purple-700">
                    {resume.job_description ? 'Categorize Matched vs Missing skills' : 'Paste JD in Section 2 first'}
                  </span>
                </button>
              </div>

              {/* Job Match Results (No fake ATS score) */}
              {jobMatch && (
                <div className="p-3.5 rounded-xl bg-[#FBFAFF] border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Job Description Keyword Audit</span>
                    <span className="text-purple-700 text-[11px]">
                      {jobMatch.matched_count}/{jobMatch.total_count} Skills Found
                    </span>
                  </div>

                  {/* Matched */}
                  {jobMatch.required_skills.filter(s => s.matched).length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Matched in Resume
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {jobMatch.required_skills.filter(s => s.matched).map(s => (
                          <span key={s.skill} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                            ✓ {s.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing */}
                  {jobMatch.missing_skills.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                        Missing from Resume
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {jobMatch.missing_skills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 pt-0.5">
                        Add only if you possess verified hands-on capability.
                      </p>
                    </div>
                  )}

                  {/* Relevant Projects */}
                  {jobMatch.relevant_projects.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                        Matching Projects
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-slate-600">
                        {jobMatch.relevant_projects.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Structure Audit Results */}
              {structureAudit && (
                <div className="p-3.5 rounded-xl bg-[#FBFAFF] border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block">Structure & ATS Quality Audit</span>
                  <div className="space-y-1.5">
                    {structureAudit.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px]">
                        {item.status === 'good' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />}
                        {item.status === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />}
                        {item.status === 'tip' && <Info className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />}
                        <div>
                          <strong className="text-slate-800">{item.section}: </strong>
                          <span className="text-slate-600">{item.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyword Suggestions Results */}
              {keywordSuggestions && (
                <div className="p-3.5 rounded-xl bg-[#FBFAFF] border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block">Recommended Industry Keywords ({resume.target_role})</span>
                  <div className="space-y-1.5">
                    {keywordSuggestions.map((item, i) => (
                      <div key={i} className="p-2 rounded-lg bg-white border border-slate-100 space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                          <span>{item.keyword}</span>
                          <span className="text-[10px] text-purple-700 font-medium">{item.category}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* VERSION HISTORY MODAL                                   */}
      {/* ======================================================== */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-5 border border-purple-100 shadow-soft-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-slate-900">Resume Version History</h3>
              </div>
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create Snapshot Form */}
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2.5">
              <label className="block text-xs font-bold text-purple-950">Save Current Draft as New Version</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={versionNameInput}
                  onChange={(e) => setVersionNameInput(e.target.value)}
                  placeholder="e.g. SDE 1 Frontend Tailored Draft"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:border-purple-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveVersion}
                  disabled={isSavingVersion}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-2xs"
                >
                  {isSavingVersion ? 'Saving...' : 'Save Snapshot'}
                </button>
              </div>
            </div>

            {/* Versions List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Saved Revisions ({versions.length})
              </span>

              {versions.length === 0 ? (
                <p className="text-center py-6 text-slate-400 text-xs">No version snapshots created yet.</p>
              ) : (
                versions.map(v => (
                  <div key={v.id} className="p-3.5 rounded-2xl bg-[#FBFAFF] border border-slate-200 flex items-center justify-between text-xs gap-3">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{v.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(v.created_at).toLocaleDateString()} at {new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {v.target_role}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRestoreVersion(v.id)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 font-bold hover:bg-purple-50 text-[11px] shadow-2xs"
                      >
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteVersion(v.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
