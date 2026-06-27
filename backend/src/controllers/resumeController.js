const { extractText } = require('../services/parseService');
const { analyzeResume, generateCoverLetter, buildResume } = require('../services/aiService');
const supabase = require('../config/supabase');
const { sendAnalysisComplete } = require('../services/emailService');
const logger = require('../config/logger');

const FREE_SCAN_LIMIT = 3;

const uploadResume = async (req, res) => {
    try {
        // Check monthly scan limit for free users
        if (req.user.plan === 'free') {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            
            const { count, error: countError } = await supabase
                .from('analyses')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', req.user.id)
                .gte('created_at', startOfMonth);

            if (countError) throw countError;
            const monthlyCount = count || 0;

            if (monthlyCount >= FREE_SCAN_LIMIT) {
                return res.status(403).json({
                    message: `You've used all ${FREE_SCAN_LIMIT} free scans for this month.`,
                    scansUsed: monthlyCount,
                    scanLimit: FREE_SCAN_LIMIT,
                    upgradeRequired: true,
                });
            }
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Validate magic numbers using file-type (ESM-only package)
        const fileType = await import('file-type');
        const fileTypeFromBuffer = fileType.fileTypeFromBuffer || fileType.default?.fileTypeFromBuffer;
        if (fileTypeFromBuffer) {
            const typeContext = await fileTypeFromBuffer(req.file.buffer);
            if (!typeContext || (typeContext.mime !== 'application/pdf' && typeContext.mime !== 'application/zip')) {
                return res.status(400).json({ message: 'Invalid file content detected. Only PDF and DOCX are accepted.' });
            }
        }

        const { jobDescription } = req.body;
        if (!jobDescription || jobDescription.trim().length < 20) {
            return res.status(400).json({ message: 'Job description must be at least 20 characters.' });
        }

        // Extract text
        const resumeText = await extractText(req.file.buffer, req.file.mimetype);
        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ message: 'Could not extract text from document. Please ensure it is not a scanned image.' });
        }

        // Run AI analysis
        const aiResult = await analyzeResume(resumeText, jobDescription);

        // Enforce Pro features
        const isPro = req.user.plan === 'pro';

        // Save to database
        const { data: analysis, error } = await supabase
            .from('analyses')
            .insert([{
                user_id: req.user.id,
                resume_text: resumeText.slice(0, 5000),
                job_description: jobDescription.slice(0, 2000),
                ats_score: aiResult.atsScore,
                missing_keywords: aiResult.missingKeywords || [],
                matched_keywords: aiResult.matchedKeywords || [],
                suggestions: aiResult.suggestions || [],
                rewritten_bullets: isPro ? (aiResult.rewrittenBullets || []) : [],
                skills_present: aiResult.skills?.present || [],
                skills_missing: aiResult.skills?.missing || [],
                formatting_score: isPro ? (aiResult.formattingAnalysis?.score || null) : null,
                formatting_issues: isPro ? (aiResult.formattingAnalysis?.issues || []) : [],
                formatting_suggestions: isPro ? (aiResult.formattingAnalysis?.suggestions || []) : [],
                keyword_recommendations: aiResult.keywordRecommendations || [],
            }])
            .select()
            .single();

        if (error) throw error;

        // Send email notification async (fire-and-forget)
        sendAnalysisComplete({
            toEmail: req.user.email,
            userName: req.user.name,
            atsScore: aiResult.atsScore,
            analysisId: analysis.id,
        }).catch(err => logger.error('Email notification error:', err));

        // Format to match old Mongoose output
        const formattedAnalysis = {
            _id: analysis.id,
            ...analysis,
            formattingAnalysis: {
                score: analysis.formatting_score,
                issues: analysis.formatting_issues,
                suggestions: analysis.formatting_suggestions,
            },
            skills: {
                present: analysis.skills_present,
                missing: analysis.skills_missing
            }
        };

        res.status(201).json({ message: 'Analysis complete', analysis: formattedAnalysis });
    } catch (error) {
        logger.error('Upload Error:', error);
        res.status(500).json({ message: error.message || 'Server Error processing resume' });
    }
};

