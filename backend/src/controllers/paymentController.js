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
                    plan: 'pro',
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

exports.razorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature'];
        
        // Verify Webhook Signature
        const expectedSignature = require('crypto')
            .createHmac('sha256', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');
            
        if (signature !== expectedSignature) {
            return res.status(400).json({ message: 'Invalid signature' });
        }
        
        const event = req.body.event;
        const payment = req.body.payload.payment.entity;
        
        if (event === 'payment.captured') {
            // Find user by order ID (this requires storing order_id in users table or a separate orders table)
            // For now, we'll log it. In a full implementation, you'd find the user by order ID and upgrade.
            logger.info(`Razorpay webhook: Payment ${payment.id} captured successfully for order ${payment.order_id}`);
            // Logic to update user plan would go here, matching on payment.order_id
        }
        
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        logger.error('Razorpay webhook error:', error);
        res.status(500).json({ message: 'Webhook error' });
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
                    plan: 'pro',
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

exports.paypalWebhook = async (req, res) => {
    try {
        const webhookEvent = req.body;
        
        // Note: For production, you MUST verify the webhook signature with PayPal API
        // This requires fetching the webhook ID and verifying the headers.
        // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature_post
        
        if (webhookEvent.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            const capture = webhookEvent.resource;
            logger.info(`PayPal webhook: Payment ${capture.id} captured successfully`);
            // Logic to update user plan would go here
        }
        
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        logger.error('PayPal webhook error:', error);
        res.status(500).json({ message: 'Webhook error' });
    }
};
