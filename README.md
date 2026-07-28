# WorkFlow HRMS (Enterprise Human Resource Management System)

Welcome to the **WorkFlow HRMS** monorepo workspace. This project contains the complete codebase for a mobile-first enterprise HRMS platform, featuring a modular monolithic .NET backend and a Next.js client application.

---

## 📂 Repository Structure

* **[nextjs-boiler-plate-v16.0.3/](file:///c:/propVivoAssessment/JECRC%2520Assessment/nextjs-boiler-plate-v16.0.3)**: Next.js 16 mobile-first frontend workspace, implementing all 15 core phases (Onboarding, Clocking, Leaves, Payroll, Expenses, Recruitment, AI HR Copilot, Custom Analytics, etc.).
* **[HRMS_Modular_Monolithic_BolierPlate Without Git/](file:///c:/propVivoAssessment/JECRC%2520Assessment/HRMS_Modular_Monolithic_BolierPlate%2520Without%2520Git)**: Modular Monolithic .NET API backend providing telemetry libraries, entity models, and PostgreSQL integrations.

---

## 💻 1. Next.js Mobile Frontend (`nextjs-boiler-plate-v16.0.3`)

The client side is a mobile-first, high-fidelity app wrapper with roles switcher controls.

### Technical Stack
* **Framework**: Next.js 16.0.3 (Turbopack) & React 19
* **State Management**: Zustand v5 (with local storage persistence middleware)
* **Styling**: Tailwind CSS v4 (with custom Teal primary & Orange accent tokens and glassmorphism elements)
* **PDF Utility**: Client-side `jsPDF` generators

### Features List (All 15 Phases)
1. **Dynamic shell switcher**: Swaps tab selections instantly matching selected profiles (Employee, Manager, HR, Admin).
2. **Clock In/Out System**: Interactive biometric logs tracking shifts and overtime.
3. **Absence Management**: Real-time Casual/Sick/Earned/Comp-off leave balances and filing forms.
4. **Reviews Flow**: Combined approvals dashboard for manager actions.
5. **Salary Projections**: Payslip calculation showing HRA, PF/Professional tax deductions, and client-side PDF download.
6. **Expense Reimbursement**: Categorized claim submissions with policy warnings (>₹10,000).
7. **Performance OKRs**: Manage cycle key result progress using interactive sliders.
8. **Onboarding checklists**: Interactive Pre-joining/Day 1 onboarding logs, executive greetings, and buddy cards.
9. **Document Vault**: Category-based secure document logs upload and tracking.
10. **Training & L&D**: Skill upgradation catalogs; completing courses generates certificates.
11. **Recruitment Kanban**: Pipeline tracking board supporting recruitment workflows and recruiter evaluation notes.
12. **Peer Kudox Award**: peer recognition stream and medal leaderboards.
13. **Announcements Feed**: Notices feed showing bulletins and important receipt acknowledgments.
14. **Team Directory**: Browse employee designations, departments, contact metrics, and shift details.
15. **AI HR Copilot**: Conversational chatbot answering queries using live store parameters.

### Setup and Installation
```bash
cd nextjs-boiler-plate-v16.0.3
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** inside your browser.

---

## ⚙️ 2. .NET Backend Service (`HRMS_Modular_Monolithic_BolierPlate Without Git`)

The backend follows a Modular Monolithic architecture structure.

### Directories
* **`API/`**: Houses controllers, API configurations, and Azure AppSettings secrets.
* **`Shared/`**: Shared libraries handling Postgres DB repositories, application building extensions, HEIC image conversions, and telemetry services.
