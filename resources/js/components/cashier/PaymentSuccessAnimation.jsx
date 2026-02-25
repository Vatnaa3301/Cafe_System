import React, { useEffect, useState } from 'react';

/**
 * Full-screen payment success animation.
 * Plays the bounce-in card → ripple → text → fade-out sequence,
 * then calls onComplete() so the receipt can appear.
 *
 * Props:
 *   onComplete {Function} — called after the exit fade finishes
 */
export default function PaymentSuccessAnimation({ onComplete }) {
    // 'enter' → 'visible' → 'exit'
    const [stage, setStage] = useState('enter');

    useEffect(() => {
        // Small rAF delay so CSS transition fires after mount
        const t1 = setTimeout(() => setStage('visible'), 30);
        // Hold the "visible" frame for 2.4 s then start fade-out
        const t2 = setTimeout(() => setStage('exit'), 2400);
        // After fade-out completes (400 ms), hand off to parent
        const t3 = setTimeout(() => onComplete(), 2800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const isVisible = stage === 'visible';
    const isExit    = stage === 'exit';

    return (
        <>
            {/* ---- keyframe definitions ---- */}
            <style>{`
                @keyframes card-bounce {
                    0%   { transform: scale(0.3) translateY(60px); opacity: 0; }
                    55%  { transform: scale(1.18) translateY(-8px); opacity: 1; }
                    75%  { transform: scale(0.94) translateY(3px); }
                    90%  { transform: scale(1.05) translateY(-2px); }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes ripple {
                    0%   { transform: scale(0.6); opacity: 0.55; }
                    100% { transform: scale(2.6); opacity: 0; }
                }
                @keyframes slide-up-fade {
                    0%   { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0);    opacity: 1; }
                }
                @keyframes checkmark-pop {
                    0%   { transform: scale(0); opacity: 0; }
                    60%  { transform: scale(1.3); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60] flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
                    opacity   : isExit ? 0 : 1,
                    transition: isExit ? 'opacity 0.4s ease-in' : 'opacity 0.25s ease-out',
                }}
            >
                <div className="flex flex-col items-center select-none">

                    {/* ── Ripple rings ── */}
                    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
                        {isVisible && [0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="absolute rounded-full border-2 border-green-400"
                                style={{
                                    width: 120, height: 120,
                                    animation: `ripple 1.6s ease-out ${i * 0.4}s infinite`,
                                    opacity: 0,
                                }}
                            />
                        ))}

                        {/* ── Card icon ── */}
                        <div
                            style={{
                                animation: isVisible ? 'card-bounce 0.7s cubic-bezier(.36,.07,.19,.97) forwards' : undefined,
                                opacity  : isVisible ? undefined : 0,
                            }}
                        >
                            <div
                                className="rounded-2xl flex flex-col justify-between"
                                style={{
                                    width: 110, height: 78,
                                    background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                                    padding: '10px 12px',
                                    boxShadow: '0 12px 32px rgba(22,163,74,0.45), 0 4px 12px rgba(0,0,0,0.15)',
                                }}
                            >
                                {/* Chip row */}
                                <div className="flex items-center gap-2">
                                    <div className="rounded-sm bg-green-700/70" style={{ width: 24, height: 16 }} />
                                    <div
                                        className="flex-1 rounded-full bg-white/20"
                                        style={{ height: 6 }}
                                    />
                                </div>
                                {/* Bottom row */}
                                <div className="flex items-center justify-between">
                                    <div className="rounded-sm bg-green-700/60" style={{ width: 34, height: 8 }} />
                                    <div className="flex gap-1">
                                        <div className="rounded-sm bg-green-700/60" style={{ width: 12, height: 12 }} />
                                        <div className="rounded-sm bg-green-700/60" style={{ width: 12, height: 12 }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Floating checkmark badge ── */}
                        {isVisible && (
                            <div
                                className="absolute -bottom-1 -right-1 rounded-full bg-white shadow-lg flex items-center justify-center"
                                style={{
                                    width: 34, height: 34,
                                    animation: 'checkmark-pop 0.4s cubic-bezier(.36,.07,.19,.97) 0.5s both',
                                }}
                            >
                                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* ── Text ── */}
                    {isVisible && (
                        <div
                            className="text-center mt-4"
                            style={{ animation: 'slide-up-fade 0.5s ease-out 0.55s both' }}
                        >
                            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">Payment Successful!</p>
                            <p className="text-sm text-gray-500 mt-1">Your payment has been confirmed.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
