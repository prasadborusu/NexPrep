# NEXPREP REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)
- `POST /api/auth/login`: Authenticate with email/password; returns auth token & user profile.
- `POST /api/auth/register`: Register new student or administrator.
- `GET /api/auth/profile/:id`: Retrieve user profile coordinates.
- `PUT /api/auth/profile/:id`: Update academic credentials, CGPA, target role, and technical skills.

---

## 2. Assessments (`/api/assessments`)
- `GET /api/assessments`: List all active exams with duration and question counts.
- `GET /api/assessments/:id`: Fetch assessment details and test questions (stripping answer keys).
- `POST /api/assessments/:id/submit`: Autosave or finalize exam submission with automated grading.
- `GET /api/assessments/:id/result/:studentId`: Retrieve detailed scorecard and canonical explanations.
- `POST /api/assessments`: Admin endpoint to create new assessment.
- `POST /api/assessments/:id/questions`: Admin endpoint to add question to assessment.

---

## 3. Coding Practice (`/api/coding`)
- `GET /api/coding/problems`: List coding challenges with acceptance rates and categories.
- `GET /api/coding/problems/:idOrSlug`: Fetch problem description, constraints, and starter code.
- `POST /api/coding/run`: Execute code with custom stdin; returns stdout, stderr, and execution time.
- `POST /api/coding/submit`: Evaluate code against all test cases including hidden test cases.
- `GET /api/coding/submissions/:studentId`: Fetch student submission history.
- `POST /api/coding/problems`: Admin endpoint to create new coding problems.

---

## 4. AI Resume Builder (`/api/resume`)
- `GET /api/resume/:studentId`: Retrieve structured resume data.
- `POST /api/resume`: Save updated resume draft.
- `POST /api/resume/ai/summary`: Generate ATS professional summary via Hugging Face Qwen3-8B.
- `POST /api/resume/ai/bullets`: Generate Google X-Y-Z quantifiable bullet points via Qwen3-8B.

---

## 5. ATS Resume Analyzer (`/api/ats`)
- `POST /api/ats/analyze`: Analyzes resume (file upload or text) vs Job Description. Returns keyword match %, formatting checks, structure checks, and actionable recommendations.
- `GET /api/ats/history/:studentId`: Retrieve past candidate ATS audit reports.

---

## 6. Skill Gap Intelligence (`/api/skill-gap`)
- `GET /api/skill-gap/:studentId?targetRole=...`: Returns strong, weak, and missing skills with readiness score.

---

## 7. Personalized Roadmap (`/api/roadmap`)
- `GET /api/roadmap/:studentId`: Retrieve candidate's 6-week curriculum.
- `POST /api/roadmap/:studentId/generate`: Regenerate tailored curriculum for a target role.
- `PATCH /api/roadmap/:studentId/item/:itemId`: Toggle completion of a roadmap milestone.

---

## 8. Mock Interview Prep (`/api/interview`)
- `POST /api/interview/start`: Initialize mock interview session with Technical, HR, and Project questions.
- `POST /api/interview/:sessionId/evaluate`: Score candidate's answer and generate constructive AI feedback.
- `GET /api/interview/:sessionId`: Retrieve session state.
- `GET /api/interview/history/:studentId`: View past interview sessions.

---

## 9. Placement Drives (`/api/placements`)
- `GET /api/placements`: List active corporate campus placement drives.
- `POST /api/placements/:driveId/apply`: Student applies to a verified drive.
- `GET /api/placements/applications/:studentId`: List drives applied by student.
- `POST /api/placements`: Admin endpoint to publish new placement drive.

---

## 10. Bulk Email Automation (`/api/bulk-email`)
- `GET /api/bulk-email/templates`: Retrieve standardized communication templates.
- `POST /api/bulk-email/parse-csv`: Ingest candidate CSV roster with column mapping.
- `POST /api/bulk-email/preview`: Preview template with dynamic token substitution.
- `POST /api/bulk-email/send`: Execute bulk dispatch with delivery metric logging.
- `GET /api/bulk-email/logs`: Fetch dispatch history logs.

---

## 11. Admin Intelligence (`/api/admin`)
- `GET /api/admin/analytics`: Return real platform KPIs, pass rates, and activity logs.
- `GET /api/admin/students`: Return candidate roster with CGPA and performance metrics.
