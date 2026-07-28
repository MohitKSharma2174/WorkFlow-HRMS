import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DailyRecord {
	day: string;
	date: string;
	clockIn: string | null;
	clockOut: string | null;
	status: "Present" | "Absent" | "Late";
	productiveHours: number;
	breakHours: number;
	overtimeHours: number;
}

export interface LeaveRequest {
	id: string;
	employeeName: string;
	type: "Casual Leave" | "Sick Leave" | "Earned Leave" | "Comp-off";
	startDate: string;
	endDate: string;
	reason: string;
	status: "Pending" | "Approved" | "Rejected";
	appliedDate: string;
}

export interface LeaveBalances {
	casual: number;
	sick: number;
	earned: number;
	compOff: number;
}

export interface SalaryProfile {
	employeeName: string;
	designation: string;
	department: string;
	basicPay: number;
	specialAllowance: number;
	lta: number;
}

export interface ExpenseRequest {
	id: string;
	employeeName: string;
	category: "Travel" | "Food" | "Accommodation" | "Equipment" | "Other";
	amount: number;
	date: string;
	description: string;
	receiptAttached: boolean;
	status: "Pending" | "Approved" | "Rejected";
	appliedDate: string;
}

export interface KeyResult {
	id: string;
	title: string;
	progress: number;
	currentValue: number;
	targetValue: number;
	unit: string;
}

export interface Objective {
	id: string;
	title: string;
	keyResults: KeyResult[];
}

export interface PerformanceReview {
	reviewCycle: string;
	managerName: string;
	managerFeedback: string;
	ratings: {
		technicalSkills: number;
		communication: number;
		teamwork: number;
		delivery: number;
		initiative: number;
	};
}

export interface OnboardingTask {
	id: string;
	section: "Pre-Joining" | "Day 1" | "Week 1" | "Month 1";
	title: string;
	description: string;
	dueDate: string;
	priority: "High" | "Medium" | "Low";
	assignee: string;
	completed: boolean;
}

export interface DocumentItem {
	id: string;
	name: string;
	category: "Personal" | "Employment" | "Tax" | "Payroll";
	fileType: "PDF" | "DOC" | "IMG";
	uploadDate: string;
	uploadedBy: string;
}

export interface CourseItem {
	id: string;
	title: string;
	description: string;
	category: "Mandatory" | "Technical" | "Soft Skills";
	duration: number; // hours
	progress: number; // 0 to 100
	status: "Not Started" | "In Progress" | "Completed";
}

export interface JobListing {
	id: string;
	title: string;
	department: string;
	location: string;
	type: "Full-time" | "Contract";
	postedDate: string;
	applicantCount: number;
	description?: string;
}

export interface Candidate {
	id: string;
	name: string;
	role: string;
	experience: string;
	stage: "Screening" | "Interview" | "Offer" | "Hired";
	notes: string;
}

export interface RecognitionItem {
	id: string;
	fromName: string;
	toName: string;
	badge: "Team Player" | "Innovation" | "Leadership" | "Above & Beyond" | "Customer First";
	message: string;
	date: string;
	points: number;
}

export interface AnnouncementItem {
	id: string;
	title: string;
	category: "Policy" | "Event" | "Holiday" | "General";
	priority: "High" | "Medium" | "Low";
	message: string;
	postedBy: string;
	postedDate: string;
	isRead: boolean;
	acknowledgedAt: string | null;
}

export interface TeamMember {
	id: string;
	name: string;
	designation: string;
	department: string;
	email: string;
	phone: string;
	manager: string;
	joiningDate: string;
	status: "Active" | "On Leave" | "Remote";
}

export interface HrmsState {
	role: "Employee" | "Manager" | "HR" | "Admin";
	setRole: (role: "Employee" | "Manager" | "HR" | "Admin") => void;
	persona: "Sarah" | "Michael" | "HR Specialist" | "Admin" | "Alex";
	setPersona: (persona: "Sarah" | "Michael" | "HR Specialist" | "Admin" | "Alex") => void;

	// Attendance State
	clockedIn: boolean;
	clockInTime: string | null;
	weeklyRecords: DailyRecord[];
	clockIn: () => void;
	clockOut: () => void;

	// Leave State
	leaveBalances: LeaveBalances;
	leaveRequests: LeaveRequest[];
	applyLeave: (type: LeaveRequest["type"], startDate: string, endDate: string, reason: string) => void;
	updateLeaveRequestStatus: (id: string, status: "Approved" | "Rejected") => void;

	// Payroll State
	salaryProfile: SalaryProfile;

	// Expense State
	expenseRequests: ExpenseRequest[];
	addExpenseRequest: (category: ExpenseRequest["category"], amount: number, date: string, description: string, receiptAttached: boolean) => void;
	updateExpenseStatus: (id: string, status: "Approved" | "Rejected") => void;

