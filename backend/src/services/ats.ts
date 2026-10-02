import { ATSAnalysisResult } from '../types';

// Tech skill taxonomy for keyword mining
const TECH_SKILLS_DICTIONARY = [
  // Languages
  'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css',
  // Frameworks & Libs
  'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'spring boot', 'django', 'fastapi', 'flask', 'tailwind', 'bootstrap', 'redux',
  // Databases & Storage
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'sqlite', 'cassandra', 'firebase', 'supabase',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git', 'github', 'terraform', 'jenkins', 'linux', 'nginx', 'microservices',
  // Concepts & Architecture
  'rest', 'graphql', 'grpc', 'data structures', 'algorithms', 'system design', 'oop', 'mvc', 'agile', 'scrum', 'unit testing', 'kafka', 'rabbitmq'
];

export function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase();
  const found: string[] = [];

  for (const skill of TECH_SKILLS_DICTIONARY) {
    // Regex word boundary matching or literal substring for multi-word
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
    if (regex.test(normalized)) {
      found.push(skill);
    }
  }

  return Array.from(new Set(found));
}

export function analyzeResumeATS(
  resumeText: string,
  jobDescription: string,
  targetRole: string = 'Software Engineer',
  studentId: string = 'student'
): ATSAnalysisResult {
  const normResume = resumeText.toLowerCase();
  const jdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);

  // 1. Keyword Match
  const matchedKeywords = jdKeywords.filter(k => resumeKeywords.includes(k));
  const missingSkills = jdKeywords.filter(k => !resumeKeywords.includes(k));

  const keywordMatchScore = jdKeywords.length > 0
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : Math.min(100, Math.round((resumeKeywords.length / 8) * 100));

  // 2. Formatting Score Calculation
  const formattingFeedback: ATSAnalysisResult['formatting_feedback'] = [];
  let formatDeductions = 0;

  // Bullet point check
  const hasBullets = /[-*•–]/.test(resumeText);
  if (hasBullets) {
    formattingFeedback.push({
      type: 'pass',
      message: 'Clean bullet points detected. ATS scanners parse bulleted achievements reliably.'
    });
  } else {
    formatDeductions += 20;
    formattingFeedback.push({
      type: 'fail',
      message: 'No standard bullet points detected. Convert large paragraphs into scannable bullet points.'
    });
  }

  // Word count check
  const words = resumeText.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 300 && words.length <= 1100) {
    formattingFeedback.push({
      type: 'pass',
      message: `Optimal resume length (${words.length} words). Fits standard 1-2 page requirements.`
    });
  } else if (words.length < 300) {
    formatDeductions += 25;
    formattingFeedback.push({
      type: 'warning',
      message: `Resume content is brief (${words.length} words). Elaborate on technical projects and quantifiable outcomes.`
    });
  } else {
    formatDeductions += 15;
    formattingFeedback.push({
      type: 'warning',
      message: `Resume is lengthy (${words.length} words). Condense descriptions to fit essential impact points.`
    });
  }

  // Contact info check
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(?:\+?\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/.test(resumeText);
  const hasLinks = /linkedin\.com|github\.com/i.test(resumeText);

  if (hasEmail && hasPhone) {
    formattingFeedback.push({
      type: 'pass',
      message: 'Direct contact coordinates (email & telephone) clearly identifiable.'
    });
  } else {
    formatDeductions += 20;
    formattingFeedback.push({
      type: 'warning',
      message: 'Ensure valid email address and phone number are explicitly positioned at the top.'
    });
  }

  if (hasLinks) {
    formattingFeedback.push({
      type: 'pass',
      message: 'Professional developer profiles (GitHub / LinkedIn) present.'
    });
  } else {
    formatDeductions += 10;
    formattingFeedback.push({
      type: 'warning',
      message: 'Add active GitHub and LinkedIn profile URLs to improve technical recruiter engagement.'
    });
  }

  const formattingScore = Math.max(20, 100 - formatDeductions);

  // 3. Structure Check
  const structureFeedback: ATSAnalysisResult['structure_feedback'] = [];
  let structureDeductions = 0;

  const sections = [
    { name: 'Summary / Objective', regex: /summary|objective|about\s+me|profile/i },
    { name: 'Work Experience / Internships', regex: /experience|employment|work\s+history|internship/i },
    { name: 'Projects', regex: /project|portfolio|academic\s+work/i },
    { name: 'Education', regex: /education|academic|degree|university|college/i },
    { name: 'Technical Skills', regex: /skills|technical\s+proficiencies|technologies|tools/i }
  ];

  for (const s of sections) {
    if (s.regex.test(resumeText)) {
      structureFeedback.push({
        section: s.name,
        status: 'present',
        tip: `Standard ${s.name} header detected.`
      });
    } else {
      structureDeductions += 15;
      structureFeedback.push({
        section: s.name,
        status: 'missing',
        tip: `Add a designated "${s.name}" section so parsing engines categorize your credentials accurately.`
      });
    }
  }

  const structureScore = Math.max(30, 100 - structureDeductions);

  // 4. Impact Metrics Check (quantifiable achievements)
  const numbersAndMetrics = resumeText.match(/\b\d+(?:\.\d+)?%|\b\d+\s*(?:ms|sec|users|clients|x|k|lpa|requests)\b/gi) || [];
  const impactMetricsScore = Math.min(100, Math.round((numbersAndMetrics.length / 5) * 100));

  // 5. Calculate Weighted Total Score
  const overallScore = Math.round(
    keywordMatchScore * 0.45 +
    formattingScore * 0.25 +
    structureScore * 0.20 +
    impactMetricsScore * 0.10
  );

  // 6. Actionable Recommendations
  const actionableRecommendations: string[] = [];
  if (missingSkills.length > 0) {
    actionableRecommendations.push(
      `Incorporate missing target competencies required by the job: ${missingSkills.slice(0, 5).join(', ')}.`
    );
  }
  if (impactMetricsScore < 60) {
    actionableRecommendations.push(
      'Quantify your accomplishments using metrics (e.g., "Increased query performance by 40%", "Built for 1,000+ active users").'
    );
  }
  if (!hasBullets) {
    actionableRecommendations.push(
      'Format each project and experience entry with 3-4 distinct bullet points using action verbs.'
    );
  }
  if (keywordMatchScore < 50) {
    actionableRecommendations.push(
      'Mirror technical phrasing from the job description directly within your skills and project descriptions.'
    );
  }
  if (actionableRecommendations.length === 0) {
    actionableRecommendations.push(
      'Strong ATS alignment! Keep your project repositories up to date and review role-specific architectural nuances.'
    );
  }

  return {
    student_id: studentId,
    target_role: targetRole,
    job_description: jobDescription,
    overall_score: overallScore,
    breakdown: {
      keyword_match_score: keywordMatchScore,
      formatting_score: formattingScore,
      structure_score: structureScore,
      impact_metrics_score: impactMetricsScore
    },
    matched_keywords: matchedKeywords,
    missing_skills: missingSkills,
    formatting_feedback: formattingFeedback,
    structure_feedback: structureFeedback,
    actionable_recommendations: actionableRecommendations,
    analyzed_at: new Date().toISOString()
  };
}
