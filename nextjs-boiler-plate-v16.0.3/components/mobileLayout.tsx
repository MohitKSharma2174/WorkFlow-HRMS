import React, { useState, useEffect } from "react";
import { useHrmsStore } from "../stores/hrmsStore";
import { Icons } from "./Icons";
import { HomeScreen } from "./screens/HomeScreen";
import { AttendanceScreen } from "./screens/AttendanceScreen";
import { LeaveScreen } from "./screens/LeaveScreen";
import { ApprovalsScreen } from "./screens/ApprovalsScreen";
import { PayrollScreen } from "./screens/PayrollScreen";
import { ExpensesScreen } from "./screens/ExpensesScreen";
import { PerformanceScreen } from "./screens/PerformanceScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { DocumentsScreen } from "./screens/DocumentsScreen";
import { TrainingScreen } from "./screens/TrainingScreen";
import { RecruitmentScreen } from "./screens/RecruitmentScreen";
import { RecognitionScreen } from "./screens/RecognitionScreen";
import { AnnouncementsScreen } from "./screens/AnnouncementsScreen";
import { TeamScreen } from "./screens/TeamScreen";
import { AnalyticsScreen } from "./screens/AnalyticsScreen";
import { CopilotScreen } from "./screens/CopilotScreen";

export function MobileLayout() {
	const { role, setRole, onboardingComplete, persona, setPersona } = useHrmsStore();
	const [activeTab, setActiveTab] = useState("Home");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Auto-route new employees to Onboarding if not complete
	useEffect(() => {
		if (role === "Employee" && !onboardingComplete) {
			setActiveTab("Onboarding");
		}
	}, [role, onboardingComplete]);

	// Reset to Home tab if the role switches and the tab doesn't exist for the new role
	useEffect(() => {
		const allowedTabs = getTabsForRole(role).map((t) => t.label);
		if (!allowedTabs.includes(activeTab)) {
			setActiveTab("Home");
		}
	}, [role, activeTab, onboardingComplete]);

	// Define which tabs are visible for which roles
	function getTabsForRole(currentRole: typeof role) {
		switch (currentRole) {
			case "Employee": {
				const baseTabs = [
					{ label: "Home", icon: Icons.Home },
					{ label: "Attendance", icon: Icons.Clock },
					{ label: "Leave", icon: Icons.Finance },
					{ label: "Payroll", icon: Icons.Talent },
					{ label: "Expenses", icon: Icons.Finance },
					{ label: "Performance", icon: Icons.Talent },
					{ label: "Training", icon: Icons.Academic },
					{ label: "Recognition", icon: Icons.Medal },
					{ label: "Copilot", icon: Icons.Copilot },
					{ label: "Notices", icon: Icons.Bell },
					{ label: "Analytics", icon: Icons.Chart },
					{ label: "Documents", icon: Icons.Document }
				];
				if (!onboardingComplete) {
					baseTabs.splice(1, 0, { label: "Onboarding", icon: Icons.Talent });
				}
				return baseTabs;
			}
			case "Manager":
				return [
					{ label: "Home", icon: Icons.Home },
					{ label: "Attendance", icon: Icons.Clock },
					{ label: "Performance", icon: Icons.Talent },
					{ label: "Training", icon: Icons.Academic },
					{ label: "Recognition", icon: Icons.Medal },
					{ label: "Directory", icon: Icons.Talent },
					{ label: "Approvals", icon: Icons.Operations },
					{ label: "Copilot", icon: Icons.Copilot },
					{ label: "Notices", icon: Icons.Bell },
					{ label: "Analytics", icon: Icons.Chart },
					{ label: "Documents", icon: Icons.Document }
				];
			case "HR":
				return [
					{ label: "Home", icon: Icons.Home },
					{ label: "Directory", icon: Icons.Talent },
					{ label: "Recruitment", icon: Icons.Operations },
					{ label: "Training", icon: Icons.Academic },
					{ label: "Recognition", icon: Icons.Medal },
					{ label: "Approvals", icon: Icons.Operations },
					{ label: "Copilot", icon: Icons.Copilot },
					{ label: "Notices", icon: Icons.Bell },
					{ label: "Analytics", icon: Icons.Chart },
					{ label: "Documents", icon: Icons.Document }
				];
			case "Admin":
				return [
					{ label: "Home", icon: Icons.Home },
					{ label: "Approvals", icon: Icons.Operations },
					{ label: "Recruitment", icon: Icons.Talent },
					{ label: "Training", icon: Icons.Academic },
					{ label: "Recognition", icon: Icons.Medal },
					{ label: "Directory", icon: Icons.Talent },
					{ label: "Settings", icon: Icons.Finance },
					{ label: "Copilot", icon: Icons.Copilot },
					{ label: "Notices", icon: Icons.Bell },
					{ label: "Analytics", icon: Icons.Chart },
					{ label: "Documents", icon: Icons.Document }
				];
			default:
				return [{ label: "Home", icon: Icons.Home }];
		}
	}

	const tabs = getTabsForRole(role);

	const renderContent = () => {
		if (activeTab === "Home") {
			return <HomeScreen setActiveTab={setActiveTab} />;
		}
		if (activeTab === "Onboarding") {
			return <OnboardingScreen setActiveTab={setActiveTab} />;
		}
		if (activeTab === "Attendance") {
			return <AttendanceScreen />;
		}
		if (activeTab === "Leave") {
			return <LeaveScreen />;
		}
		if (activeTab === "Approvals") {
			return <ApprovalsScreen />;
		}
		if (activeTab === "Payroll") {
			return <PayrollScreen />;
		}
		if (activeTab === "Expenses") {
			return <ExpensesScreen />;
		}
		if (activeTab === "Performance") {
			return <PerformanceScreen />;
		}
		if (activeTab === "Documents") {
			return <DocumentsScreen />;
		}
		if (activeTab === "Training") {
			return <TrainingScreen />;
		}
		if (activeTab === "Recruitment") {
			return <RecruitmentScreen />;
		}
		if (activeTab === "Recognition") {
			return <RecognitionScreen />;
		}
		if (activeTab === "Notices") {
			return <AnnouncementsScreen />;
		}
		if (activeTab === "Directory") {
			return <TeamScreen />;
		}
		if (activeTab === "Analytics") {
			return <AnalyticsScreen />;
		}
		if (activeTab === "Copilot") {
			return <CopilotScreen />;
		}

		// Placeholder view for other tabs in Phase 1
		return (
			<div className="glass rounded-2xl p-6 text-center card-shadow border border-slate-100 dark:border-slate-800/80 bg-white/20 dark:bg-slate-900/10 space-y-4 animate-slideup min-h-[300px] flex flex-col justify-center items-center">
				<div className="w-16 h-16 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center mb-2">
					<Icons.Info className="w-8 h-8" />
				</div>
				<h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
					{activeTab} Module
				</h3>
				<p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
					This dashboard widget represents a prototype placeholder. Full operational capability will be deployed in Phase 2.
				</p>
				<span className="text-[10px] font-bold text-orange-brand uppercase bg-orange-light px-2.5 py-1 rounded-full">
					Phase 2 Development
				</span>
			</div>
		);
	};

	if (!mounted) {
		return (
			<div className="min-h-screen bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center py-0 sm:py-8 font-sans">
				<div className="w-full max-w-md bg-white dark:bg-[#070b13] min-h-screen sm:min-h-[800px] sm:max-h-[850px] sm:rounded-[36px] shadow-2xl relative flex flex-col border border-slate-200 dark:border-slate-800/80 overflow-hidden sm:ring-8 sm:ring-slate-900/10 items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-brand" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center py-0 sm:py-8 font-sans">
			{/* Mobile device frame shell container */}
			<div className="w-full max-w-md bg-white dark:bg-[#070b13] min-h-screen sm:min-h-[800px] sm:max-h-[850px] sm:rounded-[36px] shadow-2xl relative flex flex-col border border-slate-200 dark:border-slate-800/80 overflow-hidden sm:ring-8 sm:ring-slate-900/10">
				
				{/* Fixed Top Header */}
				<header className="absolute top-0 inset-x-0 h-16 bg-white/70 dark:bg-[#070b13]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between px-4 z-40">
					{/* Brand Name */}
					<div className="flex items-center gap-1.5">
						<div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-orange-500 flex items-center justify-center shadow-md">
							<span className="text-white font-extrabold text-xs">W</span>
						</div>
						<span className="font-extrabold text-sm tracking-tight text-slate-800 dark:text-white">
							Work<span className="text-orange-brand">Flow</span>
						</span>
					</div>

					{/* Switcher Dropdown */}
					<div className="flex items-center gap-3">
						{/* Persona Switcher */}
						<select
							value={persona}
							onChange={(e) => setPersona(e.target.value as any)}
							className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-teal-brand dark:text-teal-400 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand cursor-pointer"
						>
							<option value="Sarah">Sarah (Employee)</option>
							<option value="Michael">Michael (Manager)</option>
							<option value="HR Specialist">HR Specialist</option>
							<option value="Admin">Admin</option>
							<option value="Alex">Alex (New Joiner)</option>
						</select>

						{/* Mock profile avatar bubble */}
						<div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0">
							<img
								src={
									persona === "Sarah"
										? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
										: persona === "Michael"
										? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
										: persona === "HR Specialist"
										? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
										: persona === "Admin"
										? "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
										: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
								}
								alt="Avatar"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				</header>

				{/* Main Content Area */}
				<main className="flex-1 overflow-y-auto px-4 pt-20 pb-24 custom-scrollbar bg-slate-50/50 dark:bg-[#070b13]">
					{renderContent()}
				</main>

				{/* Fixed Dynamic Bottom Navigation Menu */}
				<nav className="absolute bottom-0 inset-x-0 h-20 bg-white/80 dark:bg-[#070b13]/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-start sm:justify-around gap-1.5 px-4 overflow-x-auto scrollbar-none z-40">
					{tabs.map((item) => {
						const Icon = item.icon;
						const isActive = activeTab === item.label;
						return (
							<button
								key={item.label}
								onClick={() => setActiveTab(item.label)}
								className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all shrink-0 cursor-pointer ${
									isActive
										? "text-teal-brand bg-teal-brand/5 font-extrabold"
										: "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
								}`}
							>
								<Icon className={`w-5 h-5 ${isActive ? "text-teal-brand scale-110" : ""}`} />
								<span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
							</button>
						);
					})}
				</nav>

			</div>
		</div>
	);
}
export default MobileLayout;
