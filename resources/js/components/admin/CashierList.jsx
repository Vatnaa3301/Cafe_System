import React, { useEffect, useState } from 'react';
import { getAllCashiers, createCashier, updateCashier, deleteCashier } from '../../api/cashiers';
import Toast from '../common/Toast';

export default function CashierList() {
    const [cashiers, setCashiers] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [toast, setToast]       = useState(null);

    // Add form
    const [newName, setNewName] = useState('');
    const [adding, setAdding]   = useState(false);

    // Edit state
    const [editId, setEditId]     = useState(null);
    const [editName, setEditName] = useState('');

    const loadCashiers = () => {
        setLoading(true);
        getAllCashiers()
            .then(setCashiers)
            .catch(() => setToast({ message: 'Failed to load cashiers.', type: 'error' }))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadCashiers(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setAdding(true);
        try {
            await createCashier({ name: newName.trim() });
            setNewName('');
            setToast({ message: 'Cashier added!', type: 'success' });
            loadCashiers();
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to add cashier.', type: 'error' });
        } finally {
            setAdding(false);
        }
    };

    const handleToggleActive = async (cashier) => {
        try {
            await updateCashier(cashier.id, { active: !cashier.active });
            loadCashiers();
        } catch {
            setToast({ message: 'Failed to update cashier.', type: 'error' });
        }
    };

    const handleEditSave = async (cashier) => {
        if (!editName.trim()) return;
        try {
            await updateCashier(cashier.id, { name: editName.trim() });
            setEditId(null);
            setToast({ message: 'Cashier updated!', type: 'success' });
            loadCashiers();
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to update cashier.', type: 'error' });
        }
    };

    const handleDelete = async (cashier) => {
        if (!window.confirm(`Delete cashier "${cashier.name}"?`)) return;
        try {
            await deleteCashier(cashier.id);
            setToast({ message: 'Cashier deleted.', type: 'success' });
            loadCashiers();
        } catch {
            setToast({ message: 'Failed to delete cashier.', type: 'error' });
        }
    };

    return (
        <div className="p-6 max-w-2xl">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Cashier Names</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage the list of cashier names shown to staff when starting a shift.
                </p>
            </div>

            {/* Add new cashier */}
            <form onSubmit={handleAdd} className="flex gap-3 mb-6">
                <input
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 placeholder-gray-400"
                    placeholder="New cashier name…"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={adding || !newName.trim()}
                    className="bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    {adding ? 'Adding…' : 'Add Cashier'}
                </button>
            </form>

            {/* Cashier list */}
            {loading ? (
                <div className="text-center py-10 text-gray-400 text-sm">Loading…</div>
            ) : cashiers.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No cashiers yet. Add one above.</div>
            ) : (
                <div className="space-y-2">
                    {cashiers.map((c) => (
                        <div
                            key={c.id}
                            className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border ${
                                c.active ? 'border-gray-100' : 'border-gray-200 opacity-60'
                            }`}
                        >
                            {/* Active indicator */}
                            <span
                                className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                                    c.active ? 'bg-green-400' : 'bg-gray-300'
                                }`}
                            />

                            {/* Name or edit input */}
                            {editId === c.id ? (
                                <input
                                    className="flex-1 rounded-lg border border-primary-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                                    value={editName}
                                    autoFocus
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleEditSave(c);
                                        if (e.key === 'Escape') setEditId(null);
                                    }}
                                />
                            ) : (
                                <span className="flex-1 text-sm font-medium text-gray-800">{c.name}</span>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center gap-2">
                                {editId === c.id ? (
                                    <>
                                        <button
                                            onClick={() => handleEditSave(c)}
                                            className="text-xs text-green-600 hover:text-green-700 font-semibold px-2 py-1 rounded-lg hover:bg-green-50"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditId(null)}
                                            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => { setEditId(c.id); setEditName(c.name); }}
                                            className="text-xs text-gray-400 hover:text-primary-500 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                                            title="Rename"
                                        >
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(c)}
                                            className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                                                c.active
                                                    ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50'
                                                    : 'text-green-500 hover:text-green-600 hover:bg-green-50'
                                            }`}
                                            title={c.active ? 'Deactivate' : 'Activate'}
                                        >
                                            {c.active ? (
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 7l-10 10M7 7l10 10"/>
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c)}
                                            className="text-xs text-gray-300 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
