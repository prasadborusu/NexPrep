# NEXPREP Architecture & System Design

**Tagline:** *Learn. Build. Prepare. Get Placed.*

NexPrep is an enterprise-grade AI-powered career preparation platform designed to help students systematically assess their technical skills, craft verified ATS-compliant resumes, practice competitive coding, and enable campus placement administrators to conduct proctored assessments and automate recruitment communications.

---

## 1. High-Level Architectural Diagram

```mermaid
graph TD
    Client["Client Web App (React + TypeScript + Vite)"]
    API["Express Backend API (Node.js + TypeScript)"]
    DB[("Supabase PostgreSQL Database (with RLS)")]
    Piston["Piston Compiler Sandbox / Local Engine"]
    Qwen["Hugging Face Qwen/Qwen3-8B Inference"]

    Client -->|REST & JSON API| API
    Client -->|Direct Auth & Realtime| DB
    API -->|PostgreSQL Queries & RLS| DB
    API -->|Code Execution (Python, Java, C++, JS)| Piston
    API -->|Prompt & Resume Section Generation| Qwen
```

---

## 2. Core Subsystems

### A. Assessment Engine
- **Supported Modes:** Multiple Choice Questions (MCQ), Live Sandboxed Coding, and Mixed Assessments.
- **Proctoring Capabilities:**
  - Real-time countdown timer with auto-submit upon expiration.
  - Periodic autosave tracking question responses.
  - Interactive Question Palette with status indicators (`visited`, `answered`, `marked_for_review`).
  - Automated canonical explanation review upon completion.

### B. Coding Practice & Compiler Service
- **Editor:** Integrated Monaco Editor with syntax highlighting and theme support.
- **Execution Engine:** Sandboxed execution supporting Python, JavaScript, Java, and C++.
- **Evaluation:** Real-time stdout/stderr capture, execution runtime measurement (ms), and dual-stage testing (public sample cases and hidden edge test cases).

### C. AI Resume Builder & ATS Analyzer
- **AI Generator:** Integrated with Hugging Face Qwen/Qwen3-8B to draft professional executive summaries and Google X-Y-Z formula achievement bullet points.
- **ATS Parsing Engine:** Deterministic keyword-extraction algorithm parsing technical proficiencies, section headers, formatting densities, and quantifiable metrics with zero synthetic scoring.
- **PDF Generation:** Direct client-side generation using `jspdf` compliant with monochrome serif/sans ATS reader layout standards.

### D. Skill Gap Intelligence & Personalized Roadmap
- **Algorithmic Aggregation:** Synthesizes candidate assessment pass rates, coding sandbox accuracy, and resume keywords against market role benchmarks (Full Stack, Frontend, Backend, SDE, Data Engineer).
- **Dynamic 6-Week Roadmap:** Chronological curriculum targeting detected weak areas with interactive task check-offs and live completion tracking.

### E. Campus Placement & Bulk Communication Hub
- **Placement Drives:** Published by administrators with CGPA eligibility gates, rounds info, application deadlines, and direct career portal links.
- **Bulk Email Dispatcher:** CSV recipient ingestion, template variable substitution (`{{name}}`, `{{company}}`, `{{role}}`), live preview, and dispatch history logging.

---

## 3. Database Schema & RLS

All primary tables feature UUID primary keys, relational foreign key constraints, and Row Level Security (RLS) policies:
- `profiles`
- `assessments`
- `questions`
- `assessment_submissions`
- `coding_problems`
- `code_submissions`
- `resumes`
- `ats_analyses`
- `roadmaps`
- `interview_sessions`
- `placement_drives`
- `placement_applications`
- `bulk_email_logs`
