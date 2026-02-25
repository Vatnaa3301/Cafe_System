import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
    '/admin/dashboard'  : 'Dashboard',
    '/admin/products'   : 'Products',
    '/admin/categories' : 'Categories',
    '/admin/orders'     : 'Orders',
};

export default function Header() {
    const { pathname } = useLocation();
    const title = PAGE_TITLES[pathname] ?? 'Café System';

    return (
        <header className="h-16 bg-[#F8F8F8] border-b border-gray-200 flex items-center px-6 gap-4">
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight flex-1">{title}</h1>
            <span className="text-sm font-medium text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </header>
    );
}
