import { HuggingFaceProvider, MANDATORY_SAFETY_PROMPT } from './providers/HuggingFaceProvider';
import { AIProvider, AISuggestionResponse, JobMatchResult } from './types';
import { ResumeData } from '../../types';

export class AIService {
  private primaryProvider: AIProvider;

  constructor() {
    this.primaryProvider = new HuggingFaceProvider();
  }

  /**
   * 1. Professional Summary Generation
   * Uses strictly candidate's actual skills, education, and projects.
   */
  public async generateSummary(data: {
    fullName: string;
    targetRole: string;
    skills: string[];
    education?: string;
    projects?: string[];
    experience?: string[];
  }): Promise<AISuggestionResponse> {
    const prompt = `Write a professional 3-4 sentence resume summary for a candidate targeting the role of "${data.targetRole}".
Facts provided by the student:
- Name: ${data.fullName || 'Candidate'}
- Verified Skills: ${data.skills.join(', ') || 'Software Development'}
- Education: ${data.education || 'Computer Science/Engineering'}
- Projects: ${data.projects?.join('; ') || 'Hands-on academic and technical projects'}
- Experience: ${data.experience?.join('; ') || 'Practical software development experience'}

RULE: ${MANDATORY_SAFETY_PROMPT} Output ONLY the final summary paragraph.`;

    const aiText = await this.primaryProvider.generateText(prompt, { maxTokens: 250 });
    let finalSummary = '';

    if (aiText && aiText.length > 50 && !aiText.toLowerCase().includes('placeholder')) {
      finalSummary = aiText.replace(/^["']|["']$/g, '').trim();
    } else {
      // High-quality deterministic fallback strictly using student facts
      const skillList = data.skills.length > 0 ? `proficient in ${data.skills.slice(0, 5).join(', ')}` : 'passionate about modern software development';
      const eduInfo = data.education ? ` possessing a disciplined technical foundation from ${data.education}` : '';
      const projInfo = data.projects && data.projects.length > 0 ? ` with practical implementation experience in ${data.projects[0]}` : '';

      finalSummary = `Results-oriented ${data.targetRole}${eduInfo}, dedicated to developing scalable, high-quality software solutions. Thoroughly ${skillList}${projInfo}, combining algorithmic problem-solving with clean coding standards. Eager to contribute to high-impact engineering teams while continuously mastering modern software architectures.`;
    }

    return {
      original: '',
      suggested: finalSummary,
      explanation: 'Crafted using your verified skills, education, and projects with active software engineering verbs.'
    };
  }

  /**
   * 2. Project Description Improvement
   * Rewrites using XYZ framework without inventing technologies or metrics.
   */
  public async improveProject(project: {
    title: string;
    currentDescription: string;
    technologies: string[];
    contributions?: string[];
  }): Promise<AISuggestionResponse & { bullets: string[] }> {
    const prompt = `Improve the following project description for a technical resume.
Project: ${project.title}
Technologies: ${project.technologies.join(', ') || 'Software Engineering'}
Student's draft: "${project.currentDescription}"
Contributions: ${project.contributions?.join('; ') || 'Full stack design and development'}

Instructions:
1. Provide an improved 2-3 sentence overview using strong action verbs.
2. Provide 2 bullet points detailing architecture and algorithmic design strictly using the stated technologies.
Do NOT invent unmentioned cloud platforms, metrics, or technologies.
Format as JSON: {"improved": "...", "bullets": ["...", "..."], "explanation": "..."}`;

    const aiText = await this.primaryProvider.generateText(prompt, { maxTokens: 400 });
    try {
      const parsed = JSON.parse(aiText.match(/\{[\s\S]*\}/)?.[0] || '');
      if (parsed.improved && Array.isArray(parsed.bullets)) {
        return {
          original: project.currentDescription,
          suggested: parsed.improved,
          bullets: parsed.bullets,
          explanation: parsed.explanation || 'Enhanced with clear architectural scope and active technical verbs.'
        };
      }
    } catch {}

    // Deterministic fallback
    const techStr = project.technologies.length > 0 ? project.technologies.join(', ') : 'modern frameworks';
    const improved = `Architected and implemented ${project.title} utilizing ${techStr} to deliver responsive end-to-end functionality. Designed modular components and data workflows following established software engineering principles.`;
    const bullets = [
      `Engineered core application logic and user workflows with ${techStr}, ensuring modularity and clean separation of concerns.`,
      `Integrated responsive interfaces and robust data handling to provide reliable execution and seamless user interactions.`
    ];

    return {
      original: project.currentDescription,
      suggested: improved,
      bullets,
      explanation: 'Structured using Google-standard action verb + context format without inventing metrics.'
    };
  }

  /**
   * 3. Experience Bullet Improvement
   */
  public async improveExperience(experience: {
    role: string;
    company: string;
    currentBullets: string[];
    technologies?: string[];
  }): Promise<{ improvedBullets: string[]; explanation: string }> {
    const rawBullets = experience.currentBullets.join('\n- ');
    const prompt = `Enhance these professional experience bullets for a candidate resume.
Role: ${experience.role} at ${experience.company}
Technologies: ${experience.technologies?.join(', ') || 'Not specified'}
Draft bullets:
- ${rawBullets}

RULE: ${MANDATORY_SAFETY_PROMPT}
Transform each bullet to start with a strong engineering verb (e.g., Developed, Engineered, Optimized, Implemented). Output as JSON array of strings: ["bullet 1", "bullet 2"]`;

    const aiText = await this.primaryProvider.generateText(prompt, { maxTokens: 350 });
    try {
      const parsed = JSON.parse(aiText.match(/\[[\s\S]*\]/)?.[0] || '');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          improvedBullets: parsed,
          explanation: 'Rephrased with strong action verbs and focused technical impact.'
        };
      }
    } catch {}

    const improvedBullets = experience.currentBullets.map((b) => {
      let trimmed = b.trim().replace(/^[-*•]\s*/, '');
      if (/^made\b/i.test(trimmed)) trimmed = trimmed.replace(/^made\b/i, 'Engineered');
      if (/^worked on\b/i.test(trimmed)) trimmed = trimmed.replace(/^worked on\b/i, 'Contributed to the development of');
      if (/^did\b/i.test(trimmed)) trimmed = trimmed.replace(/^did\b/i, 'Implemented');
      if (/^created\b/i.test(trimmed)) trimmed = trimmed.replace(/^created\b/i, 'Architected');
      return trimmed;
    });

    return {
      improvedBullets,
      explanation: 'Elevated phrasing with high-impact software engineering verbs.'
    };
  }

