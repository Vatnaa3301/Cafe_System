import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import ProductForm from './ProductForm';
import Toast from '../common/Toast';
import { formatCurrency } from '../../utils/format';

export default function ProductList() {
    const [products, setProducts]     = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [catFilter, setCatFilter]   = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formOpen, setFormOpen]     = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [toast, setToast]           = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const fetchAll = async () => {
        setLoading(true);
        const [p, c] = await Promise.all([getProducts(), getCategories()]);
        setProducts(p);
        setCategories(c);
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const handleDelete = async () => {
        try {
            await deleteProduct(deleteTarget.id);
            showToast('Product deleted.');
            fetchAll();
        } catch {
            showToast('Failed to delete product.', 'error');
        } finally {
            setDeleteTarget(null);
        }
    };

    const openAdd  = ()  => { setEditProduct(null); setFormOpen(true); };
    const openEdit = (p) => { setEditProduct(p);    setFormOpen(true); };

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat    = catFilter ? String(p.category_id) === String(catFilter) : true;
        return matchSearch && matchCat;
    });

    return (
        <div className="space-y-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    <input
                        className="input w-56 text-sm"
                        placeholder="Search products…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="input w-44 text-sm"
                        value={catFilter}
                        onChange={(e) => setCatFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <button onClick={openAdd} className="btn-primary text-sm whitespace-nowrap">
                    + Add Product
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Image', 'Name', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products found.</td></tr>
                                ) : filtered.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/${product.image}`}
                                                    alt={product.name}
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            {product.description && <p className="text-xs text-gray-400 truncate max-w-xs">{product.description}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{product.category?.name}</td>
                                        <td className="px-4 py-3 font-semibold text-primary-600">{formatCurrency(product.price)}</td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                label={product.is_available ? 'Available' : 'Unavailable'}
                                                variant={product.is_available ? 'success' : 'danger'}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEdit(product)}
                                                    className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(product)}
                                                    className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Product Form Modal */}
            <Modal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                title={editProduct ? 'Edit Product' : 'Add Product'}
                size="lg"
            >
                <ProductForm
                    product={editProduct}
                    categories={categories}
                    onSuccess={() => { setFormOpen(false); fetchAll(); showToast(editProduct ? 'Product updated.' : 'Product created.'); }}
                    onCancel={() => setFormOpen(false)}
                />
            </Modal>

            {/* Confirm Delete */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
