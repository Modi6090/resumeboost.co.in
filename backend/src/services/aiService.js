const OpenAI = require('openai');
const axios = require('axios');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock_key'
});

const callAI = async (prompt, temperature = 0.5) => {
    if (process.env.GEMINI_API_KEY) {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature }
            },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data.candidates[0].content.parts[0].text;
    } else {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: temperature,
        });
        return response.choices[0].message.content;
    }
};

const STUDENT_JD_EXAMPLE = `Software Engineering Intern — Summer 2025
Company: TechFlow Inc. (San Francisco, CA)

About the Role:
We're looking for a passionate Software Engineering Intern to join our platform team. You will work alongside senior engineers to build and ship features for our cloud-based SaaS product.

Responsibilities:
- Develop and maintain RESTful APIs using Node.js and Express
- Collaborate with the frontend team on React-based features
- Write clean, testable code with proper documentation
- Participate in code reviews and daily standups
- Work with databases (MongoDB, PostgreSQL) for data modeling

Requirements:
- Pursuing a B.S. or M.S. in Computer Science or related field
- Proficiency in JavaScript/TypeScript
- Experience with React or similar frontend frameworks
- Familiarity with Node.js and REST APIs
- Knowledge of Git, version control workflows
- Strong problem-solving skills

Nice to Have:
- Experience with Docker, Kubernetes
- Contributions to open-source projects
- Familiarity with AWS or GCP
- Knowledge of CI/CD pipelines

Duration: May–August 2025 (12 weeks)
Compensation: $45–55/hr`;

const getMockResult = () => ({
    atsScore: Math.floor(Math.random() * (88 - 58 + 1) + 58),
    missingKeywords: ['Docker', 'CI/CD', 'TypeScript', 'AWS', 'PostgreSQL'],
    matchedKeywords: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API', 'Git'],
    suggestions: [
        'Add measurable achievements with specific metrics (e.g., "reduced load time by 30%").',
        'Include a concise summary or objective statement at the top of your resume.',
        'Tailor your skills section to match keywords from the job description directly.'
    ],
    rewrittenBullets: [
        'Engineered and deployed a React + Node.js web application serving 2,000+ daily active users, reducing page load time by 35% through component optimization.',
        'Architected and maintained 12 RESTful API endpoints with JWT authentication, improving API response time by 40% using MongoDB indexing strategies.'
    ],
    skills: {
        present: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'REST API Design'],
        missing: ['TypeScript', 'Docker', 'AWS', 'CI/CD', 'PostgreSQL', 'Kubernetes'],
    },
    formattingAnalysis: {
        score: 72,
        issues: [
            'Resume exceeds recommended 1-page limit for candidates with under 5 years of experience.',
            'Inconsistent date formatting detected across experience section.',
            'Missing a professional summary section — strongly recommended for ATS systems.',
        ],
        suggestions: [
            'Use a single, consistent date format (e.g., "Jan 2024 – Present").',
            'Keep bullet points to 1–2 lines each for maximum readability.',
        ]
    },
    keywordRecommendations: ['TypeScript', 'Docker', 'AWS S3', 'CI/CD', 'Agile', 'Unit Testing', 'Jest', 'PostgreSQL']
});

const analyzeResume = async (resumeText, jobDescription) => {
    const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mocked_key_for_now';
    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mocked_key_for_now' && process.env.OPENAI_API_KEY !== 'mock_key';
    if (!hasGemini && !hasOpenAI) {
        return getMockResult();
    }

    try {
        const prompt = `
You are an expert ATS (Applicant Tracking System) and career coach. Analyze the resume against the job description below.

Resume:
"""${resumeText}"""

Job Description:
"""${jobDescription}"""

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "atsScore": <number 0-100>,
  "matchedKeywords": <string[], up to 8 skills/keywords found in BOTH>,
  "missingKeywords": <string[], up to 6 important skills/keywords from JD NOT in resume>,
  "suggestions": <string[], exactly 3 actionable and specific improvement tips>,
  "rewrittenBullets": <string[], exactly 2 improved bullet points rewritten from the resume content, using STAR format>,
  "skills": {
    "present": <string[], technical and soft skills found in resume>,
    "missing": <string[], important skills from JD missing in resume>
  },
  "formattingAnalysis": {
    "score": <number 0-100, formatting quality score>,
    "issues": <string[], up to 3 specific formatting problems detected>,
    "suggestions": <string[], up to 2 formatting fix recommendations>
  },
  "keywordRecommendations": <string[], up to 8 high-impact keywords to add to the resume>
}`;

        let resultText = await callAI(prompt, 0.5);
        resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(resultText);
    } catch (error) {
        console.error('OpenAI API Error:', error);
        // Graceful fallback to mock
        return getMockResult();
    }
};

