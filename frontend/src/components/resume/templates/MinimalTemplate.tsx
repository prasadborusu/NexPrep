import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
  data: ResumeData;
  isMini?: boolean;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, isMini = false }) => {
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
    <div className={`bg-white text-slate-900 font-sans leading-relaxed ${isMini ? 'p-4 text-[7px] space-y-2' : 'p-8 sm:p-10 space-y-5 shadow-xs'}`}>
      {/* Header */}
      <div className="border-b border-slate-900 pb-3">
        <h1 className={`${isMini ? 'text-sm' : 'text-2xl sm:text-3xl'} font-bold tracking-tight uppercase text-slate-900`}>
          {personal_info.full_name || 'Your Full Name'}
        </h1>
        <div className={`${isMini ? 'text-[8px]' : 'text-xs sm:text-sm'} font-semibold text-slate-700 mt-0.5`}>
          {target_role || 'Target Role'}
        </div>
        <div className={`flex flex-wrap gap-x-3 gap-y-1 ${isMini ? 'text-[6px]' : 'text-xs'} text-slate-600 mt-2 font-mono`}>
          {personal_info.email && <span>{personal_info.email}</span>}
          {personal_info.phone && <span>• {personal_info.phone}</span>}
          {personal_info.location && <span>• {personal_info.location}</span>}
          {personal_info.linkedin_url && <span>• LinkedIn</span>}
          {personal_info.github_url && <span>• GitHub</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-1">
          <h2 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5`}>
            Professional Summary
          </h2>
          <p className={`${isMini ? 'text-[6.5px]' : 'text-xs'} text-slate-700 leading-normal`}>
            {summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {allSkills.length > 0 && (
        <div className="space-y-1">
          <h2 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5`}>
            Technical Skills
          </h2>
          <div className={`${isMini ? 'text-[6.5px]' : 'text-xs'} text-slate-800`}>
            <span className="font-semibold text-slate-900">Core Competencies: </span>
            {allSkills.join(', ')}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="space-y-2">
          <h2 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5`}>
            Technical Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className={`${isMini ? 'text-[7px]' : 'text-xs'} font-bold text-slate-900`}>{proj.title}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className={`${isMini ? 'text-[5.5px]' : 'text-[10px]'} font-mono text-slate-600`}>
                      [{proj.technologies.join(', ')}]
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

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="space-y-2">
          <h2 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5`}>
            Work Experience
          </h2>
          <div className="space-y-2">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className={`${isMini ? 'text-[7px]' : 'text-xs'} font-bold text-slate-900`}>{exp.role} — {exp.company}</span>
                  <span className={`${isMini ? 'text-[5.5px]' : 'text-[10px]'} text-slate-600 font-mono`}>
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

      {/* Education */}
      {education && education.length > 0 && (
        <div className="space-y-1">
          <h2 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5`}>
            Education
          </h2>
          <div className="space-y-1">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <div>
                  <span className={`${isMini ? 'text-[7px]' : 'text-xs'} font-bold text-slate-900`}>{edu.institution}</span>
                  <span className={`${isMini ? 'text-[6px]' : 'text-xs'} text-slate-700 ml-1.5`}>
                    {edu.degree} in {edu.field}
                  </span>
                </div>
                <div className={`${isMini ? 'text-[5.5px]' : 'text-[10px]'} text-slate-600 font-mono`}>
                  {edu.end_year ? `Class of ${edu.end_year}` : ''} {edu.score ? `• ${edu.score}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="space-y-1">
          <h2 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5`}>
            Certifications
          </h2>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, idx) => (
              <span key={cert.id || idx} className={`${isMini ? 'text-[6px]' : 'text-xs'} text-slate-800`}>
                • {cert.name} ({cert.issuer})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
