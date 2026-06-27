const supabase = require('../config/supabase');
const { createRazorpayOrder, verifyRazorpaySignature } = require('../services/razorpayService');
const { createPaypalOrder, capturePaypalPayment } = require('../services/paypalService');
const logger = require('../config/logger');

// ─── RAZORPAY ────────────────────────────────────────────────────────

exports.initRazorpayOrder = async (req, res) => {
    try {
        const order = await createRazorpayOrder(req.user.id);
        res.status(200).json(order);
    } catch (error) {
        logger.error('API Error initiating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create Razorpay order' });
    }
};

exports.verifyRazorpayPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: 'Missing payment details' });
    }

    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (isValid) {
        try {
            await supabase
                .from('users')
                .update({
                    plan: 'premium',
                    payment_provider: 'razorpay',
                    payment_id: razorpay_payment_id
                })
                .eq('id', req.user.id);
                
            return res.status(200).json({ success: true, message: 'Premium plan activated' });
        } catch (error) {
            logger.error('Error updating user after Razorpay payment:', error);
            return res.status(500).json({ message: 'Payment verified but failed to update user plan' });
        }
    } else {
        return res.status(400).json({ message: 'Invalid payment signature' });
    }
};

// ─── PAYPAL ──────────────────────────────────────────────────────────

exports.initPaypalOrder = async (req, res) => {
    try {
        const order = await createPaypalOrder();
        res.status(200).json(order);
    } catch (error) {
        logger.error('API Error initiating PayPal order:', error);
        res.status(500).json({ message: 'Failed to create PayPal order' });
    }
};

exports.capturePaypalPayment = async (req, res) => {
    const { orderID } = req.body;

    if (!orderID) {
        return res.status(400).json({ message: 'Missing PayPal order ID' });
    }

    try {
        const captureData = await capturePaypalPayment(orderID);

        if (captureData.status === 'COMPLETED') {
            await supabase
                .from('users')
                .update({
                    plan: 'premium',
                    payment_provider: 'paypal',
                    payment_id: captureData.id
                })
                .eq('id', req.user.id);

            return res.status(200).json({ success: true, message: 'Premium plan activated' });
        } else {
            return res.status(400).json({ message: `Payment capture failed. Status: ${captureData.status}` });
        }
    } catch (error) {
        logger.error('Error capturing PayPal payment:', error);
        return res.status(500).json({ message: 'Failed to capture PayPal payment' });
    }
};
