'use client';
import { useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, Target, BarChart3, Loader2, ScanLine } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/axios';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError('');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1
    });

    const handlePasteExampleJD = async () => {
        try {
            const response = await api.get('/resume/sample-jd');
            setJobDescription(response.data.jobDescription);
        } catch (err) {
            console.error('Failed to fetch sample JD', err);
            // Fallback just in case
            setJobDescription(`Software Engineer\n\nAbout the Role:\nWe are looking for a Software Engineer to build scalable web applications. You will work with a modern tech stack including React, Node.js, and PostgreSQL.\n\nResponsibilities:\n- Develop and maintain web applications\n- Write clean, efficient, and testable code\n- Collaborate with cross-functional teams\n\nRequirements:\n- 3+ years of experience with JavaScript/TypeScript\n- Strong knowledge of React and Node.js\n- Experience with cloud platforms (AWS/GCP)\n- Understanding of CI/CD pipelines`);
        }
    };

    const handleScan = async () => {
        if (!file || jobDescription.length < 20) {
            setError('Please upload a resume and provide a valid job description.');
            return;
        }

        setIsAnalyzing(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        try {
            const response = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data.analysis);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during analysis.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (result) {
        return (
            <div className="p-8 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-white">Analysis Complete</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full border-4 border-indigo-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl font-bold text-white">{result.ats_score}%</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">ATS Compatibility Score</h3>
                            <p className="text-slate-400 text-sm">
                                Your resume scores {result.ats_score}% against the provided job description. 
                                Follow the suggestions below to improve your chances.
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Matched Keywords ({result.matched_keywords?.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.matched_keywords?.map((kw, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">{kw}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4" /> Missing Keywords ({result.missing_keywords?.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_keywords?.map((kw, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-indigo-400 mb-4">AI Suggestions</h3>
                    <ul className="space-y-3">
                        {result.suggestions?.map((s, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-300">
                                <span className="bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs mt-0.5">{i + 1}</span>
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <button 
                    onClick={() => setResult(null)}
                    className="mt-8 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm"
                >
                    Run Another Scan
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">New Resume Scan</h1>
                <p className="text-slate-400 text-sm">Upload your resume and paste the job description to get instant ATS feedback.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Form Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Dropzone */}
                    <div 
                        {...getRootProps()} 
                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                            isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="bg-indigo-600/20 p-4 rounded-full mb-4">
                            <UploadCloud className="h-8 w-8 text-indigo-400" />
                        </div>
                        {file ? (
                            <div className="text-center">
                                <p className="text-white font-semibold flex items-center justify-center gap-2">
                                    <FileText className="h-4 w-4 text-emerald-400" /> {file.name}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Click to change file</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-slate-300 font-medium mb-1">Drag & drop your resume here</p>
                                <p className="text-xs text-slate-500">Supports PDF and DOCX</p>
                            </div>
                        )}
                    </div>

                    {/* JD Textarea */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-slate-300">Job Description</label>
                            <button 
                                onClick={handlePasteExampleJD}
                                className="text-indigo-400 hover:text-indigo-300 text-xs font-medium hover:underline transition-all"
                            >
                                Paste Example JD
                            </button>
                        </div>
                        <textarea 
                            rows={8}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the target job description here to compare keywords..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                        ></textarea>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button 
                        onClick={handleScan}
                        disabled={isAnalyzing || !file || jobDescription.length < 20}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...</>
                        ) : (
                            <><ScanLine className="w-5 h-5" /> Scan & Analyze</>
                        )}
                    </button>
                </div>

                {/* Right Info Area */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 h-full">
                        <h3 className="text-lg font-bold text-white mb-6">How to get a high ATS Score</h3>
                        
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="bg-indigo-500/10 p-2 rounded-lg shrink-0">
                                    <Target className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200 text-sm mb-1">Tailor your keywords</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Ensure the exact phrases from the required skills section of the job description are present in your resume.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="bg-amber-500/10 p-2 rounded-lg shrink-0">
                                    <FileText className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200 text-sm mb-1">Use Action Verbs</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Start every bullet point with a strong action verb like &quot;Developed&quot;, &quot;Led&quot;, &quot;Architected&quot;, instead of &quot;Responsible for&quot;.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="bg-emerald-500/10 p-2 rounded-lg shrink-0">
                                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200 text-sm mb-1">Quantify Impact</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Numbers speak louder than words. Mention team sizes, percentage improvements, and revenue impacts.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
