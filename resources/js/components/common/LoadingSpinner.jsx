import React from 'react';

export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
    const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

    const spinner = (
        <svg
            className={`animate-spin text-primary-500 ${sizes[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
            />
        </svg>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
                {spinner}
            </div>
        );
    }

    return <div className="flex justify-center items-center p-6">{spinner}</div>;
}
