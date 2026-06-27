const supabase = require('../config/supabase');

// GET /api/analytics/summary
const getAnalyticsSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: analyses, error } = await supabase
            .from('analyses')
            .select('ats_score, missing_keywords, created_at')
            .eq('user_id', userId);

        if (error) throw error;

        const total = analyses.length;

        if (total === 0) {
            return res.json({
                total: 0,
                averageScore: 0,
                topKeywords: [],
                weeklyTrend: [],
                scoreDistribution: [],
            });
        }

        // Average ATS score
        const totalScore = analyses.reduce((sum, a) => sum + a.ats_score, 0);
        const averageScore = Math.round(totalScore / total);

        // Top missing keywords
        const keywordCounts = {};
        analyses.forEach(a => {
            (a.missing_keywords || []).forEach(k => {
                keywordCounts[k] = (keywordCounts[k] || 0) + 1;
            });
        });
        const topKeywords = Object.entries(keywordCounts)
            .map(([keyword, count]) => ({ keyword, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        // Weekly trend (last 7 days)
        const weeklyAgg = {};
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        analyses.forEach(a => {
            const d = new Date(a.created_at);
            if (d >= sevenDaysAgo) {
                const dateStr = d.toISOString().slice(0, 10);
                if (!weeklyAgg[dateStr]) {
                    weeklyAgg[dateStr] = { count: 0, scoreSum: 0 };
                }
                weeklyAgg[dateStr].count += 1;
                weeklyAgg[dateStr].scoreSum += a.ats_score;
            }
        });

        // Fill missing days
        const weeklyTrend = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            const agg = weeklyAgg[dateStr];
            weeklyTrend.push({
                date: dateStr,
                count: agg ? agg.count : 0,
                avgScore: agg ? Math.round(agg.scoreSum / agg.count) : 0,
            });
        }

        // Score distribution buckets
        const buckets = [
            { label: '0-39', min: 0, max: 39 },
            { label: '40-59', min: 40, max: 59 },
            { label: '60-79', min: 60, max: 79 },
            { label: '80-100', min: 80, max: 100 },
        ];
        
        const scoreDistribution = buckets.map(b => {
            const count = analyses.filter(a => a.ats_score >= b.min && a.ats_score <= b.max).length;
            return { label: b.label, count };
        });

        res.json({ total, averageScore, topKeywords, weeklyTrend, scoreDistribution });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
};

module.exports = { getAnalyticsSummary };
