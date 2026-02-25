import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/products';
import { getCategories } from '../../api/categories';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import Cart from './Cart';
import LoadingSpinner from '../common/LoadingSpinner';
import CustomizeModal from './CustomizeModal';

export default function POSView() {
    const [products, setProducts]             = useState([]);
    const [categories, setCategories]         = useState([]);
    const [loading, setLoading]               = useState(true);
    const [search, setSearch]                 = useState('');
    const [activeCat, setActiveCat]           = useState('');
    const [customizeProduct, setCustomizeProduct] = useState(null);
    const { user, logout }                    = useAuth();
    const { activeCashier, setActiveCashier } = useCart();
    const navigate                            = useNavigate();

    useEffect(() => {
        Promise.all([getProducts(), getCategories()])
            .then(([p, c]) => { setProducts(p); setCategories(c); })
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat    = activeCat ? String(p.category_id) === String(activeCat) : true;
        return matchSearch && matchCat;
    });

    return (
        <div className="flex h-screen bg-[#F8F8F8] overflow-hidden">
            {/* Left — Product Grid */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className="bg-[#F8F8F8] px-6 pt-5 pb-3 flex items-center gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0 mr-2">
                        <span className="text-xl font-extrabold text-gray-800 tracking-tight">
                            Vat'<span className="text-primary-500">Milktea</span>
                        </span>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border-0 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 placeholder-gray-400"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter button */}
                    <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl transition-colors shadow-sm shadow-primary-200">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="4" y1="6" x2="20" y2="6"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                            <line x1="11" y1="18" x2="13" y2="18"/>
                        </svg>
                        Filter
                    </button>

                    <div className="flex-1" />

                    {/* User / Cashier */}
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                            {activeCashier ? activeCashier[0].toUpperCase() : (user?.name?.[0]?.toUpperCase() ?? 'U')}
                        </div>
                        <div className="leading-tight">
                            <p className="text-sm font-semibold text-gray-800">
                                {activeCashier ?? user?.name}
                            </p>
                            <button
                                onClick={() => setActiveCashier(null)}
                                className="text-xs text-primary-400 hover:text-primary-600 transition-colors"
                                title="Switch cashier"
                            >
                                Switch cashier
                            </button>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Category filter */}
                <div className="px-6 py-3">
                    <CategoryFilter categories={categories} active={activeCat} onChange={setActiveCat} />
                </div>

                {/* Section heading */}
                <div className="px-6 pb-2">
                    <h2 className="text-lg font-bold text-gray-800">
                        {categories.find((c) => String(c.id) === String(activeCat))?.name ?? 'All'} menu
                    </h2>
                </div>

                {/* Products */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {loading ? (
                        <LoadingSpinner />
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-gray-400 py-12">No products found.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {filtered.map((p) => (
                                <ProductCard key={p.id} product={p} onCustomize={setCustomizeProduct} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right — Cart */}
            <Cart />

            {/* Customize Modal */}
            {customizeProduct && (
                <CustomizeModal
                    product={customizeProduct}
                    onClose={() => setCustomizeProduct(null)}
                />
            )}
        </div>
    );
}
