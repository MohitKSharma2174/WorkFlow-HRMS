import React, { useState, useEffect } from "react";
import { useHrmsStore, DocumentItem } from "../../stores/hrmsStore";
import { Icons } from "../Icons";

export function DocumentsScreen() {
	const { documents, addDocument, role } = useHrmsStore();
	const [activeCategory, setActiveCategory] = useState<DocumentItem["category"]>("Employment");
	const [searchQuery, setSearchQuery] = useState("");
	
	// Upload Form States
	const [isUploadOpen, setIsUploadOpen] = useState(false);
	const [docName, setDocName] = useState("");
	const [docCategory, setDocCategory] = useState<DocumentItem["category"]>("Employment");
	const [docFileType, setDocFileType] = useState<DocumentItem["fileType"]>("PDF");

	// Toast State
	const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

	// Auto-fade toast
	useEffect(() => {
		if (toast) {
			const timer = setTimeout(() => {
				setToast(null);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [toast]);

	const showToast = (message: string, type: "success" | "info" = "success") => {
		setToast({ message, type });
	};

	const handleUpload = (e: React.FormEvent) => {
		e.preventDefault();
		if (!docName.trim()) {
			showToast("Please enter a document name", "info");
			return;
		}
		addDocument(docName.trim(), docCategory, docFileType);
		showToast("Document uploaded successfully ✓", "success");
		setDocName("");
		setIsUploadOpen(false);
	};

	const simulateView = (name: string) => {
		showToast(`Opening document: ${name}...`, "success");
	};

	const simulateDownload = (name: string) => {
		showToast(`Downloading document: ${name}...`, "success");
	};

	// Filter and search
	const filteredDocs = documents
		.filter((doc) => doc.category === activeCategory)
		.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));

	// Category configuration with icons
	const categories: { label: DocumentItem["category"]; count: number }[] = [
		{ label: "Personal", count: documents.filter((d) => d.category === "Personal").length },
		{ label: "Employment", count: documents.filter((d) => d.category === "Employment").length },
		{ label: "Tax", count: documents.filter((d) => d.category === "Tax").length },
		{ label: "Payroll", count: documents.filter((d) => d.category === "Payroll").length },
	];

	return (
		<div className="space-y-6 animate-slideup p-1 pb-10">
			{/* Floating Notification Toast */}
			{toast && (
				<div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fadein max-w-xs w-full px-4">
					<div className={`p-4 rounded-xl shadow-xl border flex items-center gap-3 backdrop-blur-md ${
						toast.type === "success" 
							? "bg-teal-500/90 text-white border-teal-400/30" 
							: "bg-orange-500/90 text-white border-orange-400/30"
					}`}>
						<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span className="text-xs font-bold leading-normal">{toast.message}</span>
					</div>
				</div>
			)}

			{/* Welcome Banner */}
			<div className="rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-5 text-white card-shadow relative overflow-hidden">
				<div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
					<svg className="w-44 h-44" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</div>
				
				<div className="relative z-10 space-y-2">
					<span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
						Digital Cabinet
					</span>
					<h2 className="text-xl font-extrabold tracking-tight">Documents Vault</h2>
					<p className="text-teal-100 text-xs leading-relaxed max-w-xs">
						Access all official files, tax forms, employment contracts, and personal ID copies.
					</p>
				</div>
			</div>

			{/* Search and Action Bar */}
			<div className="flex gap-2 items-center">
				<div className="flex-1 relative">
					<span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</span>
					<input
						type="text"
						placeholder="Search documents by name..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-brand dark:text-white"
					/>
				</div>

				<button
					onClick={() => setIsUploadOpen(!isUploadOpen)}
					className="bg-orange-brand hover:bg-orange-hover text-white p-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
					title="Upload Document"
				>
					<Icons.Plus className="w-5 h-5" />
				</button>
			</div>

			{/* Upload Document Form Dropdown */}
			{isUploadOpen && (
				<div className="glass p-5 rounded-2xl border border-orange-brand/20 dark:border-orange-brand/35 bg-orange-brand/5 dark:bg-orange-950/10 card-shadow-orange space-y-4 animate-slideup">
					<div className="flex justify-between items-center">
						<h3 className="text-xs font-extrabold text-orange-brand dark:text-orange-400 tracking-wider uppercase">
							Upload New Document
						</h3>
						<button
							onClick={() => setIsUploadOpen(false)}
							className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
						>
							<Icons.Close className="w-4 h-4" />
						</button>
					</div>

					<form onSubmit={handleUpload} className="space-y-4 text-xs">
						<div>
							<label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5">Document Name</label>
							<input
								type="text"
								value={docName}
								onChange={(e) => setDocName(e.target.value)}
								placeholder="e.g. Aadhaar Card Front"
								className="w-full px-3.5 py-2.5 bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-brand dark:text-white"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5">Category</label>
								<select
									value={docCategory}
									onChange={(e) => setDocCategory(e.target.value as any)}
									className="w-full px-3 py-2.5 bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-brand dark:text-white font-bold"
								>
									<option value="Personal">Personal</option>
									<option value="Employment">Employment</option>
									<option value="Tax">Tax</option>
									<option value="Payroll">Payroll</option>
								</select>
							</div>

							<div>
								<label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5">File Format</label>
								<select
									value={docFileType}
									onChange={(e) => setDocFileType(e.target.value as any)}
									className="w-full px-3 py-2.5 bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-brand dark:text-white font-bold"
								>
									<option value="PDF">PDF</option>
									<option value="DOC">DOC / DOCX</option>
									<option value="IMG">Image (JPG/PNG)</option>
								</select>
							</div>
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="button"
								onClick={() => setIsUploadOpen(false)}
								className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer font-bold"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="flex-1 bg-orange-brand hover:bg-orange-hover text-white py-3 rounded-xl font-bold shadow-md cursor-pointer"
							>
								Submit Upload
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Category Filter Tabs */}
			<div className="flex gap-1.5 bg-slate-100/80 dark:bg-slate-900/50 p-1 rounded-xl overflow-x-auto scrollbar-none">
				{categories.map((cat) => {
					const isSelected = activeCategory === cat.label;
					return (
						<button
							key={cat.label}
							onClick={() => setActiveCategory(cat.label)}
							className={`flex-1 text-center py-2 px-3 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
								isSelected
									? "bg-white dark:bg-[#070b13] text-teal-brand dark:text-teal-400 shadow-sm"
									: "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
							}`}
						>
							{cat.label}
							<span className={`px-1.5 py-0.2 rounded-full text-[8px] font-bold ${
								isSelected 
									? "bg-teal-brand/10 text-teal-brand dark:text-teal-400" 
									: "bg-slate-200 dark:bg-slate-800 text-slate-500"
							}`}>
								{cat.count}
							</span>
						</button>
					);
				})}
			</div>

			{/* Document Grid/List */}
			<div className="space-y-3">
				{filteredDocs.length === 0 ? (
					<div className="glass text-center py-10 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-slate-400 text-xs flex flex-col justify-center items-center space-y-2">
						<svg className="w-8 h-8 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<span className="font-bold">No documents found in this section</span>
						<p className="text-[10px] text-slate-500">Upload a PDF, DOC, or image to start organizing your files.</p>
					</div>
				) : (
					filteredDocs.map((doc) => {
						// Format-specific icons and colors
						const formatStyle = 
							doc.fileType === "PDF"
								? { bg: "bg-rose-50 dark:bg-rose-950/20", border: "border-rose-100 dark:border-rose-900/30", text: "text-rose-600 dark:text-rose-400", icon: (
									<svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
									</svg>
								)}
								: doc.fileType === "DOC"
								? { bg: "bg-indigo-50 dark:bg-indigo-950/20", border: "border-indigo-100 dark:border-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", icon: (
									<svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
								)}
								: { bg: "bg-teal-50 dark:bg-teal-950/20", border: "border-teal-100 dark:border-teal-900/30", text: "text-teal-600 dark:text-teal-400", icon: (
									<svg className="w-5 h-5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								)};

						return (
							<div
								key={doc.id}
								className="glass p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 card-shadow flex flex-col justify-between hover:border-teal-brand/20 dark:hover:border-teal-brand/20 transition-all duration-300"
							>
								<div className="flex items-start gap-3">
									{/* Format Icon */}
									<div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${formatStyle.bg} ${formatStyle.border}`}>
										{formatStyle.icon}
									</div>

									{/* Meta Details */}
									<div className="min-w-0 flex-1">
										<div className="flex justify-between items-start gap-2">
											<h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pr-1">
												{doc.name}
											</h4>
											<span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border uppercase tracking-wider shrink-0 ${formatStyle.bg} ${formatStyle.border} ${formatStyle.text}`}>
												{doc.fileType}
											</span>
										</div>
										<p className="text-[10px] text-slate-400 mt-1">
											Uploaded: {doc.uploadDate} &bull; By: {doc.uploadedBy}
										</p>
									</div>
								</div>

								{/* Action Buttons Row */}
								<div className="flex gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/40">
									<button
										onClick={() => simulateView(doc.name)}
										className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 hover:border-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
									>
										<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
										View File
									</button>

									<button
										onClick={() => simulateDownload(doc.name)}
										className="flex-1 bg-teal-brand/10 hover:bg-teal-brand/15 text-teal-brand dark:text-teal-400 py-2.5 rounded-xl text-[10px] font-bold transition-all border border-teal-brand/10 dark:border-teal-brand/20 flex items-center justify-center gap-1 cursor-pointer"
									>
										<Icons.Download className="w-3.5 h-3.5" />
										Download
									</button>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
