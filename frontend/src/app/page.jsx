'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, Zap, Target, FileText, Shield, ArrowRight, Menu, X, Check, Mail } from 'lucide-react';

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-clip relative">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/50">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        ResumeBoost
                    </span>
                </Link>
                
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link href="/dashboard/upload" className="bg-white text-[#020617] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2">
                        Get Started <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-slate-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                </nav>
            </header>

            {/* Mobile Nav Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
                    <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-medium text-slate-300 hover:text-white transition-colors">Features</Link>
                    <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-medium text-slate-300 hover:text-white transition-colors">How it works</Link>
                    <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-medium text-slate-300 hover:text-white transition-colors">Pricing</Link>
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link href="/dashboard/upload" onClick={() => setMobileMenuOpen(false)} className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-500 transition-colors flex items-center gap-2">
                            Get Started <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <main className="container mx-auto px-6 pt-16 md:pt-24 pb-32 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-indigo-400 text-sm font-medium mb-8">
                        <Zap className="w-4 h-4" />
                        AI-Powered Resume Optimization
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        Beat the ATS and land your <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                            dream job faster.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
                        Upload your resume, paste the job description, and let our advanced AI analyze your compatibility. Get actionable suggestions to optimize your keywords and formatting in seconds.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                        <Link href="/dashboard/upload" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group">
                            Scan Your Resume Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#demo" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2 border border-slate-700">
                            View Demo
                        </Link>
                    </div>
                </div>

                {/* Dashboard Preview / Demo Section */}
                <div id="demo" className="mt-24 relative mx-auto max-w-5xl px-4 scroll-mt-32">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 rounded-2xl" />
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-xl">
                        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                            {/* Mock Dashboard Header */}
                            <div className="h-12 border-b border-slate-800 flex items-center px-4 gap-2 bg-slate-900/80">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <div className="p-4 md:p-8 flex flex-col md:flex-row gap-8">
                                <div className="hidden md:block w-48 space-y-4">
                                    <div className="h-8 bg-slate-800/50 rounded animate-pulse" />
                                    <div className="h-8 bg-slate-800/50 rounded animate-pulse w-3/4" />
                                    <div className="h-8 bg-slate-800/50 rounded animate-pulse w-5/6" />
                                    <div className="h-8 bg-slate-800/50 rounded animate-pulse w-2/3" />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-2">
                                            <div className="h-6 w-32 md:w-48 bg-slate-800 rounded animate-pulse" />
                                            <div className="h-4 w-48 md:w-64 bg-slate-800/50 rounded animate-pulse" />
                                        </div>
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-indigo-500/50 flex items-center justify-center relative">
                                            <span className="text-lg md:text-xl font-bold text-indigo-400">85%</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="h-24 md:h-32 bg-slate-800/30 border border-slate-800 rounded-xl" />
                                        <div className="h-24 md:h-32 bg-slate-800/30 border border-slate-800 rounded-xl" />
                                    </div>
                                    <div className="h-32 md:h-48 bg-slate-800/30 border border-slate-800 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div id="features" className="py-24 md:py-32 scroll-mt-16 px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything you need to stand out</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Our comprehensive suite of tools ensures your application bypasses automated filters and catches the recruiter&apos;s eye.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Target, title: "Precision Keyword Matching", desc: "Identify exactly which keywords you're missing from the job description and where to place them." },
                            { icon: Zap, title: "Instant AI Feedback", desc: "Get actionable, line-by-line suggestions to improve the impact of your bullet points in seconds." },
                            { icon: Shield, title: "ATS Formatting Check", desc: "Ensure your resume's structure, fonts, and layout are perfectly readable by applicant tracking systems." }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-colors text-center md:text-left">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 mx-auto md:mx-0">
                                    <feature.icon className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How it Works */}
                <div id="how-it-works" className="py-24 md:py-32 scroll-mt-16 px-4 bg-slate-900/20 rounded-3xl border border-slate-800/50 my-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How it works</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Three simple steps to significantly increase your interview chances.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {[
                            { step: "1", title: "Upload Resume", desc: "Drag and drop your current PDF or DOCX resume into our secure platform." },
                            { step: "2", title: "Paste Description", desc: "Copy and paste the job description for the specific role you want." },
                            { step: "3", title: "Get Optimized", desc: "Receive an instant ATS score and line-by-line suggestions to improve it." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center relative">
                                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-indigo-600/30 z-10">
                                    {item.step}
                                </div>
                                {i !== 2 && <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-gradient-to-r from-indigo-500/50 to-transparent z-0"></div>}
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Section */}
                <div id="pricing" className="py-24 md:py-32 scroll-mt-16 px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Start for free, upgrade when you need more power.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-2">Hobbyist</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold text-white">$0</span>
                                <span className="text-slate-500 font-medium">/forever</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['3 AI Resume Scans per month', 'Basic ATS Keyword Matching', 'Export to PDF'].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/dashboard/upload" className="w-full text-center py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors mt-auto">
                                Start Free
                            </Link>
                        </div>
                        {/* Pro Tier */}
                        <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-2xl shadow-indigo-900/20">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
                            <h3 className="text-xl font-bold text-white mb-2">Pro Professional</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold text-white">$15</span>
                                <span className="text-slate-500 font-medium">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['Unlimited AI Resume Scans', 'Advanced Context Analysis', 'Unlimited Cover Letters', 'Line-by-line AI rewriting'].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                                        <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/dashboard/checkout" className="w-full text-center py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/25 mt-auto flex justify-center items-center gap-2">
                                <Zap className="w-4 h-4" /> Upgrade to Pro
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-[#020617] relative z-10 pt-16 pb-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-6 w-fit">
                                <div className="bg-indigo-600 p-2 rounded-xl">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold text-slate-200">ResumeBoost</span>
                            </Link>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
                                Empowering job seekers with AI-driven resume optimization. Beat the applicant tracking systems and land your dream job faster.
                            </p>
                            <div className="flex gap-4 text-slate-500">
                                <a href="#" className="hover:text-indigo-400 transition-colors p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                                </a>
                                <a href="#" className="hover:text-indigo-400 transition-colors p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                </a>
                                <a href="#" className="hover:text-indigo-400 transition-colors p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Product</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
                                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="/dashboard/upload" className="hover:text-white transition-colors">Scan Resume</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Resources</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Resume Templates</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Mail className="w-4 h-4"/> Contact Us</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-slate-500">
                            &copy; {new Date().getFullYear()} ResumeBoost. All rights reserved.
                        </div>
                        <div className="text-sm text-slate-600">
                            Made with ♥ for job seekers everywhere.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
