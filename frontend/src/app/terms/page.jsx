import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 py-20">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-12">
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium mb-6 inline-block">
                        &larr; Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">Terms and Conditions</h1>
                    <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-8 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using ResumeBoost ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                            In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                        <p className="mb-4">
                            ResumeBoost provides users with AI-powered resume optimization, analysis, cover letter generation, and related career tools. 
                            You understand and agree that the Service may include certain communications from ResumeBoost, such as service announcements and administrative messages.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. User Account and Security</h2>
                        <p className="mb-4">
                            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or mobile device. 
                            You agree to accept responsibility for all activities that occur under your account or password.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Payment and Subscriptions</h2>
                        <p className="mb-4">
                            Premium features require a paid subscription. By selecting a premium plan, you agree to pay the stated fees. 
                            Subscription fees are billed in advance on a recurring basis (e.g., monthly). You may cancel your subscription at any time, but no refunds will be provided for partial months.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            ResumeBoost shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages resulting from your use or inability to use the service.
                            We do not guarantee that the use of our services will result in employment or job offers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at support@resumeboost.ai.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
