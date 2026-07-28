import React from "react";
import { useHrmsStore } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function AnalyticsScreen() {
	const {
		role,
		weeklyRecords,
		leaveRequests,
		leaveBalances,
		expenseRequests,
		objectives,
		courses,
		teamMembers,
		candidates,
		clockedIn,
		salaryProfile
	} = useHrmsStore();

	// ==========================================
	// EMPLOYEE CALCULATIONS
	// ==========================================
	
	// 1. Attendance Rate (Mon-Fri)
	const workingDays = weeklyRecords.filter((r) => r.day !== "Saturday" && r.day !== "Sunday");
	const presentDaysCount = workingDays.filter(
		(r) => r.status === "Present" || r.status === "Late" || r.clockIn !== null
	).length;
	const empAttendanceRate = workingDays.length > 0 ? Math.round((presentDaysCount / workingDays.length) * 100) : 0;

	// 2. Leaves Taken vs Remaining Balance
	const myApprovedRequests = leaveRequests.filter((r) => r.employeeName === (salaryProfile?.employeeName || "Sarah") && r.status === "Approved");
	const leavesTaken = myApprovedRequests.reduce((sum, r) => {
		const start = new Date(r.startDate);
		const end = new Date(r.endDate);
		const diff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
		return sum + diff;
	}, 0);
	const remainingBalance = leaveBalances.casual + leaveBalances.sick + leaveBalances.earned + leaveBalances.compOff;
	const totalEntitled = leavesTaken + remainingBalance;
	const leaveUtilization = totalEntitled > 0 ? Math.round((leavesTaken / totalEntitled) * 100) : 0;

	// 3. Expense Claims Summary
	const myExpenses = expenseRequests.filter((r) => r.employeeName === (salaryProfile?.employeeName || "Sarah"));
	const myTotalSubmitted = myExpenses.reduce((sum, r) => sum + r.amount, 0);
	const myTotalApproved = myExpenses.filter((r) => r.status === "Approved").reduce((sum, r) => sum + r.amount, 0);
	const myTotalPending = myExpenses.filter((r) => r.status === "Pending").reduce((sum, r) => sum + r.amount, 0);

	// 4. OKR Completion (Average)
	const allKRs = objectives.flatMap((o) => o.keyResults);
	const okrCompletion = allKRs.length > 0 ? Math.round(allKRs.reduce((sum, kr) => sum + kr.progress, 0) / allKRs.length) : 0;

	// 5. Courses Completed
	const coursesCompleted = courses.filter((c) => c.progress === 100).length;
	const coursesTotal = courses.length;
	const coursesCompletionPct = coursesTotal > 0 ? Math.round((coursesCompleted / coursesTotal) * 100) : 0;


	// ==========================================
	// MANAGER CALCULATIONS
	// ==========================================

	// 1. Team Attendance Rate
	const activeMembersCount = teamMembers.filter((m) => m.status === "Active" || m.status === "Remote").length;
	const teamAttendanceRate = teamMembers.length > 0 ? Math.round((activeMembersCount / teamMembers.length) * 100) : 0;

	// 2. Team Leave Utilization (Staff currently on leave)
	const membersOnLeave = teamMembers.filter((m) => m.status === "On Leave").length;
	const teamOnLeavePct = teamMembers.length > 0 ? Math.round((membersOnLeave / teamMembers.length) * 100) : 0;

	// 3. Pending Approvals Count
	const pendingLeavesCount = leaveRequests.filter((r) => r.status === "Pending").length;
	const pendingExpensesCount = expenseRequests.filter((r) => r.status === "Pending").length;
	const totalPendingApprovals = pendingLeavesCount + pendingExpensesCount;

	// 4. Team OKR Average Progress
	const teamOkrAverage = okrCompletion; // shares objectives state


	// ==========================================
	// HR / ADMIN CALCULATIONS
	// ==========================================

	// 1. Total Headcount
	const totalHeadcount = teamMembers.length;

	// 2. Org-wide Attendance Rate
	const orgAttendanceRate = teamAttendanceRate;

	// 3. Total Leave Requests
	const totalLeaveRequestsCount = leaveRequests.length;

	// 4. Org Financial Claims (Expenses Submitted vs Approved)
	const orgTotalSubmitted = expenseRequests.reduce((sum, r) => sum + r.amount, 0);
	const orgTotalApproved = expenseRequests.filter((r) => r.status === "Approved").reduce((sum, r) => sum + r.amount, 0);
	const orgTotalPending = expenseRequests.filter((r) => r.status === "Pending").reduce((sum, r) => sum + r.amount, 0);

	// 5. Recruitment Pipeline stage breakdown
	const screenCandidatesCount = candidates.filter((c) => c.stage === "Screening").length;
	const interviewCandidatesCount = candidates.filter((c) => c.stage === "Interview").length;
	const offerCandidatesCount = candidates.filter((c) => c.stage === "Offer").length;
	const hiredCandidatesCount = candidates.filter((c) => c.stage === "Hired").length;
	const totalCandidatesCount = candidates.length;

	return (
		<div className="space-y-6 animate-slideup p-1 pb-20">
			
			{/* Overview Dashboard Banner */}
			<div className="rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 text-white card-shadow relative overflow-hidden flex items-center justify-between">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<Icons.Chart className="w-40 h-40" />
				</div>
				<div className="space-y-1">
					<span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
						Analytics & Reporting
					</span>
					<h3 className="text-lg font-extrabold text-slate-100 mt-2">Executive Workspace</h3>
					<p className="text-[10px] text-slate-400 leading-normal">
						Viewing analytics configured for the <span className="text-orange-brand font-bold uppercase">{role}</span> profile
					</p>
				</div>
			</div>

			{/* ==========================================
			    1. EMPLOYEE DASHBOARD VIEW
			   ========================================== */}
			{role === "Employee" && (
				<div className="space-y-6">
					
					{/* Stat metrics cards */}
					<div className="grid grid-cols-2 gap-3">
						
						{/* OKR Ring Card */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow flex flex-col justify-between space-y-4 items-center">
							<div className="text-center">
								<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">OKR Average</span>
								<span className="text-[8px] font-bold text-teal-brand uppercase block mt-0.5">Q2 Goal Cycle</span>
							</div>

							{/* Progress ring using custom CSS border segments */}
							<div className="relative w-20 h-20 rounded-full flex items-center justify-center border-4 border-slate-100 dark:border-slate-800">
								<div 
									className="absolute inset-0 rounded-full border-4 border-teal-brand/80 border-t-transparent border-r-transparent animate-spin-slow"
									style={{ transform: `rotate(${okrCompletion * 3.6}deg)` }}
								/>
								<span className="text-base font-black font-mono text-slate-800 dark:text-slate-200 z-10">{okrCompletion}%</span>
							</div>
						</div>

						{/* L&D Course Completed Card */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow flex flex-col justify-between space-y-4 items-center">
							<div className="text-center">
								<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">L&D Progress</span>
								<span className="text-[8px] font-bold text-orange-brand uppercase block mt-0.5">Courses Catalog</span>
							</div>

							<div className="relative w-20 h-20 rounded-full flex items-center justify-center border-4 border-slate-100 dark:border-slate-800">
								<div 
									className="absolute inset-0 rounded-full border-4 border-orange-brand/80 border-b-transparent border-l-transparent"
									style={{ transform: `rotate(${coursesCompletionPct * 3.6}deg)` }}
								/>
								<div className="text-center z-10">
									<span className="text-sm font-black font-mono text-slate-800 dark:text-slate-200 block">{coursesCompleted} / {coursesTotal}</span>
									<span className="text-[7.5px] font-black text-slate-400 block uppercase">Done</span>
								</div>
							</div>
						</div>
					</div>

					{/* Weekly Attendance Trend 7-Bar Chart */}
					<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4">
						<div className="flex justify-between items-start">
							<div className="space-y-0.5">
								<h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Attendance Log</h4>
								<p className="text-[10px] text-slate-400">Activity status of past 7 shifts</p>
							</div>
							<div className="text-right">
								<span className="text-sm font-bold text-teal-brand dark:text-teal-400 block">{empAttendanceRate}%</span>
								<span className="text-[8px] text-slate-400 uppercase font-bold block">Monthly rate</span>
							</div>
						</div>

						{/* Vertical columns bar graph */}
						<div className="flex justify-around items-end h-28 pt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
							{weeklyRecords.map((day) => {
								const isPresent = day.status === "Present" || day.status === "Late" || (day.day === "Thursday" && clockedIn);
								return (
									<div key={day.day} className="flex flex-col items-center gap-2 group w-8">
										{/* Value bar */}
										<div
											className={`w-3.5 rounded-t-md transition-all duration-500 ${
												isPresent
													? "bg-gradient-to-t from-teal-600 to-teal-400 h-16 shadow-xs"
													: "bg-slate-200 dark:bg-slate-800 h-2"
											}`}
										/>
										{/* Label */}
										<span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
											{day.day.slice(0, 3)}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* Leave Utilization Horizontal Bar Chart */}
					<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4">
						<div className="flex justify-between items-center text-xs">
							<h4 className="font-bold text-slate-850 dark:text-slate-200">Leave Balance Utilized</h4>
							<span className="font-mono text-teal-brand font-bold">{leavesTaken} / {totalEntitled} Days</span>
						</div>

						{/* Horizontal Progress Bar */}
						<div className="space-y-1">
							<div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-150 dark:border-slate-800/50">
								<div 
									className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-350"
									style={{ width: `${leaveUtilization}%` }}
								/>
							</div>
							<div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
								<span>Taken: {leavesTaken}d</span>
								<span>Utilization: {leaveUtilization}%</span>
								<span>Remaining: {remainingBalance}d</span>
							</div>
						</div>
					</div>

					{/* Expenses claims summary cards */}
					<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4">
						<div className="space-y-0.5">
							<h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Claims Summary</h4>
							<p className="text-[10px] text-slate-400">Total submitted expense reimbursement index</p>
						</div>

						<div className="grid grid-cols-3 gap-2">
							<div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 text-center">
								<span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider">Submitted</span>
								<span className="text-xs font-black text-slate-700 dark:text-slate-300 mt-1 block">₹{myTotalSubmitted}</span>
							</div>
							<div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 text-center">
								<span className="text-[8px] text-teal-500 block font-bold uppercase tracking-wider">Approved</span>
								<span className="text-xs font-black text-teal-600 dark:text-teal-400 mt-1 block">₹{myTotalApproved}</span>
							</div>
							<div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 text-center">
								<span className="text-[8px] text-orange-500 block font-bold uppercase tracking-wider">Pending</span>
								<span className="text-xs font-black text-orange-600 mt-1 block">₹{myTotalPending}</span>
							</div>
						</div>
					</div>

				</div>
			)}

			{/* ==========================================
			    2. MANAGER DASHBOARD VIEW
			   ========================================== */}
			{role === "Manager" && (
				<div className="space-y-6">
					
					{/* Stat widgets cards */}
					<div className="grid grid-cols-2 gap-3">
						
						{/* Team Attendance card */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow space-y-1">
							<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Team Attendance</span>
							<span className="text-2xl font-black font-mono text-teal-brand dark:text-teal-400 block mt-1">{teamAttendanceRate}%</span>
							<span className="text-[8px] font-bold text-emerald-500 block uppercase tracking-wide">
								↑ 2.4% vs last week
							</span>
						</div>

						{/* Team Leave Utilization */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow space-y-1">
							<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Staff On Leave</span>
							<span className="text-2xl font-black font-mono text-rose-500 block mt-1">{membersOnLeave}</span>
							<span className="text-[8px] font-bold text-rose-450 block uppercase tracking-wide">
								{teamOnLeavePct}% overall utilization
							</span>
						</div>

						{/* Team OKRs progress */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow space-y-1">
							<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Team OKR Average</span>
							<span className="text-2xl font-black font-mono text-orange-brand block mt-1">{teamOkrAverage}%</span>
							<span className="text-[8px] font-bold text-orange-500 block uppercase tracking-wide">
								↑ Q2 goal metrics
							</span>
						</div>

						{/* Pending Approvals alerts */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow space-y-1 relative">
							{totalPendingApprovals > 0 && (
								<span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
							)}
							<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Pending Reviews</span>
							<span className="text-2xl font-black font-mono text-slate-800 dark:text-slate-200 block mt-1">{totalPendingApprovals}</span>
							<span className="text-[8px] font-bold text-slate-450 block uppercase tracking-wide">
								{pendingLeavesCount} leaves • {pendingExpensesCount} claims
							</span>
						</div>
					</div>

					{/* Team Attendance visual bar chart */}
					<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4">
						<div className="flex justify-between items-center text-xs">
							<h4 className="font-bold text-slate-850 dark:text-slate-200">Daily Attendance Rate</h4>
							<span className="font-mono text-teal-brand font-bold">{activeMembersCount} / {totalHeadcount} Present</span>
						</div>

						<div className="space-y-1">
							<div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-150 dark:border-slate-800/50">
								<div 
									className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-350"
									style={{ width: `${teamAttendanceRate}%` }}
								/>
							</div>
							<div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
								<span>Available: {activeMembersCount}</span>
								<span>Rate: {teamAttendanceRate}%</span>
								<span>Headcount: {totalHeadcount}</span>
							</div>
						</div>
					</div>

				</div>
			)}

			{/* ==========================================
			    3. HR / ADMIN DASHBOARD VIEW
			   ========================================== */}
			{(role === "HR" || role === "Admin") && (
				<div className="space-y-6">
					
					{/* Stat indicators */}
					<div className="grid grid-cols-2 gap-3">
						
						{/* Headcount */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow space-y-1">
							<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Headcount</span>
							<span className="text-2xl font-black font-mono text-slate-800 dark:text-slate-200 block mt-1">{totalHeadcount}</span>
							<span className="text-[8px] font-bold text-teal-brand block uppercase tracking-wide">
								↑ Active profiles directory
							</span>
						</div>

						{/* Attendance Rate */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow space-y-1">
							<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Org Attendance</span>
							<span className="text-2xl font-black font-mono text-teal-brand block mt-1">{orgAttendanceRate}%</span>
							<span className="text-[8px] font-bold text-emerald-500 block uppercase tracking-wide">
								↑ Today's average shifts
							</span>
						</div>

						{/* Leaves this month */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow space-y-1">
							<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Leave Request Load</span>
							<span className="text-2xl font-black font-mono text-rose-500 block mt-1">{totalLeaveRequestsCount}</span>
							<span className="text-[8px] font-bold text-rose-450 block uppercase tracking-wide">
								↓ Total filings filed
							</span>
						</div>

						{/* Financial Claims */}
						<div className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow space-y-1">
							<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Claims (Month)</span>
							<span className="text-2xl font-black font-mono text-orange-brand block mt-1">₹{orgTotalSubmitted}</span>
							<span className="text-[8px] font-bold text-orange-500 block uppercase tracking-wide">
								Pending claim reviews
							</span>
						</div>
					</div>

					{/* Org Financial Claims submitted vs approved comparison */}
					<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4">
						<h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Expenses Reimbursements</h4>
						
						<div className="space-y-3.5">
							{/* Submitted Bar */}
							<div className="space-y-1">
								<div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider">
									<span>Total Submitted</span>
									<span>₹{orgTotalSubmitted}</span>
								</div>
								<div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden p-0.5">
									<div className="h-full bg-orange-brand rounded-full w-full" />
								</div>
							</div>

							{/* Approved Bar */}
							<div className="space-y-1">
								<div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider">
									<span>Approved</span>
									<span>₹{orgTotalApproved} ({orgTotalSubmitted > 0 ? Math.round((orgTotalApproved / orgTotalSubmitted) * 100) : 0}%)</span>
								</div>
								<div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden p-0.5">
									<div 
										className="h-full bg-teal-brand rounded-full transition-all duration-350"
										style={{ width: `${orgTotalSubmitted > 0 ? Math.round((orgTotalApproved / orgTotalSubmitted) * 100) : 0}%` }}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Recruitment Pipeline Kanban Stage breakdown summary */}
					<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4">
						<div className="flex justify-between items-center">
							<h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Recruitment Funnel</h4>
							<span className="text-[10px] font-bold text-teal-brand bg-teal-brand/10 px-2 py-0.5 rounded">
								{totalCandidatesCount} Applicants
							</span>
						</div>

						{/* Pipeline progress bars */}
						<div className="space-y-3 pt-1">
							{/* Screening */}
							<div className="space-y-1 text-xs">
								<div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
									<span>Screening</span>
									<span>{screenCandidatesCount} Candidates</span>
								</div>
								<div className="w-full bg-slate-100 dark:bg-slate-900/60 h-2 rounded-full overflow-hidden">
									<div 
										className="h-full bg-slate-400" 
										style={{ width: `${totalCandidatesCount > 0 ? (screenCandidatesCount / totalCandidatesCount) * 100 : 0}%` }}
									/>
								</div>
							</div>

							{/* Interview */}
							<div className="space-y-1 text-xs">
								<div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
									<span>Interview</span>
									<span>{interviewCandidatesCount} Candidates</span>
								</div>
								<div className="w-full bg-slate-100 dark:bg-slate-900/60 h-2 rounded-full overflow-hidden">
									<div 
										className="h-full bg-orange-brand" 
										style={{ width: `${totalCandidatesCount > 0 ? (interviewCandidatesCount / totalCandidatesCount) * 100 : 0}%` }}
									/>
								</div>
							</div>

							{/* Offer */}
							<div className="space-y-1 text-xs">
								<div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
									<span>Offer</span>
									<span>{offerCandidatesCount} Candidates</span>
								</div>
								<div className="w-full bg-slate-100 dark:bg-slate-900/60 h-2 rounded-full overflow-hidden">
									<div 
										className="h-full bg-teal-brand" 
										style={{ width: `${totalCandidatesCount > 0 ? (offerCandidatesCount / totalCandidatesCount) * 100 : 0}%` }}
									/>
								</div>
							</div>

							{/* Hired */}
							<div className="space-y-1 text-xs">
								<div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
									<span>Hired</span>
									<span>{hiredCandidatesCount} Candidates</span>
								</div>
								<div className="w-full bg-slate-100 dark:bg-slate-900/60 h-2 rounded-full overflow-hidden">
									<div 
										className="h-full bg-emerald-500" 
										style={{ width: `${totalCandidatesCount > 0 ? (hiredCandidatesCount / totalCandidatesCount) * 100 : 0}%` }}
									/>
								</div>
							</div>
						</div>
					</div>

				</div>
			)}

		</div>
	);
}

export default AnalyticsScreen;
