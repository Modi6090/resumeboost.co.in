const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    initRazorpayOrder,
    verifyRazorpayPayment,
    initPaypalOrder,
    capturePaypalPayment
} = require('../controllers/paymentController');

// Razorpay
router.post('/razorpay/create-order', protect, initRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// PayPal
router.post('/paypal/create-order', protect, initPaypalOrder);
router.post('/paypal/capture', protect, capturePaypalPayment);

module.exports = router;