const getAnalyses = async (req, res) => {
    try {
        const { data: analyses, error } = await supabase
            .from('analyses')
            .select(`
                id, user_id, job_description, ats_score, missing_keywords, 
                matched_keywords, suggestions, rewritten_bullets, skills_present, 
                skills_missing, formatting_score, formatting_issues, formatting_suggestions, 
                keyword_recommendations, created_at, updated_at
            `)
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Format
        const formattedAnalyses = analyses.map(a => ({
            _id: a.id,
            ...a,
            formattingAnalysis: {
                score: a.formatting_score,
                issues: a.formatting_issues,
                suggestions: a.formatting_suggestions,
            },
            skills: {
                present: a.skills_present,
                missing: a.skills_missing
            }
        }));

        // Include monthly scan usage for free users
        let scanInfo = null;
        if (req.user.plan === 'free') {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const { count } = await supabase
                .from('analyses')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', req.user.id)
                .gte('created_at', startOfMonth);
            
            scanInfo = { scansUsed: count || 0, scanLimit: FREE_SCAN_LIMIT };
        }

        res.status(200).json({ analyses: formattedAnalyses, scanInfo });
    } catch (error) {
        logger.error('Get Analyses Error:', error);
        res.status(500).json({ message: 'Server Error fetching analyses' });
    }
};

const getAnalysisById = async (req, res) => {
    try {
        const { data: analysis, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('id', req.params.id)
            .maybeSingle();

        if (error) throw error;
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        if (analysis.user_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        const formattedAnalysis = {
            _id: analysis.id,
            ...analysis,
            formattingAnalysis: {
                score: analysis.formatting_score,
                issues: analysis.formatting_issues,
                suggestions: analysis.formatting_suggestions,
            },
            skills: {
                present: analysis.skills_present,
                missing: analysis.skills_missing
            }
        };

        res.status(200).json(formattedAnalysis);
    } catch (error) {
        logger.error('Get Analysis Error:', error);
        res.status(500).json({ message: 'Server Error fetching analysis' });
    }
};

// GET /api/resume/sample-jd
const getSampleJobDescription = async (req, res) => {
    const { STUDENT_JD_EXAMPLE } = require('../services/aiService');
    res.json({ jobDescription: STUDENT_JD_EXAMPLE });
};

const createCoverLetter = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileType = await import('file-type');
        const fileTypeFromBuffer = fileType.fileTypeFromBuffer || fileType.default?.fileTypeFromBuffer;
        if (fileTypeFromBuffer) {
            const typeContext = await fileTypeFromBuffer(req.file.buffer);
            if (!typeContext || (typeContext.mime !== 'application/pdf' && typeContext.mime !== 'application/zip')) {
                return res.status(400).json({ message: 'Invalid file content detected. Only PDF and DOCX are accepted.' });
            }
        }

        let { jobDescription, tone, focus } = req.body;
        if (!jobDescription || jobDescription.trim().length < 20) {
            return res.status(400).json({ message: 'Job description must be at least 20 characters.' });
        }

        // Restrict advanced cover letter features for free users
        if (req.user.plan !== 'pro') {
            tone = 'Professional and confident'; // Force default tone
            focus = 'None specified'; // Force default focus
        }

        const resumeText = await extractText(req.file.buffer, req.file.mimetype);
        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ message: 'Could not extract text from document.' });
        }

        const coverLetterText = await generateCoverLetter(resumeText, jobDescription, tone, focus);

        res.status(200).json({ coverLetter: coverLetterText });
    } catch (error) {
        logger.error('Cover Letter Error:', error);
        res.status(500).json({ message: error.message || 'Server Error generating cover letter' });
    }
};

const generateBuilderData = async (req, res) => {
    try {
        // Feature check - Could restrict to Pro only or free trial
        if (req.user.plan !== 'pro') {
            // Optional: you can block it entirely or allow a stripped-down version.
            // For now, we'll allow it but you could return 403 here.
        }

        const { rawNotes, targetRole } = req.body;
        
        if (!rawNotes || rawNotes.trim().length < 20) {
            return res.status(400).json({ message: 'Please provide more detail in your raw notes (at least 20 characters).' });
        }

        const builtResumeData = await buildResume(rawNotes, targetRole);

        res.status(200).json({ resumeData: builtResumeData });
    } catch (error) {
        logger.error('Resume Builder Error:', error);
        res.status(500).json({ message: error.message || 'Server Error building resume' });
    }
};

const deleteAnalysis = async (req, res) => {
    try {
        // Verify ownership first
        const { data: analysis, error: fetchError } = await supabase
            .from('analyses')
            .select('id, user_id')
            .eq('id', req.params.id)
            .maybeSingle();

        if (fetchError) throw fetchError;
        if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
        if (analysis.user_id !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        const { error } = await supabase
            .from('analyses')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.status(200).json({ message: 'Analysis deleted successfully' });
    } catch (error) {
        logger.error('Delete Analysis Error:', error);
        res.status(500).json({ message: 'Server Error deleting analysis' });
    }
};

module.exports = { uploadResume, getAnalyses, getAnalysisById, getSampleJobDescription, createCoverLetter, generateBuilderData, deleteAnalysis };