  /**
   * 4. Target Job Description Match Analysis (Matched, Missing, Needs Review)
   */
  public analyzeJobMatch(resume: ResumeData, jobDescription: string): JobMatchResult {
    const resumeSkills = [
      ...(resume.skills.languages || []),
      ...(resume.skills.frameworks || []),
      ...(resume.skills.libraries || []),
      ...(resume.skills.databases || []),
      ...(resume.skills.tools || []),
      ...(resume.skills.cloud || []),
      ...(resume.skills.other || [])
    ].map(s => s.trim().toLowerCase());

    // Extract potential technologies from Job Description
    const commonTechBank = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'rust',
      'react', 'next.js', 'angular', 'vue', 'node.js', 'express', 'django', 'fastapi',
      'spring boot', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
      'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'git', 'ci/cd', 'rest apis',
      'graphql', 'microservices', 'system design', 'data structures', 'algorithms',
      'tailwind', 'html', 'css', 'sql', 'nosql', 'kafka', 'unit testing'
    ];

    const jdLower = jobDescription.toLowerCase();
    const mentionedTech = commonTechBank.filter(t => jdLower.includes(t));

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    const needsReviewSkills: string[] = [];

    mentionedTech.forEach(tech => {
      const hasSkill = resumeSkills.some(rs => rs === tech || rs.includes(tech) || tech.includes(rs));
      if (hasSkill) {
        matchedSkills.push(tech.charAt(0).toUpperCase() + tech.slice(1));
      } else {
        // If conceptual skill (like System Design, Data Structures) mark as needs review, else missing
        if (tech === 'system design' || tech === 'data structures' || tech === 'algorithms' || tech === 'unit testing') {
          needsReviewSkills.push(tech.charAt(0).toUpperCase() + tech.slice(1));
        } else {
          missingSkills.push(tech.charAt(0).toUpperCase() + tech.slice(1));
        }
      }
    });

    const total = Math.max(1, matchedSkills.length + missingSkills.length + needsReviewSkills.length);
    const relevanceScore = Math.min(100, Math.round((matchedSkills.length / total) * 100));

    const recommendations: string[] = [];
    if (missingSkills.length > 0) {
      recommendations.push(`Consider acquiring or demonstrating verified projects using: ${missingSkills.slice(0, 3).join(', ')}.`);
    }
    if (needsReviewSkills.length > 0) {
      recommendations.push(`Explicitly emphasize foundational competencies like ${needsReviewSkills.join(', ')} across your project bullets.`);
    }
    if (matchedSkills.length >= 3) {
      recommendations.push(`Highlight your experience with ${matchedSkills.slice(0, 3).join(', ')} directly in your professional summary.`);
    }