	// Performance State
	objectives: Objective[];
	performanceReview: PerformanceReview;
	updateKRProgress: (objectiveId: string, krId: string, progress: number) => void;

	// Onboarding Phase 7 State
	onboardingComplete: boolean;
	onboardingTasks: OnboardingTask[];
	completeOnboarding: () => void;
	toggleOnboardingTask: (id: string) => void;

	// Documents Phase 8 State
	documents: DocumentItem[];
	addDocument: (name: string, category: DocumentItem["category"], fileType: DocumentItem["fileType"]) => void;

	// Training Phase 9 State
	courses: CourseItem[];
	updateCourseProgress: (id: string) => void;

	// Recruitment Phase 10 State
	jobListings: JobListing[];
	candidates: Candidate[];
	addJobListing: (title: string, department: string, location: string, type: "Full-time" | "Contract", description: string) => void;
	moveCandidateStage: (id: string, newStage: Candidate["stage"]) => void;
	updateCandidateNotes: (id: string, notes: string) => void;

	// Recognition Phase 11 State
	recognitions: RecognitionItem[];
	addRecognition: (toName: string, badge: RecognitionItem["badge"], message: string) => void;

	// Announcements Phase 12 State
	announcements: AnnouncementItem[];
	markAnnouncementRead: (id: string) => void;
	acknowledgeAnnouncement: (id: string) => void;
	addAnnouncement: (title: string, category: AnnouncementItem["category"], priority: AnnouncementItem["priority"], message: string) => void;

	// Team Management Phase 13 State
	teamMembers: TeamMember[];
	addTeamMember: (name: string, designation: string, department: string, email: string, joiningDate: string) => void;
}

const initialWeeklyRecords: DailyRecord[] = [
	{
		day: "Monday",
		date: "22 Jun",
		clockIn: "09:00 AM",
		clockOut: "05:30 PM",
		status: "Present",
		productiveHours: 8.5,
		breakHours: 1.0,
		overtimeHours: 0.0,
	},
	{
		day: "Tuesday",
		date: "23 Jun",
		clockIn: "08:55 AM",
		clockOut: "06:00 PM",
		status: "Present",
		productiveHours: 9.0,
		breakHours: 1.0,
		overtimeHours: 0.5,
	},
	{
		day: "Wednesday",
		date: "24 Jun",
		clockIn: "09:45 AM",
		clockOut: "05:45 PM",
		status: "Late",
		productiveHours: 8.0,
		breakHours: 1.0,
		overtimeHours: 0.0,
	},
	{
		day: "Thursday",
		date: "25 Jun",
		clockIn: null,
		clockOut: null,
		status: "Absent",
		productiveHours: 0.0,
		breakHours: 0.0,
		overtimeHours: 0.0,
	},
	{
		day: "Friday",
		date: "26 Jun",
		clockIn: null,
		clockOut: null,
		status: "Absent",
		productiveHours: 0.0,
		breakHours: 0.0,
		overtimeHours: 0.0,
	},
	{
		day: "Saturday",
		date: "27 Jun",
		clockIn: null,
		clockOut: null,
		status: "Absent",
		productiveHours: 0.0,
		breakHours: 0.0,
		overtimeHours: 0.0,
	},
	{
		day: "Sunday",
		date: "28 Jun",
		clockIn: null,
		clockOut: null,
		status: "Absent",
		productiveHours: 0.0,
		breakHours: 0.0,
		overtimeHours: 0.0,
	},
];

const initialLeaveRequests: LeaveRequest[] = [
	{
		id: "req1",
		employeeName: "Sarah",
		type: "Earned Leave",
		startDate: "2026-06-10",
		endDate: "2026-06-12",
		reason: "Family event out of town",
		status: "Approved",
		appliedDate: "2026-06-05",
	},
	{
		id: "req2",
		employeeName: "Alex",
		type: "Sick Leave",
		startDate: "2026-06-26",
		endDate: "2026-06-26",
		reason: "Doctor consultation for fever",
		status: "Pending",
		appliedDate: "2026-06-25",
	},
	{
		id: "req3",
		employeeName: "Sarah",
		type: "Casual Leave",
		startDate: "2026-06-29",
		endDate: "2026-06-30",
		reason: "Personal work at home",
		status: "Pending",
		appliedDate: "2026-06-25",
	},
	{
		id: "req4",
		employeeName: "Sarah",
		type: "Casual Leave",
		startDate: "2026-05-15",
		endDate: "2026-05-16",
		reason: "Urgent banking task",
		status: "Rejected",
		appliedDate: "2026-05-12",
	},
];

