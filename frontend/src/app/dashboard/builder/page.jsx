'use client';
import { useState } from 'react';
import { Sparkles, Loader2, FileText, CheckCircle2, Download, Briefcase, GraduationCap } from 'lucide-react';
import api from '@/lib/axios';

export default function BuilderPage() {
    const [rawNotes, setRawNotes] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!rawNotes || rawNotes.trim().length < 20) {
            setError('Please provide at least a few sentences of rough notes or past experience.');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            const response = await api.post('/resume/build', { rawNotes, targetRole });
            setResumeData(response.data.resumeData);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while building the resume.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">AI Resume Builder</h1>
                <p className="text-slate-400 text-sm">Turn your messy notes, rough bullet points, or old job descriptions into a perfectly structured, ATS-optimized resume.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Form Area */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Target Job Role</label>
                                <input 
                                    type="text" 
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    placeholder="e.g., Senior Product Manager"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Your Rough Notes</label>
                                <textarea 
                                    rows={10}
                                    value={rawNotes}
                                    onChange={(e) => setRawNotes(e.target.value)}
                                    placeholder="Just brain dump your experience here. Don't worry about formatting. e.g., 'Worked at Stripe from 2021 to 2023. I led a team of 5 engineers to build the new billing dashboard. It increased revenue by 20%...'"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || rawNotes.length < 20}
                            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Structuring Resume...</>
                            ) : (
                                <><Sparkles className="w-5 h-5" /> Auto-Build Resume</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Result Area */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full min-h-[600px]">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-400" /> Structured Result
                        </h3>
                        {resumeData && (
                            <button 
                                onClick={() => {
                                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
                                    const downloadAnchorNode = document.createElement('a');
                                    downloadAnchorNode.setAttribute("href",     dataStr);
                                    downloadAnchorNode.setAttribute("download", "resume_data.json");
                                    document.body.appendChild(downloadAnchorNode);
                                    downloadAnchorNode.click();
                                    downloadAnchorNode.remove();
                                }}
                                className="flex items-center gap-1.5 text-xs font-medium text-white transition-colors bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg"
                            >
                                <Download className="w-4 h-4" /> Download JSON
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-auto pr-2">
                        {resumeData ? (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                {/* Summary */}
                                <div>
                                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Professional Summary</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">{resumeData.summary}</p>
                                </div>

                                {/* Experience */}
                                <div>
                                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> Experience
                                    </h4>
                                    <div className="space-y-6">
                                        {resumeData.experience?.map((exp, idx) => (
                                            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-bold text-white">{exp.role}</div>
                                                        <div className="text-sm text-slate-400">{exp.company}</div>
                                                    </div>
                                                    <div className="text-xs font-medium bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">
                                                        {exp.startDate} - {exp.endDate}
                                                    </div>
                                                </div>
                                                <ul className="mt-3 space-y-2">
                                                    {exp.bullets?.map((bullet, i) => (
                                                        <li key={i} className="flex gap-2 text-sm text-slate-300 items-start">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                                                            <span className="leading-relaxed">{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Education */}
                                <div>
                                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" /> Education
                                    </h4>
                                    <div className="space-y-3">
                                        {resumeData.education?.map((edu, idx) => (
                                            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold text-white text-sm">{edu.degree}</div>
                                                    <div className="text-sm text-slate-400">{edu.institution}</div>
                                                </div>
                                                <div className="text-xs text-slate-500">{edu.year}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.skills?.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                <Sparkles className="w-8 h-8 mb-3 opacity-50" />
                                <p className="italic text-sm">Your perfectly structured resume will appear here...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