    return {
      matchedSkills,
      missingSkills,
      needsReviewSkills,
      roleRelevanceScore: relevanceScore,
      recommendations
    };
  }

  /**
   * 5. Deterministic ATS Scoring
   * Strictly calculated from actual data signals without hallucinated ratings.
   */
  public calculateDeterministicATS(resume: ResumeData, jobDescription?: string) {
    let score = 0;
    const checks: Array<{ category: string; max: number; score: number; feedback: string }> = [];

    // 1. Personal Info completeness (max 15)
    let contactScore = 0;
    if (resume.personal_info.full_name) contactScore += 5;
    if (resume.personal_info.email && resume.personal_info.email.includes('@')) contactScore += 4;
    if (resume.personal_info.phone) contactScore += 3;
    if (resume.personal_info.linkedin_url || resume.personal_info.github_url) contactScore += 3;
    score += contactScore;
    checks.push({
      category: 'Contact & Profile Links',
      max: 15,
      score: contactScore,
      feedback: contactScore === 15 ? 'Comprehensive contact information and professional profiles provided.' : 'Ensure name, professional email, phone, and GitHub/LinkedIn are included.'
    });

    // 2. Professional Summary (max 15)
    let summaryScore = 0;
    if (resume.summary && resume.summary.length > 50) {
      summaryScore = resume.summary.length >= 120 ? 15 : 10;
    }
    score += summaryScore;
    checks.push({
      category: 'Professional Summary',
      max: 15,
      score: summaryScore,
      feedback: summaryScore >= 10 ? 'Clear target role summary aligned with candidate background.' : 'Add a 3-4 sentence professional summary highlighting your core engineering competencies.'
    });

    // 3. Technical Skills (max 20)
    const allSkills = [
      ...(resume.skills.languages || []),
      ...(resume.skills.frameworks || []),
      ...(resume.skills.libraries || []),
      ...(resume.skills.databases || []),
      ...(resume.skills.tools || []),
      ...(resume.skills.cloud || [])
    ];
    let skillScore = 0;
    if (allSkills.length >= 8) skillScore = 20;
    else if (allSkills.length >= 4) skillScore = 14;
    else if (allSkills.length > 0) skillScore = 8;
    score += skillScore;
    checks.push({
      category: 'Technical Skills Inventory',
      max: 20,
      score: skillScore,
      feedback: skillScore === 20 ? 'Strong technical skill coverage across languages, frameworks, and tools.' : 'List at least 6-8 core technical skills categorized into languages, frameworks, and databases.'
    });

    // 4. Projects (max 25)
    let projScore = 0;
    if (resume.projects && resume.projects.length >= 2) {
      const hasGoodBullets = resume.projects.some(p => (p.bullets && p.bullets.length > 0) || p.description.length > 80);
      projScore = hasGoodBullets ? 25 : 18;
    } else if (resume.projects && resume.projects.length === 1) {
      projScore = 12;
    }
    score += projScore;
    checks.push({
      category: 'Projects & Implementations',
      max: 25,
      score: projScore,
      feedback: projScore === 25 ? 'High quality projects demonstrating hands-on architectural experience.' : 'Feature at least 2 structured technical projects with active implementation details.'
    });

    // 5. Education (max 15)
    let eduScore = 0;
    if (resume.education && resume.education.length > 0) {
      const firstEdu = resume.education[0];
      if (firstEdu.institution && firstEdu.degree) eduScore = 15;
      else eduScore = 8;
    }
    score += eduScore;
    checks.push({
      category: 'Academic Background',
      max: 15,
      score: eduScore,
      feedback: eduScore === 15 ? 'Clear educational credentials including institution and degree.' : 'Specify your university, degree program, and graduation timeframe.'
    });

    // 6. Experience or Certifications Bonus (max 10)
    let expScore = 0;
    if (resume.experience && resume.experience.length > 0) expScore += 6;
    if (resume.certifications && resume.certifications.length > 0) expScore += 4;
    score += Math.min(10, expScore);
    checks.push({
      category: 'Experience & Certifications',
      max: 10,
      score: Math.min(10, expScore),
      feedback: expScore > 0 ? 'Verified experience or external certifications evidenced.' : 'Include relevant internships, open source contributions, or industry credentials.'
    });

    return {
      overallScore: Math.min(100, score),
      checks,
      calculatedAt: new Date().toISOString()
    };
  }
}

export const aiService = new AIService();