const initialExpenseRequests: ExpenseRequest[] = [
	{
		id: "exp1",
		employeeName: "Sarah",
		category: "Food",
		amount: 1200,
		date: "2026-06-22",
		description: "Dinner with client team",
		receiptAttached: true,
		status: "Approved",
		appliedDate: "2026-06-23",
	},
	{
		id: "exp2",
		employeeName: "Alex",
		category: "Travel",
		amount: 12500,
		date: "2026-06-24",
		description: "Flight tickets for corporate training session",
		receiptAttached: true,
		status: "Pending",
		appliedDate: "2026-06-24",
	},
	{
		id: "exp3",
		employeeName: "Sarah",
		category: "Food",
		amount: 850,
		date: "2026-06-25",
		description: "Lunch meeting with product design",
		receiptAttached: true,
		status: "Pending",
		appliedDate: "2026-06-25",
	},
	{
		id: "exp4",
		employeeName: "Sarah",
		category: "Equipment",
		amount: 3500,
		date: "2026-05-14",
		description: "Mock mechanical keyboard upgrade claim",
		receiptAttached: false,
		status: "Rejected",
		appliedDate: "2026-05-15",
	},
];

const initialObjectives: Objective[] = [
	{
		id: "obj1",
		title: "Deliver Next.js Boilerplate HRMS Frontend Prototype",
		keyResults: [
			{
				id: "kr1_1",
				title: "Complete 6 operational screens with fully-responsive mobile shell",
				progress: 60,
				currentValue: 3.6,
				targetValue: 6,
				unit: "screens",
			},
			{
				id: "kr1_2",
				title: "Resolve all TypeScript compilation compiler warnings",
				progress: 100,
				currentValue: 100,
				targetValue: 100,
				unit: "%",
			},
		],
	},
	{
		id: "obj2",
		title: "Optimize Client Bundle Loading Speeds",
		keyResults: [
			{
				id: "kr2_1",
				title: "Reduce initial JS payload below 800KB target",
				progress: 40,
				currentValue: 920,
				targetValue: 800,
				unit: "KB",
			},
			{
				id: "kr2_2",
				title: "Compress asset image files across static public directories",
				progress: 30,
				currentValue: 3,
				targetValue: 10,
				unit: "images",
			},
		],
	},
];

const initialPerformanceReview: PerformanceReview = {
	reviewCycle: "Q1 2026 Cycle",
	managerName: "Michael",
	managerFeedback:
		"Sarah has done an exceptional job leading the frontend setup for the India operations. Her visual design system execution and layout structuring are outstanding. Needs to focus slightly on optimizing asset sizes in the upcoming quarter.",
	ratings: {
		technicalSkills: 4.8,
		communication: 4.2,
		teamwork: 4.5,
		delivery: 4.7,
		initiative: 4.6,
	},
};

const initialOnboardingTasks: OnboardingTask[] = [
	{
		id: "ot1",
		section: "Pre-Joining",
		title: "Sign Employment Contract Offer",
		description: "Read, sign, and submit your digital employment contract.",
		dueDate: "20 Jun",
		priority: "High",
		assignee: "Employee",
		completed: true,
	},
	{
		id: "ot2",
		section: "Pre-Joining",
		title: "Upload Verification KYC ID",
		description: "Upload scanned copies of PAN and Aadhaar card for payroll registration.",
		dueDate: "21 Jun",
		priority: "High",
		assignee: "Employee",
		completed: true,
	},
	{
		id: "ot3",
		section: "Day 1",
		title: "Collect IT Assets & Hardware",
		description: "Pick up your MacBook Pro and building security access card from the IT lobby desk.",
		dueDate: "25 Jun",
		priority: "High",
		assignee: "IT Desk",
		completed: false,
	},
	{
		id: "ot4",
		section: "Day 1",
		title: "Compliance Orientation Briefing",
		description: "Attend the HR welcome presentation and core security compliance briefing.",
		dueDate: "25 Jun",
		priority: "Medium",
		assignee: "HR Specialist",
		completed: false,
	},
	{
		id: "ot5",
		section: "Week 1",
		title: "Setup VPN and Corporate Accounts",
		description: "Activate your Slack, Google Workspace, and secure office VPN access.",
		dueDate: "28 Jun",
		priority: "High",
		assignee: "IT Support",
		completed: false,
	},
	{
		id: "ot6",
		section: "Week 1",
		title: "Buddy Introduction Meeting",
		description: "Connect with your assigned onboarding buddy over coffee or lunch sync.",
		dueDate: "30 Jun",
		priority: "Low",
		assignee: "Sarah",
		completed: false,
	},
	{
		id: "ot7",
		section: "Month 1",
		title: "Complete Core Compliance training",
		description: "Pass the mandatory security awareness training module in LMS.",
		dueDate: "20 Jul",
		priority: "Medium",
		assignee: "Employee",
		completed: false,
	},
	{
		id: "ot8",
		section: "Month 1",
		title: "Align on OKRs and 1-Month Goals",
		description: "Collaborate with your manager to establish and save Q2 OKRs in the Performance module.",
		dueDate: "25 Jul",
		priority: "Medium",
		assignee: "Michael",
		completed: false,
	},
];

