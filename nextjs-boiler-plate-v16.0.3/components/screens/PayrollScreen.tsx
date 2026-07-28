import React, { useState } from "react";
import { useHrmsStore } from "../../stores/hrmsStore";
import { Icons } from "../Icons";
import { jsPDF } from "jspdf";

export function PayrollScreen() {
	const { salaryProfile } = useHrmsStore();
	const [lwpDays, setLwpDays] = useState(0);
	const [selectedMonth, setSelectedMonth] = useState("June 2026");

	const { basicPay, specialAllowance, lta, employeeName, designation, department } = salaryProfile;

	// Mathematical calculations
	const hra = Math.round(basicPay * 0.40); // 40% HRA
	const grossSalary = basicPay + hra + specialAllowance + lta;

	// Calculate LWP deduction based on basic pay (assuming 30-day month)
	const lwpDeduction = Math.round((basicPay / 30) * lwpDays);

	// Deductions calculations
	const pf = Math.round(basicPay * 0.12); // 12% PF of basic
	
	// ESI 0.75% of gross, if gross < 21000
	const esi = grossSalary < 21000 ? Math.round(grossSalary * 0.0075) : 0;
	const pt = 200; // PT standard ₹200/month
	
	const totalDeductions = pf + esi + pt + lwpDeduction;
	const netTakeHome = grossSalary - totalDeductions;

	const generatePdf = () => {
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a4",
		});

		// Border & Accents
		doc.setDrawColor(13, 148, 136); // Teal
		doc.setLineWidth(1);
		doc.rect(5, 5, 200, 287); // Page border

		// Header Banner
		doc.setFillColor(13, 148, 136); // Teal
		doc.rect(5, 5, 200, 20, "F");
		
		doc.setTextColor(255, 255, 255);
		doc.setFont("Helvetica", "bold");
		doc.setFontSize(14);
		doc.text("WORKFLOW SYSTEMS INC. (INDIA OPERATIONS)", 10, 18);
		
		// Title
		doc.setTextColor(15, 23, 42); // Dark slate
		doc.setFontSize(16);
		doc.text("PAYSLIP STATEMENT", 80, 40);
		
		// Metadata box
		doc.setDrawColor(226, 232, 240); // Light slate border
		doc.setFillColor(248, 250, 252);
		doc.rect(10, 48, 190, 32, "FD");

		doc.setFontSize(10);
		doc.setFont("Helvetica", "bold");
		doc.text("Employee Name:", 15, 55);
		doc.text("Designation:", 15, 62);
		doc.text("Department:", 15, 69);
		doc.text("Statutory Code:", 15, 76);

		doc.setFont("Helvetica", "normal");
		doc.text(employeeName, 50, 55);
		doc.text(designation, 50, 62);
		doc.text(department, 50, 69);
		doc.text("IN-HRMS-2026", 50, 76);

		doc.setFont("Helvetica", "bold");
		doc.text("Pay Period:", 110, 55);
		doc.text("Currency:", 110, 62);
		doc.text("LWP Days:", 110, 69);
		doc.text("Bank A/c No:", 110, 76);

		doc.setFont("Helvetica", "normal");
		doc.text(selectedMonth, 145, 55);
		doc.text("INR (Rs. - \u20B9)", 145, 62);
		doc.text(lwpDays.toString(), 145, 69);
		doc.text("*********4830", 145, 76);

		// Earnings & Deductions Headers
		doc.setFillColor(15, 23, 42);
		doc.rect(10, 88, 92, 8, "F");
		doc.rect(108, 88, 92, 8, "F");

		doc.setTextColor(255, 255, 255);
		doc.setFont("Helvetica", "bold");
		doc.setFontSize(10);
		doc.text("EARNINGS DETAILED", 15, 94);
		doc.text("DEDUCTIONS DETAILED", 113, 94);

		doc.setTextColor(15, 23, 42);
		
		// Row 1
		doc.text("Basic Salary", 12, 106);
		doc.text(`Rs. ${basicPay.toLocaleString()}`, 70, 106);
		doc.text("Provident Fund (PF)", 110, 106);
		doc.text(`Rs. ${pf.toLocaleString()}`, 170, 106);

		// Row 2
		doc.text("HRA (40% of Basic)", 12, 114);
		doc.text(`Rs. ${hra.toLocaleString()}`, 70, 114);
		doc.text("ESI", 110, 114);
		doc.text(`Rs. ${esi.toLocaleString()}`, 170, 114);

		// Row 3
		doc.text("Special Allowance", 12, 122);
		doc.text(`Rs. ${specialAllowance.toLocaleString()}`, 70, 122);
		doc.text("Professional Tax (PT)", 110, 122);
		doc.text(`Rs. ${pt.toLocaleString()}`, 170, 122);

		// Row 4
		doc.text("Leave Travel Allow.", 12, 130);
		doc.text(`Rs. ${lta.toLocaleString()}`, 70, 130);
		doc.text("LWP Deduction", 110, 130);
		doc.text(`Rs. ${lwpDeduction.toLocaleString()}`, 170, 130);

		// Grid lines
		doc.setDrawColor(203, 213, 225);
		doc.line(10, 100, 102, 100);
		doc.line(108, 100, 200, 100);
		doc.line(10, 136, 102, 136);
		doc.line(108, 136, 200, 136);

		// Total Gross vs Total Deduct
		doc.setFont("Helvetica", "bold");
		doc.text("Gross Earnings (A)", 12, 144);
		doc.text(`Rs. ${grossSalary.toLocaleString()}`, 70, 144);
		doc.text("Total Deductions (B)", 110, 144);
		doc.text(`Rs. ${totalDeductions.toLocaleString()}`, 170, 144);

		// Net Pay section block
		doc.setDrawColor(13, 148, 136);
		doc.setFillColor(204, 251, 241); // light teal background
		doc.rect(10, 155, 190, 15, "FD");

		doc.setFontSize(11);
		doc.text("NET TAKE-HOME SALARY (A - B):", 15, 164);
		doc.setFontSize(12);
		doc.text(`Rs. ${netTakeHome.toLocaleString()} /-`, 140, 164);

		// Footer info
		doc.setFont("Helvetica", "normal");
		doc.setFontSize(8);
		doc.setTextColor(100, 116, 139);
		doc.text("This is an electronically generated document. No signature required.", 60, 260);

		// Save PDF
		doc.save(`Payslip_${selectedMonth.replace(" ", "_")}_Mohit_Sharma.pdf`);
	};

	const pastMonths = [
		"May 2026",
		"April 2026",
		"March 2026",
		"February 2026",
		"January 2026",
		"December 2025",
	];

	return (
		<div className="space-y-6 animate-slideup p-1">
			{/* Employee Profile Header Summary */}
			<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-3.5">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center text-sm font-bold">
						MS
					</div>
					<div>
						<h3 className="text-sm font-bold text-slate-800 dark:text-white">{employeeName}</h3>
						<p className="text-[10px] text-slate-400">
							{designation} • {department}
						</p>
					</div>
				</div>
				<div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[10px] font-bold text-slate-500">
					<span>Basic Pay Rate:</span>
					<span className="text-teal-brand">₹{basicPay.toLocaleString()} / month</span>
				</div>
			</div>

			{/* Payslip Overview Card */}
			<div className="rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 text-white card-shadow relative overflow-hidden space-y-5">
				<div className="flex justify-between items-center">
					<span className="text-[9px] font-bold uppercase tracking-wider bg-teal-brand/30 px-3 py-1 rounded-full text-teal-300">
						Statement Period: {selectedMonth}
					</span>
					<button
						onClick={generatePdf}
						className="text-[10px] font-bold bg-orange-brand hover:bg-orange-hover text-white px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-md"
					>
						<Icons.Download className="w-3.5 h-3.5" /> Download PDF
					</button>
				</div>

				<div className="space-y-1">
					<span className="text-slate-400 text-[10px] uppercase font-bold block">Net Take-Home Pay</span>
					<h2 className="text-3xl font-extrabold font-mono tracking-tight text-teal-400">
						₹{netTakeHome.toLocaleString()}
					</h2>
				</div>

				<div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
					<div>
						<span className="text-slate-400 text-[10px] block">Gross Salary (A)</span>
						<span className="font-bold text-slate-200">₹{grossSalary.toLocaleString()}</span>
					</div>
					<div>
						<span className="text-slate-400 text-[10px] block">Total Deductions (B)</span>
						<span className="font-bold text-rose-400">₹{totalDeductions.toLocaleString()}</span>
					</div>
				</div>
			</div>

			{/* Interactive LWP Recalculator Slider */}
			<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-3.5">
				<div className="flex justify-between items-center">
					<h3 className="text-sm font-bold text-slate-800 dark:text-teal-400">Simulate LWP (Leave Without Pay)</h3>
					<span className="text-xs font-bold text-orange-brand bg-orange-light px-2 py-0.5 rounded-full">
						{lwpDays} Day(s)
					</span>
				</div>
				<div className="space-y-1.5">
					<input
						type="range"
						min="0"
						max="30"
						value={lwpDays}
						onChange={(e) => setLwpDays(Number(e.target.value))}
						className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-brand"
					/>
					<div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
						<span>0 Days</span>
						<span>LWP Deduction: ₹{lwpDeduction.toLocaleString()}</span>
						<span>30 Days</span>
					</div>
				</div>
			</div>

			{/* Detailed Earnings vs Deductions breakdowns */}
			<div className="grid grid-cols-1 gap-4">
				{/* Earnings */}
				<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-3">
					<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 bg-teal-brand rounded-full" />
						Earnings breakdown
					</h3>
					<div className="space-y-2.5 text-xs">
						<div className="flex justify-between text-slate-600 dark:text-slate-400">
							<span>Basic Pay</span>
							<span className="font-bold">₹{basicPay.toLocaleString()}</span>
						</div>
						<div className="flex justify-between text-slate-600 dark:text-slate-400">
							<span>HRA (40% of Basic)</span>
							<span className="font-bold">₹{hra.toLocaleString()}</span>
						</div>
						<div className="flex justify-between text-slate-600 dark:text-slate-400">
							<span>Special Allowance</span>
							<span className="font-bold">₹{specialAllowance.toLocaleString()}</span>
						</div>
						<div className="flex justify-between text-slate-600 dark:text-slate-400">
							<span>LTA (Leave Travel Allowance)</span>
							<span className="font-bold">₹{lta.toLocaleString()}</span>
						</div>
						<div className="flex justify-between text-slate-800 dark:text-slate-200 font-bold border-t pt-2 border-slate-100 dark:border-slate-800">
							<span>Total Gross (A)</span>
							<span>₹{grossSalary.toLocaleString()}</span>
						</div>
					</div>
				</div>

				{/* Deductions */}
				<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-3">
					<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 bg-orange-brand rounded-full" />
						Deductions breakdown
					</h3>
					<div className="space-y-2.5 text-xs">
						<div className="flex justify-between text-slate-600 dark:text-slate-400">
							<span>Provident Fund (PF - 12%)</span>
							<span className="font-bold">₹{pf.toLocaleString()}</span>
						</div>
						<div className="flex justify-between text-slate-600 dark:text-slate-400">
							<span>Employees State Insurance (ESI - 0.75%)</span>
							<span className="font-bold">₹{esi.toLocaleString()}</span>
						</div>
						<div className="flex justify-between text-slate-600 dark:text-slate-400">
							<span>Professional Tax (PT)</span>
							<span className="font-bold">₹{pt.toLocaleString()}</span>
						</div>
						{lwpDeduction > 0 && (
							<div className="flex justify-between text-rose-500 font-medium">
								<span>LWP Deduction ({lwpDays} days)</span>
								<span className="font-bold">₹{lwpDeduction.toLocaleString()}</span>
							</div>
						)}
						<div className="flex justify-between text-slate-800 dark:text-slate-200 font-bold border-t pt-2 border-slate-100 dark:border-slate-800">
							<span>Total Deductions (B)</span>
							<span>₹{totalDeductions.toLocaleString()}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Past 6 Months payslip history */}
			<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Payslip History</h3>
				<div className="space-y-2.5">
					{pastMonths.map((month) => (
						<button
							key={month}
							onClick={() => setSelectedMonth(month)}
							className={`w-full p-3 border rounded-xl flex justify-between items-center text-xs font-bold transition-all cursor-pointer ${
								selectedMonth === month
									? "border-teal-brand bg-teal-brand/5 text-teal-brand"
									: "border-slate-150 bg-white/20 dark:bg-slate-900/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/30"
							}`}
						>
							<span>Statement Period: {month}</span>
							<span className="underline text-[10px]">Load breakdown</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
export default PayrollScreen;
