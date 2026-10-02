import React from 'react';
import { ResumeData, ResumeTemplateId } from '../../../types';
import { MinimalTemplate } from './MinimalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { TechnicalTemplate } from './TechnicalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';

export { MinimalTemplate, ModernTemplate, ClassicTemplate, TechnicalTemplate, ExecutiveTemplate };

export const ResumePreviewRenderer: React.FC<{
  data: ResumeData;
  templateId?: ResumeTemplateId;
  isMini?: boolean;
}> = ({ data, templateId, isMini = false }) => {
  const chosen = templateId || data.template_id || data.template || 'modern';

  switch (chosen) {
    case 'minimal':
      return <MinimalTemplate data={data} isMini={isMini} />;
    case 'classic':
      return <ClassicTemplate data={data} isMini={isMini} />;
    case 'technical':
      return <TechnicalTemplate data={data} isMini={isMini} />;
    case 'executive':
      return <ExecutiveTemplate data={data} isMini={isMini} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} isMini={isMini} />;
  }
};