const initialDocuments: DocumentItem[] = [
	{
		id: "doc1",
		name: "Offer Letter",
		category: "Employment",
		fileType: "PDF",
		uploadDate: "2026-06-20",
		uploadedBy: "HR Specialist",
	},
	{
		id: "doc2",
		name: "Appointment Letter",
		category: "Employment",
		fileType: "PDF",
		uploadDate: "2026-06-25",
		uploadedBy: "HR Specialist",
	},
	{
		id: "doc3",
		name: "PAN Card",
		category: "Personal",
		fileType: "IMG",
		uploadDate: "2026-06-25",
		uploadedBy: "Sarah",
	},
	{
		id: "doc4",
		name: "Aadhaar Card",
		category: "Personal",
		fileType: "IMG",
		uploadDate: "2026-06-25",
		uploadedBy: "Sarah",
	},
	{
		id: "doc5",
		name: "Form 16 - FY 2025-26",
		category: "Tax",
		fileType: "PDF",
		uploadDate: "2026-05-15",
		uploadedBy: "Admin",
	},
	{
		id: "doc6",
		name: "May 2026 Payslip",
		category: "Payroll",
		fileType: "PDF",
		uploadDate: "2026-06-01",
		uploadedBy: "Admin",
	},
	{
		id: "doc7",
		name: "Experience Letter - Previous Org",
		category: "Employment",
		fileType: "DOC",
		uploadDate: "2026-06-10",
		uploadedBy: "HR Specialist",
	},
];

const initialCourses: CourseItem[] = [
	{
		id: "course1",
		title: "POSH Training",
		description: "Prevention of Sexual Harassment at workplace. Mandatory compliance training for all employees.",
		category: "Mandatory",
		duration: 2,
		progress: 100,
		status: "Completed",
	},
	{
		id: "course2",
		title: "Data Privacy Policy",
		description: "Understand GDPR, DPDP Act 2023, and corporate guidelines on data security and privacy compliance.",
		category: "Mandatory",
		duration: 1.5,
		progress: 100,
		status: "Completed",
	},
	{
		id: "course3",
		title: "React Advanced Patterns",
		description: "Master advanced React patterns including compound components, render props, hooks, and performance tuning.",
		category: "Technical",
		duration: 8,
		progress: 40,
		status: "In Progress",
	},
	{
		id: "course4",
		title: "Node.js Best Practices",
		description: "Learn production-ready Node.js patterns, security practices, performance optimizations, and error handling.",
		category: "Technical",
		duration: 6,
		progress: 0,
		status: "Not Started",
	},
	{
		id: "course5",
		title: "Communication Skills",
		description: "Enhance your verbal, non-verbal, and written communication for effective collaboration in cross-functional teams.",
		category: "Soft Skills",
		duration: 3,
		progress: 80,
		status: "In Progress",
	},
	{
		id: "course6",
		title: "Leadership Fundamentals",
		description: "Discover foundational leadership styles, feedback loops, delegation, and driving team success.",
		category: "Soft Skills",
		duration: 4,
		progress: 0,
		status: "Not Started",
	},
	{
		id: "course7",
		title: "Cloud Architecture & AWS",
		description: "Deep dive into scalable cloud architectures, VPC design, EC2 auto-scaling, Serverless (Lambda), and S3 security.",
		category: "Technical",
		duration: 10,
		progress: 0,
		status: "Not Started",
	},
	{
		id: "course8",
		title: "Information Security Basics",
		description: "Learn to identify phishing attempts, secure passwords, clean desk policies, and general info security standards.",
		category: "Mandatory",
		duration: 1,
		progress: 0,
		status: "Not Started",
	},
];

const initialJobListings: JobListing[] = [
	{
		id: "job1",
		title: "Software Engineer (React)",
		department: "Engineering",
		location: "Bangalore, India",
		type: "Full-time",
		postedDate: "2026-06-15",
		applicantCount: 12,
		description: "Looking for an experienced React Engineer to build modular visual design systems and mobile-first hybrid dashboard components.",
	},
	{
		id: "job2",
		title: "HR Operations Specialist",
		department: "HR",
		location: "Jaipur, India",
		type: "Full-time",
		postedDate: "2026-06-18",
		applicantCount: 4,
		description: "Coordinate pre-joining onboarding verification flows and design training learning course catalog metrics.",
	},
	{
		id: "job3",
		title: "Backend Engineer (Node.js)",
		department: "Engineering",
		location: "Remote, India",
		type: "Full-time",
		postedDate: "2026-06-20",
		applicantCount: 8,
		description: "Build robust modular monolithic APIs, secure middleware filters, and database schemas with proper indexing.",
	},
	{
		id: "job4",
		title: "UI/UX Designer",
		department: "Product Design",
		location: "Bangalore, India",
		type: "Contract",
		postedDate: "2026-06-22",
		applicantCount: 6,
		description: "Iterate on mobile design layouts, glassmorphism aesthetics, color palettes, and interactive transitions.",
	},
];

