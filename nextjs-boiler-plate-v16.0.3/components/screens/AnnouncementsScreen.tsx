import React, { useState } from "react";
import { useHrmsStore, AnnouncementItem } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function AnnouncementsScreen() {
	const { role, announcements, addAnnouncement, markAnnouncementRead, acknowledgeAnnouncement } = useHrmsStore();
	const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "High">("All");
	const [showPostModal, setShowPostModal] = useState(false);

	// Form states
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState<AnnouncementItem["category"]>("General");
	const [priority, setPriority] = useState<AnnouncementItem["priority"]>("Medium");
	const [message, setMessage] = useState("");

	// Counts
	const totalNotices = announcements.length;
	const unreadCount = announcements.filter((a) => !a.isRead).length;
	const highCount = announcements.filter((a) => a.priority === "High").length;

	// Filter logic
	const filteredAnnouncements = announcements.filter((a) => {
		if (activeFilter === "Unread") return !a.isRead;
		if (activeFilter === "High") return a.priority === "High";
		return true;
	});

	// Form submit handler
	const handlePostSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !message) return;
		addAnnouncement(title, category, priority, message);
		
		// Reset
		setTitle("");
		setCategory("General");
		setPriority("Medium");
		setMessage("");
		setShowPostModal(false);
		setActiveFilter("All");
	};

	// Helper styling for category badges
	const getCategoryBadgeClass = (cat: string) => {
		switch (cat) {
			case "Policy":
				return "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30";
			case "Holiday":
				return "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30";
			case "Event":
				return "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30";
			default:
				return "bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800/30";
		}
	};

	// Helper styling for priority badges
	const getPriorityBadgeClass = (pri: string) => {
		switch (pri) {
			case "High":
				return "bg-red-500 text-white shadow-xs";
			case "Medium":
				return "bg-orange-brand text-white shadow-xs";
			default:
				return "bg-slate-400 text-white shadow-xs";
		}
	};

	// Check if user is HR/Admin to allow posting notices
	const canPost = role === "HR" || role === "Admin";

	return (
		<div className="space-y-6 animate-slideup p-1 relative min-h-screen pb-20">
			
			{/* Top Announcements metrics bar */}
			<div className="grid grid-cols-3 gap-3">
				<div className="glass p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1">
					<span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Total Notices</span>
					<span className="text-xl font-extrabold text-slate-700 dark:text-slate-350 block">{totalNotices}</span>
				</div>
				<div className="glass p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1 relative">
					{unreadCount > 0 && (
						<span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-brand animate-ping" />
					)}
					<span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Unread Alerts</span>
					<span className="text-xl font-extrabold text-orange-brand block">{unreadCount}</span>
				</div>
				<div className="glass p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-1">
					<span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Urgent Priority</span>
					<span className="text-xl font-extrabold text-red-500 block">{highCount}</span>
				</div>
			</div>

			{/* Sub-tab selection */}
			<div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80 gap-1">
				<button
					onClick={() => setActiveFilter("All")}
					className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
						activeFilter === "All"
							? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
							: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
					}`}
				>
					All Bulletins
				</button>
				<button
					onClick={() => setActiveFilter("Unread")}
					className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
						activeFilter === "Unread"
							? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
							: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
					}`}
				>
					Unread ({unreadCount})
				</button>
				<button
					onClick={() => setActiveFilter("High")}
					className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
						activeFilter === "High"
							? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
							: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
					}`}
				>
					High Priority
				</button>
			</div>

			{/* Social Feed List */}
			<div className="space-y-4">
				<div className="flex justify-between items-center px-1">
					<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Notices</h3>
					{canPost && (
						<button
							onClick={() => setShowPostModal(true)}
							className="bg-orange-brand hover:bg-orange-hover text-white py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-1"
						>
							<Icons.Plus className="w-3.5 h-3.5 text-white" />
							Post Notice
						</button>
					)}
				</div>

				<div className="space-y-4">
					{filteredAnnouncements.length > 0 ? (
						filteredAnnouncements.map((ann) => (
							<div
								key={ann.id}
								onClick={() => !ann.isRead && markAnnouncementRead(ann.id)}
								className={`glass rounded-2xl p-5 border card-shadow space-y-4 transition-all relative cursor-pointer ${
									!ann.isRead
										? "border-orange-brand/20 dark:border-orange-brand/35 bg-orange-brand/5 dark:bg-orange-950/5 shadow-xs"
										: "border-slate-100 dark:border-slate-800/80 bg-white/20 dark:bg-slate-900/10"
								}`}
							>
								{/* Left unread bar indicator */}
								{!ann.isRead && (
									<div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-brand rounded-l-2xl" />
								)}

								{/* Top Info section */}
								<div className="flex justify-between items-center pl-1">
									<div className="flex items-center gap-2">
										<span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getCategoryBadgeClass(ann.category)}`}>
											{ann.category}
										</span>
										<span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${getPriorityBadgeClass(ann.priority)}`}>
											{ann.priority}
										</span>
									</div>
									<span className="text-[9px] text-slate-400 font-mono">{ann.postedDate}</span>
								</div>

								{/* Headline */}
								<div className="space-y-1">
									<h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-snug flex items-center gap-2 pl-1">
										{ann.title}
										{!ann.isRead && (
											<span className="w-2 h-2 rounded-full bg-orange-brand shrink-0 block" title="New Alert" />
										)}
									</h4>
									<p className="text-[9px] text-slate-400 font-bold pl-1 uppercase tracking-wider">
										Posted By: {ann.postedBy}
									</p>
								</div>

								{/* Body Text */}
								<p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-medium pl-1">
									{ann.message}
								</p>

								{/* Acknowledge button block (Only for High priority or important notices) */}
								{ann.priority === "High" && (
									<div className="pt-2 pl-1 border-t border-slate-100 dark:border-slate-800/80" onClick={(e) => e.stopPropagation()}>
										{ann.acknowledgedAt ? (
											<div className="flex items-center gap-2 text-[10px] text-teal-brand font-bold bg-teal-brand/5 dark:bg-teal-950/20 p-2.5 rounded-xl border border-teal-brand/10 w-fit">
												<Icons.Check className="w-4 h-4 text-teal-brand" />
												<span>Acknowledged on: {ann.acknowledgedAt}</span>
											</div>
										) : (
											<button
												onClick={() => acknowledgeAnnouncement(ann.id)}
												className="bg-teal-brand hover:bg-teal-hover text-white py-2 px-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-xs active:scale-98 cursor-pointer flex items-center gap-1.5"
											>
												<Icons.Check className="w-3.5 h-3.5 text-white" />
												Acknowledge Receipt
											</button>
										)}
									</div>
								)}
							</div>
						))
					) : (
						<div className="glass rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800/80 card-shadow bg-white/20 dark:bg-slate-900/10 py-12 space-y-3">
							<div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
								<Icons.Info className="w-6 h-6" />
							</div>
							<h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
								No notices found
							</h4>
							<p className="text-[11px] text-slate-500 dark:text-slate-450 max-w-[200px] mx-auto leading-relaxed">
								There are no announcements matching this filter configuration.
							</p>
						</div>
					)}
				</div>
			</div>

			{/* MODAL: Post New Announcement (HR/Admin only) */}
			{showPostModal && (
				<div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
					<div className="w-full max-w-md bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4 animate-slideup max-h-[85vh] overflow-y-auto">
						
						<div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
							<h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
								<span className="w-2.5 h-2.5 bg-orange-brand rounded-full animate-pulse" />
								Post New Announcement
							</h3>
							<button
								onClick={() => setShowPostModal(false)}
								className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-450 cursor-pointer"
							>
								<Icons.Close className="w-4 h-4" />
							</button>
						</div>

						<form onSubmit={handlePostSubmit} className="space-y-4">
							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notice Title *</label>
								<input
									type="text"
									required
									placeholder="e.g. System Maintenance Schedule"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand"
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-1">
									<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
									<select
										value={category}
										onChange={(e) => setCategory(e.target.value as any)}
										className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand cursor-pointer"
									>
										<option value="General">General</option>
										<option value="Policy">Policy</option>
										<option value="Holiday">Holiday</option>
										<option value="Event">Event</option>
									</select>
								</div>
								<div className="space-y-1">
									<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
									<select
										value={priority}
										onChange={(e) => setPriority(e.target.value as any)}
										className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand cursor-pointer"
									>
										<option value="Low">Low</option>
										<option value="Medium">Medium</option>
										<option value="High">High</option>
									</select>
								</div>
							</div>

							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Body *</label>
								<textarea
									required
									rows={4}
									placeholder="Write your company announcement here..."
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
									Publish Notice
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

		</div>
	);
}

export default AnnouncementsScreen;
