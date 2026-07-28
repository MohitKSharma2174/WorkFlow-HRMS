import React, { useState, useRef, useEffect } from "react";
import { useHrmsStore } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

interface ChatMessage {
	id: string;
	sender: "user" | "copilot";
	text: string;
	timestamp: string;
}

export function CopilotScreen() {
	const {
		leaveBalances,
		clockedIn,
		clockInTime,
		weeklyRecords,
		salaryProfile,
		expenseRequests,
		objectives,
		courses,
		announcements
	} = useHrmsStore();

	const employeeName = salaryProfile?.employeeName || "Sarah";
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	useEffect(() => {
		setMessages([
			{
				id: "welcome-1",
				sender: "copilot",
				text: `Hello ${employeeName}! 👋 Welcome to your WorkFlow AI assistant.`,
				timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
			},
			{
				id: "welcome-2",
				sender: "copilot",
				text: "I'm here to help you quickly query your HR info, check leave balances, track attendance, calculate salary projections, or check your OKRs.",
				timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
			},
			{
				id: "welcome-3",
				sender: "copilot",
				text: "What would you like to ask today? (Try typing 'help' to see all available commands)",
				timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
			}
		]);
	}, [employeeName]);

	const [inputValue, setInputValue] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom of chat
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, isTyping]);

	// Parse rule-based contextual reply
	const generateCopilotReply = (userMessage: string): string => {
		const cleanMsg = userMessage.toLowerCase().trim();

		// leaves/leave check
		if (/\bleaves?\b/.test(cleanMsg)) {
			const totalBalance = leaveBalances.casual + leaveBalances.sick + leaveBalances.earned + leaveBalances.compOff;
			return `Here are your current leave balances:\n\n` +
				`• Casual Leave: **${leaveBalances.casual} days**\n` +
				`• Sick Leave: **${leaveBalances.sick} days**\n` +
				`• Earned Leave: **${leaveBalances.earned} days**\n` +
				`• Comp-off: **${leaveBalances.compOff} days**\n\n` +
				`Total available leave balance: **${totalBalance} days**. You can apply for leaves in the Leave tab.`;
		}

		// attendance/clock check
		if (/\b(attendance|clock)\b/.test(cleanMsg)) {
			const statusMsg = clockedIn
				? `You are currently **Clocked In** since **${clockInTime}** today.`
				: `You are currently **Clocked Out**.`;

			// Find today's weekday shift stats
			const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			const todayName = weekdays[new Date().getDay()];
			const todayRecord = weeklyRecords.find((r) => r.day === todayName);

			let shiftMsg = "";
			if (todayRecord) {
				shiftMsg = `\n\nToday (${todayName}): Status is **${todayRecord.status}**. Hours logged: **${todayRecord.productiveHours} hrs** (Break: ${todayRecord.breakHours} hrs).`;
			}

			return `${statusMsg}${shiftMsg}\n\nYou can view full logs and clock in/out in the Attendance tab.`;
		}

		// salary/payslip/pay check
		if (/\b(salary|payslip|pay)\b/.test(cleanMsg)) {
			const { basicPay, specialAllowance, lta } = salaryProfile;
			const hra = Math.round(basicPay * 0.40);
			const grossSalary = basicPay + hra + specialAllowance + lta;
			const pf = Math.round(basicPay * 0.12);
			const esi = grossSalary < 21000 ? Math.round(grossSalary * 0.0075) : 0;
			const pt = 200;
			const totalDeductions = pf + esi + pt;
			const netTakeHome = grossSalary - totalDeductions;

			return `Here is your salary projection for the current month:\n\n` +
				`• **Gross Earnings**: ₹${grossSalary.toLocaleString("en-IN")}\n` +
				`  - Basic Pay: ₹${basicPay.toLocaleString("en-IN")}\n` +
				`  - HRA (40%): ₹${hra.toLocaleString("en-IN")}\n` +
				`  - Special Allowance: ₹${specialAllowance.toLocaleString("en-IN")}\n` +
				`  - LTA: ₹${lta.toLocaleString("en-IN")}\n\n` +
				`• **Deductions**: ₹${totalDeductions.toLocaleString("en-IN")}\n` +
				`  - Provident Fund (12%): ₹${pf.toLocaleString("en-IN")}\n` +
				`  - Professional Tax: ₹${pt}\n\n` +
				`• **Projected Net Take-home**: **₹${netTakeHome.toLocaleString("en-IN")}**\n\n` +
				`You can view and generate official payslips in the Payroll tab.`;
		}

		// expense/expenses check
		if (/\b(expense|expenses)\b/.test(cleanMsg)) {
			const pendingClaims = expenseRequests.filter(
				(r) => r.employeeName === employeeName && r.status === "Pending"
			);
			const pendingCount = pendingClaims.length;
			const totalPendingAmount = pendingClaims.reduce((sum, r) => sum + r.amount, 0);

			if (pendingCount === 0) {
				return `You do not have any pending expense claims currently.\n\nType 'expenses' or visit the Expenses tab to file a new reimbursement request.`;
			}

			return `You have **${pendingCount} pending** expense claim(s) totaling **₹${totalPendingAmount.toLocaleString("en-IN")}** awaiting review.\n\nYou can track details or upload receipts in the Expenses tab.`;
		}

		// goal/okr check
		if (/\b(goal|okr)s?\b/.test(cleanMsg)) {
			const allKRs = objectives.flatMap((o) => o.keyResults);
			const okrCompletion = allKRs.length > 0 ? Math.round(allKRs.reduce((sum, kr) => sum + kr.progress, 0) / allKRs.length) : 0;

			return `Your overall OKR Completion is at **${okrCompletion}%** for the current cycle.\n\n` +
				`Objectives count: **${objectives.length}**\n` +
				`Total key results tracked: **${allKRs.length}**\n\n` +
				`Update your progress values directly in the Performance tab.`;
		}

		// training/course check
		if (/\b(training|course)s?\b/.test(cleanMsg)) {
			const completed = courses.filter((c) => c.progress === 100).length;
			const inProgress = courses.filter((c) => c.progress > 0 && c.progress < 100).length;

			return `Here is your Learning & Development (L&D) progress summary:\n\n` +
				`• Completed Courses: **${completed}**\n` +
				`• In Progress Courses: **${inProgress}**\n` +
				`• Total Courses Enrolled: **${courses.length}**\n\n` +
				`You can resume courses and download certificates in the Training tab.`;
		}

		// announcement check
		if (/\b(announcement|announcements|notice|notices)\b/.test(cleanMsg)) {
			const unreadAnnouncements = announcements.filter((a) => !a.isRead).length;

			return `You have **${unreadAnnouncements} unread** announcement(s) on your WorkFlow bulletin feed.\n\nCheck them out in the Notices tab.`;
		}

		// hello/hi/help check
		if (/\b(hello|hi|help|hey)\b/.test(cleanMsg)) {
			return `Hi ${employeeName}! I am **WorkFlow AI**, your virtual HR copilot.\n\nI can retrieve personal metrics and information. Try asking me about:\n\n` +
				`• **leave** — remaining casual, sick, and earned leave balances\n` +
				`• **attendance** — clock status and daily shift hours\n` +
				`• **salary** — projected net take-home details and deductions\n` +
				`• **expenses** — count and total of your pending reimbursements\n` +
				`• **goals** — overall OKR progress percentages\n` +
				`• **training** — completed and active L&D course counts\n` +
				`• **announcements** — count of unread notifications`;
		}

		// Default fallback
		return "I can help you with leave, attendance, salary, expenses, goals, training, and announcements. Try asking about any of these!";
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim()) return;

		const userText = inputValue;
		const timestampStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

		// Append user message
		const newUserMsg: ChatMessage = {
			id: `user-${Date.now()}`,
			sender: "user",
			text: userText,
			timestamp: timestampStr
		};

		setMessages((prev) => [...prev, newUserMsg]);
		setInputValue("");
		setIsTyping(true);

		// Simulate AI delay
		setTimeout(() => {
			const copilotReply = generateCopilotReply(userText);
			const newCopilotMsg: ChatMessage = {
				id: `copilot-${Date.now()}`,
				sender: "copilot",
				text: copilotReply,
				timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
			};
			setMessages((prev) => [...prev, newCopilotMsg]);
			setIsTyping(false);
		}, 800);
	};

	return (
		<div className="flex flex-col h-[calc(100vh-170px)] sm:h-[630px] rounded-2xl overflow-hidden glass border border-slate-100 dark:border-slate-800/80 bg-white/10 dark:bg-slate-900/10 card-shadow animate-slideup">
			
			{/* Chat Header banner */}
			<div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shrink-0">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-orange-500 flex items-center justify-center shadow-md relative">
						<Icons.Copilot className="w-5 h-5 text-white" />
						<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
					</div>
					<div>
						<h3 className="text-xs font-black tracking-wide">WorkFlow AI</h3>
						<span className="text-[9px] text-teal-400 font-bold uppercase tracking-wider block">HR Copilot • Active</span>
					</div>
				</div>
				<span className="text-[9px] font-black uppercase text-orange-brand bg-orange-brand/10 border border-orange-brand/20 px-2 py-0.5 rounded-full">
					Prototype v1.0
				</span>
			</div>

			{/* Message History Feed */}
			<div 
				ref={scrollRef}
				className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-[#070b13]/40"
			>
				{messages.map((msg) => {
					const isUser = msg.sender === "user";
					return (
						<div 
							key={msg.id}
							className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}
						>
							{!isUser && (
								<div className="w-7 h-7 rounded-lg bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0">
									<Icons.Copilot className="w-4 h-4" />
								</div>
							)}
							<div className="max-w-[80%] flex flex-col">
								<div 
									className={`px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed card-shadow whitespace-pre-line ${
										isUser 
											? "bg-teal-brand text-white rounded-tr-none font-medium"
											: "glass border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 rounded-tl-none"
									}`}
								>
									{msg.text}
								</div>
								<span className={`text-[8px] text-slate-400 font-bold uppercase mt-1 block tracking-wider ${isUser ? "text-right" : "text-left"}`}>
									{msg.timestamp}
								</span>
							</div>
						</div>
					);
				})}

				{/* Bouncing Dots typing indicator */}
				{isTyping && (
					<div className="flex justify-start items-start gap-2.5">
						<div className="w-7 h-7 rounded-lg bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0">
							<Icons.Copilot className="w-4 h-4 animate-pulse" />
						</div>
						<div className="glass px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 flex gap-1.5 items-center justify-center">
							<span className="w-1.5 h-1.5 bg-teal-brand/80 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
							<span className="w-1.5 h-1.5 bg-teal-brand/80 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
							<span className="w-1.5 h-1.5 bg-teal-brand/80 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
						</div>
					</div>
				)}
			</div>

			{/* Chat Footer Input Section */}
			<form 
				onSubmit={handleSendMessage}
				className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-[#070b13]/85 backdrop-blur-md flex gap-2 shrink-0 items-center"
			>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Ask leaves, salary, attendance, OKRs..."
					className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-brand text-slate-800 dark:text-slate-200"
				/>
				<button 
					type="submit"
					className="w-8 h-8 rounded-xl bg-teal-brand hover:bg-teal-hover text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
				>
					<Icons.Send className="w-4 h-4" />
				</button>
			</form>
		</div>
	);
}
