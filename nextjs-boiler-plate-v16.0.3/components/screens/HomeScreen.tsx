import React from "react";
import { useHrmsStore } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

interface HomeScreenProps {
	setActiveTab?: (tab: string) => void;
}

export function HomeScreen({ setActiveTab }: HomeScreenProps) {
	const {
		role,
		onboardingComplete,
		onboardingTasks,
		leaveBalances,
		clockedIn,
		leaveRequests,
		expenseRequests,
		announcements,
		salaryProfile
	} = useHrmsStore();

	const totalTasks = onboardingTasks.length;
	const completedTasks = onboardingTasks.filter((t) => t.completed).length;
	const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good Morning";
		if (hour < 17) return "Good Afternoon";
		return "Good Evening";
	};

	const getTodayString = () => {
		const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric", year: "numeric" };
		return new Date().toLocaleDateString("en-US", options);
	};

	const employeeName = salaryProfile?.employeeName || "Sarah";
	const greeting = getGreeting();
	const todayString = getTodayString();
	const attendanceStatus = clockedIn ? "Clocked In" : "Clocked Out";
	const casualLeave = leaveBalances?.casual ?? 0;
	const unreadNoticesCount = announcements?.filter((a) => !a.isRead).length ?? 0;
	const pendingApprovalsCount =
		(leaveRequests?.filter((r) => r.status === "Pending").length ?? 0) +
		(expenseRequests?.filter((r) => r.status === "Pending").length ?? 0);

	const renderQuickActions = () => {
		switch (role) {
			case "Employee":
				return (
					<>
						<button
							onClick={() => setActiveTab?.("Documents")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Document className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Documents Vault</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Contracts, IDs, tax forms</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Attendance")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Clock className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Clock In/Out</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Track daily working shifts</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Leave")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Finance className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Apply Leave</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Request time off & balances</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Payroll")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Talent className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Salary & Payroll</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">View slips & projections</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Copilot")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-orange-brand/20 dark:hover:border-orange-brand/20 hover:bg-orange-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group col-span-2"
						>
							<div className="p-2 rounded-lg bg-orange-brand/10 text-orange-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Copilot className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">AI HR Copilot</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Chat about your leaves, attendance, salary, goals, & more</p>
							</div>
						</button>
					</>
				);
			case "Manager":
				return (
					<>
						<button
							onClick={() => setActiveTab?.("Directory")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Talent className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Team Directory</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Browse team member profiles</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Approvals")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Operations className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Pending Reviews</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Approve leave & expense claims</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Performance")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group col-span-2"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Chart className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Performance & OKRs</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Review goals and progress metrics</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Copilot")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-orange-brand/20 dark:hover:border-orange-brand/20 hover:bg-orange-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group col-span-2"
						>
							<div className="p-2 rounded-lg bg-orange-brand/10 text-orange-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Copilot className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">AI HR Copilot</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Chat about team leaves, stats, & goals</p>
							</div>
						</button>
					</>
				);
			case "HR":
				return (
					<>
						<button
							onClick={() => setActiveTab?.("Recruitment")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Operations className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Recruitment</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Post jobs & candidate pipeline</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Directory")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Talent className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Org Directory</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Browse company profiles</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Approvals")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group col-span-2"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Operations className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Pending Reviews</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Review leaves and expenses</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Copilot")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-orange-brand/20 dark:hover:border-orange-brand/20 hover:bg-orange-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group col-span-2"
						>
							<div className="p-2 rounded-lg bg-orange-brand/10 text-orange-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Copilot className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">AI HR Copilot</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Conversational workspace helper chatbot</p>
							</div>
						</button>
					</>
				);
			case "Admin":
				return (
					<>
						<button
							onClick={() => setActiveTab?.("Directory")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Talent className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">System Directory</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Add and manage employees</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Approvals")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20 hover:bg-teal-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
						>
							<div className="p-2 rounded-lg bg-teal-brand/10 text-teal-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Operations className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">System Approvals</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Override leave/claim actions</p>
							</div>
						</button>

						<button
							onClick={() => setActiveTab?.("Copilot")}
							className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-orange-brand/20 dark:hover:border-orange-brand/20 hover:bg-orange-brand/5 transition-all text-left flex items-start gap-3.5 cursor-pointer group col-span-2"
						>
							<div className="p-2 rounded-lg bg-orange-brand/10 text-orange-brand shrink-0 group-hover:scale-110 transition-transform">
								<Icons.Copilot className="w-5 h-5" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">AI HR Copilot</h4>
								<p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Conversational workspace helper chatbot</p>
							</div>
						</button>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<div className="space-y-6 animate-slideup p-1">
			{/* Welcome Greeting Banner */}
			<div className="rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-6 text-white card-shadow relative overflow-hidden">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<Icons.Home className="w-40 h-40" />
				</div>
				<span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
					{todayString}
				</span>
				<h2 className="text-xl font-extrabold mt-3">{greeting}, {employeeName}!</h2>
				<p className="text-teal-100 text-[11px] mt-1 leading-relaxed">
					Welcome to your Global HRMS workspace. You are currently browsing the dashboard under the{" "}
					<span className="text-orange-400 font-bold underline">{role}</span> profile.
				</p>
			</div>

			{/* Onboarding Progress Alert Banner */}
			{role === "Employee" && !onboardingComplete && (
				<div className="glass p-5 rounded-2xl border border-orange-brand/20 dark:border-orange-brand/35 bg-orange-brand/5 dark:bg-orange-950/10 relative overflow-hidden card-shadow-orange space-y-4">
					<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 to-orange-400" />
					<div className="flex justify-between items-start pl-1">
						<div>
							<h3 className="text-xs font-extrabold text-orange-brand dark:text-orange-400 flex items-center gap-1.5 tracking-tight uppercase">
								<svg className="w-4 h-4 text-orange-brand shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
								Onboarding in Progress
							</h3>
							<p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium leading-normal">
								Complete your training, upload KYC documents, and sync with your team leads.
							</p>
						</div>
						<span className="text-xs font-extrabold text-orange-brand bg-orange-light px-2.5 py-0.5 rounded-full dark:bg-orange-950/45 dark:border dark:border-orange-500/10">
							{progressPercentage}%
						</span>
					</div>

					{/* Mini Progress Bar */}
					<div className="h-2 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-100 dark:border-slate-800">
						<div
							style={{ width: `${progressPercentage}%` }}
							className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
						/>
					</div>

					<button
						onClick={() => setActiveTab?.("Onboarding")}
						className="w-full bg-orange-brand hover:bg-orange-hover text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
					>
						Continue Onboarding Checklist
						<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
							<path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
					</button>
				</div>
			)}

			{/* Dynamic Stats Grid */}
			<div className={`grid gap-3 ${role === "Employee" ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
				<div className="glass p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1 bg-white/20 dark:bg-slate-900/10">
					<span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">Attendance</span>
					<span className={`text-xs font-black mt-1 block ${clockedIn ? "text-teal-brand" : "text-slate-500"}`}>{attendanceStatus}</span>
				</div>
				<div className="glass p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1 bg-white/20 dark:bg-slate-900/10">
					<span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">Casual Leave</span>
					<span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-1 block">{casualLeave} Days</span>
				</div>
				{role !== "Employee" && (
					<div className="glass p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1 bg-white/20 dark:bg-slate-900/10">
						<span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">Pending Reviews</span>
						<span className="text-xs font-black text-orange-brand mt-1 block">{pendingApprovalsCount} Items</span>
					</div>
				)}
				<div className="glass p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1 bg-white/20 dark:bg-slate-900/10">
					<span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">Unread Notices</span>
					<span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-1 block">{unreadNoticesCount} New</span>
				</div>
			</div>

			{/* Quick Actions Panel */}
			<div className="glass rounded-2xl p-5 card-shadow space-y-4 border border-slate-100 dark:border-slate-800/80">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
					<span className="w-2.5 h-2.5 bg-teal-brand rounded-full" />
					Quick Access Hub
				</h3>
				<div className="grid grid-cols-2 gap-3">
					{renderQuickActions()}
				</div>
			</div>

			{/* Design System Theme Test Palette Card */}
			<div className="glass rounded-2xl p-5 card-shadow space-y-4 border border-slate-100 dark:border-slate-800/80">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
					<span className="w-2.5 h-2.5 bg-orange-brand rounded-full animate-pulse" />
					Design System Identity Tokens
				</h3>
				<p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
					Checking visual synchronization of the Teal & Orange brand color tokens, shadows, and fonts in light/dark variants:
				</p>
				<div className="grid grid-cols-2 gap-3 pt-1 text-[11px] font-bold">
					<div className="p-3 bg-teal-brand text-white rounded-xl text-center shadow-md">
						Teal Brand Primary
					</div>
					<div className="p-3 bg-orange-brand text-white rounded-xl text-center shadow-md">
						Orange Brand Accent
					</div>
					<div className="p-3 border border-teal-brand/20 bg-teal-brand/5 text-teal-brand rounded-xl text-center">
						Teal Subtle Light
					</div>
					<div className="p-3 border border-orange-brand/20 bg-orange-brand/5 text-orange-brand rounded-xl text-center">
						Orange Subtle Light
					</div>
				</div>
			</div>
		</div>
	);
}
