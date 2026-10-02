import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
  data: ResumeData;
  isMini?: boolean;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, isMini = false }) => {
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
    <div className={`bg-white text-slate-900 font-serif leading-relaxed ${isMini ? 'p-3 text-[7px] space-y-1.5' : 'p-8 sm:p-12 space-y-4 shadow-xs'}`}>
      {/* Centered Classic Header */}
      <div className="text-center space-y-1 border-b border-slate-900 pb-3">
        <h1 className={`${isMini ? 'text-sm' : 'text-2xl sm:text-3xl'} font-bold tracking-normal uppercase text-slate-950 font-serif`}>
          {personal_info.full_name || 'Your Full Name'}
        </h1>
        <div className={`${isMini ? 'text-[7px]' : 'text-xs italic text-slate-600'}`}>
          {target_role || 'Target Role'}
        </div>
        <div className={`flex flex-wrap justify-center gap-x-3 gap-y-0.5 ${isMini ? 'text-[5.5px]' : 'text-xs text-slate-700'}`}>
          {personal_info.location && <span>{personal_info.location}</span>}
          {personal_info.phone && <span>• {personal_info.phone}</span>}
          {personal_info.email && <span>• {personal_info.email}</span>}
          {personal_info.linkedin_url && <span>• LinkedIn</span>}
          {personal_info.github_url && <span>• GitHub</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-1">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5`}>
            Professional Profile
          </h2>
          <p className={`${isMini ? 'text-[6px]' : 'text-xs text-slate-800'}`}>
            {summary}
          </p>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="space-y-1">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5`}>
            Education
          </h2>
          <div className="space-y-1.5">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-slate-950">
                  <span className={`${isMini ? 'text-[6.5px]' : 'text-xs'}`}>{edu.institution}</span>
                  <span className={`${isMini ? 'text-[5.5px]' : 'text-xs italic font-normal text-slate-600'}`}>
                    {edu.end_year ? `Graduation: ${edu.end_year}` : ''}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-slate-800">
                  <span className={`${isMini ? 'text-[6px]' : 'text-xs italic'}`}>{edu.degree} in {edu.field}</span>
                  {edu.score && <span className={`${isMini ? 'text-[5.5px]' : 'text-xs font-semibold'}`}>{edu.score}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="space-y-1.5">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5`}>
            Experience
          </h2>
          <div className="space-y-2">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-slate-950">
                  <span className={`${isMini ? 'text-[6.5px]' : 'text-xs'}`}>{exp.company}</span>
                  <span className={`${isMini ? 'text-[5.5px]' : 'text-xs italic font-normal text-slate-600'}`}>
                    {exp.start_date || 'Past'} - {exp.end_date || 'Present'}
                  </span>
                </div>
                <div className={`${isMini ? 'text-[6px]' : 'text-xs italic text-slate-800 font-semibold'}`}>
                  {exp.role}
                </div>
                {exp.description && (
                  <p className={`${isMini ? 'text-[6px]' : 'text-xs text-slate-800'}`}>{exp.description}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={`list-disc list-inside ${isMini ? 'text-[5.5px]' : 'text-xs text-slate-800'} space-y-0.5`}>
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
        <div className="space-y-1.5">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5`}>
            Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-slate-950">
                  <span className={`${isMini ? 'text-[6.5px]' : 'text-xs'}`}>{proj.title}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className={`${isMini ? 'text-[5.5px]' : 'text-[10px] italic font-normal text-slate-600'}`}>
                      {proj.technologies.join(', ')}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className={`${isMini ? 'text-[6px]' : 'text-xs text-slate-800'}`}>{proj.description}</p>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className={`list-disc list-inside ${isMini ? 'text-[5.5px]' : 'text-xs text-slate-800'} space-y-0.5`}>
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

      {/* Skills */}
      {allSkills.length > 0 && (
        <div className="space-y-1">
          <h2 className={`${isMini ? 'text-[7.5px]' : 'text-xs'} font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5`}>
            Technical Skills
          </h2>
          <div className={`${isMini ? 'text-[6px]' : 'text-xs text-slate-800'}`}>
            <span className="font-bold">Languages & Tools: </span>
            {allSkills.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};
