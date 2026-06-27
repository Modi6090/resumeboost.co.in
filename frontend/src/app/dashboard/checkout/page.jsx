'use client';
import { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleRazorpayPayment = async () => {
        setIsProcessing(true);
        setError('');

        try {
            // Create order on backend
            const { data: order } = await api.post('/payment/razorpay/create-order');

            // Load Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'ResumeBoost',
                description: 'Pro Plan - Unlimited Scans',
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        await api.post('/payment/razorpay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        setSuccess(true);
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {},
                theme: { color: '#4f46e5' },
            };

            // Dynamically load Razorpay script if not already loaded
            if (!window.Razorpay) {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => {
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                };
                document.body.appendChild(script);
            } else {
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaypalPayment = async () => {
        setIsProcessing(true);
        setError('');

        try {
            // Create PayPal order on backend
            const { data: order } = await api.post('/payment/paypal/create-order');

            // For PayPal, we'd typically redirect to approval URL or use PayPal JS SDK
            // For now, we'll use the approve link from the order
            const approveLink = order.links?.find(l => l.rel === 'approve');
            if (approveLink) {
                window.location.href = approveLink.href;
            } else {
                setError('Failed to get PayPal approval URL.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate PayPal payment.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayment = () => {
        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else {
            handlePaypalPayment();
        }
    };

    if (success) {
        return (
            <div className="p-8 max-w-3xl mx-auto flex flex-col items-center text-center mt-20">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
                <p className="text-slate-400 mb-8 max-w-md">
                    Welcome to ResumeBoost Pro! Your account has been upgraded and you now have access to all premium features.
                </p>
                <a href="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-xl transition-all">
                    Go to Dashboard
                </a>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-slate-400 mb-8">Complete your purchase to unlock ResumeBoost Pro.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Select Payment Method</h2>
                        
                        <div className="space-y-4">
                            {/* Razorpay Option */}
                            <label 
                                onClick={() => setPaymentMethod('razorpay')}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                paymentMethod === 'razorpay' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                            }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        paymentMethod === 'razorpay' ? 'border-indigo-500' : 'border-slate-600'
                                    }`}>
                                        {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white flex items-center gap-2">
                                            Razorpay (India & Global)
                                        </div>
                                        <div className="text-sm text-slate-400">Pay via UPI, Cards, NetBanking</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-70">
                                    <CreditCard className="w-6 h-6 text-slate-300" />
                                </div>
                            </label>

                            {/* PayPal Option */}
                            <label 
                                onClick={() => setPaymentMethod('paypal')}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                paymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                            }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        paymentMethod === 'paypal' ? 'border-indigo-500' : 'border-slate-600'
                                    }`}>
                                        {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">PayPal</div>
                                        <div className="text-sm text-slate-400">Pay via PayPal balance or Cards</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-70 font-bold italic text-blue-400 text-xl tracking-tighter">
                                    PayPal
                                </div>
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-8">
                        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                        
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                            <div>
                                <p className="font-semibold text-white">ResumeBoost Pro</p>
                                <p className="text-sm text-slate-400">Monthly Subscription</p>
                            </div>
                            <span className="font-bold text-white">
                                {paymentMethod === 'razorpay' ? '₹199' : '$9.00'}
                            </span>
                        </div>

                        <div className="space-y-3 mb-6 border-b border-slate-800 pb-4 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>{paymentMethod === 'razorpay' ? '₹199' : '$9.00'}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Tax (0%)</span>
                                <span>{paymentMethod === 'razorpay' ? '₹0' : '$0.00'}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="font-bold text-white text-lg">Total</span>
                            <span className="font-bold text-indigo-400 text-2xl">
                                {paymentMethod === 'razorpay' ? '₹199' : '$9.00'}
                            </span>
                        </div>

                        <button 
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
                        >
                            {isProcessing ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                                <>Pay {paymentMethod === 'razorpay' ? '₹199' : '$9.00'} now</>
                            )}
                        </button>
                        
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            Guaranteed safe & secure checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