const initialCandidates: Candidate[] = [
	{
		id: "cand1",
		name: "Amit Verma",
		role: "Software Engineer (React)",
		experience: "4 Years",
		stage: "Screening",
		notes: "Solid React background. Knowledge of Redux. Needs technical screening task.",
	},
	{
		id: "cand2",
		name: "Neha Singh",
		role: "UI/UX Designer",
		experience: "3 Years",
		stage: "Interview",
		notes: "Great portfolio. Clear communication. Interview scheduled for tomorrow 2 PM.",
	},
	{
		id: "cand3",
		name: "Rajesh Kumar",
		role: "Backend Engineer (Node.js)",
		experience: "5 Years",
		stage: "Offer",
		notes: "Passed technical round with top score. Offer letter drafted and under review.",
	},
	{
		id: "cand4",
		name: "Priya Sharma",
		role: "HR Operations Specialist",
		experience: "2 Years",
		stage: "Hired",
		notes: "Joined today! Onboarding tasks assigned.",
	},
	{
		id: "cand5",
		name: "Vikram Aditya",
		role: "Software Engineer (React)",
		experience: "6 Years",
		stage: "Screening",
		notes: "Experienced with Next.js and TypeScript. Reviewing resume.",
	},
	{
		id: "cand6",
		name: "Pooja Patel",
		role: "Backend Engineer (Node.js)",
		experience: "3.5 Years",
		stage: "Interview",
		notes: "Good systems design overview. Practical coding interview scheduled.",
	},
];

const initialRecognitions: RecognitionItem[] = [
	{
		id: "rec1",
		fromName: "HR Specialist",
		toName: "Michael",
		badge: "Innovation",
		message: "Incredible work refactoring the build configuration and speeding up static pages generation!",
		date: "2026-06-18",
		points: 100,
	},
	{
		id: "rec2",
		fromName: "Admin",
		toName: "Sarah",
		badge: "Above & Beyond",
		message: "Thanks for staying late to help verify the server-side deployment files. Truly went above and beyond!",
		date: "2026-06-19",
		points: 100,
	},
	{
		id: "rec3",
		fromName: "Michael",
		toName: "Sarah",
		badge: "Leadership",
		message: "Great leadership in setting up the frontend repository guidelines and design identity cards.",
		date: "2026-06-22",
		points: 100,
	},
	{
		id: "rec4",
		fromName: "Sarah",
		toName: "Admin",
		badge: "Above & Beyond",
		message: "Exceptional assistance in debugging a critical type error in our global state slice. Lifesaver!",
		date: "2026-06-23",
		points: 100,
	},
	{
		id: "rec5",
		fromName: "Admin",
		toName: "Michael",
		badge: "Customer First",
		message: "Fabulous coordination on customer feedback calls. Addressed all layout tickets proactively.",
		date: "2026-06-24",
		points: 100,
	},
	{
		id: "rec6",
		fromName: "Michael",
		toName: "Sarah",
		badge: "Team Player",
		message: "Phenomenal teammate! Always ready to jump in and code refactors together. Keep it up!",
		date: "2026-06-24",
		points: 100,
	},
	{
		id: "rec7",
		fromName: "Sarah",
		toName: "Alex",
		badge: "Innovation",
		message: "Awesome proposal on optimizing candidate pipeline boards inside HRMS dashboard.",
		date: "2026-06-25",
		points: 100,
	},
	{
		id: "rec8",
		fromName: "Sarah",
		toName: "HR Specialist",
		badge: "Customer First",
		message: "Sarah resolved the deployment issues for our clients instantly this morning. Great job!",
		date: "2026-06-25",
		points: 100,
	},
];

const initialAnnouncements: AnnouncementItem[] = [
	{
		id: "ann1",
		title: "Q2 Performance Appraisal Cycle Launch",
		category: "Policy",
		priority: "High",
		message: "The Q2 appraisal self-assessment cycle is now live in the system. Please align with your respective team leads to record key performance index goals, complete KR sliders, and sign off by July 5, 2026.",
		postedBy: "HR Specialist",
		postedDate: "2026-06-24",
		isRead: false,
		acknowledgedAt: null,
	},
	{
		id: "ann2",
		title: "Revised Hybrid Working Leave Accrual policy",
		category: "Policy",
		priority: "High",
		message: "Effective July 1, casual leave balances will be accrued on a pro-rata monthly rate of 1.5 days instead of upfront allocation, helping managers schedule coverage for key production deployments more reliably.",
		postedBy: "HR Specialist",
		postedDate: "2026-06-25",
		isRead: false,
		acknowledgedAt: null,
	},
	{
		id: "ann3",
		title: "Diwali Festivities & Holidays Notice",
		category: "Holiday",
		priority: "Medium",
		message: "WorkFlow office hubs across India will remain officially closed on November 11 and November 12, 2026, for Diwali celebrations. We wish you and your families a joyous, safe, and happy festival of lights!",
		postedBy: "Admin",
		postedDate: "2026-06-25",
		isRead: true,
		acknowledgedAt: null,
	},
	{
		id: "ann4",
		title: "Upcoming Office Relocation",
		category: "General",
		priority: "Medium",
		message: "Our team is shifting to our spacious new office in Tech Square, Block B on July 15. More information on seat allocation, IT desk setups, and VPN network guidelines will follow in a separate document.",
		postedBy: "Admin",
		postedDate: "2026-06-22",
		isRead: true,
		acknowledgedAt: null,
	},
	{
		id: "ann5",
		title: "Leadership town hall sync",
		category: "Event",
		priority: "Low",
		message: "Join us for our monthly virtual town hall sync this Friday at 4:00 PM IST. We will review our product roadmap accomplishments, onboarding milestones, and introduce our new joiners.",
		postedBy: "Admin",
		postedDate: "2026-06-25",
		isRead: false,
		acknowledgedAt: null,
	},
];

