import React, { useState } from "react";
import { useHrmsStore, LeaveRequest, ExpenseRequest } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function ApprovalsScreen() {
	const {
		leaveRequests,
		updateLeaveRequestStatus,
		expenseRequests,
		updateExpenseStatus,
	} = useHrmsStore();

	const [activeModule, setActiveModule] = useState<"leaves" | "expenses">("leaves");

	// Leave lists
	const pendingLeaves = leaveRequests.filter((req) => req.status === "Pending");
	const completedLeaves = leaveRequests.filter((req) => req.status !== "Pending");

	// Expense lists
	const pendingExpenses = expenseRequests.filter((req) => req.status === "Pending");
	const completedExpenses = expenseRequests.filter((req) => req.status !== "Pending");

	const calculateDays = (start: string, end: string) => {
		const diff = new Date(end).getTime() - new Date(start).getTime();
		return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
	};

	const getStatusBadgeClass = (status: "Pending" | "Approved" | "Rejected") => {
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
					<Icons.Operations className="w-40 h-40" />
				</div>
				<div className="space-y-1">
					<span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
						Executive Approvals
					</span>
					<h3 className="text-lg font-extrabold text-slate-100 mt-2">Pending Reviews</h3>
					<p className="text-[10px] text-slate-400 leading-normal">
						Approve or reject employee leave requests and expense reimbursement claims
					</p>
				</div>
			</div>

			{/* Top Selector for Leaves vs Expenses */}
			<div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
				<button
					onClick={() => setActiveModule("leaves")}
					className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
						activeModule === "leaves" ? "bg-teal-brand text-white card-shadow" : "text-slate-500 hover:text-slate-800"
					}`}
				>
					Leave Approvals ({pendingLeaves.length})
				</button>
				<button
					onClick={() => setActiveModule("expenses")}
					className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
						activeModule === "expenses" ? "bg-teal-brand text-white card-shadow" : "text-slate-500 hover:text-slate-800"
					}`}
				>
					Expense Approvals ({pendingExpenses.length})
				</button>
			</div>

			{/* ================= LEAVE APPROVALS SECTION ================= */}
			{activeModule === "leaves" && (
				<div className="space-y-6">
					{/* Pending Leaves */}
					<div className="space-y-4">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Pending Leaves ({pendingLeaves.length})
						</h3>
						{pendingLeaves.length === 0 ? (
							<div className="p-6 text-center text-xs text-slate-400 glass rounded-xl border">
								No pending leave requests.
							</div>
						) : (
							pendingLeaves.map((req) => (
								<div
									key={req.id}
									className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-3 bg-white/40 dark:bg-slate-900/10"
								>
									<div className="flex justify-between items-start">
										<div>
											<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
												Request by: <span className="text-teal-brand">{req.employeeName}</span>
											</h4>
											<p className="text-[9px] text-slate-400 mt-0.5">Applied on {req.appliedDate}</p>
										</div>
										<span className="text-[10px] font-bold text-orange-brand bg-orange-light px-2 py-0.5 rounded-full">
											{req.type}
										</span>
									</div>

									<div className="p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-1">
										<div className="text-[10px] text-slate-500 font-bold">
											Duration: {req.startDate} to {req.endDate} ({calculateDays(req.startDate, req.endDate)} day(s))
										</div>
										<p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
											"{req.reason}"
										</p>
									</div>

									<div className="flex justify-end gap-2 pt-1">
										<button
											onClick={() => updateLeaveRequestStatus(req.id, "Rejected")}
											className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-600 text-[10px] font-bold rounded-lg transition-all cursor-pointer border border-rose-200"
										>
											Reject
										</button>
										<button
											onClick={() => updateLeaveRequestStatus(req.id, "Approved")}
											className="px-4 py-2 bg-teal-brand hover:bg-teal-hover text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer shadow-sm"
										>
											Approve
										</button>
									</div>
								</div>
							))
						)}
					</div>

					{/* Completed Leaves History */}
					<div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Completed History ({completedLeaves.length})
						</h3>
						<div className="space-y-3.5">
							{completedLeaves.length === 0 ? (
								<p className="text-xs text-slate-400 text-center py-2">No historical leave logs.</p>
							) : (
								completedLeaves.map((req) => (
									<div
										key={req.id}
										className="p-3 bg-slate-50/50 dark:bg-slate-900/5 border border-slate-100 dark:border-slate-800/50 rounded-xl flex justify-between items-center text-xs"
									>
										<div className="space-y-0.5">
											<div className="flex items-center gap-2">
												<span className="font-extrabold text-slate-700 dark:text-slate-300">{req.employeeName}</span>
												<span className="text-[10px] text-slate-400">({req.type})</span>
											</div>
											<p className="text-[10px] text-slate-500">
												{req.startDate} to {req.endDate} ({calculateDays(req.startDate, req.endDate)} day(s))
											</p>
										</div>
										<span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeClass(req.status)}`}>
											{req.status}
										</span>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}

			{/* ================= EXPENSE APPROVALS SECTION ================= */}
			{activeModule === "expenses" && (
				<div className="space-y-6">
					{/* Pending Expenses */}
					<div className="space-y-4">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Pending Expenses ({pendingExpenses.length})
						</h3>
						{pendingExpenses.length === 0 ? (
							<div className="p-6 text-center text-xs text-slate-400 glass rounded-xl border">
								No pending expense claims.
							</div>
						) : (
							pendingExpenses.map((exp) => {
								const isExceedLimit = exp.amount > 10000;
								return (
									<div
										key={exp.id}
										className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-3 bg-white/40 dark:bg-slate-900/10"
									>
										<div className="flex justify-between items-start">
											<div>
												<h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
													Claim by: <span className="text-teal-brand">{exp.employeeName}</span>
												</h4>
												<p className="text-[9px] text-slate-400 mt-0.5">Applied on {exp.appliedDate}</p>
											</div>
											<span className="text-sm font-extrabold text-slate-850 dark:text-white">
												₹{exp.amount.toLocaleString()}
											</span>
										</div>

										{isExceedLimit && (
											<div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-450 text-[9px] font-bold p-2 rounded-lg">
												⚠️ Policy Limit: Claims exceeding ₹10,000 require manual receipt inspection.
											</div>
										)}

										<div className="p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-1">
											<div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
												Category: {exp.category} | Transaction Date: {exp.date}
											</div>
											<p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
												"{exp.description}"
											</p>
											{exp.receiptAttached && (
												<span className="inline-block mt-1 text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-extrabold">
													Receipt Verified ✓
												</span>
											)}
										</div>

										<div className="flex justify-end gap-2 pt-1">
											<button
												onClick={() => updateExpenseStatus(exp.id, "Rejected")}
												className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-600 text-[10px] font-bold rounded-lg transition-all cursor-pointer border border-rose-200"
											>
												Reject
											</button>
											<button
												onClick={() => updateExpenseStatus(exp.id, "Approved")}
												className="px-4 py-2 bg-teal-brand hover:bg-teal-hover text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer shadow-sm"
											>
												Approve
											</button>
										</div>
									</div>
								);
							})
						)}
					</div>

					{/* Completed Expenses History */}
					<div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Completed History ({completedExpenses.length})
						</h3>
						<div className="space-y-3.5">
							{completedExpenses.length === 0 ? (
								<p className="text-xs text-slate-400 text-center py-2">No historical expense logs.</p>
							) : (
								completedExpenses.map((exp) => (
									<div
										key={exp.id}
										className="p-3 bg-slate-50/50 dark:bg-slate-900/5 border border-slate-100 dark:border-slate-800/50 rounded-xl flex justify-between items-center text-xs"
									>
										<div className="space-y-0.5">
											<div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
												<span>{exp.employeeName}</span>
												<span className="text-[10px] text-slate-400 font-medium">({exp.category})</span>
											</div>
											<p className="text-[10px] text-slate-500">
												Amount: ₹{exp.amount.toLocaleString()} | Date: {exp.date}
											</p>
										</div>
										<span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeClass(exp.status)}`}>
											{exp.status}
										</span>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
export default ApprovalsScreen;
