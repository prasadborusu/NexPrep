import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
  data: ResumeData;
  isMini?: boolean;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, isMini = false }) => {
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
    <div className={`bg-white text-slate-900 font-sans ${isMini ? 'p-3 text-[7px]' : 'p-8 sm:p-10 shadow-xs'}`}>
      {/* Top Banner Header */}
      <div className="border-b-2 border-purple-600 pb-4 mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className={`${isMini ? 'text-sm' : 'text-2xl sm:text-3xl'} font-black text-slate-950 tracking-tight`}>
            {personal_info.full_name || 'Your Full Name'}
          </h1>
          <div className={`${isMini ? 'text-[8px]' : 'text-sm'} font-bold text-purple-700 mt-0.5 uppercase tracking-wide`}>
            {target_role || 'Target Role'}
          </div>
        </div>

        <div className={`flex flex-wrap sm:flex-col sm:items-end gap-x-2 gap-y-0.5 ${isMini ? 'text-[5.5px]' : 'text-xs'} text-slate-500 font-medium`}>
          {personal_info.email && <span>{personal_info.email}</span>}
          {personal_info.phone && <span>{personal_info.phone}</span>}
          {personal_info.location && <span>{personal_info.location}</span>}
          {personal_info.linkedin_url && <span>LinkedIn Profile</span>}
          {personal_info.github_url && <span>GitHub Portfolio</span>}
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Sidebar (1/3) */}
        <div className="col-span-1 space-y-4 border-r border-slate-100 pr-4">
          {/* Skills */}
          {allSkills.length > 0 && (
            <div className="space-y-1.5">
              <h3 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-black text-purple-900 uppercase tracking-wider`}>
                Skills & Stack
              </h3>
              <div className="flex flex-wrap gap-1">
                {allSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded ${isMini ? 'text-[5.5px]' : 'text-[11px]'} font-semibold bg-purple-50 text-purple-700 border border-purple-100/80`}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="space-y-2">
              <h3 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-black text-purple-900 uppercase tracking-wider`}>
                Education
              </h3>
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="space-y-0.5">
                    <div className={`${isMini ? 'text-[6.5px]' : 'text-xs'} font-bold text-slate-900`}>{edu.institution}</div>
                    <div className={`${isMini ? 'text-[6px]' : 'text-[11px]'} text-slate-600`}>{edu.degree} in {edu.field}</div>
                    <div className={`${isMini ? 'text-[5.5px]' : 'text-[10px]'} text-slate-400 font-mono`}>
                      {edu.end_year ? `Graduation: ${edu.end_year}` : ''} {edu.score ? `• ${edu.score}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="space-y-1.5">
              <h3 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-black text-purple-900 uppercase tracking-wider`}>
                Certifications
              </h3>
              <ul className="space-y-1">
                {certifications.map((c, idx) => (
                  <li key={c.id || idx} className={`${isMini ? 'text-[6px]' : 'text-xs'} text-slate-700`}>
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className={`${isMini ? 'text-[5px]' : 'text-[10px]'} text-slate-400`}>{c.issuer}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Main Column (2/3) */}
        <div className="col-span-2 space-y-4">
          {/* Summary */}
          {summary && (
            <div className="space-y-1">
              <h3 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-black text-purple-900 uppercase tracking-wider border-b border-purple-100 pb-1`}>
                Profile Overview
              </h3>
              <p className={`${isMini ? 'text-[6.5px]' : 'text-xs'} text-slate-700 leading-relaxed`}>
                {summary}
              </p>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="space-y-2.5">
              <h3 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-black text-purple-900 uppercase tracking-wider border-b border-purple-100 pb-1`}>
                Highlighted Projects
              </h3>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className={`${isMini ? 'text-[7.5px]' : 'text-sm'} font-bold text-slate-950`}>
                        {proj.title}
                      </span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className={`${isMini ? 'text-[5.5px]' : 'text-[11px]'} font-mono font-medium text-purple-700`}>
                          {proj.technologies.join(', ')}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className={`${isMini ? 'text-[6px]' : 'text-xs'} text-slate-600`}>
                        {proj.description}
                      </p>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className={`list-disc list-inside ${isMini ? 'text-[5.5px]' : 'text-xs'} text-slate-600 space-y-0.5`}>
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
            <div className="space-y-2.5">
              <h3 className={`${isMini ? 'text-[8px]' : 'text-xs'} font-black text-purple-900 uppercase tracking-wider border-b border-purple-100 pb-1`}>
                Experience
              </h3>
              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className={`${isMini ? 'text-[7.5px]' : 'text-sm'} font-bold text-slate-950`}>
                        {exp.role} <span className="font-normal text-slate-500">at</span> {exp.company}
                      </span>
                      <span className={`${isMini ? 'text-[5.5px]' : 'text-[10px]'} font-mono text-slate-400`}>
                        {exp.start_date || 'Past'} - {exp.end_date || 'Present'}
                      </span>
                    </div>
                    {exp.description && (
                      <p className={`${isMini ? 'text-[6px]' : 'text-xs'} text-slate-600`}>
                        {exp.description}
                      </p>
                    )}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className={`list-disc list-inside ${isMini ? 'text-[5.5px]' : 'text-xs'} text-slate-600 space-y-0.5`}>
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
        </div>
      </div>
    </div>
  );
};
