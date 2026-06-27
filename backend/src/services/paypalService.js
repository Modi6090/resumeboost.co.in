const paypal = require('@paypal/checkout-server-sdk');
const logger = require('../config/logger');

/**
 * Set up and return PayPal environment
 */
const environment = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID || 'PAYPAL-SANDBOX-CLIENT-ID';
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL-SANDBOX-CLIENT-SECRET';

    // In production use paypal.core.LiveEnvironment
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

const client = () => {
    return new paypal.core.PayPalHttpClient(environment());
};

/**
 * Creates a PayPal Order
 * @returns {Promise<Object>} The PayPal order object
 */
const createPaypalOrder = async () => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '9.00' // $9
            },
            description: 'AI Resume Analyzer Premium (Unlimited Scans)'
        }]
    });

    try {
        const response = await client().execute(request);
        return response.result;
    } catch (error) {
        logger.error('Error creating PayPal order:', error);
        throw error;
    }
};

/**
 * Captures a PayPal Order
 * @param {string} orderId 
 * @returns {Promise<Object>} The captured order result
 */
const capturePaypalPayment = async (orderId) => {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const response = await client().execute(request);
        return response.result;
    } catch (error) {
        logger.error('Error capturing PayPal payment:', error);
        throw error;
    }
};

module.exports = {
    createPaypalOrder,
    capturePaypalPayment
};
