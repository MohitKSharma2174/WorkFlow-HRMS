import React, { useState, useEffect } from "react";
import { useHrmsStore } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function AttendanceScreen() {
	const { clockedIn, clockInTime, weeklyRecords, clockIn, clockOut } = useHrmsStore();
	const [secondsWorked, setSecondsWorked] = useState(0);
	const [simulationState, setSimulationState] = useState<"idle" | "verifying" | "success">("idle");

	// Find today's record (Thursday)
	const todayRecord = weeklyRecords.find((rec) => rec.day === "Thursday") || {
		status: "Absent",
		clockIn: null,
		clockOut: null,
		productiveHours: 0,
		breakHours: 0,
		overtimeHours: 0,
	};

	// Timer logic
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (clockedIn && clockInTime) {
			const tick = () => {
				const diff = Date.now() - new Date(clockInTime).getTime();
				setSecondsWorked(Math.floor(diff / 1000));
			};
			tick();
			interval = setInterval(tick, 1000);
		} else {
			setSecondsWorked(0);
		}
		return () => clearInterval(interval);
	}, [clockedIn, clockInTime]);

	const formatTimer = (totalSeconds: number) => {
		const hrs = Math.floor(totalSeconds / 3600);
		const mins = Math.floor((totalSeconds % 3600) / 60);
		const secs = totalSeconds % 60;
		return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const handleClockInClick = () => {
		setSimulationState("verifying");
		
		// Simulate GPS & Selfie validation checks after a 1.2s delay
		setTimeout(() => {
			setSimulationState("success");
			clockIn();
			
			// Reset simulation alert after 4 seconds
			setTimeout(() => {
				setSimulationState("idle");
			}, 4000);
		}, 1200);
	};

	const handleClockOutClick = () => {
		clockOut();
		setSimulationState("idle");
	};

	// Define status badges styles
	const getStatusStyles = (status: string) => {
		switch (status) {
			case "Present":
				return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
			case "Late":
				return "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900";
			case "Absent":
			default:
				return "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800";
		}
	};

	return (
		<div className="space-y-6 animate-slideup p-1">
			{/* Today's Attendance Overview Card */}
			<div className="glass rounded-2xl p-5 card-shadow border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
				<div className="space-y-1">
					<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Duty Status</span>
					<h3 className="text-lg font-bold text-slate-800 dark:text-white">Thursday, 25 Jun</h3>
				</div>
				<span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${getStatusStyles(todayRecord.status)}`}>
					{todayRecord.status}
				</span>
			</div>

			{/* Clocking Module Widget */}
			<div className="glass rounded-3xl p-6 card-shadow border border-slate-100 dark:border-slate-800/80 text-center space-y-5">
				{/* Clock state indicators */}
				<div className="flex flex-col items-center">
					<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
						clockedIn
							? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
							: "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
					}`}>
						<span className={`w-1.5 h-1.5 rounded-full ${clockedIn ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
						{clockedIn ? "Active Shift Timer" : "Shift Inactive"}
					</span>

					{clockedIn ? (
						<div className="mt-4 space-y-1">
							<h2 className="text-4xl font-extrabold font-mono tracking-tight text-teal-brand dark:text-teal-400">
								{formatTimer(secondsWorked)}
							</h2>
							<p className="text-[10px] text-slate-400">
								Shift started at {todayRecord.clockIn}
							</p>
						</div>
					) : (
						<div className="mt-4 py-2">
							<h2 className="text-3xl font-extrabold text-slate-400 dark:text-slate-600">00:00:00</h2>
							<p className="text-[10px] text-slate-400">Ready to clock in</p>
						</div>
					)}
				</div>

				{/* Simulation checks indicator banner */}
				{simulationState === "verifying" && (
					<div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 text-xs space-y-2 text-left animate-pulse">
						<p className="text-teal-brand font-bold">Verifying compliance coordinates...</p>
						<div className="flex items-center gap-2 text-slate-400">
							<span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 animate-ping" />
							<span>Validating geofence coordinates</span>
						</div>
						<div className="flex items-center gap-2 text-slate-400">
							<span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 animate-ping" />
							<span>Capturing selfie validation placeholder</span>
						</div>
					</div>
				)}

				{simulationState === "success" && (
					<div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl p-4 text-xs text-left space-y-1">
						<p className="font-bold">Verification Successful!</p>
						<p className="flex items-center gap-1.5 font-semibold text-[11px] text-emerald-500">
							✓ Location verified (Office HQ Geofence)
						</p>
						<p className="flex items-center gap-1.5 font-semibold text-[11px] text-emerald-500">
							✓ Selfie captured (Verification logged)
						</p>
					</div>
				)}

				{/* Interactive Buttons */}
				{clockedIn ? (
					<button
						onClick={handleClockOutClick}
						className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all card-shadow flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg"
					>
						<Icons.Clock className="w-5 h-5" />
						Clock Out Shift
					</button>
				) : (
					<button
						onClick={handleClockInClick}
						disabled={simulationState === "verifying"}
						className="w-full py-4 bg-teal-brand hover:bg-teal-hover text-white font-bold rounded-2xl transition-all card-shadow flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Icons.Clock className="w-5 h-5" />
						{simulationState === "verifying" ? "Validating..." : "Clock In Shift"}
					</button>
				)}
			</div>

			{/* Working Hours Summary Panel */}
			<div className="grid grid-cols-3 gap-3">
				<div className="glass rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 text-center">
					<span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Productive</span>
					<span className="text-base font-bold text-teal-brand dark:text-teal-400 mt-1 block">
						{todayRecord.productiveHours}h
					</span>
				</div>
				<div className="glass rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 text-center">
					<span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Breaks</span>
					<span className="text-base font-bold text-slate-600 dark:text-slate-300 mt-1 block">
						{todayRecord.breakHours}h
					</span>
				</div>
				<div className="glass rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 text-center">
					<span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Overtime</span>
					<span className="text-base font-bold text-orange-brand dark:text-orange-400 mt-1 block">
						{todayRecord.overtimeHours}h
					</span>
				</div>
			</div>

			{/* Weekly History List */}
			<div className="glass rounded-2xl p-5 card-shadow space-y-4 border border-slate-100 dark:border-slate-800/80">
				<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Weekly History</h3>
				<div className="space-y-3">
					{weeklyRecords.map((rec) => (
						<div
							key={rec.day}
							className="p-3 bg-white/20 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/80 rounded-xl flex justify-between items-center text-xs"
						>
							<div className="space-y-0.5">
								<div className="flex items-center gap-2">
									<span className="font-extrabold text-slate-800 dark:text-slate-200">{rec.day}</span>
									<span className="text-[10px] text-slate-400">{rec.date}</span>
								</div>
								<p className="text-[10px] text-slate-500">
									{rec.clockIn ? `${rec.clockIn} - ${rec.clockOut || "Active"}` : "No clock logs recorded"}
								</p>
							</div>

							<div className="text-right space-y-1">
								<span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyles(rec.status)}`}>
									{rec.status}
								</span>
								{rec.productiveHours > 0 && (
									<span className="text-[9px] text-slate-400 block font-semibold">
										{rec.productiveHours} hrs worked
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
export default AttendanceScreen;
