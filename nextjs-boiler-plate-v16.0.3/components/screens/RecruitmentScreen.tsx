import React, { useState } from "react";
import { useHrmsStore, Candidate, JobListing } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function RecruitmentScreen() {
	const { jobListings, candidates, addJobListing, moveCandidateStage, updateCandidateNotes } = useHrmsStore();
	
	// Local UI states
	const [activeTab, setActiveTab] = useState<"Jobs" | "Pipeline">("Pipeline");
	const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
	const [candidateNotes, setCandidateNotes] = useState("");
	const [showJobModal, setShowJobModal] = useState(false);

	// New job form state
	const [jobTitle, setJobTitle] = useState("");
	const [jobDept, setJobDept] = useState("");
	const [jobLoc, setJobLoc] = useState("");
	const [jobType, setJobType] = useState<"Full-time" | "Contract">("Full-time");
	const [jobDesc, setJobDesc] = useState("");

	// Metrics
	const totalOpen = jobListings.length;
	const inProgressCandidates = candidates.filter((c) => c.stage !== "Hired").length;
	const hiredCount = candidates.filter((c) => c.stage === "Hired").length;

	// Kanban columns
	const stages: Candidate["stage"][] = ["Screening", "Interview", "Offer", "Hired"];

	// Get candidates for a stage
	const getCandidatesByStage = (stage: Candidate["stage"]) => {
		return candidates.filter((c) => c.stage === stage);
	};

	// Handle candidate card click to open notes modal
	const handleOpenNotes = (cand: Candidate) => {
		setSelectedCandidate(cand);
		setCandidateNotes(cand.notes);
	};

	// Save notes handler
	const handleSaveNotes = () => {
		if (selectedCandidate) {
			updateCandidateNotes(selectedCandidate.id, candidateNotes);
			setSelectedCandidate(null);
		}
	};

	// Add new job handler
	const handlePostJob = (e: React.FormEvent) => {
		e.preventDefault();
		if (!jobTitle || !jobDept || !jobLoc) return;
		addJobListing(jobTitle, jobDept, jobLoc, jobType, jobDesc);
		
		// Reset form
		setJobTitle("");
		setJobDept("");
		setJobLoc("");
		setJobType("Full-time");
		setJobDesc("");
		setShowJobModal(false);
		setActiveTab("Jobs");
	};

	// Helper to find next stage
	const getNextStage = (currentStage: Candidate["stage"]): Candidate["stage"] | null => {
		const currentIndex = stages.indexOf(currentStage);
		if (currentIndex < stages.length - 1) {
			return stages[currentIndex + 1];
		}
		return null;
	};

	// Helper to find previous stage
	const getPrevStage = (currentStage: Candidate["stage"]): Candidate["stage"] | null => {
		const currentIndex = stages.indexOf(currentStage);
		if (currentIndex > 0) {
			return stages[currentIndex - 1];
		}
		return null;
	};

	return (
		<div className="space-y-6 animate-slideup p-1 relative min-h-screen pb-20">
			{/* Header Banner */}
			<div className="rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 text-white card-shadow relative overflow-hidden flex items-center justify-between">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<Icons.Operations className="w-40 h-40" />
				</div>
				<div className="space-y-1">
					<span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
						Talent Acquisition
					</span>
					<h3 className="text-lg font-extrabold text-slate-100 mt-2">Recruitment Portal</h3>
					<p className="text-[10px] text-slate-400 leading-normal">
						Manage active job openings and track candidate interview pipelines
					</p>
				</div>
			</div>

			{/* Recruitment Metrics summary section */}
			<div className="grid grid-cols-3 gap-3">
				<div className="glass p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1">
					<span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Open Positions</span>
					<span className="text-xl font-extrabold text-teal-brand dark:text-teal-400 block">{totalOpen}</span>
				</div>
				<div className="glass p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1">
					<span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">In Pipeline</span>
					<span className="text-xl font-extrabold text-orange-brand block">{inProgressCandidates}</span>
				</div>
				<div className="glass p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1">
					<span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Hired (Month)</span>
					<span className="text-xl font-extrabold text-emerald-500 block">{hiredCount}</span>
				</div>
			</div>

			{/* Sub-tab selection */}
			<div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80 gap-1">
				<button
					onClick={() => setActiveTab("Pipeline")}
					className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
						activeTab === "Pipeline"
							? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
							: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
					}`}
				>
					Candidate Pipeline
				</button>
				<button
					onClick={() => setActiveTab("Jobs")}
					className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
						activeTab === "Jobs"
							? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
							: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
					}`}
				>
					Job Openings
				</button>
			</div>

			{/* TAB CONTENT: Candidate Pipeline (Kanban board) */}
			{activeTab === "Pipeline" && (
				<div className="space-y-4">
					<div className="flex justify-between items-center px-1">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kanban Board</h3>
						<span className="text-[9px] text-slate-400 italic">Scroll horizontally to view stages</span>
					</div>

					{/* Horizontal Kanban board column wrapper */}
					<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
						{stages.map((stage) => {
							const stageCandidates = getCandidatesByStage(stage);
							return (
								<div
									key={stage}
									className="w-[280px] shrink-0 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col space-y-3 snap-center min-h-[380px]"
								>
									{/* Column Header */}
									<div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/65 pb-2">
										<h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
											<span className={`w-2 h-2 rounded-full ${
												stage === "Screening"
													? "bg-slate-400"
													: stage === "Interview"
													? "bg-orange-brand"
													: stage === "Offer"
													? "bg-teal-brand"
													: "bg-emerald-500"
											}`} />
											{stage}
										</h4>
										<span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
											{stageCandidates.length}
										</span>
									</div>

									{/* Column Card list */}
									<div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
										{stageCandidates.length > 0 ? (
											stageCandidates.map((cand) => (
												<div
													key={cand.id}
													className="bg-white dark:bg-[#0c1220]/80 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-3 hover:border-teal-brand/30 dark:hover:border-teal-brand/35 transition-all group relative cursor-pointer"
													onClick={() => handleOpenNotes(cand)}
												>
													<div className="space-y-1">
														<div className="flex justify-between items-start">
															<h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-teal-brand transition-colors">
																{cand.name}
															</h5>
															{cand.notes && (
																<Icons.Document className="w-3.5 h-3.5 text-slate-350 shrink-0" />
															)}
														</div>
														<p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
															{cand.role}
														</p>
													</div>

													<div className="flex justify-between items-center text-[9px] font-bold">
														<span className="text-slate-400">Exp: {cand.experience}</span>
													</div>

													{/* stage action movement buttons */}
													<div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80" onClick={(e) => e.stopPropagation()}>
														{/* Move Previous Stage */}
														{getPrevStage(cand.stage) && (
															<button
																onClick={() => moveCandidateStage(cand.id, getPrevStage(cand.stage)!)}
																className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-450 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
																title="Move to previous stage"
															>
																<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
																	<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
																</svg>
															</button>
														)}

														{/* Move Next Stage */}
														{getNextStage(cand.stage) && (
															<button
																onClick={() => moveCandidateStage(cand.id, getNextStage(cand.stage)!)}
																className="flex items-center gap-1 py-1 px-2.5 bg-teal-brand/10 hover:bg-teal-brand/20 text-teal-brand dark:text-teal-400 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
																title="Advance stage"
															>
																<span>Advance</span>
																<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
																	<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
																</svg>
															</button>
														)}
													</div>
												</div>
											))
										) : (
											<div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-1.5">
												<span className="text-[10px] font-bold block">No Candidates</span>
												<span className="text-[9px] text-slate-450 leading-relaxed block">Drag/advance profiles here</span>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* TAB CONTENT: Job Openings catalog */}
			{activeTab === "Jobs" && (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Vacancies</h3>
						<button
							onClick={() => setShowJobModal(true)}
							className="bg-orange-brand hover:bg-orange-hover text-white py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-1"
						>
							<Icons.Plus className="w-3.5 h-3.5 text-white" />
							Post Job
						</button>
					</div>

					{/* Jobs List */}
					<div className="space-y-4">
						{jobListings.map((job) => (
							<div
								key={job.id}
								className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-3.5"
							>
								<div className="flex justify-between items-start">
									<div className="space-y-1">
										<h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
											{job.department}
										</h4>
										<h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
											{job.title}
										</h3>
									</div>
									<span className="text-[9px] font-black uppercase bg-teal-brand/10 text-teal-brand dark:text-teal-400 px-2 py-0.5 rounded border border-teal-brand/10">
										{job.type}
									</span>
								</div>

								{job.description && (
									<p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
										{job.description}
									</p>
								)}

								<div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-850">
									<span className="flex items-center gap-1">
										<svg className="w-3.5 h-3.5 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										{job.location}
									</span>
									<span className="text-slate-400 font-mono">Posted: {job.postedDate}</span>
								</div>

								<div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
									<span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Total Applicants</span>
									<span className="text-xs font-black text-teal-brand dark:text-teal-400">{job.applicantCount} Candidates</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* MODAL: Post New Job */}
			{showJobModal && (
				<div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
					<div className="w-full max-w-md bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4 animate-slideup max-h-[85vh] overflow-y-auto">
						<div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
							<h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
								<span className="w-2.5 h-2.5 bg-orange-brand rounded-full" />
								Post New Job
							</h3>
							<button
								onClick={() => setShowJobModal(false)}
								className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-450 cursor-pointer"
							>
								<Icons.Close className="w-4 h-4" />
							</button>
						</div>

						<form onSubmit={handlePostJob} className="space-y-4">
							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title *</label>
								<input
									type="text"
									required
									placeholder="e.g. Senior Frontend Developer"
									value={jobTitle}
									onChange={(e) => setJobTitle(e.target.value)}
									className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand"
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-1">
									<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department *</label>
									<input
										type="text"
										required
										placeholder="e.g. Engineering"
										value={jobDept}
										onChange={(e) => setJobDept(e.target.value)}
										className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand"
									/>
								</div>
								<div className="space-y-1">
									<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location *</label>
									<input
										type="text"
										required
										placeholder="e.g. Bangalore, India"
										value={jobLoc}
										onChange={(e) => setJobLoc(e.target.value)}
										className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand"
									/>
								</div>
							</div>

							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Type</label>
								<select
									value={jobType}
									onChange={(e) => setJobType(e.target.value as any)}
									className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand"
								>
									<option value="Full-time">Full-time</option>
									<option value="Contract">Contract</option>
								</select>
							</div>

							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Description</label>
								<textarea
									rows={3}
									placeholder="Write key responsibilities and expectations..."
									value={jobDesc}
									onChange={(e) => setJobDesc(e.target.value)}
									className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand resize-none"
								/>
							</div>

							<div className="pt-2">
								<button
									type="submit"
									className="w-full bg-teal-brand hover:bg-teal-hover text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer text-center"
								>
									Publish Job Post
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* SLIDE-UP MODAL: Candidate Notes Editor */}
			{selectedCandidate && (
				<div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
					<div className="w-full max-w-md bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4 animate-slideup max-h-[85vh] overflow-y-auto">
						
						<div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
							<div className="space-y-0.5">
								<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidate Profile</span>
								<h3 className="text-sm font-extrabold text-slate-800 dark:text-white leading-normal">
									{selectedCandidate.name}
								</h3>
							</div>
							<button
								onClick={() => setSelectedCandidate(null)}
								className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-450 cursor-pointer"
							>
								<Icons.Close className="w-4 h-4" />
							</button>
						</div>

						{/* Candidate mini summary */}
						<div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1 text-[11px] font-bold text-slate-600 dark:text-slate-350">
							<div className="flex justify-between">
								<span className="text-slate-400">Position Applied:</span>
								<span>{selectedCandidate.role}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">Total Experience:</span>
								<span>{selectedCandidate.experience}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">Current Stage:</span>
								<span className="text-teal-brand">{selectedCandidate.stage}</span>
							</div>
						</div>

						{/* Notes Editor area */}
						<div className="space-y-1.5">
							<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">HR Interview Notes</label>
							<textarea
								rows={4}
								placeholder="Add candidate evaluation notes, salary expectations, feedback or notice periods..."
								value={candidateNotes}
								onChange={(e) => setCandidateNotes(e.target.value)}
								className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand resize-none"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3 pt-2">
							<button
								onClick={() => setSelectedCandidate(null)}
								className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-xl text-xs font-bold transition-all hover:bg-slate-200 cursor-pointer text-center"
							>
								Cancel
							</button>
							<button
								onClick={handleSaveNotes}
								className="w-full bg-teal-brand hover:bg-teal-hover text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer text-center"
							>
								Save Notes
							</button>
						</div>
					</div>
				</div>
			)}

		</div>
	);
}

export default RecruitmentScreen;
