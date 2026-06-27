const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../config/logger');

let razorpayInstance;

// Setup Razorpay instance
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    logger.warn('Razorpay keys not configured. Razorpay payments will fail.');
}

/**
 * Creates a Razorpay Order
 * @param {string} userId - User reference
 * @returns {Promise<Object>} The Razorpay order object
 */
const createRazorpayOrder = async (userId) => {
    if (!razorpayInstance) throw new Error('Razorpay is not configured');

    const options = {
        amount: 19900, // ₹199 in paise
        currency: 'INR',
        receipt: `receipt_order_${userId}_${Date.now()}`,
        payment_capture: 1 // Auto capture
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        return order;
    } catch (error) {
        logger.error('Error creating Razorpay order:', error);
        throw error;
    }
};

/**
 * Verifies the Razorpay payment signature
 * @param {string} orderId 
 * @param {string} paymentId 
 * @param {string} signature 
 * @returns {boolean} True if signature is valid
 */
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    if (!process.env.RAZORPAY_KEY_SECRET) return false;

    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    return expectedSignature === signature;
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpaySignature
};
