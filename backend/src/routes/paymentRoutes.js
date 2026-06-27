const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    initRazorpayOrder,
    verifyRazorpayPayment,
    initPaypalOrder,
    capturePaypalPayment,
    razorpayWebhook,
    paypalWebhook
} = require('../controllers/paymentController');

// Razorpay
router.post('/razorpay/create-order', protect, initRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/razorpay/webhook', razorpayWebhook);

// PayPal
router.post('/paypal/create-order', protect, initPaypalOrder);
router.post('/paypal/capture', protect, capturePaypalPayment);
router.post('/paypal/webhook', paypalWebhook);

module.exports = router;
