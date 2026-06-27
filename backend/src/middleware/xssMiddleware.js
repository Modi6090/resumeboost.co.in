const xss = require('xss');

const sanitize = (obj) => {
    if (typeof obj === 'string') {
        return xss(obj);
    }
    if (Array.isArray(obj)) {
        obj.forEach((val, idx) => {
            obj[idx] = sanitize(val);
        });
    } else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach((key) => {
            obj[key] = sanitize(obj[key]);
        });
    }
    return obj;
};

const xssClean = (req, res, next) => {
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);
    next();
};

module.exports = xssClean;
