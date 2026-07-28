# WorkFlow HRMS (Mobile-First Enterprise HR Workspace)

WorkFlow is a mobile-first, high-fidelity Human Resource Management System (HRMS) prototype built to deliver a premium, responsive employee and administrator workspace. Featuring glassmorphism design tokens, dark/light modes, role-based workflows, and real-time state persistence, WorkFlow handles everything from onboarding checksheets to custom CSS analytics and an interactive AI HR Copilot.

---

## 🚀 Tech Stack

- **Core**: Next.js 16.0.3 (Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS variables, Glassmorphism elements
- **State Management**: Zustand v5 (with local storage persistence middleware)
- **PDF Generation**: jsPDF client-side generators

---

## 📦 Features & Modules (All 15 Phases)

### 1. Role Switcher & Dynamic Layouts
- Switch roles dynamically between **Employee**, **Manager**, **HR**, and **Admin** via the top header bar dropdown. The app shell bottom navigation instantly recalculates and updates the accessible tab views and dashboard controls.

### 2. Clock In/Out System
- Integrated biometric mock clock. Employees can clock in and out in real-time, calculating daily shift times, lunch breaks, and overtime hours.

### 3. Statutory Leave Management
- Real-time leave entitlement tracking. Employees can file leaves (Casual, Sick, Earned, Comp-off), projecting balance deductions and routing to the manager approval queue.

### 4. Pending Approvals Flow (Manager, HR, Admin)
- Combined administrative approvals dashboard to review, approve, or reject pending leaves and expense reimbursement filings with real-time notifications.

### 5. Payslip Generation & PDF Exports
- Projected salary statement calculations showing gross earnings, deductions (PF/Professional Tax), and net take-home salary. Generates and downloads clean landscape/portrait PDF payslips directly.

### 6. Expense Claim Reimbursables
- Filer form to upload receipts and claim expenses under Travel, Food, Accommodation, and Equipment. Automatic warnings for policy violations (>₹10,000).

### 7. Self-Service Performance OKRs
- Manage objectives and key results (OKRs) with interactive sliders. Dynamically calculates average OKR progress across active cycles.

### 8. Employee Onboarding Hub
- Guided onboarding dashboard containingPre-joining, Day 1, Week 1, and Month 1 checksheets, welcoming message cards from executives, and team profile sheets.

### 9. Documents Vault Uploads
- Secure vault category filtering (Personal, Employment, Tax, Payroll) to upload, search, and view PDF/DOC files.

### 10. Training & Learning Module
- L&D catalog split into Mandatory, Technical, and Soft Skills. Progress tracking increments by 20% on start/continue. Completed courses automatically unlock a custom-generated certificate of completion PDF.

### 11. Recruitment Module (HR & Admin)
- Kanban candidate applicant tracking board split into 4 columns (Screening, Interview, Offer, Hired). Allows recruiters to drag/move stages and write evaluation notes.

### 12. Recognition & Kudos Feed
- Gamified peer recognition social feed. Colleague select dropdowns, points leaderboards with medals, and custom category badges.

### 13. Announcements Bulletin Alerts
- Corporate notice board highlighting high-priority receipts. Unread notice indicators cleared on reading, with acknowledgment timestamp logs.

### 14. Team Management Directory
- Searchable employee contact list with filters by department. Details panels show full profiles, manager names, and today's shift clock status.

### 15. Conversational AI HR Copilot
- Virtual HR assistant chatbot ('WorkFlow AI'). Responds dynamically using keyword regular expression scanner rules targeting active store parameters. Simulates response delays with typing indicators.

---

## 🎨 Design Identity System

WorkFlow relies on custom premium identity tokens declared in `app/globals.css`:
- **Teal brand primary**: `#0d9488` / `#14b8a6` (accentuating trust, clean UI, and system status).
- **Orange brand accent**: `#ea580c` / `#f97316` (highlighting warnings, pending actions, and achievements).
- **Glassmorphism panels**: Translucent backgrounds (`rgba(255, 255, 255, 0.7)` / dark variants) blended with backdrop-blur utilities.

---

## 🔧 Installation & Setup

1. **Clone and Navigate**:
   ```bash
   cd nextjs-boiler-plate-v16.0.3
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Dev Environment**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) inside your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 📸 Screenshots & Layouts
*(Placeholder section for visual layout previews of Mobile Viewport)*
- **Dashboard Hub**: Home screen displaying greetings and stats card indexes.
- **Kanban Board**: Recruitment candidate tracking.
- **AI Chatbot**: Conversational WorkFlow AI copilot panels.
