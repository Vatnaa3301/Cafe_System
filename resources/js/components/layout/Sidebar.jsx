import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    {
        to: '/admin/dashboard',
        label: 'Dashboard',
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        to: '/admin/products',
        label: 'Products',
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
            </svg>
        ),
    },
    {
        to: '/admin/categories',
        label: 'Categories',
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
        ),
    },
    {
        to: '/admin/orders',
        label: 'Orders',
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
        ),
    },
    {
        to: '/admin/cashiers',
        label: 'Cashiers',
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate          = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 min-h-screen bg-[#F8F8F8] border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-200">
                <span className="text-xl font-extrabold text-gray-800 tracking-tight">
                    Vat'<span className="text-primary-500">Milktea</span>
                </span>
                <p className="text-xs text-gray-400 font-medium capitalize mt-0.5">{user?.role} panel</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                                isActive
                                    ? 'bg-primary-500 text-white shadow-sm shadow-primary-200'
                                    : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:shadow-sm'
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* User profile */}
            <div className="px-3 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white shadow-sm border border-gray-100">
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold uppercase">
                            {user?.name?.[0]}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
}
