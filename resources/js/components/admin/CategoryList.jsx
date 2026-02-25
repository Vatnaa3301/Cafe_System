import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import Modal from '../common/Modal';
import Toast from '../common/Toast';

// ── Category form (create / edit) ─────────────────────────────────────────────
function CategoryForm({ category, onSuccess, onCancel }) {
    const [name, setName]       = useState(category?.name ?? '');
    const [image, setImage]     = useState(null);
    const [preview, setPreview] = useState(category?.image ? `/storage/${category.image}` : null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('name', name);
            if (image) fd.append('image', image);
            if (category) fd.append('_method', 'PUT');

            if (category) {
                await updateCategory(category.id, fd);
            } else {
                await createCategory(fd);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            {/* Image upload */}
            <div className="flex gap-4 items-start">
                <div
                    className="h-24 w-24 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-primary-300 transition-colors"
                    onClick={() => document.getElementById('cat-img-input').click()}
                >
                    {preview ? (
                        <img src={preview} alt="preview" className="h-full w-full object-contain p-2" />
                    ) : (
                        <div className="text-center text-gray-300">
                            <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <p className="text-xs mt-1">Upload</p>
                        </div>
                    )}
                </div>
                <input id="cat-img-input" type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <div className="flex-1 space-y-3">
                    <div>
                        <label className="label">Category Name *</label>
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Coffee"
                            required
                        />
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 -mt-2">Click the box to upload a category icon (PNG with transparent background recommended, max 2 MB)</p>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
                    {loading ? 'Saving…' : category ? 'Update Category' : 'Create Category'}
                </button>
            </div>
        </form>
    );
}

// ── Main list ─────────────────────────────────────────────────────────────────
export default function CategoryList() {
    const [categories, setCategories]     = useState([]);
    const [loading, setLoading]           = useState(true);
    const [formOpen, setFormOpen]         = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast]               = useState(null);

    const showToast = (msg, type = 'success') => setToast({ message: msg, type });

    const fetchAll = () => {
        setLoading(true);
        getCategories().then(setCategories).finally(() => setLoading(false));
    };

    useEffect(() => { fetchAll(); }, []);

    const openNew  = () => { setEditCategory(null); setFormOpen(true); };
    const openEdit = (cat) => { setEditCategory(cat); setFormOpen(true); };

    const handleDelete = async () => {
        try {
            await deleteCategory(deleteTarget.id);
            showToast('Category deleted.');
            fetchAll();
        } catch {
            showToast('Failed to delete.', 'error');
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="space-y-5">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{categories.length} categories</p>
                <button onClick={openNew} className="btn-primary text-sm flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                    Add Category
                </button>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : categories.length === 0 ? (
                <div className="text-center py-16 text-gray-300">
                    <svg className="h-12 w-12 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                    </svg>
                    <p className="text-sm">No categories yet. Click <strong>Add Category</strong> to start.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="card overflow-hidden group">
                            {/* Icon area */}
                            <div className="h-28 bg-orange-50/60 flex items-center justify-center">
                                {cat.image ? (
                                    <img
                                        src={`/storage/${cat.image}`}
                                        alt={cat.name}
                                        className="h-20 w-20 object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <svg className="h-14 w-14 text-orange-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M3 3h18v18H3z" rx="3" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                )}
                            </div>

                            {/* Info row */}
                            <div className="flex items-center gap-3 px-4 py-3">
                                {/* Small icon badge */}
                                <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 -mt-7 relative z-10 overflow-hidden">
                                    {cat.image ? (
                                        <img src={`/storage/${cat.image}`} alt={cat.name} className="h-full w-full object-contain p-1.5" />
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="3" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 truncate">{cat.name}</p>
                                    <p className="text-xs text-gray-400">{cat.products_count ?? 0} products</p>
                                </div>
                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => openEdit(cat)}
                                        className="h-8 w-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(cat)}
                                        className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editCategory ? 'Edit Category' : 'New Category'}>
                <CategoryForm
                    category={editCategory}
                    onSuccess={() => {
                        setFormOpen(false);
                        fetchAll();
                        showToast(editCategory ? 'Category updated.' : 'Category created.');
                    }}
                    onCancel={() => setFormOpen(false)}
                />
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Category"
                message={`Delete "${deleteTarget?.name}"? All related products will also be deleted.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
