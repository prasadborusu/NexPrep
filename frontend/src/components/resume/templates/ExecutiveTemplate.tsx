import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
  data: ResumeData;
  isMini?: boolean;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, isMini = false }) => {
  const { personal_info, target_role, summary, skills, education, experience, projects, certifications, achievements } = data;

  const allSkills = [
    ...(skills?.languages || []),
    ...(skills?.frameworks || []),
    ...(skills?.libraries || []),
    ...(skills?.databases || []),
    ...(skills?.tools || []),
    ...(skills?.cloud || []),
    ...(skills?.other || [])
  ];

  return (
    <div className={`bg-white text-slate-900 font-sans ${isMini ? 'p-3 text-[6.5px] space-y-2' : 'p-8 sm:p-12 space-y-5 shadow-xs'}`}>
      {/* Executive Header */}
      <div className="bg-[#181C2E] text-white p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`${isMini ? 'text-sm' : 'text-2xl sm:text-3xl'} font-bold tracking-tight text-white uppercase`}>
            {personal_info.full_name || 'Your Full Name'}
          </h1>
          <div className={`${isMini ? 'text-[7.5px]' : 'text-xs sm:text-sm'} text-amber-400 font-semibold tracking-wider uppercase mt-0.5`}>
            {target_role || 'Technology Leader / Senior Engineer'}
          </div>
        </div>

        <div className={`flex flex-wrap sm:flex-col sm:items-end gap-x-2 gap-y-0.5 ${isMini ? 'text-[5.5px]' : 'text-xs text-slate-300'}`}>
          {personal_info.email && <span>{personal_info.email}</span>}
          {personal_info.phone && <span>{personal_info.phone}</span>}
          {personal_info.location && <span>{personal_info.location}</span>}
          {personal_info.linkedin_url && <span>LinkedIn Profile</span>}
        </div>
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-slate-900`}>
            Executive Overview & Leadership Profile
          </h2>
          <p className={`${isMini ? 'text-[6px]' : 'text-xs'} text-slate-700 leading-relaxed`}>
            {summary}
          </p>
        </div>
      )}

      {/* Core Competencies */}
      {allSkills.length > 0 && (
        <div className="space-y-1.5">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-[#181C2E] border-b-2 border-[#181C2E] pb-1`}>
            Core Competencies & Technical Scope
          </h2>
          <div className={`grid grid-cols-3 gap-2 ${isMini ? 'text-[6px]' : 'text-xs'} text-slate-800`}>
            {allSkills.map((sk, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="font-semibold">{sk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="space-y-2">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-[#181C2E] border-b-2 border-[#181C2E] pb-1`}>
            Professional Experience & Key Deliverables
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className={`${isMini ? 'text-[7.5px]' : 'text-sm'} font-bold text-slate-900`}>{exp.role}</span>
                    <span className="text-slate-500 ml-1.5">| {exp.company}</span>
                  </div>
                  <span className={`${isMini ? 'text-[5.5px]' : 'text-xs'} font-mono text-slate-500`}>
                    {exp.start_date || 'Past'} - {exp.end_date || 'Present'}
                  </span>
                </div>
                {exp.description && (
                  <p className={`${isMini ? 'text-[6px]' : 'text-xs'} text-slate-700`}>{exp.description}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={`list-disc list-inside ${isMini ? 'text-[5.5px]' : 'text-xs'} text-slate-700 space-y-0.5`}>
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="space-y-2">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-[#181C2E] border-b-2 border-[#181C2E] pb-1`}>
            Key Projects & Systems
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className={`${isMini ? 'text-[7.5px]' : 'text-sm'} font-bold text-slate-900`}>{proj.title}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className={`${isMini ? 'text-[5.5px]' : 'text-xs'} text-amber-700 font-semibold font-mono`}>
                      {proj.technologies.join(', ')}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className={`${isMini ? 'text-[6px]' : 'text-xs'} text-slate-700`}>{proj.description}</p>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className={`list-disc list-inside ${isMini ? 'text-[5.5px]' : 'text-xs'} text-slate-700 space-y-0.5`}>
                    {proj.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="space-y-1">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-[#181C2E] border-b-2 border-[#181C2E] pb-1`}>
            Academic Background
          </h2>
          <div className="space-y-1">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline text-xs">
                <span className="font-bold text-slate-900">{edu.institution} — {edu.degree} in {edu.field}</span>
                <span className="text-slate-500 font-mono">{edu.end_year ? `Grad: ${edu.end_year}` : ''} {edu.score ? `(${edu.score})` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
