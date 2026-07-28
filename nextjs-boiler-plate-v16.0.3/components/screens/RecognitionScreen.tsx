import React, { useState } from "react";
import { useHrmsStore, RecognitionItem } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function RecognitionScreen() {
	const { recognitions, addRecognition, salaryProfile } = useHrmsStore();
	const employeeName = salaryProfile?.employeeName || "Sarah";
	const [activeTab, setActiveTab] = useState<"Feed" | "Leaderboard" | "My">("Feed");
	const [showGiveModal, setShowGiveModal] = useState(false);

	// Form states
	const [toName, setToName] = useState("");
	const [badge, setBadge] = useState<RecognitionItem["badge"]>("Team Player");
	const [message, setMessage] = useState("");

	// Colleagues list (filter out active user)
	const allEmployees = ["Sarah", "Michael", "HR Specialist", "Admin", "Alex"];
	const colleagues = allEmployees.filter((name) => name !== employeeName);

	// Badge configurations
	const badgeConfig: Record<
		RecognitionItem["badge"],
		{ emoji: string; color: string; border: string; bg: string }
	> = {
		"Team Player": {
			emoji: "🤝",
			color: "text-teal-600 dark:text-teal-400",
			border: "border-teal-200 dark:border-teal-900/50",
			bg: "bg-teal-50 dark:bg-teal-950/20"
		},
		"Innovation": {
			emoji: "💡",
			color: "text-cyan-600 dark:text-cyan-400",
			border: "border-cyan-200 dark:border-cyan-900/50",
			bg: "bg-cyan-50 dark:bg-cyan-950/20"
		},
		"Leadership": {
			emoji: "👑",
			color: "text-amber-600 dark:text-amber-400",
			border: "border-amber-200 dark:border-amber-900/50",
			bg: "bg-amber-50 dark:bg-amber-950/20"
		},
		"Above & Beyond": {
			emoji: "🚀",
			color: "text-purple-600 dark:text-purple-400",
			border: "border-purple-200 dark:border-purple-900/50",
			bg: "bg-purple-50 dark:bg-purple-950/20"
		},
		"Customer First": {
			emoji: "🎯",
			color: "text-orange-600 dark:text-orange-400",
			border: "border-orange-200 dark:border-orange-900/50",
			bg: "bg-orange-50 dark:bg-orange-950/20"
		}
	};

	// Calculate leaderboard points received this month
	// Calculate leaderboard points received this month
	const leaderboard = allEmployees
		.map((emp) => {
			const empRecognitions = recognitions.filter((r) => r.toName === emp);
			const totalPoints = empRecognitions.reduce((sum, r) => sum + r.points, 0);
			return {
				name: emp,
				points: totalPoints,
				count: empRecognitions.length
			};
		})
		.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
		.slice(0, 5);

	// Recognitions received by active employee
	const myRecognitions = recognitions.filter((r) => r.toName === employeeName);
	const myTotalPoints = myRecognitions.reduce((sum, r) => sum + r.points, 0);

	const handleGiveSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!toName || !message) return;
		addRecognition(toName, badge, message);
		
		// Reset form
		setToName("");
		setBadge("Team Player");
		setMessage("");
		setShowGiveModal(false);
		setActiveTab("Feed");
	};

	// Colleague Initials helper
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("");
	};

	return (
		<div className="space-y-6 animate-slideup p-1 relative min-h-screen pb-20">
			
			{/* Gamified Header Summary Card */}
			<div className="rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 text-white card-shadow relative overflow-hidden flex items-center justify-between">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<Icons.Medal className="w-40 h-40" />
				</div>
				
				<div className="space-y-1 z-10">
					<span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
						Peer Kudos Program
					</span>
					<h3 className="text-lg font-extrabold text-slate-100 mt-2">WorkFlow Awards</h3>
					<p className="text-[10px] text-slate-400 leading-normal">Praise colleagues, award points & climb the rankings</p>
				</div>

				<div className="text-right z-10 shrink-0 flex flex-col items-end">
					<span className="text-3xl font-black font-mono text-orange-brand">{myTotalPoints}</span>
					<span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">My Kudos Points</span>
				</div>
			</div>

			{/* Sub tabs selection */}
			<div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80 gap-1 overflow-x-auto scrollbar-none">
				<button
					onClick={() => setActiveTab("Feed")}
					className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
						activeTab === "Feed"
							? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
							: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
					}`}
				>
					Kudos Feed
				</button>
				<button
					onClick={() => setActiveTab("Leaderboard")}
					className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
						activeTab === "Leaderboard"
							? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
							: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
					}`}
				>
					Monthly Leaderboard
				</button>
				<button
					onClick={() => setActiveTab("My")}
					className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
						activeTab === "My"
							? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
							: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
					}`}
				>
					Received ({myRecognitions.length})
				</button>
			</div>

			{/* TAB CONTENT: social Kudos Feed */}
			{activeTab === "Feed" && (
				<div className="space-y-4">
					<div className="flex justify-between items-center px-1">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Feed</h3>
						<button
							onClick={() => setShowGiveModal(true)}
							className="bg-orange-brand hover:bg-orange-hover text-white py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-1"
						>
							<Icons.Plus className="w-3.5 h-3.5 text-white" />
							Give Kudos
						</button>
					</div>

					<div className="space-y-4">
						{recognitions.map((rec) => {
							const cfg = badgeConfig[rec.badge];
							return (
								<div
									key={rec.id}
									className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-3.5 animate-slideup"
								>
									{/* Feed Header */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700 font-extrabold text-[11px] text-teal-brand">
												{getInitials(rec.fromName)}
											</div>
											<div className="space-y-0.5">
												<h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-none">
													{rec.fromName}
												</h4>
												<p className="text-[10px] text-slate-400">
													recognized <span className="text-teal-brand dark:text-teal-400 font-bold">{rec.toName}</span>
												</p>
											</div>
										</div>
										<span className="text-[9px] text-slate-400 font-mono">{rec.date}</span>
									</div>

									{/* Badge block */}
									<div className={`flex items-center gap-2 p-2.5 rounded-xl border ${cfg.border} ${cfg.bg}`}>
										<span className="text-lg">{cfg.emoji}</span>
										<div className="min-w-0">
											<h5 className={`text-[10px] font-black uppercase tracking-wider ${cfg.color}`}>
												{rec.badge}
											</h5>
											<p className="text-[9px] text-slate-450 uppercase font-black tracking-widest mt-0.5 font-mono">
												Awarded +{rec.points} pts
											</p>
										</div>
									</div>

									{/* Personal Message */}
									<p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-medium pl-1">
										"{rec.message}"
									</p>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* TAB CONTENT: dynamic Leaderboard */}
			{activeTab === "Leaderboard" && (
				<div className="space-y-4">
					<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Top Performers This Month</h3>
					
					<div className="glass rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow overflow-hidden divide-y divide-slate-100 dark:divide-slate-850">
						{leaderboard.map((item, index) => {
							const rankMedals = ["🥇", "🥈", "🥉"];
							return (
								<div
									key={item.name}
									className="flex items-center justify-between p-4 bg-white/20 dark:bg-slate-900/10 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all"
								>
									<div className="flex items-center gap-4">
										{/* Rank */}
										<span className="text-lg w-6 text-center font-bold text-slate-400">
											{index < 3 ? rankMedals[index] : index + 1}
										</span>

										{/* Avatar initials */}
										<div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center border border-slate-200/50 dark:border-slate-800 font-extrabold text-xs text-teal-brand dark:text-teal-400">
											{getInitials(item.name)}
										</div>

										<div className="space-y-0.5">
											<h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
												{item.name}
												{item.name === employeeName && (
													<span className="text-[8px] font-black text-orange-brand bg-orange-brand/10 px-1.5 py-0.5 rounded">YOU</span>
												)}
											</h4>
											<p className="text-[10px] text-slate-400 font-semibold">{item.count} recognitions received</p>
										</div>
									</div>

									{/* Points badge */}
									<div className="text-right">
										<span className="text-sm font-black font-mono text-teal-brand dark:text-teal-400 block">{item.points}</span>
										<span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block font-mono">pts</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* TAB CONTENT: my received recognitions */}
			{activeTab === "My" && (
				<div className="space-y-4">
					<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Accolades Received</h3>

					{myRecognitions.length > 0 ? (
						<div className="space-y-4">
							{myRecognitions.map((rec) => {
								const cfg = badgeConfig[rec.badge];
								return (
									<div
										key={rec.id}
										className="glass rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 card-shadow space-y-3.5 animate-slideup"
									>
										{/* Card Header */}
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700 font-extrabold text-[11px] text-orange-brand">
													{getInitials(rec.fromName)}
												</div>
												<div className="space-y-0.5">
													<h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-none">
														From: {rec.fromName}
													</h4>
													<p className="text-[9px] text-slate-400 font-semibold">Awarded to you</p>
												</div>
											</div>
											<span className="text-[9px] text-slate-400 font-mono">{rec.date}</span>
										</div>

										{/* Badge detail */}
										<div className={`flex items-center gap-2 p-2.5 rounded-xl border ${cfg.border} ${cfg.bg}`}>
											<span className="text-lg">{cfg.emoji}</span>
											<div className="min-w-0">
												<h5 className={`text-[10px] font-black uppercase tracking-wider ${cfg.color}`}>
													{rec.badge}
												</h5>
												<p className="text-[9px] text-slate-450 uppercase font-black tracking-widest mt-0.5 font-mono">
													+{rec.points} pts added
												</p>
											</div>
										</div>

										{/* Message */}
										<p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-medium pl-1 italic">
											"{rec.message}"
										</p>
									</div>
								);
							})}
						</div>
					) : (
						<div className="glass rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800/80 card-shadow bg-white/20 dark:bg-slate-900/10 py-12 space-y-3">
							<div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
								<Icons.Info className="w-6 h-6" />
							</div>
							<h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
								No recognitions yet
							</h4>
							<p className="text-[11px] text-slate-500 dark:text-slate-450 max-w-[200px] mx-auto leading-relaxed">
								You have not received any kudos accolades yet for this period.
							</p>
						</div>
					)}
				</div>
			)}

			{/* MODAL: Give Colleague Kudos Recognition */}
			{showGiveModal && (
				<div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
					<div className="w-full max-w-md bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4 animate-slideup max-h-[85vh] overflow-y-auto">
						
						<div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
							<h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
								<span className="w-2.5 h-2.5 bg-orange-brand rounded-full animate-pulse" />
								Give Colleague Kudos
							</h3>
							<button
								onClick={() => setShowGiveModal(false)}
								className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-450 cursor-pointer"
							>
								<Icons.Close className="w-4 h-4" />
							</button>
						</div>

						<form onSubmit={handleGiveSubmit} className="space-y-4">
							
							{/* Colleague selection */}
							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Colleague *</label>
								<select
									required
									value={toName}
									onChange={(e) => setToName(e.target.value)}
									className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand cursor-pointer"
								>
									<option value="">-- Choose Colleague --</option>
									{colleagues.map((name) => (
										<option key={name} value={name}>
											{name}
										</option>
									))}
								</select>
							</div>

							{/* Badge selection grid */}
							<div className="space-y-2">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Award Recognition Badge *</label>
								<div className="grid grid-cols-2 gap-2">
									{(Object.keys(badgeConfig) as Array<keyof typeof badgeConfig>).map((key) => {
										const cfg = badgeConfig[key];
										const isSelected = badge === key;
										return (
											<button
												key={key}
												type="button"
												onClick={() => setBadge(key)}
												className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
													isSelected
														? "border-teal-brand bg-teal-brand/5 shadow-sm font-extrabold"
														: "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-550 dark:text-slate-400"
												}`}
											>
												<span className="text-xl shrink-0">{cfg.emoji}</span>
												<div className="min-w-0">
													<h5 className="text-[10px] font-bold leading-tight">{key}</h5>
													<p className="text-[8px] text-slate-400 mt-0.5 leading-none">+100 Pts</p>
												</div>
											</button>
										);
									})}
								</div>
							</div>

							{/* Message input */}
							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kudos Message *</label>
								<textarea
									required
									rows={3}
									placeholder="Describe specifically how this person exemplified this value..."
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand resize-none"
								/>
							</div>

							<div className="pt-2">
								<button
									type="submit"
									className="w-full bg-teal-brand hover:bg-teal-hover text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer text-center"
								>
									Send Kudos & Award Points
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

		</div>
	);
}

export default RecognitionScreen;
