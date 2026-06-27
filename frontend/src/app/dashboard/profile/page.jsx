'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Star, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            'Are you absolutely sure you want to delete your account? This action cannot be undone and all your data (including scans and cover letters) will be permanently lost.'
        );
        
        if (!confirmDelete) return;

        setIsDeleting(true);
        setError('');

        try {
            await api.delete('/auth/me');
            await logout();
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete account. Please try again or contact support.');
            setIsDeleting(false);
        }
    };

    if (!user) return null;

    const firstName = user.user_metadata?.full_name?.split(' ')[0] 
                   || user.user_metadata?.name?.split(' ')[0]
                   || user.email?.split('@')[0] 
                   || 'User';
                   
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Not provided';
    const plan = user.plan || 'free';
    const joinDate = new Date(user.created_at || Date.now()).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                <p className="text-slate-400 text-sm">Manage your profile and account preferences.</p>
            </div>

            {/* Profile Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-600/20 border-2 border-indigo-500/50 flex items-center justify-center text-4xl font-bold text-indigo-400 shrink-0">
                        {firstName[0]?.toUpperCase()}
                    </div>
                    <div className="space-y-1 flex-1">
                        <h2 className="text-2xl font-bold text-white">{firstName}</h2>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <User className="w-4 h-4" />
                            <span>Full Name: {fullName}</span>
                        </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 px-6 py-4 rounded-xl text-center">
                        <p className="text-sm text-slate-400 mb-1">Current Plan</p>
                        <p className="text-xl font-bold text-white uppercase tracking-wide flex items-center justify-center gap-2">
                            {plan === 'pro' && <Star className="w-5 h-5 text-indigo-400" />}
                            {plan}
                        </p>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-slate-400 text-sm mb-6 max-w-2xl">
                    Once you delete your account, there is no going back. Please be certain. 
                    All of your resumes, cover letters, analysis history, and active subscriptions will be permanently deleted.
                </p>

                {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-sm text-red-400">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    {isDeleting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Deleting Account...</>
                    ) : (
                        <><Trash2 className="w-5 h-5" /> Delete Account</>
                    )}
                </button>
            </div>
        </div>
    );
}
