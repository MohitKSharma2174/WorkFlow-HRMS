import React, { useState } from "react";
import { useHrmsStore, ExpenseRequest } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function ExpensesScreen() {
	const { expenseRequests, addExpenseRequest, salaryProfile } = useHrmsStore();

	// Form states
	const [category, setCategory] = useState<ExpenseRequest["category"]>("Travel");
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState("");
	const [description, setDescription] = useState("");
	const [receiptAttached, setReceiptAttached] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");

	// Filter user expenses
	const myExpenses = expenseRequests.filter((e) => e.employeeName === (salaryProfile?.employeeName || "Sarah"));

	// Aggregated metrics calculations
	const totalSubmitted = myExpenses.reduce((sum, e) => sum + e.amount, 0);
	const totalApproved = myExpenses.reduce((sum, e) => e.status === "Approved" ? sum + e.amount : sum, 0);
	const totalPending = myExpenses.reduce((sum, e) => e.status === "Pending" ? sum + e.amount : sum, 0);
	const totalRejected = myExpenses.reduce((sum, e) => e.status === "Rejected" ? sum + e.amount : sum, 0);

	const isPolicyViolated = Number(amount) > 10000;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!amount || !date || !description) return;

		const amtVal = parseFloat(amount);
		if (isNaN(amtVal) || amtVal <= 0) {
			alert("Error: Please enter a valid expense amount.");
			return;
		}

		addExpenseRequest(category, amtVal, date, description, receiptAttached);

		setSuccessMsg("Success: Expense claim submitted to manager! ✓");
		setAmount("");
		setDate("");
		setDescription("");
		setReceiptAttached(false);

		setTimeout(() => setSuccessMsg(""), 4000);
	};

	const getStatusBadgeClass = (status: ExpenseRequest["status"]) => {
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
						Expense Reimbursements
					</span>
					<h3 className="text-lg font-extrabold text-slate-100 mt-2">Expenses Claims</h3>
					<p className="text-[10px] text-slate-400 leading-normal">
						Submit receipts and track the lifecycle of your reimbursement claims
					</p>
				</div>
			</div>

			{/* Aggregated Expense Metric Cards */}
			<div className="grid grid-cols-2 gap-3">
				<div className="glass rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 text-center space-y-0.5">
					<span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Total Claims</span>
					<span className="text-lg font-extrabold text-slate-700 dark:text-slate-200">₹{totalSubmitted.toLocaleString()}</span>
				</div>
				<div className="glass rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 text-center space-y-0.5">
					<span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Approved</span>
					<span className="text-lg font-extrabold text-emerald-500">₹{totalApproved.toLocaleString()}</span>
				</div>
				<div className="glass rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 text-center space-y-0.5">
					<span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Pending</span>
					<span className="text-lg font-extrabold text-amber-500">₹{totalPending.toLocaleString()}</span>
				</div>
				<div className="glass rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 text-center space-y-0.5">
					<span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Rejected</span>
					<span className="text-lg font-extrabold text-rose-500">₹{totalRejected.toLocaleString()}</span>
				</div>
			</div>

			{/* Add Expense Claim Form */}
			<div className="glass rounded-2xl p-5 card-shadow space-y-4 border border-slate-100 dark:border-slate-800/80">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
					<span className="w-2.5 h-2.5 bg-teal-brand rounded-full" />
					Submit Reimbursement Claim
				</h3>

				{successMsg && (
					<div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl p-3 text-xs font-bold animate-fadein">
						{successMsg}
					</div>
				)}

				{isPolicyViolated && (
					<div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl p-3 text-[10px] font-bold leading-normal animate-fadein">
						⚠️ Policy Check: Single transactions exceeding ₹10,000 require additional Executive review and original receipt files.
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value as any)}
								className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs focus:ring-1 focus:ring-teal-brand cursor-pointer"
							>
								<option value="Travel">Travel & Cab</option>
								<option value="Food">Food & Meals</option>
								<option value="Accommodation">Accommodation</option>
								<option value="Equipment">IT & Equipment</option>
								<option value="Other">Other Expenses</option>
							</select>
						</div>

						<div className="space-y-1">
							<label className="text-[9px] font-bold text-slate-400 uppercase">Amount (₹)</label>
							<input
								type="number"
								required
								placeholder="e.g. 1500"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<label className="text-[9px] font-bold text-slate-400 uppercase">Transaction Date</label>
							<input
								type="date"
								required
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs"
							/>
						</div>

						<div className="space-y-1">
							<label className="text-[9px] font-bold text-slate-400 uppercase">Receipt File</label>
							<button
								type="button"
								onClick={() => setReceiptAttached(!receiptAttached)}
								className={`w-full p-2.5 border rounded-xl text-[10px] font-bold transition-all text-center cursor-pointer ${
									receiptAttached
										? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
										: "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 bg-white/40 dark:bg-slate-900/40 text-slate-500"
								}`}
							>
								{receiptAttached ? "Receipt attached ✓" : "Scan receipt image"}
							</button>
						</div>
					</div>

					<div className="space-y-1">
						<label className="text-[9px] font-bold text-slate-400 uppercase">Description Details</label>
						<textarea
							required
							rows={2}
							value={description}
							placeholder="Enter client names, project scope, or item list..."
							onChange={(e) => setDescription(e.target.value)}
							className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs focus:outline-none focus:ring-1 focus:ring-teal-brand"
						/>
					</div>

					<button
						type="submit"
						className="w-full py-3 bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
					>
						File Expense Claim
					</button>
				</form>
			</div>

			{/* My Expenses History Log */}
			<div className="glass rounded-2xl p-5 card-shadow space-y-4 border border-slate-100 dark:border-slate-800/80">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">My Expense History</h3>
				<div className="space-y-3">
					{myExpenses.length === 0 ? (
						<p className="text-xs text-slate-400 text-center py-4">No recent expense claims recorded.</p>
					) : (
						myExpenses.map((exp) => (
							<div
								key={exp.id}
								className="p-3.5 bg-white/20 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/80 rounded-xl flex justify-between items-center text-xs"
							>
								<div className="space-y-1.5 flex-1 pr-3">
									<div className="flex items-center gap-2 flex-wrap">
										<span className="font-extrabold text-slate-800 dark:text-slate-200">{exp.category}</span>
										<span className="text-[9px] text-slate-400 font-medium">({exp.date})</span>
										{exp.receiptAttached && (
											<span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 rounded font-bold">
												Receipt ✓
											</span>
										)}
									</div>
									<p className="text-[10px] text-slate-500 italic leading-relaxed">"{exp.description}"</p>
								</div>

								<div className="text-right space-y-1.5 shrink-0">
									<span className="font-extrabold text-slate-700 dark:text-slate-200 block">
										₹{exp.amount.toLocaleString()}
									</span>
									<span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeClass(exp.status)}`}>
										{exp.status}
									</span>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
export default ExpensesScreen;
