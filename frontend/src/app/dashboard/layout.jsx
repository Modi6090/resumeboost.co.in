'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    ScanLine, 
    FileText, 
    Mail, 
    CreditCard, 
    LogOut,
    FileCode2,
    Menu,
    X,
    Zap,
    User
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const { user, logout, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scanInfo, setScanInfo] = useState({ scansUsed: 0, scanLimit: 3, plan: 'free' });

    // Fetch real scan usage data
    useEffect(() => {
        const fetchScanInfo = async () => {
            try {
                const response = await api.get('/resume');
                const info = response.data.scanInfo;
                if (info) {
                    setScanInfo({ 
                        scansUsed: info.scansUsed || 0, 
                        scanLimit: info.scanLimit || 3,
                        plan: info.plan || 'free' 
                    });
                }
            } catch (err) {
                // silently fail — sidebar still works with defaults
            }
        };
        if (user) fetchScanInfo();
    }, [user, pathname]); // re-fetch when navigating (after a new scan)

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/upload', label: 'Scanner', icon: ScanLine },
        { href: '/dashboard/builder', label: 'Resume Builder', icon: FileText },
        { href: '/dashboard/cover-letters', label: 'Cover Letters', icon: Mail },
        { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
        { href: '/dashboard/profile', label: 'Profile', icon: User },
    ];

    const scanPercent = scanInfo.scanLimit > 0 
        ? Math.min(100, Math.round((scanInfo.scansUsed / scanInfo.scanLimit) * 100)) 
        : 0;

    const firstName = user?.user_metadata?.full_name?.split(' ')[0] 
                   || user?.user_metadata?.name?.split(' ')[0]
                   || user?.email?.split('@')[0] 
                   || 'User';

    const SidebarContent = () => (
        <>
            <div className="p-6 flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <FileCode2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ResumeBoost</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                isActive 
                                ? 'bg-indigo-600/10 text-indigo-400' 
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4">
                {/* Scan usage widget */}
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700/50">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-white">
                            {scanInfo.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                        </h4>
                        {scanInfo.plan === 'pro' && (
                            <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">PRO</span>
                        )}
                    </div>
                    {scanInfo.plan !== 'pro' && (
                        <>
                            <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
                                <div 
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        scanPercent >= 100 ? 'bg-red-500' : scanPercent >= 66 ? 'bg-amber-500' : 'bg-indigo-500'
                                    }`} 
                                    style={{ width: `${scanPercent}%` }} 
                                />
                            </div>
                            <p className="text-xs text-slate-400 mb-3">
                                {scanInfo.scansUsed} of {scanInfo.scanLimit} scans used this month
                            </p>
                            <Link 
                                href="/dashboard/billing" 
                                onClick={() => setSidebarOpen(false)}
                                className="w-full text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1"
                            >
                                <Zap className="w-3 h-3" /> Upgrade to Pro
                            </Link>
                        </>
                    )}
                    {scanInfo.plan === 'pro' && (
                        <p className="text-xs text-slate-400">Unlimited scans · All features unlocked</p>
                    )}
                </div>

                {/* User info + sign out */}
                <div className="flex items-center gap-3 px-2 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {firstName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{firstName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
                
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-[#020617] text-white">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-slate-800 bg-[#020617] flex-col shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <FileCode2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">ResumeBoost</span>
                </div>
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-slate-300 hover:text-white p-1"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <>
                    <div 
                        className="md:hidden fixed inset-0 bg-black/60 z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-[#020617] border-r border-slate-800 z-50 flex flex-col overflow-y-auto">
                        <SidebarContent />
                    </aside>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto md:pt-0 pt-14">
                {children}
            </main>
        </div>
    );
}
