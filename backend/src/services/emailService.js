const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const createTransporter = () => {
    // If no SMTP creds, use Ethereal (fake SMTP for dev)
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your@gmail.com') {
        return null; // Will use console log fallback
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const sendAnalysisComplete = async ({ toEmail, userName, atsScore, analysisId }) => {
    const transporter = createTransporter();

    const scoreColor = atsScore >= 80 ? '#22c55e' : atsScore >= 60 ? '#f59e0b' : '#ef4444';
    const scoreLabel = atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Work';

    const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Resume Analysis Complete</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Your ATS score is ready</p>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px;">Hi <strong>${userName}</strong>,</p>
        <p>Your resume has been analyzed. Here's a quick summary:</p>
        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; width: 120px; height: 120px; border-radius: 50%; border: 6px solid ${scoreColor}; line-height: 108px; font-size: 36px; font-weight: 800; color: ${scoreColor};">${atsScore}</div>
          <p style="color: ${scoreColor}; font-weight: 600; margin-top: 12px;">${scoreLabel}</p>
        </div>
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/result/${analysisId}" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">View Full Analysis →</a>
        </div>
      </div>
      <div style="padding: 16px 32px; border-top: 1px solid #1e293b; text-align: center;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">AI Resume ATS Analyzer · Unsubscribe</p>
      </div>
    </div>
  `;

    if (!transporter) {
        logger.info(`[EMAIL MOCK] Analysis complete for ${toEmail}: ATS Score ${atsScore}`);
        return;
    }

    try {
        await transporter.sendMail({
            from: `"AI Resume Analyzer" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: `Your Resume Score: ${atsScore}/100 — ${scoreLabel}`,
            html,
        });
        logger.info(`Email sent to ${toEmail}`);
    } catch (err) {
        logger.error('Email send failed:', err);
    }
};

const sendWelcomeEmail = async ({ toEmail, userName }) => {
    const transporter = createTransporter();
    if (!transporter) {
        logger.info(`[EMAIL MOCK] Welcome email to ${toEmail}`);
        return;
    }

    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to AI Resume ATS Analyzer, ${userName}! 🎉</h2>
      <p>You're all set. Start by uploading your resume and a job description to get your ATS score instantly.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Go to Dashboard →</a>
    </div>
  `;

    try {
        await transporter.sendMail({
            from: `"AI Resume Analyzer" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Welcome to AI Resume ATS Analyzer!',
            html,
        });
    } catch (err) {
        logger.error('Welcome email failed:', err);
    }
};

module.exports = { sendAnalysisComplete, sendWelcomeEmail };
