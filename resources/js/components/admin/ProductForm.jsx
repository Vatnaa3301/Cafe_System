import React, { useState } from 'react';
import { createProduct, updateProduct } from '../../api/products';
import AvailabilityToggle from '../ui/AvailabilityToggle';
import StyledCheckbox from '../ui/StyledCheckbox';

export default function ProductForm({ product, categories, onSuccess, onCancel }) {
    const [form, setForm] = useState({
        name         : product?.name          ?? '',
        description  : product?.description   ?? '',
        price        : product?.price         ?? '',
        category_id  : product?.category_id   ?? '',
        is_available : product?.is_available  ?? true,
        image        : null,
    });
    const [preview, setPreview]           = useState(product?.image ? `/storage/${product.image}` : null);
    const [loading, setLoading]           = useState(false);
    const [errors, setErrors]             = useState({});

    // ── Sizes ──────────────────────────────────────────────────────────────
    const [enableSizes, setEnableSizes]   = useState(!!product?.sizes);
    const [sizeS, setSizeS]               = useState(product?.sizes?.S ?? '');
    const [sizeM, setSizeM]               = useState(product?.sizes?.M ?? '');
    const [sizeL, setSizeL]               = useState(product?.sizes?.L ?? '');

    // ── Ice Levels ─────────────────────────────────────────────────────────
    const ALL_ICE_OPTIONS = ['No Ice', 'Less Ice', 'Normal Ice', 'More Ice', 'Warm', 'Hot'];
    const [enableIceLevels, setEnableIceLevels] = useState(!!(product?.ice_levels?.length));
    const [iceLevels, setIceLevels] = useState(
        product?.ice_levels?.length ? product.ice_levels : [...ALL_ICE_OPTIONS]
    );
    const toggleIceLevel = (opt) =>
        setIceLevels((prev) =>
            prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
        );

    // ── Toppings ───────────────────────────────────────────────────────────
    const [enableToppings, setEnableToppings] = useState(!!(product?.toppings?.length));
    const [toppings, setToppings]             = useState(
        product?.toppings?.length ? product.toppings : [{ name: '', extra_price: '' }]
    );

    const addTopping    = () => setToppings([...toppings, { name: '', extra_price: '' }]);
    const removeTopping = (i) => setToppings(toppings.filter((_, idx) => idx !== i));
    const updateTopping = (i, field, val) => {
        const updated = toppings.map((t, idx) => idx === i ? { ...t, [field]: val } : t);
        setToppings(updated);
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setForm({ ...form, image: file });
            setPreview(file ? URL.createObjectURL(file) : null);
        } else if (type === 'checkbox') {
            setForm({ ...form, [name]: checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const fd = new FormData();
        fd.append('name',         form.name);
        fd.append('description',  form.description);
        fd.append('price',        form.price);
        fd.append('category_id',  form.category_id);
        fd.append('is_available', form.is_available ? '1' : '0');
        if (form.image) fd.append('image', form.image);

        // Sizes
        if (enableSizes && (sizeS || sizeM || sizeL)) {
            fd.append('sizes', JSON.stringify({
                S: parseFloat(sizeS) || 0,
                M: parseFloat(sizeM) || 0,
                L: parseFloat(sizeL) || 0,
            }));
        } else {
            fd.append('sizes', '');
        }

        // Ice Levels
        if (enableIceLevels && iceLevels.length > 0) {
            fd.append('ice_levels', JSON.stringify(iceLevels));
        } else {
            fd.append('ice_levels', '');
        }

        // Toppings
        const validToppings = toppings.filter((t) => t.name.trim());
        if (enableToppings && validToppings.length > 0) {
            fd.append('toppings', JSON.stringify(
                validToppings.map((t) => ({ name: t.name.trim(), extra_price: parseFloat(t.extra_price) || 0 }))
            ));
        } else {
            fd.append('toppings', '');
        }

        try {
            if (product) {
                await updateProduct(product.id, fd);
            } else {
                await createProduct(fd);
            }
            onSuccess();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const field = (key) => ({
        name: key,
        value: form[key],
        onChange: handleChange,
        className: `input ${errors[key] ? 'border-red-400' : ''}`,
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Preview */}
            <div className="flex gap-4 items-start">
                <div className="h-24 w-24 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                    {preview ? (
                        <img src={preview} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <label className="label">Product Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 2 MB</p>
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
                </div>
            </div>

            {/* Name */}
            <div>
                <label className="label">Product Name *</label>
                <input {...field('name')} type="text" placeholder="e.g. Caramel Macchiato" required />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label">Category *</label>
                    <select {...field('category_id')} required className={`input ${errors.category_id ? 'border-red-400' : ''}`}>
                        <option value="">Select category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id[0]}</p>}
                </div>
                <div>
                    <label className="label">Base Price ($) *</label>
                    <input {...field('price')} type="number" min="0" step="0.01" placeholder="4.50" required />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price[0]}</p>}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="label">Description</label>
                <textarea
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    className="input resize-none"
                    placeholder="Optional description…"
                />
            </div>

            {/* Available toggle */}
            <div className="py-1">
                <AvailabilityToggle
                    checked={form.is_available}
                    onChange={handleChange}
                    name="is_available"
                />
            </div>

            {/* Cup Sizes */}
            <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <StyledCheckbox
                        id="enableSizes"
                        checked={enableSizes}
                        onChange={(e) => setEnableSizes(e.target.checked)}
                        label="Enable Cup Sizes (S / M / L)"
                    />
                </div>
                {enableSizes && (
                    <div className="grid grid-cols-3 gap-3">
                        {[['S', sizeS, setSizeS], ['M', sizeM, setSizeM], ['L', sizeL, setSizeL]].map(([label, val, setter]) => (
                            <div key={label}>
                                <label className="label">Size {label} Price ($)</label>
                                <input
                                    type="number" min="0" step="0.01"
                                    placeholder="0.00"
                                    value={val}
                                    onChange={(e) => setter(e.target.value)}
                                    className="input"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Ice Levels */}
            <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <StyledCheckbox
                    id="enableIceLevels"
                    checked={enableIceLevels}
                    onChange={(e) => setEnableIceLevels(e.target.checked)}
                    label="Customize Ice Level Options"
                />
                {enableIceLevels && (
                    <div className="flex flex-wrap gap-2">
                        {ALL_ICE_OPTIONS.map((opt) => (
                            <label
                                key={opt}
                                className="flex items-center gap-1.5 cursor-pointer select-none"
                                style={{
                                    border: iceLevels.includes(opt) ? '1px solid #C96A3D' : '1px solid #EAEAEA',
                                    borderRadius: 20,
                                    padding: '5px 12px',
                                    background: iceLevels.includes(opt) ? '#FFF6F1' : '#FFFFFF',
                                    fontSize: 13,
                                    color: iceLevels.includes(opt) ? '#C96A3D' : '#555',
                                    fontWeight: iceLevels.includes(opt) ? 600 : 400,
                                    transition: 'all 0.15s',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={iceLevels.includes(opt)}
                                    onChange={() => toggleIceLevel(opt)}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Toppings */}
            <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <StyledCheckbox
                        id="enableToppings"
                        checked={enableToppings}
                        onChange={(e) => setEnableToppings(e.target.checked)}
                        label="Enable Toppings"
                    />
                </div>
                {enableToppings && (
                    <div className="space-y-2">
                        {toppings.map((t, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Topping name (e.g. Boba)"
                                    value={t.name}
                                    onChange={(e) => updateTopping(i, 'name', e.target.value)}
                                    className="input flex-1"
                                />
                                <input
                                    type="number" min="0" step="0.01"
                                    placeholder="Extra $"
                                    value={t.extra_price}
                                    onChange={(e) => updateTopping(i, 'extra_price', e.target.value)}
                                    className="input w-24"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeTopping(i)}
                                    className="text-red-400 hover:text-red-600 text-lg leading-none"
                                    title="Remove"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addTopping}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                            + Add Topping
                        </button>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
                    {loading ? 'Saving…' : product ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}
