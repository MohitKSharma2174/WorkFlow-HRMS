import React, { useState } from "react";
import { useHrmsStore, LeaveRequest } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function LeaveScreen() {
	const { leaveBalances, leaveRequests, applyLeave } = useHrmsStore();
	
	// Form state
	const [leaveType, setLeaveType] = useState<LeaveRequest["type"]>("Casual Leave");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [reason, setReason] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	// Filter user leaves
	const myRequests = leaveRequests.filter((req) => req.employeeName === "Alex Mercer");

	const calculateDays = (start: string, end: string) => {
		if (!start || !end) return 0;
		const diff = new Date(end).getTime() - new Date(start).getTime();
		return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!startDate || !endDate || !reason) return;

		// Validation: check that end date is after or equal to start date
		if (new Date(endDate) < new Date(startDate)) {
			alert("Error: End Date cannot be before Start Date.");
			return;
		}

		applyLeave(leaveType, startDate, endDate, reason);
		
		const days = calculateDays(startDate, endDate);
		setSuccessMsg(`Success: Applied for ${days} day(s) of ${leaveType}! ✓`);
		setStartDate("");
		setEndDate("");
		setReason("");

		// Reset success notification after 4s
		setTimeout(() => setSuccessMsg(""), 4000);
	};

	const getStatusBadgeClass = (status: LeaveRequest["status"]) => {
		switch (status) {
			case "Approved":
				return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
			case "Rejected":
				return "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900";
			case "Pending":
			default:
				return "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900";
		}
	};

	return (
		<div className="space-y-6 animate-slideup p-1">
			{/* Header Banner */}
			<div className="rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 text-white card-shadow relative overflow-hidden flex items-center justify-between">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<Icons.Finance className="w-40 h-40" />
				</div>
				<div className="space-y-1">
					<span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
						Time & Absence
					</span>
					<h3 className="text-lg font-extrabold text-slate-100 mt-2">Leave Management</h3>
					<p className="text-[10px] text-slate-400 leading-normal">
						Track entitlements, casual days, and file time-off requests
					</p>
				</div>
			</div>

			{/* Statutory India Leave Balances */}
			<div className="grid grid-cols-2 gap-3">
				<div className="glass rounded-xl p-4 border border-slate-100 dark:border-slate-800/80 text-center space-y-1">
					<span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Casual Leave</span>
					<span className="text-2xl font-extrabold text-teal-brand dark:text-teal-400">{leaveBalances.casual}</span>
					<span className="text-[9px] text-slate-400 block font-medium">Standard India allotment</span>
				</div>
				<div className="glass rounded-xl p-4 border border-slate-100 dark:border-slate-800/80 text-center space-y-1">
					<span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Sick Leave</span>
					<span className="text-2xl font-extrabold text-teal-brand dark:text-teal-400">{leaveBalances.sick}</span>
					<span className="text-[9px] text-slate-400 block font-medium">Statutory balance</span>
				</div>
				<div className="glass rounded-xl p-4 border border-slate-100 dark:border-slate-800/80 text-center space-y-1">
					<span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Earned Leave</span>
					<span className="text-2xl font-extrabold text-orange-brand dark:text-orange-400">{leaveBalances.earned}</span>
					<span className="text-[9px] text-slate-400 block font-medium">Privilege leave accrued</span>
				</div>
				<div className="glass rounded-xl p-4 border border-slate-100 dark:border-slate-800/80 text-center space-y-1">
					<span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Comp-off</span>
					<span className="text-2xl font-extrabold text-slate-600 dark:text-slate-400">{leaveBalances.compOff}</span>
					<span className="text-[9px] text-slate-400 block font-medium">Calculated from overtime</span>
				</div>
			</div>

			{/* Apply for Leave Form */}
			<div className="glass rounded-2xl p-5 card-shadow space-y-4 border border-slate-100 dark:border-slate-800/80">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
					<span className="w-2.5 h-2.5 bg-teal-brand rounded-full" />
					Submit Leave Request
				</h3>

				{successMsg && (
					<div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl p-3.5 text-xs font-bold">
						{successMsg}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<label className="text-[9px] font-bold text-slate-400 uppercase">Leave Category</label>
							<select
								value={leaveType}
								onChange={(e) => setLeaveType(e.target.value as any)}
								className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs focus:ring-1 focus:ring-teal-brand cursor-pointer"
							>
								<option value="Casual Leave">Casual Leave</option>
								<option value="Sick Leave">Sick Leave</option>
								<option value="Earned Leave">Earned Leave</option>
								<option value="Comp-off">Comp-off</option>
							</select>
						</div>

						<div className="space-y-1">
							<label className="text-[9px] font-bold text-slate-400 uppercase">Total Days</label>
							<div className="p-2.5 text-xs font-bold text-slate-500">
								{startDate && endDate ? `${calculateDays(startDate, endDate)} Day(s)` : "--"}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<label className="text-[9px] font-bold text-slate-400 uppercase">From Date</label>
							<input
								type="date"
								required
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-[9px] font-bold text-slate-400 uppercase">To Date</label>
							<input
								type="date"
								required
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs"
							/>
						</div>
					</div>

					<div className="space-y-1">
						<label className="text-[9px] font-bold text-slate-400 uppercase">Reason / Details</label>
						<textarea
							required
							rows={2}
							value={reason}
							placeholder="Enter standard reasoning for manager review..."
							onChange={(e) => setReason(e.target.value)}
							className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs focus:outline-none focus:ring-1 focus:ring-teal-brand"
						/>
					</div>

					<button
						type="submit"
						className="w-full py-3 bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
					>
						File Request
					</button>
				</form>
			</div>

			{/* Leave Requests Log Feed */}
			<div className="glass rounded-2xl p-5 card-shadow space-y-4 border border-slate-100 dark:border-slate-800/80">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">My Leave History</h3>
				<div className="space-y-3">
					{myRequests.length === 0 ? (
						<p className="text-xs text-slate-400 text-center py-4">No recent leave history records.</p>
					) : (
						myRequests.map((req) => (
							<div
								key={req.id}
								className="p-3 bg-white/20 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/80 rounded-xl flex justify-between items-center text-xs"
							>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-extrabold text-slate-800 dark:text-slate-200">{req.type}</span>
										<span className="text-[10px] text-slate-400">
											({calculateDays(req.startDate, req.endDate)} Days)
										</span>
									</div>
									<p className="text-[10px] text-slate-500 font-mono">
										{req.startDate} to {req.endDate}
									</p>
									<p className="text-[10px] text-slate-400 italic">"{req.reason}"</p>
								</div>

								<span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(req.status)}`}>
									{req.status}
								</span>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
export default LeaveScreen;
