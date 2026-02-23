import React, { useEffect } from 'react';

const TYPES = {
    success: { bg: 'bg-green-50 border-green-200', icon: 'text-green-500', text: 'text-green-800' },
    error:   { bg: 'bg-red-50 border-red-200',     icon: 'text-red-500',   text: 'text-red-800'   },
    info:    { bg: 'bg-blue-50 border-blue-200',   icon: 'text-blue-500',  text: 'text-blue-800'  },
    warning: { bg: 'bg-yellow-50 border-yellow-200', icon: 'text-yellow-500', text: 'text-yellow-800' },
};

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const style = TYPES[type];

    return (
        <div
            className={`fixed top-5 right-5 z-[60] flex items-center gap-3 border rounded-xl px-4 py-3 shadow-lg max-w-sm ${style.bg}`}
        >
            <span className={style.icon}>
                {type === 'success' && (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                )}
                {type === 'error' && (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                )}
            </span>
            <span className={`text-sm font-medium ${style.text}`}>{message}</span>
            <button onClick={onClose} className={`ml-2 ${style.icon} hover:opacity-70`}>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
            </button>
        </div>
    );
}
