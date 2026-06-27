import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 py-20">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-12">
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium mb-6 inline-block">
                        &larr; Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-8 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p className="mb-4">We collect information you provide directly to us, including:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Account information (name, email address, password)</li>
                            <li>Resume and cover letter documents uploaded to our platform</li>
                            <li>Job descriptions pasted into our analysis tools</li>
                            <li>Payment information (processed securely by our payment providers, Stripe/Razorpay)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process your resume analysis using Artificial Intelligence</li>
                            <li>Process transactions and send related information</li>
                            <li>Send technical notices, updates, and support messages</li>
                            <li>Respond to your comments, questions, and requests</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Data Security and AI Processing</h2>
                        <p className="mb-4">
                            We implement appropriate technical and organizational measures to protect your personal data. 
                            When you upload your resume for analysis, the text content is temporarily processed by our AI partners (e.g., OpenAI) via secure API connections. 
                            We do not use your personal data to train our AI models without explicit consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Retention</h2>
                        <p className="mb-4">
                            We retain your resumes and analysis results to allow you to track your progress over time. 
                            You can request the deletion of your account and all associated data at any time through your account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Sharing</h2>
                        <p>
                            We do not sell, trade, or rent your personal identification information to others. 
                            We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and advertisers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at privacy@resumeboost.ai.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
