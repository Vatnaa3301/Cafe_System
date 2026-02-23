import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
    const { login }          = useAuth();
    const navigate           = useNavigate();
    const [form, setForm]    = useState({ email: '', password: '' });
    const [error, setError]  = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(form);
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/cashier', { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.errors?.email?.[0] ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-orange-100 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-primary-500 flex items-center justify-center mb-3 shadow-md">
                        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
                            <path d="M6 2v2M10 2v2M14 2v2" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Café System</h1>
                    <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
                    <p className="font-semibold text-gray-600 mb-1">Demo credentials:</p>
                    <p>Admin: <span className="font-mono">admin@cafe.com</span> / <span className="font-mono">password</span></p>
                    <p>Cashier: <span className="font-mono">cashier@cafe.com</span> / <span className="font-mono">password</span></p>
                </div>
            </div>
        </div>
    );
}
