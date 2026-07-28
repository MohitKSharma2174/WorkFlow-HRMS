import React, { useState } from "react";
import { useHrmsStore } from "../../stores/hrmsStore";
import { Icons } from "../Icons";
import { jsPDF } from "jspdf";

export function TrainingScreen() {
	const { courses, updateCourseProgress, salaryProfile } = useHrmsStore();
	const [activeCategory, setActiveCategory] = useState<"All" | "Mandatory" | "Technical" | "Soft Skills">("All");

	// Summaries
	const totalCourses = courses.length;
	const completedCount = courses.filter((c) => c.progress === 100).length;
	const inProgressCount = courses.filter((c) => c.progress > 0 && c.progress < 100).length;
	
	// Calculate total hours learned based on progress weight
	const totalHoursLearned = courses.reduce((sum, c) => sum + (c.duration * c.progress) / 100, 0);
	const formattedHours = Math.round(totalHoursLearned * 10) / 10;

	// Categories list for filtering
	const categories = ["All", "Mandatory", "Technical", "Soft Skills"] as const;

	// Filter courses
	const filteredCourses = courses.filter(
		(c) => activeCategory === "All" || c.category === activeCategory
	);

	// Generate and Download Certificate
	const handleDownloadCertificate = (courseTitle: string) => {
		const doc = new jsPDF({
			orientation: "landscape",
			unit: "mm",
			format: "a4",
		});

		const employeeName = salaryProfile?.employeeName || "Sarah";
		const completionDate = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		// Slate background fill
		doc.setFillColor(250, 250, 250);
		doc.rect(0, 0, 297, 210, "F");

		// Outer thick border (Teal)
		doc.setDrawColor(13, 148, 136); // Teal 600
		doc.setLineWidth(4);
		doc.rect(8, 8, 281, 194);

		// Inner thin border (Orange)
		doc.setDrawColor(234, 88, 12); // Orange 600
		doc.setLineWidth(1.5);
		doc.rect(12, 12, 273, 186);

		// Header ribbon badge
		doc.setFillColor(13, 148, 136);
		doc.rect(88, 8, 120, 14, "F");
		doc.setTextColor(255, 255, 255);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(10);
		doc.text("WORKFLOW ACADEMY & HR SYSTEM", 148, 17, { align: "center" });

		// Document Title
		doc.setTextColor(15, 23, 42); // Slate 900
		doc.setFont("helvetica", "bold");
		doc.setFontSize(28);
		doc.text("CERTIFICATE OF COMPLETION", 148, 48, { align: "center" });

		// Subtext
		doc.setFont("helvetica", "normal");
		doc.setFontSize(14);
		doc.setTextColor(71, 85, 105); // Slate 600
		doc.text("This is proudly presented to", 148, 66, { align: "center" });

		// Employee Name
		doc.setFont("helvetica", "bold");
		doc.setFontSize(26);
		doc.setTextColor(13, 148, 136); // Teal
		doc.text(employeeName, 148, 88, { align: "center" });

		// Course text
		doc.setFont("helvetica", "normal");
		doc.setFontSize(14);
		doc.setTextColor(71, 85, 105);
		doc.text("for successfully completing the specialized training module in", 148, 106, { align: "center" });

		// Course Title
		doc.setFont("helvetica", "bold");
		doc.setFontSize(20);
		doc.setTextColor(234, 88, 12); // Orange
		doc.text(courseTitle, 148, 124, { align: "center" });

		// Congratulations message
		doc.setFont("helvetica", "normal");
		doc.setFontSize(11);
		doc.setTextColor(100, 116, 139);
		doc.text("Congratulations on your commitment to personal enrichment and professional excellence.", 148, 142, { align: "center" });

		// Signature & Date
		// Divider Line Left (Date)
		doc.setDrawColor(203, 213, 225);
		doc.setLineWidth(0.5);
		doc.line(45, 172, 105, 172);
		
		doc.setTextColor(71, 85, 105);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(9);
		doc.text("DATE OF COMPLETION", 75, 178, { align: "center" });
		
		doc.setFont("helvetica", "normal");
		doc.setFontSize(11);
		doc.text(completionDate, 75, 166, { align: "center" });

		// Divider Line Right (Authorized Signature)
		doc.line(192, 172, 252, 172);
		
		doc.setFont("helvetica", "bold");
		doc.setFontSize(9);
		doc.text("AUTHORIZED SIGNATURE", 222, 178, { align: "center" });

		doc.setFont("helvetica", "bold");
		doc.setFontSize(12);
		doc.setTextColor(13, 148, 136);
		doc.text("WorkFlow L&D Dept", 222, 166, { align: "center" });

		// Download PDF file
		const fileName = `Certificate_${courseTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
		doc.save(fileName);
	};

	// Get tag color based on course category
	const getCategoryBadgeClass = (category: string) => {
		switch (category) {
			case "Mandatory":
				return "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30";
			case "Technical":
				return "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30";
			case "Soft Skills":
				return "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30";
			default:
				return "bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800/30";
		}
	};

	return (
		<div className="space-y-6 animate-slideup p-1">
			
			{/* Learning Summary Dashboard Card */}
			<div className="rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 text-white card-shadow relative overflow-hidden">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<Icons.Academic className="w-40 h-40" />
				</div>
				
				<div className="space-y-1">
					<span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
						Learning Management System
					</span>
					<h3 className="text-lg font-extrabold text-slate-100 mt-2">My Learning Dashboard</h3>
					<p className="text-[10px] text-slate-400 leading-normal">Track compliance courses and skill development items</p>
				</div>

				<div className="grid grid-cols-4 gap-2 pt-6 mt-4 border-t border-white/10 text-center">
					<div className="space-y-0.5">
						<span className="text-[8px] font-black text-slate-450 uppercase tracking-widest block">Total</span>
						<span className="text-lg font-bold text-white block">{totalCourses}</span>
					</div>
					<div className="space-y-0.5 border-l border-white/5">
						<span className="text-[8px] font-black text-teal-400 uppercase tracking-widest block">Completed</span>
						<span className="text-lg font-bold text-teal-400 block">{completedCount}</span>
					</div>
					<div className="space-y-0.5 border-l border-white/5">
						<span className="text-[8px] font-black text-orange-400 uppercase tracking-widest block">Active</span>
						<span className="text-lg font-bold text-orange-400 block">{inProgressCount}</span>
					</div>
					<div className="space-y-0.5 border-l border-white/5">
						<span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest block">Hours</span>
						<span className="text-lg font-bold text-cyan-400 block">{formattedHours}h</span>
					</div>
				</div>
			</div>

			{/* Category tabs */}
			<div className="space-y-3.5">
				<div className="flex justify-between items-center">
					<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
						Course Catalog
					</h3>
					<span className="text-[9px] font-bold text-teal-brand dark:text-teal-400 bg-teal-brand/10 dark:bg-teal-950/40 px-2 py-0.5 rounded-full">
						{filteredCourses.length} Courses
					</span>
				</div>

				<div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80 gap-1 overflow-x-auto scrollbar-none">
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`flex-1 text-center py-2 px-3 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
								activeCategory === cat
									? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
									: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
							}`}
						>
							{cat}
						</button>
					))}
				</div>
			</div>

			{/* Course List Grid */}
			<div className="space-y-4">
				{filteredCourses.length > 0 ? (
					filteredCourses.map((course) => {
						const isNotStarted = course.progress === 0;
						const isCompleted = course.progress === 100;
						
						return (
							<div
								key={course.id}
								className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4"
							>
								{/* Category and Status badges */}
								<div className="flex justify-between items-center">
									<span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getCategoryBadgeClass(course.category)}`}>
										{course.category}
									</span>
									
									<span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
										isCompleted
											? "bg-teal-500/10 text-teal-500"
											: course.progress > 0
											? "bg-orange-500/10 text-orange-500"
											: "bg-slate-500/10 text-slate-500"
									}`}>
										{course.status}
									</span>
								</div>

								{/* Course Details */}
								<div className="space-y-1.5">
									<h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-snug">
										{course.title}
									</h4>
									<p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
										{course.description}
									</p>
								</div>

								{/* Duration and progress bar info */}
								<div className="space-y-2 pt-1">
									<div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
										<span className="flex items-center gap-1">
											<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
												<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											{course.duration} hrs
										</span>
										<span className="font-mono text-teal-brand dark:text-teal-400">
											{course.progress}% Completed
										</span>
									</div>

									{/* Progress bar */}
									<div className="w-full bg-slate-150 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-100/50 dark:border-slate-700/30">
										<div
											className={`h-full rounded-full transition-all duration-300 ${
												isCompleted
													? "bg-teal-brand"
													: "bg-orange-brand"
											}`}
											style={{ width: `${course.progress}%` }}
										/>
									</div>
								</div>

								{/* Actions button */}
								<div className="pt-1.5">
									{isCompleted ? (
										<button
											onClick={() => handleDownloadCertificate(course.title)}
											className="w-full bg-teal-brand hover:bg-teal-hover text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
										>
											<Icons.Download className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
											Download Certificate
										</button>
									) : (
										<button
											onClick={() => updateCourseProgress(course.id)}
											className="w-full bg-orange-brand hover:bg-orange-hover text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
										>
											{isNotStarted ? (
												<>
													<span>Start Course</span>
													<Icons.ArrowRight className="w-3.5 h-3.5" />
												</>
											) : (
												<>
													<span>Continue Course</span>
													<Icons.ArrowRight className="w-3.5 h-3.5" />
												</>
											)}
										</button>
									)}
								</div>
							</div>
						);
					})
				) : (
					<div className="glass rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800/80 card-shadow bg-white/20 dark:bg-slate-900/10 py-12 space-y-3">
						<div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
							<Icons.Info className="w-6 h-6" />
						</div>
						<h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
							No courses found
						</h4>
						<p className="text-[11px] text-slate-500 dark:text-slate-455 max-w-[200px] mx-auto leading-relaxed">
							There are no courses matching the "{activeCategory}" category currently.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default TrainingScreen;
