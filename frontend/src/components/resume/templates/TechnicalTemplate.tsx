import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
  data: ResumeData;
  isMini?: boolean;
}

export const TechnicalTemplate: React.FC<TemplateProps> = ({ data, isMini = false }) => {
  const { personal_info, target_role, summary, skills, education, experience, projects, certifications, achievements } = data;

  return (
    <div className={`bg-white text-slate-900 font-mono ${isMini ? 'p-3 text-[6.5px] space-y-2' : 'p-8 sm:p-10 space-y-5 shadow-xs'}`}>
      {/* Code-style Header */}
      <div className="border-b-2 border-indigo-700 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h1 className={`${isMini ? 'text-sm' : 'text-2xl sm:text-3xl'} font-bold tracking-tight text-slate-900 font-sans`}>
            {personal_info.full_name || 'Your Full Name'}
          </h1>
          <div className={`${isMini ? 'text-[7.5px]' : 'text-xs sm:text-sm'} text-indigo-700 font-bold mt-0.5`}>
            &gt; {target_role || 'Software Development Engineer'}
          </div>
        </div>

        <div className={`flex flex-wrap sm:flex-col sm:items-end gap-x-2 gap-y-0.5 ${isMini ? 'text-[5.5px]' : 'text-[11px]'} text-slate-600`}>
          {personal_info.email && <span>{personal_info.email}</span>}
          {personal_info.phone && <span>{personal_info.phone}</span>}
          {personal_info.github_url && <span>github.com/{personal_info.github_url.replace(/^.*github\.com\/?/i, '') || 'profile'}</span>}
          {personal_info.linkedin_url && <span>linkedin.com/in/{personal_info.linkedin_url.replace(/^.*linkedin\.com\/in\/?/i, '') || 'profile'}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-1">
          <div className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5 font-sans border-b border-indigo-100 pb-0.5`}>
            <span className="text-indigo-600 font-mono">//</span> Summary
          </div>
          <p className={`${isMini ? 'text-[6px]' : 'text-xs'} text-slate-700 font-sans leading-relaxed`}>
            {summary}
          </p>
        </div>
      )}

      {/* Technical Stack Matrix */}
      {skills && (
        <div className="space-y-1.5">
          <div className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5 font-sans border-b border-indigo-100 pb-0.5`}>
            <span className="text-indigo-600 font-mono">//</span> Technical Skills & Stack
          </div>
          <div className={`grid grid-cols-2 gap-x-4 gap-y-1 ${isMini ? 'text-[6px]' : 'text-xs'}`}>
            {skills.languages && skills.languages.length > 0 && (
              <div>
                <span className="text-slate-500 font-bold">Languages: </span>
                <span className="text-slate-800">{skills.languages.join(', ')}</span>
              </div>
            )}
            {skills.frameworks && skills.frameworks.length > 0 && (
              <div>
                <span className="text-slate-500 font-bold">Frameworks: </span>
                <span className="text-slate-800">{skills.frameworks.join(', ')}</span>
              </div>
            )}
            {skills.databases && skills.databases.length > 0 && (
              <div>
                <span className="text-slate-500 font-bold">Databases: </span>
                <span className="text-slate-800">{skills.databases.join(', ')}</span>
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <span className="text-slate-500 font-bold">Developer Tools: </span>
                <span className="text-slate-800">{skills.tools.join(', ')}</span>
              </div>
            )}
            {skills.cloud && skills.cloud.length > 0 && (
              <div>
                <span className="text-slate-500 font-bold">Cloud & DevOps: </span>
                <span className="text-slate-800">{skills.cloud.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="space-y-2">
          <div className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5 font-sans border-b border-indigo-100 pb-0.5`}>
            <span className="text-indigo-600 font-mono">//</span> Key Implementations & Systems
          </div>
          <div className="space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="space-y-1">
                <div className="flex justify-between items-baseline font-sans">
                  <span className={`${isMini ? 'text-[7px]' : 'text-sm'} font-bold text-slate-900`}>{proj.title}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className={`${isMini ? 'text-[5.5px]' : 'text-xs'} font-mono text-indigo-700 font-semibold`}>
                      [{proj.technologies.join(', ')}]
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className={`${isMini ? 'text-[6px]' : 'text-xs'} font-sans text-slate-700`}>{proj.description}</p>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className={`list-disc list-inside ${isMini ? 'text-[5.5px]' : 'text-xs'} font-sans text-slate-700 space-y-0.5`}>
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

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="space-y-2">
          <div className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5 font-sans border-b border-indigo-100 pb-0.5`}>
            <span className="text-indigo-600 font-mono">//</span> Engineering Experience
          </div>
          <div className="space-y-2.5">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-sans">
                  <span className={`${isMini ? 'text-[7px]' : 'text-sm'} font-bold text-slate-900`}>
                    {exp.role} @ {exp.company}
                  </span>
                  <span className={`${isMini ? 'text-[5.5px]' : 'text-[10px]'} font-mono text-slate-500`}>
                    {exp.start_date || 'Past'} - {exp.end_date || 'Present'}
                  </span>
                </div>
                {exp.description && (
                  <p className={`${isMini ? 'text-[6px]' : 'text-xs'} font-sans text-slate-700`}>{exp.description}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={`list-disc list-inside ${isMini ? 'text-[5.5px]' : 'text-xs'} font-sans text-slate-700 space-y-0.5`}>
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

      {/* Education */}
      {education && education.length > 0 && (
        <div className="space-y-1">
          <div className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5 font-sans border-b border-indigo-100 pb-0.5`}>
            <span className="text-indigo-600 font-mono">//</span> Education & Academics
          </div>
          <div className="space-y-1 font-sans">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <span className={`${isMini ? 'text-[7px]' : 'text-xs'} font-bold text-slate-900`}>
                  {edu.institution} — {edu.degree} in {edu.field}
                </span>
                <span className={`${isMini ? 'text-[5.5px]' : 'text-[10px]'} font-mono text-slate-500`}>
                  {edu.end_year ? `Grad: ${edu.end_year}` : ''} {edu.score ? `[${edu.score}]` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
