import { SkillGapData } from '../types';
import { memoryStore } from './db';

// Required skills mapping for target careers
const ROLE_BENCHMARKS: Record<string, string[]> = {
  'Full Stack Engineer': ['Java', 'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'REST APIs', 'Data Structures', 'Docker'],
  'Frontend Specialist': ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS', 'Tailwind', 'Redux', 'Performance Optimization', 'Web Vitals'],
  'Backend Engineer': ['Java', 'Python', 'Node.js', 'PostgreSQL', 'Redis', 'Microservices', 'System Design', 'Docker', 'Kafka', 'SQL'],
  'Software Development Engineer': ['Data Structures', 'Algorithms', 'Java', 'C++', 'OOP', 'SQL', 'Operating Systems', 'Computer Networks'],
  'Data Engineer': ['Python', 'SQL', 'PostgreSQL', 'Spark', 'Kafka', 'Data Warehousing', 'ETL', 'Docker']
};

export function computeSkillGap(
  studentId: string,
  targetRole: string = 'Full Stack Engineer'
): SkillGapData {
  const profile = memoryStore.profiles.find(p => p.id === studentId) || memoryStore.profiles[0];
  const assessmentSubs = memoryStore.assessment_submissions.filter(s => s.student_id === studentId);
  const codeSubs = memoryStore.code_submissions.filter(s => s.student_id === studentId);

  const benchmarkSkills = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS['Full Stack Engineer'];
  const studentSkills = (profile?.skills || []).map(s => s.toLowerCase());

  // Assessment performance factors
  const avgAssessmentScore = assessmentSubs.length > 0
    ? assessmentSubs.reduce((acc, s) => acc + (s.percentage || 0), 0) / assessmentSubs.length
    : 0;

  // Coding performance factor
  const acceptedCodeSubs = codeSubs.filter(s => s.status === 'Accepted').length;
  const codingProficiency = codeSubs.length > 0 ? (acceptedCodeSubs / codeSubs.length) * 100 : 0;

  const strongSkills: SkillGapData['strong_skills'] = [];
  const weakSkills: SkillGapData['weak_skills'] = [];
  const missingSkills: SkillGapData['missing_skills'] = [];

  for (const skill of benchmarkSkills) {
    const isPresentInProfile = studentSkills.some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
    
    if (isPresentInProfile) {
      // Check if reinforced by coding or assessments
      let proficiency = 70;
      if (['Java', 'Python', 'JavaScript', 'C++', 'Data Structures'].some(k => skill.toLowerCase().includes(k.toLowerCase()))) {
        if (acceptedCodeSubs >= 2) proficiency = 90;
        else if (acceptedCodeSubs === 1) proficiency = 80;
        else proficiency = 65;
      }
      if (avgAssessmentScore >= 70) proficiency = Math.min(95, proficiency + 10);

      if (proficiency >= 75) {
        strongSkills.push({
          skill,
          proficiency,
          source: 'Validated via Profile & Practical Submissions'
        });
      } else {
        weakSkills.push({
          skill,
          proficiency,
          reason: 'Listed in profile but requires higher test performance and practice problem solving.'
        });
      }
    } else {
      missingSkills.push({
        skill,
        importance: ['Data Structures', 'System Design', 'PostgreSQL', 'Java', 'Python'].includes(skill) ? 'high' : 'medium',
        recommended_resource: `Complete NexPrep Practice Module on ${skill}`
      });
    }
  }

  const coveredCount = strongSkills.length + (weakSkills.length * 0.5);
  const readiness = Math.round((coveredCount / benchmarkSkills.length) * 100);

  const learningSuggestions: string[] = [
    `Focus on mastering high-priority missing items: ${missingSkills.slice(0, 2).map((m: any) => m.skill).join(', ') || 'System Design'}.`,
    `Solve at least 3 medium-difficulty algorithmic problems weekly under timed conditions.`,
    `Review assessment explanations for areas where MCQs were missed to solidify core principles.`
  ];

  return {
    student_id: studentId,
    target_role: targetRole,
    strong_skills: strongSkills,
    weak_skills: weakSkills,
    missing_skills: missingSkills,
    learning_suggestions: learningSuggestions,
    readiness_percentage: Math.min(100, Math.max(15, readiness)),
    calculated_at: new Date().toISOString()
  };
}
