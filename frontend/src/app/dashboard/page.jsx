'use client';
import { useState, useEffect } from 'react';
import { FileText, Plus, Target, Clock, ArrowRight, Activity, Award, BarChart3, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

export default function DashboardOverview() {
    const { user } = useAuth();
    const [recentScans, setRecentScans] = useState([]);
    const [stats, setStats] = useState({ averageScore: 0, totalScans: 0, scansUsed: 0, scanLimit: 3 });
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [resumeRes, analyticsRes] = await Promise.all([
                    api.get('/resume'),
                    api.get('/analytics/summary')
                ]);
                
                const analyses = resumeRes.data.analyses || [];
                setRecentScans(analyses);

                setStats({
                    averageScore: analyticsRes.data.averageScore || 0,
                    totalScans: analyticsRes.data.total || 0,
                    scansUsed: resumeRes.data.scanInfo?.scansUsed || 0,
                    scanLimit: resumeRes.data.scanInfo?.scanLimit || 3
                });
                
                setAnalytics(analyticsRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const firstName = user?.user_metadata?.full_name?.split(' ')[0] 
                   || user?.user_metadata?.name?.split(' ')[0]
                   || user?.email?.split('@')[0] 
                   || 'User';

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {firstName}</h1>
                    <p className="text-slate-400">Here's what's happening with your job search today.</p>
                </div>
                <Link 
                    href="/dashboard/upload" 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                    <Plus className="w-5 h-5" />
                    New Scan
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                            <Target className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Average Score</p>
                            <h3 className="text-2xl font-bold text-white">{stats.averageScore}%</h3>
                        </div>
                    </div>
                    <div className="text-sm text-slate-400 flex items-center gap-1 font-medium mt-4">
                        Based on your previous scans
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                            <FileText className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Scans</p>
                            <h3 className="text-2xl font-bold text-white">{stats.totalScans}</h3>
                        </div>
                    </div>
                    <div className="text-sm text-slate-400 mt-4">
                        {Math.max(0, stats.scanLimit - stats.scansUsed)} remaining on Free Plan
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-indigo-200 font-medium">Pro Plan</p>
                            <h3 className="text-xl font-bold text-white">Unlock Everything</h3>
                        </div>
                    </div>
                    <Link href="/dashboard/billing" className="text-sm font-semibold text-white mt-4 inline-flex items-center gap-1 hover:gap-2 transition-all relative z-10">
                        Upgrade now <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Analytics Section */}
            {analytics && analytics.total > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Missing Keywords */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <h2 className="text-lg font-bold text-white">Frequent Missing Keywords</h2>
                        </div>
                        {analytics.topKeywords?.length > 0 ? (
                            <div className="space-y-3">
                                {analytics.topKeywords.slice(0, 5).map((kw, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300 font-medium">{kw.keyword}</span>
                                        <span className="text-slate-500 bg-slate-800 px-2.5 py-0.5 rounded-full text-xs">Missing {kw.count}x</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">No missing keywords found across your scans.</p>
                        )}
                    </div>

                    {/* Score Distribution */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-lg font-bold text-white">Score Distribution</h2>
                        </div>
                        {analytics.scoreDistribution?.length > 0 ? (
                            <div className="space-y-4 mt-2">
                                {analytics.scoreDistribution.map((bucket, i) => {
                                    const maxCount = Math.max(...analytics.scoreDistribution.map(b => b.count), 1);
                                    const percent = Math.round((bucket.count / maxCount) * 100);
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="text-xs text-slate-400 w-12 text-right">{bucket.label}</span>
                                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-white w-6">{bucket.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">No scores to distribute yet.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Recent Scans */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Scans</h2>
                    <Link href="/dashboard/upload" className="text-indigo-400 text-sm font-medium hover:text-indigo-300">View all</Link>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-slate-800/50">
                        {isLoading ? (
                            <div className="p-6 text-center text-slate-400">Loading your scans...</div>
                        ) : recentScans.length > 0 ? (
                            recentScans.map((scan) => {
                                const date = new Date(scan.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                });
                                return (
                                    <Link key={scan._id || scan.id} href={`/dashboard/analysis/${scan._id || scan.id}`} className="p-6 hover:bg-slate-800/30 transition-colors flex items-center justify-between group block">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold
                                                ${scan.ats_score >= 80 ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 
                                                  scan.ats_score >= 70 ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 
                                                  'border-red-500/50 text-red-400 bg-red-500/10'}`}>
                                                {scan.ats_score}%
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">ATS Scan</h4>
                                                <p className="text-sm text-slate-400 flex items-center gap-2">
                                                    <Clock className="w-3 h-3" /> {date}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg transition-all">
                                            View Report →
                                        </span>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="p-6 text-center text-slate-400 flex flex-col items-center">
                                <FileText className="w-12 h-12 text-slate-600 mb-3" />
                                <p>No previous scans found. Click "New Scan" to get started!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