const generateCoverLetter = async (resumeText, jobDescription, tone, focus) => {
    const hasKey = (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mocked_key_for_now') || process.env.OPENAI_API_KEY;
    if (!hasKey) {
        return "Mock Cover Letter: \n\nDear Hiring Manager,\n\nI am writing to express my interest in this position. My skills match your job description perfectly. I look forward to hearing from you.\n\nBest regards,\nCandidate";
    }

    try {
        const prompt = `You are an expert career coach and copywriter. Write a compelling, highly personalized cover letter.
Do not invent any experience; only use facts from the Resume. 
Align the tone to be: ${tone || 'Professional and confident'}.
Special Focus Area: ${focus || 'None specified'}.

Structure the letter with a strong opening hook, a middle section highlighting 2-3 specific achievements from the resume that solve the pain points in the Job Description, and a confident closing.

Resume:
"""${resumeText}"""

Job Description:
"""${jobDescription}"""

Return ONLY the raw cover letter text. Do not use markdown blocks.`;

        const resultText = await callAI(prompt, 0.7);
        return resultText.trim();
    } catch (error) {
        console.error('AI Cover Letter Error:', error);
        throw new Error('AI Error: ' + error.message);
    }
};

const buildResume = async (rawNotes, targetRole) => {
    const hasKey = (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mocked_key_for_now') || process.env.OPENAI_API_KEY;
    if (!hasKey) {
        return {
            summary: "Mock Professional Summary for " + targetRole,
            experience: [{ company: "Mock Company", role: targetRole, startDate: "Jan 2020", endDate: "Present", bullets: ["Mock achievement 1", "Mock achievement 2"] }],
            education: [{ institution: "Mock University", degree: "B.S. Computer Science", year: "2019" }],
            skills: ["JavaScript", "React", "Node.js"]
        };
    }

    try {
        const prompt = `You are an expert executive resume writer. Take the following rough notes, past experience, or messy text provided by the user, and transform it into a highly professional, ATS-optimized resume structure tailored for the role of: ${targetRole || 'Software Professional'}.

Enhance the bullet points to be action-oriented and metric-driven where possible, but DO NOT hallucinate fake companies, roles, or degrees. If dates are missing, use "Present" or "Past".

User's Raw Notes:
"""${rawNotes}"""

Return ONLY a valid JSON object with the following exact structure (no markdown, no extra text):
{
  "personalInfo": {
     "fullName": "",
     "email": "",
     "phone": "",
     "location": "",
     "linkedin": ""
  },
  "summary": "<A powerful 3-4 sentence professional summary>",
  "experience": [
    {
      "company": "<Company Name>",
      "role": "<Job Title>",
      "startDate": "<e.g., Jan 2020>",
      "endDate": "<e.g., Present>",
      "bullets": ["<Action-oriented bullet 1>", "<Action-oriented bullet 2>"]
    }
  ],
  "education": [
    {
      "institution": "<School Name>",
      "degree": "<Degree Name>",
      "year": "<Graduation Year>"
    }
  ],
  "skills": ["<Skill 1>", "<Skill 2>", "<Skill 3>"]
}`;

        let resultText = await callAI(prompt, 0.5);
        resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(resultText);
    } catch (error) {
        console.error('AI Resume Builder Error:', error);
        throw new Error(error.message);
    }
};

module.exports = { analyzeResume, generateCoverLetter, buildResume, STUDENT_JD_EXAMPLE };