const initialTeamMembers: TeamMember[] = [
	{
		id: "mem1",
		name: "Sarah",
		designation: "Software Engineer",
		department: "Engineering",
		email: "sarah@workflow.com",
		phone: "+1 202 555 0143",
		manager: "Michael",
		joiningDate: "2024-05-15",
		status: "Active",
	},
	{
		id: "mem2",
		name: "Michael",
		designation: "Engineering Lead",
		department: "Engineering",
		email: "michael@workflow.com",
		phone: "+1 202 555 0172",
		manager: "Admin",
		joiningDate: "2023-02-10",
		status: "Active",
	},
	{
		id: "mem3",
		name: "HR Specialist",
		designation: "HR Lead",
		department: "HR",
		email: "hr@workflow.com",
		phone: "+1 202 555 0195",
		manager: "Admin",
		joiningDate: "2024-01-20",
		status: "Active",
	},
	{
		id: "mem4",
		name: "Admin",
		designation: "System Administrator",
		department: "Operations",
		email: "admin@workflow.com",
		phone: "+1 202 555 0111",
		manager: "Board of Directors",
		joiningDate: "2022-06-01",
		status: "Active",
	},
	{
		id: "mem5",
		name: "Alex",
		designation: "Associate Software Engineer",
		department: "Engineering",
		email: "alex@workflow.com",
		phone: "+1 202 555 0188",
		manager: "Michael",
		joiningDate: "2026-06-25",
		status: "Active",
	},
];


