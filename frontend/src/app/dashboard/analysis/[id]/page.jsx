'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ArrowLeft, CheckCircle2, Target, Lightbulb, FileText, 
    BarChart3, AlertTriangle, Sparkles, Loader2, Trash2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function AnalysisDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await api.get(`/resume/${id}`);
                setAnalysis(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load analysis.');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchAnalysis();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this analysis?')) return;
        setIsDeleting(true);
        try {
            await api.delete(`/resume/${id}`);
            router.push('/dashboard');
        } catch (err) {
            setError('Failed to delete analysis.');
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                    <p className="text-slate-400 text-sm">Loading analysis...</p>
                </div>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="p-8 max-w-3xl mx-auto text-center mt-20">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Analysis not found</h2>
                <p className="text-slate-400 mb-6">{error || 'This analysis may have been deleted.'}</p>
                <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 font-medium">
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    const score = analysis.ats_score;
    const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';
    const scoreBorderColor = score >= 80 ? 'border-emerald-500' : score >= 60 ? 'border-amber-500' : 'border-red-500';
    const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';
    const date = new Date(analysis.created_at).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors p-1">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Analysis Report</h1>
                        <p className="text-sm text-slate-500">{date}</p>
                    </div>
                </div>
                <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/5 disabled:opacity-50"
                >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>

            {/* Score Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className={`w-28 h-28 rounded-full border-4 ${scoreBorderColor} flex flex-col items-center justify-center shrink-0`}>
                        <span className={`text-3xl font-bold ${scoreColor}`}>{score}%</span>
                        <span className={`text-[10px] font-medium ${scoreColor} uppercase tracking-wider`}>{scoreLabel}</span>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold text-white mb-2">ATS Compatibility Score</h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                            Your resume scores {score}% against the provided job description. 
                            {score >= 80 ? ' Great job! Your resume is well-optimized.' : 
                             score >= 60 ? ' Good start — follow the suggestions below to push it higher.' :
                             ' Follow the suggestions below to significantly improve your chances.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> 
                        Matched Keywords ({analysis.matched_keywords?.length || 0})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.matched_keywords?.length > 0 ? analysis.matched_keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20 font-medium">{kw}</span>
                        )) : <p className="text-sm text-slate-500 italic">No matches found</p>}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4" /> 
                        Missing Keywords ({analysis.missing_keywords?.length || 0})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.missing_keywords?.length > 0 ? analysis.missing_keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20 font-medium">{kw}</span>
                        )) : <p className="text-sm text-slate-500 italic">All keywords matched!</p>}
                    </div>
                </div>
            </div>

            {/* Skills Breakdown */}
            {(analysis.skills?.present?.length > 0 || analysis.skills?.missing?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Skills Present
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.skills.present?.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 text-xs rounded-lg border border-indigo-500/20">{s}</span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Skills Missing
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.skills.missing?.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 bg-amber-500/10 text-amber-300 text-xs rounded-lg border border-amber-500/20">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Suggestions */}
            {analysis.suggestions?.length > 0 && (
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" /> AI Suggestions
                    </h3>
                    <ul className="space-y-3">
                        {analysis.suggestions.map((s, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-300">
                                <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                                <span className="leading-relaxed">{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Rewritten Bullets (Pro) */}
            {analysis.rewritten_bullets?.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> AI-Rewritten Bullets
                        <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full ml-2">PRO</span>
                    </h3>
                    <ul className="space-y-3">
                        {analysis.rewritten_bullets.map((bullet, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                                <span className="leading-relaxed">{bullet}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Formatting Analysis (Pro) */}
            {analysis.formattingAnalysis?.score != null && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" /> Formatting Analysis
                        <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full ml-2">PRO</span>
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-2xl font-bold text-white">{analysis.formattingAnalysis.score}/100</div>
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <div 
                                className="bg-indigo-500 h-2 rounded-full transition-all" 
                                style={{ width: `${analysis.formattingAnalysis.score}%` }} 
                            />
                        </div>
                    </div>
                    {analysis.formattingAnalysis.issues?.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-red-400 mb-2">Issues Found</h4>
                            <ul className="space-y-2">
                                {analysis.formattingAnalysis.issues.map((issue, i) => (
                                    <li key={i} className="text-sm text-slate-400 flex gap-2 items-start">
                                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {analysis.formattingAnalysis.suggestions?.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-emerald-400 mb-2">Fix Recommendations</h4>
                            <ul className="space-y-2">
                                {analysis.formattingAnalysis.suggestions.map((s, i) => (
                                    <li key={i} className="text-sm text-slate-400 flex gap-2 items-start">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Keyword Recommendations */}
            {analysis.keyword_recommendations?.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-400" /> Recommended Keywords to Add
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.keyword_recommendations.map((kw, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700 font-medium">
                                + {kw}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                    href="/dashboard/upload" 
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors text-center text-sm"
                >
                    Run Another Scan
                </Link>
                <Link 
                    href="/dashboard" 
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-center text-sm"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
