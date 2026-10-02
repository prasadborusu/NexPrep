import { ATSAnalysisResult } from '../types';

// Comprehensive technical skills dictionary for ATS keyword mining
const TECH_SKILLS_DICTIONARY = [
  // Languages
  'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'c', 'go', 'golang', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css', 'r', 'bash', 'shell',

  // Backend & Frameworks
  'django', 'fastapi', 'flask', 'node.js', 'express', 'spring boot', 'nestjs', 'asp.net',
  'ruby on rails', 'laravel', 'tornado', 'celery',

  // Frontend & UI
  'react', 'next.js', 'vue', 'angular', 'svelte', 'tailwind', 'bootstrap', 'redux',
  'webpack', 'vite', 'html5', 'css3', 'responsive design',

  // Databases & Caching
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'sqlite',
  'cassandra', 'firebase', 'supabase', 'prisma', 'sqlalchemy',

  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git', 'github', 'gitlab',
  'terraform', 'jenkins', 'linux', 'unix', 'nginx', 'apache', 'microservices',

  // Architecture & Concepts
  'rest', 'restful', 'graphql', 'grpc', 'data structures', 'algorithms', 'system design',
  'oop', 'mvc', 'agile', 'scrum', 'unit testing', 'pytest', 'jest', 'tdd', 'kafka',
  'rabbitmq', 'jwt', 'oauth', 'api design',

  // Data & Machine Learning
  'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow', 'opencv',
  'machine learning', 'deep learning', 'etl', 'data pipeline'
];

// Industry-standard core competencies for common job roles
const ROLE_BENCHMARKS: Record<string, { roleName: string; coreSkills: string[]; minKeywords: number }> = {
  python: {
    roleName: 'Python Developer',
    coreSkills: [
      'python', 'sql', 'django', 'fastapi', 'flask', 'git', 'rest', 'docker',
      'postgresql', 'unit testing', 'oop', 'data structures', 'redis', 'linux'
    ],
    minKeywords: 8
  },
  backend: {
    roleName: 'Backend Engineer',
    coreSkills: [
      'python', 'node.js', 'sql', 'postgresql', 'rest', 'git', 'docker', 'redis',
      'microservices', 'data structures', 'algorithms', 'system design', 'unit testing', 'aws'
    ],
    minKeywords: 8
  },
  frontend: {
    roleName: 'Frontend Specialist',
    coreSkills: [
      'javascript', 'typescript', 'react', 'next.js', 'html', 'css', 'tailwind',
      'redux', 'git', 'rest', 'responsive design', 'unit testing'
    ],
    minKeywords: 7
  },
  fullstack: {
    roleName: 'Full Stack Engineer',
    coreSkills: [
      'javascript', 'typescript', 'react', 'node.js', 'sql', 'html', 'css', 'git',
      'rest', 'docker', 'postgresql', 'mongodb', 'data structures', 'unit testing'
    ],
    minKeywords: 9
  },
  sde: {
    roleName: 'Software Development Engineer',
    coreSkills: [
      'data structures', 'algorithms', 'oop', 'system design', 'git', 'sql',
      'unit testing', 'linux', 'ci/cd', 'docker', 'python', 'java'
    ],
    minKeywords: 8
  },
  data: {
    roleName: 'Data Engineer',
    coreSkills: [
      'python', 'sql', 'postgresql', 'data structures', 'kafka', 'docker', 'git',
      'linux', 'pandas', 'aws', 'etl'
    ],
    minKeywords: 7
  }
};

export function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase();
  const found: string[] = [];

  for (const skill of TECH_SKILLS_DICTIONARY) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
    if (regex.test(normalized)) {
      found.push(skill);
    }
  }

  return Array.from(new Set(found));
}

// Action verbs standard for software resumes
const ACTION_VERBS = [
  'developed', 'built', 'engineered', 'architected', 'optimized', 'implemented',
  'designed', 'automated', 'integrated', 'refactored', 'spearheaded', 'created',
  'deployed', 'maintained', 'resolved', 'collaborated', 'scaled', 'accelerated'
];