export const useHrmsStore = create<HrmsState>()(
	persist(
		(set) => ({
			persona: "Sarah",
			role: "Employee",
			setRole: (role) => set({ role }),
			setPersona: (persona) =>
				set((state) => {
					let newRole: HrmsState["role"] = "Employee";
					let onboarding = true;
					let profile = { ...state.salaryProfile };

					if (persona === "Sarah") {
						newRole = "Employee";
						onboarding = true;
						profile = {
							employeeName: "Sarah",
							designation: "Software Engineer",
							department: "Engineering",
							basicPay: 35000,
							specialAllowance: 8000,
							lta: 3000,
						};
					} else if (persona === "Alex") {
						newRole = "Employee";
						onboarding = false;
						profile = {
							employeeName: "Alex",
							designation: "Associate Software Engineer",
							department: "Engineering",
							basicPay: 25000,
							specialAllowance: 5000,
							lta: 2000,
						};
					} else if (persona === "Michael") {
						newRole = "Manager";
						onboarding = true;
						profile = {
							employeeName: "Michael",
							designation: "Engineering Lead",
							department: "Engineering",
							basicPay: 60000,
							specialAllowance: 15000,
							lta: 5000,
						};
					} else if (persona === "HR Specialist") {
						newRole = "HR";
						onboarding = true;
						profile = {
							employeeName: "HR Specialist",
							designation: "HR Lead",
							department: "HR",
							basicPay: 45000,
							specialAllowance: 10000,
							lta: 4000,
						};
					} else if (persona === "Admin") {
						newRole = "Admin";
						onboarding = true;
						profile = {
							employeeName: "Admin",
							designation: "System Administrator",
							department: "Operations",
							basicPay: 55000,
							specialAllowance: 12000,
							lta: 4500,
						};
					}

					return {
						persona,
						role: newRole,
						onboardingComplete: onboarding,
						salaryProfile: profile,
					};
				}),

			// Attendance
			clockedIn: false,
			clockInTime: null,
			weeklyRecords: initialWeeklyRecords,
			clockIn: () =>
				set((state) => {
					const now = new Date();
					const isoString = now.toISOString();
					const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
					
					const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
					const status = isLate ? "Late" : "Present";

					const updatedRecords = state.weeklyRecords.map((rec) => {
						if (rec.day === "Thursday") {
							return {
								...rec,
								clockIn: timeString,
								status: status as any,
								breakHours: 1.0,
							};
						}
						return rec;
					});

					return {
						clockedIn: true,
						clockInTime: isoString,
						weeklyRecords: updatedRecords,
					};
				}),

			clockOut: () =>
				set((state) => {
					if (!state.clockInTime) return {};
					const now = new Date();
					const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
					
					const diffMs = now.getTime() - new Date(state.clockInTime).getTime();
					const totalHours = diffMs / (1000 * 60 * 60);
					const productive = Math.max(0, parseFloat((totalHours - 1.0).toFixed(2)));
					const overtime = Math.max(0, parseFloat((productive - 8.0).toFixed(2)));

					const updatedRecords = state.weeklyRecords.map((rec) => {
						if (rec.day === "Thursday") {
							return {
								...rec,
								clockOut: timeString,
								productiveHours: productive,
								overtimeHours: overtime,
							};
						}
						return rec;
					});

					return {
						clockedIn: false,
						clockInTime: null,
						weeklyRecords: updatedRecords,
					};
				}),

			// Leave Balances initial state
			leaveBalances: {
				casual: 12,
				sick: 12,
				earned: 18,
				compOff: 0,
			},
			leaveRequests: initialLeaveRequests,

			applyLeave: (type, startDate, endDate, reason) =>
				set((state) => {
					const newRequest: LeaveRequest = {
						id: "req_" + Math.random().toString(36).substring(2, 11),
						employeeName: state.salaryProfile.employeeName,
						type,
						startDate,
						endDate,
						reason,
						status: "Pending",
						appliedDate: new Date().toISOString().split("T")[0],
					};
					return {
						leaveRequests: [newRequest, ...state.leaveRequests],
					};
				}),

			updateLeaveRequestStatus: (id, status) =>
				set((state) => {
					const request = state.leaveRequests.find((r) => r.id === id);
					if (!request) return {};

					let updatedBalances = { ...state.leaveBalances };
					if (status === "Approved" && request.status !== "Approved") {
						const start = new Date(request.startDate);
						const end = new Date(request.endDate);
						const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

						if (request.type === "Casual Leave") {
							updatedBalances.casual = Math.max(0, updatedBalances.casual - days);
						} else if (request.type === "Sick Leave") {
							updatedBalances.sick = Math.max(0, updatedBalances.sick - days);
						} else if (request.type === "Earned Leave") {
							updatedBalances.earned = Math.max(0, updatedBalances.earned - days);
						} else if (request.type === "Comp-off") {
							updatedBalances.compOff = Math.max(0, updatedBalances.compOff - days);
						}
					}

					const updatedRequests = state.leaveRequests.map((r) => {
						if (r.id === id) {
							return { ...r, status };
						}
						return r;
					});

					return {
						leaveRequests: updatedRequests,
						leaveBalances: updatedBalances,
					};
				}),

			// Hardcoded employee salary profile (India standard)
			salaryProfile: {
				employeeName: "Sarah",
				designation: "Software Engineer",
				department: "Engineering",
				basicPay: 35000,
				specialAllowance: 8000,
				lta: 3000,
			},

			// Expense state
			expenseRequests: initialExpenseRequests,
			addExpenseRequest: (category, amount, date, description, receiptAttached) =>
				set((state) => {
					const newExpense: ExpenseRequest = {
						id: "exp_" + Math.random().toString(36).substring(2, 11),
						employeeName: state.salaryProfile.employeeName,
						category,
						amount,
						date,
						description,
						receiptAttached,
						status: "Pending",
						appliedDate: new Date().toISOString().split("T")[0],
					};
					return {
						expenseRequests: [newExpense, ...state.expenseRequests],
					};
				}),
			updateExpenseStatus: (id, status) =>
				set((state) => {
					const updatedExpenses = state.expenseRequests.map((exp) => {
						if (exp.id === id) {
							return { ...exp, status };
						}
						return exp;
					});
					return {
						expenseRequests: updatedExpenses,
					};
				}),

			// Performance state
			objectives: initialObjectives,
			performanceReview: initialPerformanceReview,
			updateKRProgress: (objectiveId, krId, progress) =>
				set((state) => {
					const updatedObjectives = state.objectives.map((obj) => {
						if (obj.id === objectiveId) {
							const updatedKRs = obj.keyResults.map((kr) => {
								if (kr.id === krId) {
									let val = Math.round((kr.targetValue * (progress / 100)) * 10) / 10;
									if (kr.targetValue === 800) {
										val = Math.round((1000 - (200 * (progress / 100))) * 10) / 10;
									}
									return {
										...kr,
										progress: Math.min(100, Math.max(0, progress)),
										currentValue: val,
									};
								}
								return kr;
							});
							return { ...obj, keyResults: updatedKRs };
						}
						return obj;
					});
					return {
						objectives: updatedObjectives,
					};
				}),

			// Onboarding initial state
			onboardingComplete: true, // Sarah is standard employee, complete onboarding by default.
			onboardingTasks: initialOnboardingTasks,

			completeOnboarding: () =>
				set({
					onboardingComplete: true,
				}),

			toggleOnboardingTask: (id) =>
				set((state) => {
					const updatedTasks = state.onboardingTasks.map((t) => {
						if (t.id === id) {
							return { ...t, completed: !t.completed };
						}
						return t;
					});
					return {
						onboardingTasks: updatedTasks,
					};
				}),

			// Documents Phase 8 State Implementation
			documents: initialDocuments,
			addDocument: (name, category, fileType) =>
				set((state) => {
					const newDoc: DocumentItem = {
						id: "doc_" + Math.random().toString(36).substring(2, 11),
						name,
						category,
						fileType,
						uploadDate: new Date().toISOString().split("T")[0],
						uploadedBy: state.salaryProfile.employeeName,
					};
					return {
						documents: [newDoc, ...state.documents],
					};
				}),

			// Training Phase 9 State Implementation
			courses: initialCourses,
			updateCourseProgress: (id) =>
				set((state) => {
					const updatedCourses = state.courses.map((course) => {
						if (course.id === id) {
							const newProgress = Math.min(100, course.progress + 20);
							const newStatus: CourseItem["status"] =
								newProgress === 100
									? "Completed"
									: newProgress > 0
									? "In Progress"
									: "Not Started";
							return {
								...course,
								progress: newProgress,
								status: newStatus,
							};
						}
						return course;
					});
					return {
						courses: updatedCourses,
					};
				}),

			// Recruitment Phase 10 State Implementation
			jobListings: initialJobListings,
			candidates: initialCandidates,
			addJobListing: (title, department, location, type, description) =>
				set((state) => {
					const newJob: JobListing = {
						id: "job_" + Math.random().toString(36).substring(2, 11),
						title,
						department,
						location,
						type,
						postedDate: new Date().toISOString().split("T")[0],
						applicantCount: 0,
						description,
					};
					return {
						jobListings: [newJob, ...state.jobListings],
					};
				}),
			moveCandidateStage: (id, newStage) =>
				set((state) => {
					const updatedCandidates = state.candidates.map((cand) => {
						if (cand.id === id) {
							return {
								...cand,
								stage: newStage,
							};
						}
						return cand;
					});
					return {
						candidates: updatedCandidates,
					};
				}),
			updateCandidateNotes: (id, notes) =>
				set((state) => {
					const updatedCandidates = state.candidates.map((cand) => {
						if (cand.id === id) {
							return {
								...cand,
								notes,
							};
						}
						return cand;
					});
					return {
						candidates: updatedCandidates,
					};
				}),

			// Recognition Phase 11 State Implementation
			recognitions: initialRecognitions,
			addRecognition: (toName, badge, message) =>
				set((state) => {
					const newRecognition: RecognitionItem = {
						id: "rec_" + Math.random().toString(36).substring(2, 11),
						fromName: state.salaryProfile.employeeName,
						toName,
						badge,
						message,
						date: new Date().toISOString().split("T")[0],
						points: 100,
					};
					return {
						recognitions: [newRecognition, ...state.recognitions],
					};
				}),

			// Announcements Phase 12 State Implementation
			announcements: initialAnnouncements,
			markAnnouncementRead: (id) =>
				set((state) => {
					const updated = state.announcements.map((ann) => {
						if (ann.id === id) {
							return { ...ann, isRead: true };
						}
						return ann;
					});
					return { announcements: updated };
				}),
			acknowledgeAnnouncement: (id) =>
				set((state) => {
					const updated = state.announcements.map((ann) => {
						if (ann.id === id) {
							const now = new Date();
							const timestamp = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
							return { ...ann, isRead: true, acknowledgedAt: timestamp };
						}
						return ann;
					});
					return { announcements: updated };
				}),
			addAnnouncement: (title, category, priority, message) =>
				set((state) => {
					const newAnn: AnnouncementItem = {
						id: "ann_" + Math.random().toString(36).substring(2, 11),
						title,
						category,
						priority,
						message,
						postedBy: state.role === "HR" ? "HR Specialist" : "Admin",
						postedDate: new Date().toISOString().split("T")[0],
						isRead: false,
						acknowledgedAt: null,
					};
					return {
						announcements: [newAnn, ...state.announcements],
					};
				}),

			// Team Management Phase 13 State Implementation
			teamMembers: initialTeamMembers,
			addTeamMember: (name, designation, department, email, joiningDate) =>
				set((state) => {
					const newMember: TeamMember = {
						id: "mem_" + Math.random().toString(36).substring(2, 11),
						name,
						designation,
						department,
						email,
						phone: "+1 202 555 0" + Math.floor(1000 + Math.random() * 9000).toString(),
						manager: "Michael",
						joiningDate,
						status: "Active",
					};
					return {
						teamMembers: [...state.teamMembers, newMember],
					};
				}),
		}),
		{
			name: "workflow-role-storage-v2",
		}
	)
);

