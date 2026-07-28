import React, { useState } from "react";
import { useHrmsStore } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

interface OnboardingScreenProps {
	setActiveTab: (tab: string) => void;
}

export function OnboardingScreen({ setActiveTab }: OnboardingScreenProps) {
	const { onboardingTasks, toggleOnboardingTask, completeOnboarding } = useHrmsStore();
	const [activeSectionTab, setActiveSectionTab] = useState<"Pre-Joining" | "Day 1" | "Week 1" | "Month 1">("Pre-Joining");

	// Calculations
	const totalTasks = onboardingTasks.length;
	const completedTasks = onboardingTasks.filter((t) => t.completed).length;
	const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
	const allCompleted = totalTasks > 0 && completedTasks === totalTasks;

	// Mock employee details
	const employeeDetails = {
		name: "Alex",
		designation: "Associate Software Engineer",
		department: "Engineering",
		manager: "Michael",
		buddy: "Sarah",
		joiningDate: "June 25, 2026",
	};

	// Welcome messages mock data
	const welcomeMessages = [
		{
			id: "msg1",
			sender: "Admin",
			role: "System Administrator",
			avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
			message: "Welcome to WorkFlow, Alex! We're on a mission to build the world's most intuitive, employee-centric HR workspace. Your engineering contributions will be vital in shaping our next-generation portals. Thrilled to have you join our team!"
		},
		{
			id: "msg2",
			sender: "Michael",
			role: "Engineering Lead (Manager)",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
			message: "Welcome to the Engineering team, Alex! We are excited to work with you on our Next.js frontend architectures. Let's get you set up and sync up for our sprint planning session tomorrow. Happy coding!"
		},
		{
			id: "msg3",
			sender: "Sarah",
			role: "Software Engineer (Buddy)",
			avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
			message: "Hey Alex! Welcome aboard! I'm here to help you get your local dev environment running, guide you through our git workflow, and show you around the office. Feel free to ping me anytime, and let's grab coffee soon!"
		},
		{
			id: "msg4",
			sender: "HR Specialist",
			role: "HR Lead",
			avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
			message: "Welcome to WorkFlow, Alex! I'll be assisting you with your compliance documents, payroll verification, and benefit enrollments. Make sure to complete your checklist tasks so we can process your setup."
		}
	];

	// Team introduction mock data
	const teamIntroductions = [
		{
			id: "team1",
			name: "Sarah",
			role: "Software Engineer",
			expertise: "React, Next.js, Tailwind CSS",
			funFact: "Enjoys solving daily LeetCode challenges and has a soft spot for pixel art design.",
			avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
		},
		{
			id: "team2",
			name: "Michael",
			role: "Engineering Lead",
			expertise: "System Design, Microservices, Team Building",
			funFact: "Brewed his own craft coffee at home and named it '404 Roast Not Found'.",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
		},
		{
			id: "team3",
			name: "HR Specialist",
			role: "HR Lead",
			expertise: "Recruitment, Talent Management, Compliance",
			funFact: "Prefers sketching team structures on whiteboard walls rather than in digital charts.",
			avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
		}
	];

	// Filter tasks for the active checklist tab
	const filteredTasks = onboardingTasks.filter((t) => t.section === activeSectionTab);

	const handleComplete = () => {
		completeOnboarding();
		setActiveTab("Home");
	};

	return (
		<div className="space-y-6 animate-slideup p-1 pb-10">
			{/* Welcome Banner */}
			<div className="rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-5 text-white card-shadow relative overflow-hidden">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<Icons.Talent className="w-44 h-44" />
				</div>
				
				<div className="relative z-10">
					<div className="flex justify-between items-start">
						<span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
							Onboarding Portal
						</span>
						<span className="text-[10px] text-teal-100 font-semibold bg-teal-800/40 px-2.5 py-0.5 rounded-full border border-teal-500/20">
							Joining Date: {employeeDetails.joiningDate}
						</span>
					</div>

					<div className="mt-4 flex gap-4 items-center">
						<div className="w-14 h-14 rounded-full border-2 border-orange-brand/80 overflow-hidden shrink-0 bg-white/10 flex items-center justify-center text-xl font-bold text-orange-400">
							MS
						</div>
						<div>
							<h2 className="text-xl font-extrabold tracking-tight">{employeeDetails.name}</h2>
							<p className="text-teal-100 text-xs font-medium">
								{employeeDetails.designation} &bull; {employeeDetails.department}
							</p>
						</div>
					</div>

					<div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
						<div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl backdrop-blur-xs">
							<span className="text-teal-200">Manager:</span>
							<span className="font-bold text-white text-[11px] truncate">{employeeDetails.manager}</span>
						</div>
						<div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl backdrop-blur-xs">
							<span className="text-teal-200">Buddy:</span>
							<span className="font-bold text-white text-[11px] truncate">{employeeDetails.buddy}</span>
						</div>
					</div>

					{/* Overall Progress Meter */}
					<div className="mt-5 pt-3 border-t border-white/5">
						<div className="flex justify-between items-center text-xs mb-1.5">
							<span className="text-teal-100 font-bold">Onboarding Completion</span>
							<span className="font-extrabold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-500/10">
								{progressPercentage}%
							</span>
						</div>
						<div className="h-3 w-full bg-teal-950/40 rounded-full overflow-hidden p-0.5 border border-white/5">
							<div
								style={{ width: `${progressPercentage}%` }}
								className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-700 ease-out"
							/>
						</div>
						<p className="text-[10px] text-teal-200/80 mt-1.5">
							{completedTasks} of {totalTasks} tasks completed
						</p>
					</div>
				</div>
			</div>

			{/* Complete Onboarding Button (conditional) */}
			{allCompleted && (
				<div className="animate-bounce">
					<button
						onClick={handleComplete}
						className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-teal-600 text-white py-4 px-6 rounded-2xl font-extrabold text-sm card-shadow-orange hover:shadow-xl transition-all duration-300 transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer border border-orange-400/20"
					>
						<Icons.Check className="w-5 h-5 animate-pulse" />
						Complete Onboarding &amp; Enter Dashboard
					</button>
				</div>
			)}

			{/* Task Checklist Section */}
			<div className="glass rounded-2xl p-4 card-shadow border border-slate-100 dark:border-slate-800/80 space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
						<span className="w-2.5 h-2.5 bg-orange-brand rounded-full" />
						Onboarding Checklist
					</h3>
					<span className="text-[10px] bg-teal-light text-teal-brand font-bold px-2 py-0.5 rounded-md dark:bg-teal-950/30 dark:text-teal-400">
						{activeSectionTab}
					</span>
				</div>

				{/* Section Tab Buttons */}
				<div className="flex gap-1 bg-slate-100/80 dark:bg-slate-900/50 p-1 rounded-xl overflow-x-auto scrollbar-none">
					{(["Pre-Joining", "Day 1", "Week 1", "Month 1"] as const).map((section) => {
						const isSelected = activeSectionTab === section;
						const total = onboardingTasks.filter((t) => t.section === section).length;
						const done = onboardingTasks.filter((t) => t.section === section && t.completed).length;
						
						return (
							<button
								key={section}
								onClick={() => setActiveSectionTab(section)}
								className={`flex-1 text-center py-2 px-2.5 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
									isSelected
										? "bg-white dark:bg-[#070b13] text-teal-brand dark:text-teal-400 shadow-sm"
										: "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
								}`}
							>
								<div>{section}</div>
								<div className="text-[8px] opacity-75 font-normal mt-0.5">
									{done}/{total}
								</div>
							</button>
						);
					})}
				</div>

				{/* Tasks List */}
				<div className="space-y-3 min-h-[150px]">
					{filteredTasks.length === 0 ? (
						<div className="text-center py-8 text-slate-400 text-xs">
							No tasks in this section.
						</div>
					) : (
						filteredTasks.map((task) => {
							const priorityStyles =
								task.priority === "High"
									? "text-rose-600 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-900/50"
									: task.priority === "Medium"
									? "text-orange-600 bg-orange-50 border-orange-100 dark:text-orange-400 dark:bg-orange-950/30 dark:border-orange-900/50"
									: "text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-950/30 dark:border-blue-900/50";

							return (
								<div
									key={task.id}
									className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3 bg-slate-50/50 dark:bg-slate-900/10 ${
										task.completed
											? "border-teal-brand/10 dark:border-teal-brand/10 opacity-70"
											: "border-slate-100 dark:border-slate-800/80 hover:border-teal-brand/20 dark:hover:border-teal-brand/20"
									}`}
								>
									{/* Checkbox */}
									<button
										onClick={() => toggleOnboardingTask(task.id)}
										className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 cursor-pointer ${
											task.completed
												? "bg-teal-brand border-teal-brand text-white"
												: "border-slate-300 dark:border-slate-700 hover:border-teal-brand bg-white dark:bg-slate-950"
										}`}
									>
										{task.completed && (
											<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
												<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										)}
									</button>

									{/* Task Content */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between gap-2 flex-wrap">
											<h4
												className={`text-xs font-bold text-slate-800 dark:text-slate-200 break-words ${
													task.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
												}`}
											>
												{task.title}
											</h4>
											<span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${priorityStyles}`}>
												{task.priority}
											</span>
										</div>

										<p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
											{task.description}
										</p>

										<div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/40 text-[9px] text-slate-400 font-medium">
											<div className="flex items-center gap-1">
												<svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
												<span>Due: {task.dueDate}</span>
											</div>
											<div className="flex items-center gap-1">
												<span className="opacity-75">Assignee:</span>
												<span className="font-semibold text-slate-600 dark:text-slate-300">{task.assignee}</span>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* Welcome Messages Section */}
			<div className="glass rounded-2xl p-4 card-shadow border border-slate-100 dark:border-slate-800/80 space-y-3">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
					<span className="w-2.5 h-2.5 bg-teal-brand rounded-full" />
					Welcome Greetings
				</h3>
				<p className="text-[10px] text-slate-400">Swipe horizontally to read welcome messages from the team leads.</p>
				
				<div className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x scrollbar-none">
					{welcomeMessages.map((msg) => (
						<div
							key={msg.id}
							className="w-[280px] bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shrink-0 snap-center flex flex-col justify-between"
						>
							<div className="space-y-3">
								{/* Card header */}
								<div className="flex gap-3 items-center">
									<div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
										<img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
									</div>
									<div className="min-w-0">
										<h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{msg.sender}</h4>
										<p className="text-[9px] text-teal-brand dark:text-teal-400 font-semibold truncate">{msg.role}</p>
									</div>
								</div>

								{/* Message */}
								<p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white/40 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100/50 dark:border-slate-900/35">
									"{msg.message}"
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Team Introductions Section */}
			<div className="glass rounded-2xl p-4 card-shadow border border-slate-100 dark:border-slate-800/80 space-y-3">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
					<span className="w-2.5 h-2.5 bg-orange-brand rounded-full animate-pulse" />
					Meet the Team
				</h3>
				<p className="text-[10px] text-slate-400">Swipe horizontally to get to know your core engineering teammates.</p>

				<div className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x scrollbar-none">
					{teamIntroductions.map((member) => (
						<div
							key={member.id}
							className="w-[280px] bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shrink-0 snap-center space-y-4"
						>
							<div className="flex gap-3 items-center">
								<div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
									<img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
								</div>
								<div>
									<h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{member.name}</h4>
									<p className="text-[9px] text-slate-400 font-semibold">{member.role}</p>
								</div>
							</div>

							<div className="space-y-2">
								<div className="text-[10px]">
									<span className="text-slate-400 font-medium uppercase tracking-wider block text-[8px] mb-0.5">Core Expertise</span>
									<span className="text-slate-700 dark:text-slate-300 font-semibold bg-teal-50 dark:bg-teal-950/20 text-teal-brand dark:text-teal-400 px-2 py-0.5 rounded border border-teal-100 dark:border-teal-900/30">
										{member.expertise}
									</span>
								</div>
								
								<div className="text-[10px] bg-orange-light/40 dark:bg-orange-950/10 p-2.5 rounded-xl border border-orange-brand/10">
									<span className="text-orange-brand font-bold uppercase tracking-wider block text-[8px] mb-0.5">Fun Fact</span>
									<span className="text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
										"{member.funFact}"
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
