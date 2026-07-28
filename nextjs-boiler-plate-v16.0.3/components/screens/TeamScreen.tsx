import React, { useState } from "react";
import { useHrmsStore, TeamMember } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function TeamScreen() {
	const { role, teamMembers, addTeamMember, leaveBalances, clockedIn, salaryProfile } = useHrmsStore();
	const employeeName = salaryProfile?.employeeName || "Sarah";
	
	// Local UI states
	const [searchQuery, setSearchQuery] = useState("");
	const [activeDept, setActiveDept] = useState<"All" | "Engineering" | "Design" | "Marketing" | "HR">("All");
	const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
	const [showAddModal, setShowAddModal] = useState(false);

	// Form states
	const [name, setName] = useState("");
	const [designation, setDesignation] = useState("");
	const [department, setDepartment] = useState("Engineering");
	const [email, setEmail] = useState("");
	const [joiningDate, setJoiningDate] = useState("");

	// Counts
	const totalMembers = teamMembers.length;
	const presentCount = teamMembers.filter((m) => m.status === "Active").length;
	const leaveCount = teamMembers.filter((m) => m.status === "On Leave").length;
	const remoteCount = teamMembers.filter((m) => m.status === "Remote").length;

	// Filter & Search Logic
	const filteredMembers = teamMembers.filter((m) => {
		const matchesSearch =
			m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
			m.designation.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesDept = activeFilterDept(m.department);
		return matchesSearch && matchesDept;
	});

	function activeFilterDept(dept: string) {
		if (activeDept === "All") return true;
		return dept.toLowerCase() === activeDept.toLowerCase();
	}

	// Add member form submit
	const handleAddSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !designation || !email || !joiningDate) return;
		addTeamMember(name, designation, department, email, joiningDate);
		
		// Reset
		setName("");
		setDesignation("");
		setDepartment("Engineering");
		setEmail("");
		setJoiningDate("");
		setShowAddModal(false);
	};

	// Initials helper
	const getInitials = (fullName: string) => {
		return fullName
			.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2);
	};

	// Status badge styling helper
	const getStatusBadgeClass = (status: TeamMember["status"]) => {
		switch (status) {
			case "Active":
				return "bg-emerald-500/10 text-emerald-500";
			case "On Leave":
				return "bg-rose-500/10 text-rose-500";
			case "Remote":
				return "bg-orange-500/10 text-orange-500";
			default:
				return "bg-slate-500/10 text-slate-500";
		}
	};

	// Mock Leave Balances for selected member
	const getLeaveBalancesForMember = (member: TeamMember) => {
		if (member.name === employeeName) {
			return {
				casual: leaveBalances.casual,
				sick: leaveBalances.sick,
				earned: leaveBalances.earned
			};
		}
		// Deterministic mock balances based on name length to look realistic
		const seed = member.name.length;
		return {
			casual: (seed % 6) + 4,
			sick: (seed % 5) + 3,
			earned: (seed % 10) + 8
		};
	};

	// Mock Shift Status for selected member
	const getShiftStatusForMember = (member: TeamMember) => {
		if (member.name === employeeName) {
			return clockedIn ? "Present (Clocked In 09:12 AM)" : "Not Clocked In";
		}
		switch (member.status) {
			case "Active":
				return "Present (Clocked In 09:05 AM)";
			case "Remote":
				return "Present (Clocked In - Remote Shift)";
			case "On Leave":
				return "On Leave (Approved Paid Leave)";
			default:
				return "Off Duty";
		}
	};

	return (
		<div className="space-y-6 animate-slideup p-1 relative min-h-screen pb-20">
			{/* Header Banner */}
			<div className="rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 text-white card-shadow relative overflow-hidden flex items-center justify-between">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<Icons.Talent className="w-40 h-40" />
				</div>
				<div className="space-y-1">
					<span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
						Directory & Operations
					</span>
					<h3 className="text-lg font-extrabold text-slate-100 mt-2">Team Management</h3>
					<p className="text-[10px] text-slate-400 leading-normal">
						Browse employee profiles, check shifts, and administer headcount
					</p>
				</div>
			</div>

			{/* Top Overview Cards */}
			<div className="grid grid-cols-4 gap-2">
				<div className="glass p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-0.5">
					<span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block">Total</span>
					<span className="text-base font-extrabold text-slate-700 dark:text-slate-350 block">{totalMembers}</span>
				</div>
				<div className="glass p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-0.5">
					<span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block">Active</span>
					<span className="text-base font-extrabold text-emerald-500 block">{presentCount}</span>
				</div>
				<div className="glass p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-0.5">
					<span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block">On Leave</span>
					<span className="text-base font-extrabold text-rose-500 block">{leaveCount}</span>
				</div>
				<div className="glass p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 card-shadow text-center space-y-0.5">
					<span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block">Remote</span>
					<span className="text-base font-extrabold text-orange-brand block">{remoteCount}</span>
				</div>
			</div>

			{/* Search and Add Member actions */}
			<div className="space-y-3">
				<div className="flex gap-2">
					<div className="relative flex-1">
						<input
							type="text"
							placeholder="Search by name, department, title..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand"
						/>
						<svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					{role === "Admin" && (
						<button
							onClick={() => setShowAddModal(true)}
							className="bg-orange-brand hover:bg-orange-hover text-white px-3.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1 shrink-0"
						>
							<Icons.Plus className="w-3.5 h-3.5 text-white" />
							Add
						</button>
					)}
				</div>

				{/* Department filter tabs */}
				<div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80 gap-1 overflow-x-auto scrollbar-none">
					{(["All", "Engineering", "Design", "Marketing", "HR"] as const).map((dept) => (
						<button
							key={dept}
							onClick={() => setActiveDept(dept)}
							className={`flex-1 text-center py-2 px-3 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
								activeDept === dept
									? "bg-white dark:bg-[#111726] text-teal-brand dark:text-teal-400 shadow-sm font-extrabold"
									: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
							}`}
						>
							{dept}
						</button>
					))}
				</div>
			</div>

			{/* Employee list directory */}
			<div className="space-y-3">
				<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
					Directory Listings ({filteredMembers.length})
				</h3>

				<div className="space-y-3">
					{filteredMembers.length > 0 ? (
						filteredMembers.map((member) => (
							<div
								key={member.id}
								onClick={() => setSelectedMember(member)}
								className="glass rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 card-shadow flex items-center justify-between hover:border-teal-brand/20 dark:hover:border-teal-brand/20 transition-all cursor-pointer group"
							>
								<div className="flex items-center gap-3 min-w-0">
									{/* Avatar initials badge */}
									<div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center border border-slate-200/50 dark:border-slate-800 font-extrabold text-xs text-teal-brand dark:text-teal-400 group-hover:scale-105 transition-transform shrink-0">
										{getInitials(member.name)}
									</div>
									<div className="min-w-0 space-y-0.5">
										<h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-normal truncate group-hover:text-teal-brand transition-colors">
											{member.name}
										</h4>
										<p className="text-[10px] text-slate-400 truncate">
											{member.designation} • <span className="font-bold">{member.department}</span>
										</p>
									</div>
								</div>

								{/* Status Badge */}
								<span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0 ${getStatusBadgeClass(member.status)}`}>
									{member.status}
								</span>
							</div>
						))
					) : (
						<div className="glass rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800/80 card-shadow bg-white/20 dark:bg-slate-900/10 py-12 space-y-3">
							<div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
								<Icons.Info className="w-6 h-6" />
							</div>
							<h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
								No members found
							</h4>
							<p className="text-[11px] text-slate-500 dark:text-slate-450 max-w-[200px] mx-auto leading-relaxed">
								There are no directory contacts matching search or filter parameters.
							</p>
						</div>
					)}
				</div>
			</div>

			{/* SLIDE-UP PROFILE DETAIL PANEL */}
			{selectedMember && (
				<div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
					<div className="w-full max-w-md bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4 animate-slideup max-h-[85vh] overflow-y-auto">
						
						<div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
							<div className="space-y-0.5">
								<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee Profile Details</span>
								<h3 className="text-sm font-extrabold text-slate-800 dark:text-white leading-normal">
									{selectedMember.name}
								</h3>
							</div>
							<button
								onClick={() => setSelectedMember(null)}
								className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-450 cursor-pointer"
							>
								<Icons.Close className="w-4 h-4" />
							</button>
						</div>

						{/* Full profile card info */}
						<div className="space-y-3">
							
							{/* Contact Card */}
							<div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-2.5 text-xs">
								<h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Information</h4>
								
								<div className="flex justify-between">
									<span className="text-slate-400">Designation:</span>
									<span className="font-bold text-slate-700 dark:text-slate-300">{selectedMember.designation}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Department:</span>
									<span className="font-bold text-slate-700 dark:text-slate-300">{selectedMember.department}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Email:</span>
									<span className="font-bold text-teal-brand dark:text-teal-400">{selectedMember.email}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Phone:</span>
									<span className="font-bold text-slate-700 dark:text-slate-300">{selectedMember.phone}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Manager:</span>
									<span className="font-bold text-slate-700 dark:text-slate-300">{selectedMember.manager}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Joining Date:</span>
									<span className="font-bold text-slate-750 dark:text-slate-300 font-mono">{selectedMember.joiningDate}</span>
								</div>
							</div>

							{/* Attendance Today */}
							<div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-2 text-xs">
								<h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Shift Status</h4>
								<div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
									<span className={`w-2.5 h-2.5 rounded-full ${
										selectedMember.status === "Active"
											? "bg-emerald-500"
											: selectedMember.status === "Remote"
											? "bg-orange-brand"
											: "bg-rose-500"
									}`} />
									<span>{getShiftStatusForMember(selectedMember)}</span>
								</div>
							</div>

							{/* Leave Balances */}
							<div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-3.5 text-xs">
								<h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Leave Balance Summary</h4>
								
								<div className="grid grid-cols-3 gap-2 text-center">
									<div className="p-2 bg-white dark:bg-[#111726]/80 rounded-xl border border-slate-150 dark:border-slate-800">
										<span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Casual</span>
										<span className="text-sm font-black text-slate-700 dark:text-slate-300 mt-1 block">
											{getLeaveBalancesForMember(selectedMember).casual}d
										</span>
									</div>
									<div className="p-2 bg-white dark:bg-[#111726]/80 rounded-xl border border-slate-150 dark:border-slate-800">
										<span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Sick</span>
										<span className="text-sm font-black text-slate-700 dark:text-slate-300 mt-1 block">
											{getLeaveBalancesForMember(selectedMember).sick}d
										</span>
									</div>
									<div className="p-2 bg-white dark:bg-[#111726]/80 rounded-xl border border-slate-150 dark:border-slate-800">
										<span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Earned</span>
										<span className="text-sm font-black text-slate-700 dark:text-slate-300 mt-1 block">
											{getLeaveBalancesForMember(selectedMember).earned}d
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="pt-2">
							<button
								onClick={() => setSelectedMember(null)}
								className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
							>
								Back to Directory
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ADMIN MODAL: Add New Team Member */}
			{showAddModal && (
				<div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
					<div className="w-full max-w-md bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4 animate-slideup max-h-[85vh] overflow-y-auto">
						
						<div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
							<h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
								<span className="w-2.5 h-2.5 bg-orange-brand rounded-full animate-pulse" />
								Add Team Member
							</h3>
							<button
								onClick={() => setShowAddModal(false)}
								className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-450 cursor-pointer"
							>
								<Icons.Close className="w-4 h-4" />
							</button>
						</div>

						<form onSubmit={handleAddSubmit} className="space-y-4">
							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Colleague Name *</label>
								<input
									type="text"
									required
									placeholder="e.g. Neha Gupta"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand"
								/>
							</div>

							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation *</label>
								<input
									type="text"
									required
									placeholder="e.g. Senior QA Engineer"
									value={designation}
									onChange={(e) => setDesignation(e.target.value)}
									className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand"
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-1">
									<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
									<select
										value={department}
										onChange={(e) => setDepartment(e.target.value)}
										className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand cursor-pointer"
									>
										<option value="Engineering">Engineering</option>
										<option value="Design">Design</option>
										<option value="Marketing">Marketing</option>
										<option value="HR">HR</option>
									</select>
								</div>
								<div className="space-y-1">
									<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joining Date *</label>
									<input
										type="date"
										required
										value={joiningDate}
										onChange={(e) => setJoiningDate(e.target.value)}
										className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand font-mono"
									/>
								</div>
							</div>

							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address *</label>
								<input
									type="email"
									required
									placeholder="e.g. neha.gupta@workflow.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-brand"
								/>
							</div>

							<div className="pt-2">
								<button
									type="submit"
									className="w-full bg-teal-brand hover:bg-teal-hover text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer text-center"
								>
									Add Member
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

		</div>
	);
}

export default TeamScreen;
