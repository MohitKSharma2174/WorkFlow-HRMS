import React from "react";
import { useHrmsStore } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function PerformanceScreen() {
	const { objectives, performanceReview, updateKRProgress } = useHrmsStore();

	// Calculate overall average completion
	const allKRs = objectives.flatMap((obj) => obj.keyResults);
	const totalProgress = allKRs.reduce((sum, kr) => sum + kr.progress, 0);
	const overallCompletion = allKRs.length > 0 ? Math.round(totalProgress / allKRs.length) : 0;

	// Rating color helpers
	const getRatingColor = (score: number) => {
		if (score >= 4.5) return "bg-teal-brand";
		if (score >= 3.5) return "bg-emerald-500";
		return "bg-orange-brand";
	};

	return (
		<div className="space-y-6 animate-slideup p-1">
			{/* Overall Performance Score Card */}
			<div className="rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 text-white card-shadow relative overflow-hidden flex items-center justify-between">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<Icons.Talent className="w-40 h-40" />
				</div>
				<div className="space-y-1">
					<span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
						Overall OKR Completion
					</span>
					<h3 className="text-sm font-semibold text-slate-300 mt-2">Q2 Performance Index</h3>
					<p className="text-[10px] text-slate-400">Calculated average of all active key results</p>
				</div>
				<div className="flex flex-col items-center">
					<span className="text-4xl font-black font-mono text-teal-400">{overallCompletion}%</span>
					<span className="text-[9px] text-slate-450 uppercase font-bold tracking-widest mt-1">Status: Active</span>
				</div>
			</div>

			{/* Objectives & Nested Key Results */}
			<div className="space-y-4">
				<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
					Current Quarter OKRs
				</h3>
				
				{objectives.map((obj) => (
					<div
						key={obj.id}
						className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4"
					>
						<div className="flex items-start gap-2">
							<span className="p-1 bg-teal-brand/10 text-teal-brand rounded-lg shrink-0 mt-0.5">
								<Icons.Check className="w-4 h-4" />
							</span>
							<h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-normal">
								{obj.title}
							</h4>
						</div>

						{/* Key Results list */}
						<div className="space-y-4 pl-2 border-l border-slate-100 dark:border-slate-800">
							{obj.keyResults.map((kr) => (
								<div key={kr.id} className="space-y-2 pl-3">
									<div className="flex justify-between items-start gap-3">
										<p className="text-[11px] font-bold text-slate-655 dark:text-slate-300 leading-normal">
											{kr.title}
										</p>
										<span className="text-[10px] font-bold font-mono text-teal-brand shrink-0">
											{kr.progress}%
										</span>
									</div>

									{/* Progress bar */}
									<div className="w-full bg-slate-150 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
										<div
											className="bg-teal-brand h-full transition-all duration-300"
											style={{ width: `${kr.progress}%` }}
										/>
									</div>

									{/* Current vs Target values */}
									<div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
										<span>Current: {kr.currentValue} {kr.unit}</span>
										<span>Target: {kr.targetValue} {kr.unit}</span>
									</div>

									{/* Update slider */}
									<div className="flex items-center gap-3 pt-1">
										<label className="text-[8px] font-black text-slate-400 uppercase tracking-widest shrink-0">
											Slide to update:
										</label>
										<input
											type="range"
											min="0"
											max="100"
											value={kr.progress}
											onChange={(e) => updateKRProgress(obj.id, kr.id, Number(e.target.value))}
											className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-brand"
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Performance review assessment */}
			<div className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
						Manager Assessment ({performanceReview.reviewCycle})
					</h3>
					<span className="text-[10px] font-bold text-teal-brand bg-teal-brand/10 px-2 py-0.5 rounded">
						Reviewed by: {performanceReview.managerName.split(" ")[0]}
					</span>
				</div>

				<p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed italic bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
					"{performanceReview.managerFeedback}"
				</p>

				{/* Rating bars */}
				<div className="space-y-3.5">
					<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category Ratings</h4>
					
					{/* Technical Skills */}
					<div className="space-y-1">
						<div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
							<span>Technical Skills</span>
							<span>{performanceReview.ratings.technicalSkills} / 5.0</span>
						</div>
						<div className="w-full bg-slate-150 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
							<div
								className={`h-full ${getRatingColor(performanceReview.ratings.technicalSkills)}`}
								style={{ width: `${(performanceReview.ratings.technicalSkills / 5) * 100}%` }}
							/>
						</div>
					</div>

					{/* Communication */}
					<div className="space-y-1">
						<div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
							<span>Communication</span>
							<span>{performanceReview.ratings.communication} / 5.0</span>
						</div>
						<div className="w-full bg-slate-150 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
							<div
								className={`h-full ${getRatingColor(performanceReview.ratings.communication)}`}
								style={{ width: `${(performanceReview.ratings.communication / 5) * 100}%` }}
							/>
						</div>
					</div>

					{/* Teamwork */}
					<div className="space-y-1">
						<div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
							<span>Teamwork</span>
							<span>{performanceReview.ratings.teamwork} / 5.0</span>
						</div>
						<div className="w-full bg-slate-150 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
							<div
								className={`h-full ${getRatingColor(performanceReview.ratings.teamwork)}`}
								style={{ width: `${(performanceReview.ratings.teamwork / 5) * 100}%` }}
							/>
						</div>
					</div>

					{/* Delivery */}
					<div className="space-y-1">
						<div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
							<span>Delivery</span>
							<span>{performanceReview.ratings.delivery} / 5.0</span>
						</div>
						<div className="w-full bg-slate-150 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
							<div
								className={`h-full ${getRatingColor(performanceReview.ratings.delivery)}`}
								style={{ width: `${(performanceReview.ratings.delivery / 5) * 100}%` }}
							/>
						</div>
					</div>

					{/* Initiative */}
					<div className="space-y-1">
						<div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
							<span>Initiative</span>
							<span>{performanceReview.ratings.initiative} / 5.0</span>
						</div>
						<div className="w-full bg-slate-150 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
							<div
								className={`h-full ${getRatingColor(performanceReview.ratings.initiative)}`}
								style={{ width: `${(performanceReview.ratings.initiative / 5) * 100}%` }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default PerformanceScreen;
