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
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Left — Product Grid */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-xs text-gray-400">Hi, {user?.name}</p>
                        <p className="font-bold text-gray-800">{user?.name}</p>
                    </div>
                    <div className="flex gap-2 flex-1 max-w-sm">
                        <input
                            className="input text-sm flex-1"
                            placeholder="Search menu or product here…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn-primary text-sm px-5">Search</button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Category filter */}
                <div className="px-6 py-3 bg-white border-b border-gray-50">
                    <CategoryFilter categories={categories} active={activeCat} onChange={setActiveCat} />
                </div>

                {/* Products */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
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
