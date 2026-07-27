import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { generateQR, checkPayment } from '../../api/bakong';
import HamsterLoader from './HamsterLoader';
import { usdToKhr, formatKHR } from '../../utils/format';

const POLL_INTERVAL_MS = 3000;   // 3 seconds
const TIMEOUT_CYCLES   = 60;     // 60 × 3s = 3 minutes

/**
 * QR Payment modal — generates a KHQR, displays it, polls Bakong until paid or timed out.
 *
 * Props:
 *   amount         {number}   - total amount to charge
 *   currency       {'USD'|'KHR'}
 *   onSuccess      {Function} - called when Bakong confirms payment
 *   onClose        {Function} - called when user cancels / goes back
 */
export default function QRPaymentModal({ amount, currency, onSuccess, onClose }) {
    const [phase, setPhase]       = useState('loading'); // loading | ready | success | timeout | error
    const [qrString, setQrString] = useState('');
    const [shortLink, setShortLink] = useState(null);
    const [md5, setMd5]           = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [pollStatus, setPollStatus] = useState('');  // shows last poll message to cashier
    const [elapsedCycles, setElapsedCycles] = useState(0);

    const intervalRef = useRef(null);
    const cycleRef    = useRef(0);

    // amount is always in USD from CartContext; convert to KHR when needed
    const apiAmount = currency === 'KHR' ? usdToKhr(amount) : amount;

    // Format amount for display
    const displayAmount = currency === 'USD'
        ? `$${Number(amount).toFixed(2)}`
        : formatKHR(apiAmount);

    // ---------------------------------------------------------------
    // Generate QR on mount
    // ---------------------------------------------------------------
    useEffect(() => {
        // Guard: don't call API with invalid amount
        if (!amount || amount <= 0) {
            setErrorMsg('Invalid order total.');
            setPhase('error');
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const res = await generateQR({ amount: apiAmount, currency });
                if (cancelled) return;
                setQrString(res.qrString);
                setMd5(res.md5);
                setShortLink(res.shortLink);
                setPhase('ready');
            } catch (err) {
                if (cancelled) return;
                const msg = err.response?.data?.message
                    || err.response?.data?.errors && JSON.stringify(err.response.data.errors)
                    || 'Failed to generate QR. Please try again.';
                setErrorMsg(msg);
                setPhase('error');
            }
        })();

        return () => { cancelled = true; };
    }, [amount, currency]);

    // ---------------------------------------------------------------
    // Start polling once QR is ready
    // ---------------------------------------------------------------
    useEffect(() => {
        if (phase !== 'ready') return;

        cycleRef.current = 0;

        intervalRef.current = setInterval(async () => {
            cycleRef.current += 1;
            setElapsedCycles(cycleRef.current);

            // Timeout guard
            if (cycleRef.current > TIMEOUT_CYCLES) {
                clearInterval(intervalRef.current);
                setPhase('timeout');
                return;
            }

            try {
                const res = await checkPayment({ md5 });
                if (res.responseCode === 0) {
                    // Payment confirmed by Bakong
                    clearInterval(intervalRef.current);
                    setPhase('success');
                    // Short flash of the success state, then hand off to Cart's animation
                    setTimeout(() => onSuccess(res.data), 200);
                } else {
                    // Not yet paid — show the message so cashier can see any issues
                    const msg = res.responseMessage || '';
                    // Show connection errors but not the routine 'not found' noise
                    if (res.errorCode === 9) {
                        setPollStatus('⚠ ' + msg.replace('Connection error: ', ''));
                    } else {
                        setPollStatus('');
                    }
                }
            } catch {
                // Network hiccup — ignore, keep polling
            }
        }, POLL_INTERVAL_MS);

        return () => clearInterval(intervalRef.current);
    }, [phase, md5]); // eslint-disable-line react-hooks/exhaustive-deps

    // ---------------------------------------------------------------
    // Retry — re-generate a fresh QR
    // ---------------------------------------------------------------
    const handleRetry = () => {
        clearInterval(intervalRef.current);
        cycleRef.current = 0;
        setElapsedCycles(0);
        setQrString('');
        setMd5('');
        setShortLink(null);
        setErrorMsg('');
        setPhase('loading');

        (async () => {
            try {
                const res = await generateQR({ amount: apiAmount, currency });
                setQrString(res.qrString);
                setMd5(res.md5);
                setShortLink(res.shortLink);
                setPhase('ready');
            } catch (err) {
                setErrorMsg(err.response?.data?.message || 'Failed to generate QR.');
                setPhase('error');
            }
        })();
    };

    // ---------------------------------------------------------------
    // Progress bar (0–100 %)
    // ---------------------------------------------------------------
    const progressPct = Math.min((elapsedCycles / TIMEOUT_CYCLES) * 100, 100);
    const secondsLeft = Math.max(0, (TIMEOUT_CYCLES - elapsedCycles) * (POLL_INTERVAL_MS / 1000));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <style>{`
                @keyframes qr-pop {
                    from { transform: scale(0.88) translateY(20px); opacity: 0; }
                    to   { transform: scale(1)    translateY(0);    opacity: 1; }
                }
            `}</style>
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                style={{ animation: 'qr-pop 0.4s cubic-bezier(.22,1,.36,1) both' }}
            >
                {/* ── Top gradient header ── */}
                <div
                    className="px-6 pt-6 pb-5 text-center"
                    style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%)' }}
                >
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <svg className="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <p className="text-blue-100 text-sm font-semibold tracking-wide">Bakong QR Payment</p>
                    </div>

                    {/* Big amount */}
                    <div className="inline-flex flex-col items-center bg-white/15 rounded-2xl px-6 py-3 backdrop-blur-sm">
                        <p className="text-xs text-blue-200 font-medium mb-0.5">Amount to Pay</p>
                        <p className="text-3xl font-black text-white tracking-tight">{displayAmount}</p>
                        <span className="mt-1 text-[10px] font-bold bg-blue-400/40 text-blue-100 px-2 py-0.5 rounded-full">
                            {currency}
                        </span>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-5">

                    {/* LOADING */}
                    {phase === 'loading' && (
                        <div className="flex flex-col items-center gap-3 py-6">
                            <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                            <p className="text-sm text-gray-500 font-medium">Generating QR code…</p>
                        </div>
                    )}

                    {/* READY */}
                    {phase === 'ready' && (
                        <div className="flex flex-col items-center gap-4">

                            {/* QR code in a clean white card */}
                            <div className="rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-inner">
                                <QRCode
                                    value={qrString}
                                    size={220}
                                    bgColor="#ffffff"
                                    fgColor="#111827"
                                    level="H"
                                />
                            </div>

                            <p className="text-xs text-gray-400 text-center leading-relaxed">
                                Open your <span className="font-semibold text-gray-700">Bakong</span> or any supported bank app<br/>and scan this QR code to pay.
                            </p>

                            {/* Deep-link button */}
                            {shortLink && (
                                <a
                                    href={shortLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full text-center py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                                >
                                    Open in Bakong App ↗
                                </a>
                            )}

                            {/* ── Hamster waiting animation ── */}
                            <div className="flex flex-col items-center gap-1 w-full">
                                <div className="flex items-center justify-center" style={{ height: 72 }}>
                                    <HamsterLoader scale={0.42} />
                                </div>

                                {/* Timer row */}
                                <div className="flex items-center justify-between w-full text-xs text-gray-400 px-1">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                                        Waiting for payment…
                                    </span>
                                    <span className="font-semibold text-gray-500">{Math.ceil(secondsLeft)}s</span>
                                </div>

                                {/* Progress bar */}
                                <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${progressPct}%`,
                                            background: progressPct > 75 ? '#ef4444' : progressPct > 40 ? '#f59e0b' : '#3b82f6',
                                        }}
                                    />
                                </div>

                                {pollStatus && (
                                    <p className="text-xs text-orange-500 mt-1 text-center break-all">{pollStatus}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SUCCESS */}
                    {phase === 'success' && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="h-9 w-9 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="font-bold text-gray-800 text-lg">Payment Confirmed!</p>
                            <p className="text-sm text-gray-400">Processing receipt…</p>
                        </div>
                    )}

                    {/* TIMEOUT */}
                    {phase === 'timeout' && (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                                <svg className="h-9 w-9 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="font-bold text-gray-800">Payment Timed Out</p>
                            <p className="text-xs text-gray-400">Customer did not pay within 3 minutes.</p>
                        </div>
                    )}

                    {/* ERROR */}
                    {phase === 'error' && (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="h-9 w-9 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="font-bold text-gray-800">QR Generation Failed</p>
                            <p className="text-xs text-gray-400 break-all">{errorMsg}</p>
                        </div>
                    )}
                </div>

                {/* ── Footer actions ── */}
                {(phase === 'ready' || phase === 'timeout' || phase === 'error') && (
                    <div className="px-6 pb-6 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-2xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            ← Back
                        </button>
                        {(phase === 'timeout' || phase === 'error') && (
                            <button
                                onClick={handleRetry}
                                className="flex-1 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                            >
                                Retry
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