export function analyzeResumeATS(
  resumeText: string,
  jobDescription: string,
  targetRole: string = 'Software Engineer',
  studentId: string = 'student'
): ATSAnalysisResult {
  const normResume = resumeText.toLowerCase();
  const rawJdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);

  // Determine matching role benchmark if Job Description is short (e.g. user typed "python developer" or few keywords)
  const jdLower = jobDescription.toLowerCase();
  const targetLower = targetRole.toLowerCase();

  let benchmarkKey = 'fullstack';
  if (jdLower.includes('python') || targetLower.includes('python')) {
    benchmarkKey = 'python';
  } else if (jdLower.includes('frontend') || targetLower.includes('frontend')) {
    benchmarkKey = 'frontend';
  } else if (jdLower.includes('backend') || targetLower.includes('backend')) {
    benchmarkKey = 'backend';
  } else if (jdLower.includes('data') || targetLower.includes('data')) {
    benchmarkKey = 'data';
  } else if (jdLower.includes('sde') || targetLower.includes('software development') || targetLower.includes('sde')) {
    benchmarkKey = 'sde';
  }

  const benchmark = ROLE_BENCHMARKS[benchmarkKey] || ROLE_BENCHMARKS['fullstack'];

  // Synthesize required skills:
  // If the user provided a full JD with >= 5 keywords, prioritize the JD's explicit keywords.
  // If the user provided a short title or short text (e.g. "python developer"), blend with role's benchmark skills.
  let targetExpectedSkills: string[];

  if (rawJdKeywords.length >= 5) {
    targetExpectedSkills = Array.from(new Set([...rawJdKeywords]));
  } else {
    // Short input like "python developer" -> expand with standard industry role competencies
    const merged = new Set([...rawJdKeywords, ...benchmark.coreSkills.slice(0, 10)]);
    targetExpectedSkills = Array.from(merged);
  }

  // 1. Keyword Match Calculation
  const matchedKeywords = targetExpectedSkills.filter(k => resumeKeywords.includes(k));
  const missingSkills = targetExpectedSkills.filter(k => !resumeKeywords.includes(k));

  // Compute realistic keyword score (never 100% on a single keyword match)
  const matchRatio = targetExpectedSkills.length > 0
    ? matchedKeywords.length / targetExpectedSkills.length
    : 0;

  // Real ATS systems scale based on breadth and essential requirements
  const keywordMatchScore = Math.min(95, Math.round(matchRatio * 100));

  // 2. Formatting & Readability Score (Granular & Realistic)
  const formattingFeedback: ATSAnalysisResult['formatting_feedback'] = [];
  let formatScore = 80; // Realistic starting baseline

  // Bullet point structure
  const hasBullets = /[-*•–]/.test(resumeText);
  if (hasBullets) {
    formatScore += 5;
    formattingFeedback.push({
      type: 'pass',
      message: 'Clean bullet points detected. ATS scanners parse bulleted achievements reliably.'
    });
  } else {
    formatScore -= 18;
    formattingFeedback.push({
      type: 'fail',
      message: 'No standard bullet points detected. Convert large paragraphs into scannable bullet points.'
    });
  }

  // Word count check
  const words = resumeText.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 400 && words.length <= 850) {
    formatScore += 5;
    formattingFeedback.push({
      type: 'pass',
      message: `Optimal resume length (${words.length} words). Well balanced for 1-page ATS screening.`
    });
  } else if (words.length >= 300 && words.length <= 1100) {
    formatScore += 2;
    formattingFeedback.push({
      type: 'pass',
      message: `Acceptable resume length (${words.length} words). Fits standard 1-2 page requirements.`
    });
  } else if (words.length < 300) {
    formatScore -= 18;
    formattingFeedback.push({
      type: 'warning',
      message: `Resume content is brief (${words.length} words). Elaborate on technical projects and quantifiable outcomes.`
    });
  } else {
    formatScore -= 10;
    formattingFeedback.push({
      type: 'warning',
      message: `Resume is lengthy (${words.length} words). Condense descriptions to fit essential impact points.`
    });
  }

  // Action verbs check
  const foundActionVerbs = ACTION_VERBS.filter(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    return regex.test(normResume);
  });

  if (foundActionVerbs.length >= 6) {
    formatScore += 5;
    formattingFeedback.push({
      type: 'pass',
      message: `Strong action-oriented language detected (${foundActionVerbs.slice(0, 4).join(', ')}...). ATS engines favor proactive verbs.`
    });
  } else if (foundActionVerbs.length >= 3) {
    formattingFeedback.push({
      type: 'pass',
      message: `Moderate action verbs detected (${foundActionVerbs.join(', ')}). Strengthen bullet starts with high-impact engineering verbs.`
    });
  } else {
    formatScore -= 10;
    formattingFeedback.push({
      type: 'warning',
      message: 'Low action verb density. Start bullet points with dynamic verbs like "Engineered", "Optimized", "Architected", or "Implemented".'
    });
  }

  // Contact info check
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(?:\+?\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/.test(resumeText);
  const hasLinks = /linkedin\.com|github\.com/i.test(resumeText);

  if (hasEmail && hasPhone) {
    formatScore += 3;
    formattingFeedback.push({
      type: 'pass',
      message: 'Direct contact coordinates (email & telephone) clearly identifiable.'
    });
  } else {
    formatScore -= 12;
    formattingFeedback.push({
      type: 'warning',
      message: 'Ensure valid email address and phone number are explicitly positioned at the top.'
    });
  }

  if (hasLinks) {
    formatScore += 2;
    formattingFeedback.push({
      type: 'pass',
      message: 'Professional developer profiles (GitHub / LinkedIn) present.'
    });
  } else {
    formatScore -= 8;
    formattingFeedback.push({
      type: 'warning',
      message: 'Add active GitHub and LinkedIn profile URLs to improve technical recruiter engagement.'
    });
  }

  const finalFormattingScore = Math.max(35, Math.min(92, formatScore));

  // 3. Structure Check (Realistic & Detailed)
  const structureFeedback: ATSAnalysisResult['structure_feedback'] = [];
  let structScore = 78;

  const sections = [
    { name: 'Summary / Objective', regex: /summary|objective|about\s+me|profile/i, weight: 3 },
    { name: 'Work Experience / Internships', regex: /experience|employment|work\s+history|internship/i, weight: 6 },
    { name: 'Projects', regex: /project|portfolio|academic\s+work/i, weight: 6 },
    { name: 'Education', regex: /education|academic|degree|university|college/i, weight: 5 },
    { name: 'Technical Skills', regex: /skills|technical\s+proficiencies|technologies|tools/i, weight: 5 }
  ];

  for (const s of sections) {
    if (s.regex.test(resumeText)) {
      structScore += s.weight;
      structureFeedback.push({
        section: s.name,
        status: 'present',
        tip: `Standard ${s.name} header detected.`
      });
    } else {
      structScore -= (s.weight * 2);
      structureFeedback.push({
        section: s.name,
        status: 'missing',
        tip: `Add a designated "${s.name}" section so parsing engines categorize your credentials accurately.`
      });
    }
  }

  const finalStructureScore = Math.max(40, Math.min(90, structScore));

  // 4. Impact Metrics Check (quantifiable achievements)
  const numbersAndMetrics = resumeText.match(/\b\d+(?:\.\d+)?%|\b\d+\s*(?:ms|sec|users|clients|x|k|lpa|requests|gb|mb)\b/gi) || [];
  let impactMetricsScore = 20; // Default when zero metrics
  if (numbersAndMetrics.length >= 5) {
    impactMetricsScore = 90;
  } else if (numbersAndMetrics.length >= 3) {
    impactMetricsScore = 75;
  } else if (numbersAndMetrics.length >= 1) {
    impactMetricsScore = 50;
  }

  // 5. Calculate Weighted Total Score
  const overallScore = Math.max(20, Math.min(98, Math.round(
    keywordMatchScore * 0.45 +
    finalFormattingScore * 0.20 +
    finalStructureScore * 0.20 +
    impactMetricsScore * 0.15
  )));

  // 6. Actionable Recommendations
  const actionableRecommendations: string[] = [];

  if (missingSkills.length > 0) {
    actionableRecommendations.push(
      `Incorporate missing target competencies for ${benchmark.roleName}: ${missingSkills.slice(0, 5).join(', ')}.`
    );
  }

  if (impactMetricsScore < 60) {
    actionableRecommendations.push(
      'Quantify your accomplishments using metrics (e.g., "Increased query performance by 40%", "Built for 1,000+ active users", "Reduced API latency to 120ms").'
    );
  }

  if (!hasBullets) {
    actionableRecommendations.push(
      'Format each project and experience entry with 3-4 distinct bullet points using action verbs.'
    );
  }

  if (foundActionVerbs.length < 5) {
    actionableRecommendations.push(
      'Enhance project descriptions with authoritative action verbs (e.g., "Architected", "Engineered", "Optimized", "Refactored").'
    );
  }

  if (keywordMatchScore < 50) {
    actionableRecommendations.push(
      `Align your skills section directly with the target job profile by explicitly showcasing hands-on experience in ${targetExpectedSkills.slice(0, 3).join(', ')}.`
    );
  }

  if (actionableRecommendations.length === 0) {
    actionableRecommendations.push(
      'Strong ATS alignment! Keep your project repositories up to date and review role-specific architectural nuances.'
    );
  }

  return {
    student_id: studentId,
    target_role: benchmark.roleName,
    job_description: jobDescription,
    overall_score: overallScore,
    breakdown: {
      keyword_match_score: keywordMatchScore,
      formatting_score: finalFormattingScore,
      structure_score: finalStructureScore,
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
