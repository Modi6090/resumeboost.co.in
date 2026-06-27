'use client';
import { useState } from 'react';
import { Mail, Loader2, Sparkles, Copy, CheckCircle2, UploadCloud, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/axios';

export default function CoverLettersPage() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [tone, setTone] = useState('Professional and confident');
    const [focus, setFocus] = useState('None specified');
    const [isGenerating, setIsGenerating] = useState(false);
    const [letter, setLetter] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

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
            setJobDescription(`Software Engineer\n\nAbout the Role:\nWe are looking for a Software Engineer to build scalable web applications. You will work with a modern tech stack including React, Node.js, and PostgreSQL.`);
        }
    };

    const handleGenerate = async () => {
        if (!file || jobDescription.length < 20) {
            setError('Please upload a resume and provide a valid job description (at least 20 chars).');
            return;
        }

        setIsGenerating(true);
        setError('');
        
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);
        formData.append('tone', tone);
        formData.append('focus', focus);

        try {
            const response = await api.post('/resume/cover-letter', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setLetter(response.data.coverLetter);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during generation.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(letter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">AI Cover Letter Generator</h1>
                <p className="text-slate-400 text-sm">Upload your resume and the target job description to instantly generate a tailored, highly-converting cover letter.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="space-y-5">
                            
                            {/* Dropzone */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">1. Upload Resume</label>
                                <div 
                                    {...getRootProps()} 
                                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                                        isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-slate-700'
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="bg-indigo-600/20 p-3 rounded-full mb-3">
                                        <UploadCloud className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    {file ? (
                                        <div className="text-center">
                                            <p className="text-white text-sm font-semibold flex items-center justify-center gap-2">
                                                <FileText className="h-4 w-4 text-emerald-400" /> {file.name}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-slate-300 text-sm font-medium mb-1">Drag & drop your resume</p>
                                            <p className="text-xs text-slate-500">PDF or DOCX only</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Job Description */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-slate-300">2. Target Job Description</label>
                                    <button 
                                        onClick={handlePasteExampleJD}
                                        className="text-indigo-400 hover:text-indigo-300 text-xs font-medium hover:underline transition-all"
                                    >
                                        Paste Example JD
                                    </button>
                                </div>
                                <textarea 
                                    rows={5}
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description here..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                />
                            </div>

                            {/* Pro Features */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Tone (Pro)</label>
                                    <select 
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option value="Professional and confident">Professional</option>
                                        <option value="Enthusiastic and passionate">Enthusiastic</option>
                                        <option value="Direct and aggressive">Direct</option>
                                        <option value="Creative and storytelling">Creative</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Focus Area (Pro)</label>
                                    <select 
                                        value={focus}
                                        onChange={(e) => setFocus(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option value="None specified">Standard</option>
                                        <option value="Emphasize my leadership and management experience">Leadership</option>
                                        <option value="Address my career gap gracefully">Address Career Gap</option>
                                        <option value="Focus on my rapid promotion history">Rapid Growth</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !file || jobDescription.length < 20}
                            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Writing with Gemini AI...</>
                            ) : (
                                <><Sparkles className="w-5 h-5" /> Generate Cover Letter</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Panel - Result */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full min-h-[500px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Mail className="w-5 h-5 text-indigo-400" /> Generated Result
                        </h3>
                        {letter && (
                            <button 
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy to clipboard'}
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-6 text-slate-300 text-sm whitespace-pre-wrap leading-relaxed overflow-auto relative">
                        {letter ? (
                            <div suppressContentEditableWarning={true} contentEditable className="outline-none min-h-full">
                                {letter}
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                                <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                                <p className="italic">Your generated cover letter will appear here...</p>
                                <p className="text-xs mt-2 opacity-70">(You can edit it directly once generated)</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
