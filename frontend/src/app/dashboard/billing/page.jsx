'use client';
import Link from 'next/link';
import { Check, Zap, CreditCard } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export default function BillingPage() {
    const { user } = useAuth();
    const plan = user?.plan || 'free';

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white mb-4">Simple, transparent pricing</h1>
                <p className="text-slate-400">Upgrade your plan to unlock unlimited scans and advanced AI features.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-2">Hobbyist</h3>
                    <p className="text-slate-400 text-sm mb-6">Perfect for trying out the platform.</p>
                    <div className="mb-6">
                        <span className="text-4xl font-extrabold text-white">$0</span>
                        <span className="text-slate-500 font-medium">/forever</span>
                    </div>
                    {plan === 'free' ? (
                        <button disabled className="w-full py-3 px-4 bg-slate-800 text-white rounded-xl font-semibold mb-8 opacity-75 cursor-default">
                            Current Plan
                        </button>
                    ) : (
                        <button disabled className="w-full py-3 px-4 bg-slate-800 text-white rounded-xl font-semibold mb-8 opacity-50 cursor-default">
                            Downgrade to Free (Contact Support)
                        </button>
                    )}
                    <ul className="space-y-4">
                        {[
                            '3 AI Resume Scans per month',
                            'Basic ATS Keyword Matching',
                            'Standard formatting checks',
                            'Export to PDF'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pro Plan */}
                <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[50px]"></div>
                    
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <h3 className="text-xl font-bold text-white">Pro Professional</h3>
                        <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Popular
                        </span>
                    </div>
                    <p className="text-indigo-200/70 text-sm mb-6 relative z-10">Everything you need to land the job.</p>
                    <div className="mb-6 relative z-10">
                        <span className="text-4xl font-extrabold text-white">$9</span>
                        <span className="text-slate-500 font-medium">/month</span>
                    </div>
                    
                    {plan === 'pro' ? (
                        <button disabled className="w-full py-3 px-4 bg-slate-800 text-white rounded-xl font-bold shadow-lg mb-8 flex items-center justify-center gap-2 relative z-10 cursor-default">
                            <Check className="w-4 h-4 text-emerald-400" /> Current Plan
                        </button>
                    ) : (
                        <Link href="/dashboard/checkout" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/25 mb-8 flex items-center justify-center gap-2 relative z-10">
                            <Zap className="w-4 h-4" /> Upgrade to Pro
                        </Link>
                    )}
                    
                    <ul className="space-y-4 relative z-10">
                        {[
                            'Unlimited AI Resume Scans',
                            'Advanced Keyword & Context Analysis',
                            'Unlimited Cover Letter Generation',
                            'Line-by-line AI rewriting suggestions',
                            'Priority Support'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                                <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-16 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 px-6 py-3 rounded-full border border-slate-800">
                    <CreditCard className="w-4 h-4" /> Secure payments powered by Stripe & Razorpay
                </div>
            </div>
        </div>
    );
}
