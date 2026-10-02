import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ResumeData, ResumeTemplateId } from '../../types';
import { ResumePreviewRenderer } from '../../components/resume/templates';
import {
  FileText,
  Plus,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
  UploadCloud,
  FileCheck2,
  Trash2
} from 'lucide-react';

interface TemplateCardInfo {
  id: ResumeTemplateId;
  name: string;
  description: string;
  category: string;
  isPopular?: boolean;
}

const TEMPLATE_CARDS: TemplateCardInfo[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean single-column layout designed for maximum ATS scan compatibility and typographical clarity.',
    category: 'ATS Optimized',
    isPopular: true
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary two-column format with violet accents, structured badges, and balanced visual weight.',
    category: 'Tech & Product',
    isPopular: true
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional Ivy-League serif layout with formal centered header, rule dividers, and chronological flow.',
    category: 'Traditional & Academia',
    isPopular: false
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Engineered for software developers: prominent GitHub links, technical stack matrix, and architecture bullets.',
    category: 'Software Engineering',
    isPopular: true
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Distinguished executive layout emphasizing core competencies, leadership scope, and business deliverables.',
    category: 'Leadership & Senior',
    isPopular: false
  }
];

export const ResumeStudioPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'templates' | 'my-resumes' | 'analyzer'>('templates');
  const [studentResumes, setStudentResumes] = useState<ResumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>('modern');
  const [isCreating, setIsCreating] = useState(false);

  // Load student resumes
  useEffect(() => {
    if (!user?.id) return;

    const fetchMyResumes = async () => {
      setIsLoading(true);
      try {
        const list = await api.resume.listForStudent(user.id);
        setStudentResumes(list);
      } catch (err) {
        console.error('Failed to load student resumes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyResumes();
  }, [user?.id]);

  // Handle template selection and create new resume
  const handleUseTemplate = async (templateId: ResumeTemplateId) => {
    if (!user?.id || isCreating) return;
    setIsCreating(true);

    try {
      const created = await api.resume.create({
        student_id: user.id,
        template_id: templateId,
        title: `${user.target_role || 'Engineering'} Resume (${templateId.toUpperCase()})`,
        target_role: user.target_role || 'Software Engineer'
      });

      navigate(`/student/resume/builder/${created.id}`);
    } catch (err) {
      console.error('Failed to create resume:', err);
      alert('Could not initialize resume with selected template. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Sample data to drive realistic mini-previews
  const sampleCandidateData: ResumeData = {
    student_id: user?.id || 'sample',
    title: 'Sample Preview',
    template: selectedTemplate,
    template_id: selectedTemplate,
    personal_info: {
      full_name: user?.full_name || 'Rohan Sharma',
      email: user?.email || 'rohan.dev@example.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      linkedin_url: 'linkedin.com/in/rohansharma',
      github_url: 'github.com/rohansharma',
      portfolio_url: ''
    },
    target_role: user?.target_role || 'Full Stack Engineer',
    summary: 'Proactive Software Engineer with a solid foundation in distributed architectures, REST API design, and data structures. Dedicated to writing clean, maintainable code.',
    education: [
      {
        id: 'edu-1',
        institution: user?.college || 'National Institute of Technology',
        degree: user?.degree || 'B.Tech',
        field: user?.branch || 'Computer Science',
        end_year: user?.graduation_year ? String(user.graduation_year) : '2026',
        score: user?.cgpa ? `${user.cgpa} CGPA` : '8.4 CGPA'
      }
    ],
    skills: {
      languages: ['Java', 'Python', 'TypeScript', 'SQL'],
      frameworks: ['React', 'Node.js', 'Express', 'Tailwind'],
      libraries: ['Redux', 'Prisma'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis'],
      tools: ['Git', 'Docker', 'Postman'],
      cloud: ['AWS', 'Supabase'],
      other: ['Data Structures', 'System Design']
    },
    projects: [
      {
        id: 'proj-1',
        title: 'Distributed Code Sandbox Execution Engine',
        technologies: ['TypeScript', 'Docker', 'Node.js'],
        description: 'Engineered an isolated sandbox execution runner capable of compiling and running multi-language code submissions securely.',
        bullets: [
          'Engineered CPU and memory containment policies using isolated containers.',
          'Reduced execution queuing latency by 45% with asynchronous event pipelines.'
        ]
      }
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'NexPrep Systems',
        role: 'Software Development Intern',
        start_date: 'Jan 2026',
        end_date: 'Present',
        description: 'Assisted in designing backend REST APIs and database schema migrations.',
        bullets: [
          'Implemented automated unit test suites covering critical authentication and submission paths.',
          'Optimized PostgreSQL query indexes, improving page response times.'
        ]
      }
    ],
    certifications: [
      { id: 'c-1', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services' }
    ],
    achievements: [],
    links: [],
    updated_at: new Date().toISOString()
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Resume Studio</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
              Qwen3.5-9B Enhanced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build a professional, ATS-optimized resume with verified student facts and precision AI assistance
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-purple-50/80 rounded-xl border border-purple-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'templates'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            Choose Template
          </button>
          <button
            onClick={() => setActiveTab('my-resumes')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'my-resumes'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            <span>My Resumes</span>
            {studentResumes.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'my-resumes' ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
              }`}>
                {studentResumes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/student/resume/analyzer')}
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-purple-700 transition-all flex items-center gap-1"
          >
            <span>Analyze Existing Resume</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* TAB 1: TEMPLATE SELECTION (The Required Pre-Builder Step) */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Choose Your Resume Template</h2>
              <p className="text-xs text-slate-500">
                Select a layout that matches your target role. Every template renders pure student data with zero hallucinations.
              </p>
            </div>
          </div>

          {/* 5 Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATE_CARDS.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  className={`bg-white rounded-2xl border-2 transition-all shadow-soft flex flex-col justify-between overflow-hidden group ${
                    isSelected
                      ? 'border-purple-600 ring-4 ring-purple-100'
                      : 'border-purple-100 hover:border-purple-300'
                  }`}
                >
                  {/* Realistic Mini Preview Container */}
                  <div
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className="h-64 bg-slate-50 p-2 overflow-hidden border-b border-purple-100 cursor-pointer relative group-hover:opacity-95 transition-opacity"
                  >
                    <div className="transform scale-[0.55] origin-top-left w-[180%] bg-white rounded shadow-sm border border-slate-200 pointer-events-none select-none">
                      <ResumePreviewRenderer data={sampleCandidateData} templateId={tmpl.id} isMini />
                    </div>

                    {tmpl.isPopular && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-700 text-white text-[10px] font-bold shadow-xs">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Card Info & Action */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">{tmpl.name} Template</h3>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {tmpl.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedTemplate(tmpl.id)}
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-purple-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Preview'}
                      </button>

                      <button
                        onClick={() => handleUseTemplate(tmpl.id)}
                        disabled={isCreating}
                        className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <span>{isCreating && selectedTemplate === tmpl.id ? 'Creating...' : 'Use Template'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY RESUMES LIST */}
      {activeTab === 'my-resumes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Saved Resumes</h2>
            <button
              onClick={() => setActiveTab('templates')}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Resume</span>
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-slate-400 text-xs">Loading resumes...</div>
          ) : studentResumes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 shadow-soft space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Resumes Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose a template above to generate your first ATS-friendly technical resume.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('templates')}
                  className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold"
                >
                  Choose Template
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {studentResumes.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-100">
                        {res.template_id || res.template || 'Modern'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(res.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{res.title}</h3>
                    <p className="text-xs text-slate-500">
                      Targeting: <span className="font-semibold text-slate-700">{res.target_role}</span>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-mono">
                      <span>{res.projects?.length || 0} Projects</span>
                      <span>•</span>
                      <span>{res.experience?.length || 0} Experiences</span>
                      <span>•</span>
                      <span>{res.education?.length || 0} Education</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/student/resume/builder/${res.id}`}
                      className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Open Builder</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
