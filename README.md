# NEXPREP

### *Learn. Build. Prepare. Get Placed.*

NexPrep is an AI-powered career preparation platform built for modern engineering campuses and ambitious students. Rather than operating as another generic exam or job board portal, NexPrep orchestrates the complete student trajectory:

$$\text{Learn} \longrightarrow \text{Assess} \longrightarrow \text{Analyze} \longrightarrow \text{Personalize} \longrightarrow \text{Build Resume} \longrightarrow \text{Prepare} \longrightarrow \text{Get Placed}$$

---

## 🎨 Design Philosophy & Aesthetics

NexPrep is engineered with an aesthetic inspired by **Notion, Linear, Stripe Dashboard, Vercel, Framer, and Apple**:
- **Background:** `#FBFAFF` (Warm, minimal SaaS surface)
- **Primary Accent:** `#6D28D9` (Deep Royal Purple)
- **Secondary:** `#8B5CF6` (Bright Violet)
- **Vibrant Accent:** `#EC4899` (Electric Pink)
- **Typography:** *Plus Jakarta Sans* & *JetBrains Mono*
- **Geometry:** 16px soft-radius cards with subtle layered shadows (`shadow-soft`)
- **Tone:** Minimal, elegant, frictionless, and data-honest with zero synthetic statistics.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Styling & Design Tokens** | TailwindCSS + Plus Jakarta Sans + Lucide Icons |
| **Animation** | Framer Motion |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **PDF Generation** | jsPDF (ATS-standard monochrome serif/sans layout) |
| **Backend Framework** | Node.js + Express + TypeScript |
| **Compiler & Execution** | Piston API with high-performance local fallback (Python, JS, Java, C++) |
| **AI Inference** | Hugging Face Inference API (`Qwen/Qwen3-8B`) |
| **Database & Auth** | Supabase PostgreSQL + Row Level Security (RLS) policies |

---

## 🚀 Features Walkthrough

### 1. Student Ecosystem
1. **Interactive Dashboard:** Live real-time KPIs, proctored test schedules, coding solve counts, and personalized roadmap progress.
2. **Proctored Assessments:** Countdown timer, autosave, question palette with marked-for-review tags, MCQ & sandboxed coding questions, and canonical explanations.
3. **Monaco Coding Sandbox:** Full-screen editor supporting Python, JavaScript, Java, and C++ with real-time compilation and evaluation against hidden test suites.
4. **AI Resume Builder:** Powered by Hugging Face `Qwen/Qwen3-8B` to draft executive summaries and Google X-Y-Z formula achievement bullet points, with direct ATS PDF export.
5. **ATS Resume Analyzer:** Deterministic keyword and structure parser calculating real match scores against job descriptions with zero synthetic scores.
6. **Skill Gap Intelligence:** Cross-analyzes test performance, sandbox submissions, and resume keywords against market role benchmarks.
7. **Personalized 6-Week Roadmap:** Dynamic weekly curriculum adapting to weak areas with interactive task completion toggles.
8. **AI Mock Interview Simulator:** Technical, HR, and System Design interview drills with keyword scoring, constructive feedback, and model phrasing.
9. **Campus Placement Drives:** Real opportunities with CGPA eligibility gates and instant application tracking.

### 2. Administrator & Placement Cell Ecosystem
1. **Institutional Analytics:** Real cohort pass rates, coding accuracy trends, and placement funnel metrics.
2. **Student Candidate Roster:** Filterable directory with academic credentials, CGPA, and preparation milestones.
3. **Assessment & Question Bank Manager:** Author exams, set durations, assign marks, and configure passing thresholds.
4. **Coding Problem Bank:** Create challenges with public and hidden test cases.
5. **Placement Drives Hub:** Publish drives, define minimum CGPA requirements, and view applicants.
6. **Bulk Email Automation:** CSV ingestion, dynamic token replacement (`{{name}}`, `{{company}}`, `{{role}}`), live preview, and dispatch history logs.

---

## ⚡ Quick Start & Local Execution

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- Python / Java / C++ (optional, for local compiler execution fallback)

### 2. Install Dependencies
```bash
# In backend
cd backend
npm install

# In frontend
cd ../frontend
npm install
```

### 3. Start Development Servers
```bash
# Terminal 1 - Start Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2 - Start Frontend Dev Server (Port 3000)
cd frontend
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🔑 Demo Access & Role Switching

NexPrep features an integrated role switcher in the top navigation bar:
- Click **"Student View"** to experience the platform as an active candidate.
- Click **"Admin View"** to inspect the institutional TPO portal, question bank, and bulk emailer.
