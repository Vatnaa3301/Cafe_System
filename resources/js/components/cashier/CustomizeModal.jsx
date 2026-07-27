import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/format';
import styled from 'styled-components';

const AddToCartWrapper = styled.div`
  width: 100%;

  button {
    --bg: #e74c3c;
    --text-color: #fff;
    position: relative;
    width: 100%;
    border: none;
    background: var(--bg);
    color: var(--text-color);
    padding: 1em;
    font-weight: bold;
    text-transform: uppercase;
    transition: 0.2s;
    border-radius: 5px;
    opacity: 0.8;
    letter-spacing: 1px;
    box-shadow: #c0392b 0px 7px 2px, #000 0px 8px 5px;
    cursor: pointer;
    font-size: 15px;
  }

  button:hover {
    opacity: 1;
  }

  button:active {
    top: 4px;
    box-shadow: #c0392b 0px 3px 2px, #000 0px 3px 5px;
  }
`;

// ─── Topping icons (kept for topping tile cards) ──────────────────────────────
function IcoTopping({ active, name }) {
    const c = active ? '#C96A3D' : '#9ca3af';
    const f = active ? '#fed7aa' : '#e5e7eb';
    const initials = name
        ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
        : '•';
    return (
        <svg viewBox="0 0 44 40" className="h-7 w-7" fill="none">
            <circle cx="14" cy="24" r="8" stroke={c} strokeWidth="2" fill={f} />
            <circle cx="30" cy="24" r="8" stroke={c} strokeWidth="2" fill={f} />
            <circle cx="22" cy="14" r="8" stroke={c} strokeWidth="2" fill={f} />
            <text x="22" y="18" textAnchor="middle" fontSize="7" fontWeight="bold" fill={c}>
                {initials}
            </text>
        </svg>
    );
}
function IcoNoneTopping({ active }) {
    const c = active ? '#C96A3D' : '#9ca3af';
    return (
        <svg viewBox="0 0 44 40" className="h-7 w-7" fill="none">
            <circle cx="14" cy="24" r="7" stroke={c} strokeWidth="1.8" />
            <circle cx="30" cy="24" r="7" stroke={c} strokeWidth="1.8" />
            <circle cx="22" cy="14" r="7" stroke={c} strokeWidth="1.8" />
            <line x1="6" y1="6" x2="38" y2="38" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

// ─── Size name map ────────────────────────────────────────────────────────────
const SIZE_NAMES = { S: 'Small', M: 'Medium', L: 'Large' };

// ─── Option data ──────────────────────────────────────────────────────────────
const SUGAR_OPTIONS         = ['0%', '25%', '50%', '70%', '100%', '120%'];
const ICE_OPTIONS           = ['No Ice', 'Less Ice', 'Normal Ice', 'More Ice', 'Warm', 'Hot'];
const TOPPING_LEVEL_OPTIONS = ['Less', 'Normal', 'More'];

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, required }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <h4 className="font-semibold text-[#1A1A1A]" style={{ fontSize: 15 }}>
                {title}
            </h4>
            {required && (
                <span
                    className="font-medium"
                    style={{
                        fontSize: 12,
                        color: '#C96A3D',
                        background: '#FFF1E9',
                        borderRadius: 20,
                        padding: '2px 10px',
                    }}
                >
                    Required
                </span>
            )}
        </div>
    );
}

// ─── Option Card — Cup Size premium card ──────────────────────────────────────
function OptionCard({ label, sublabel, price, selected, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-1 text-center transition-all duration-150"
            style={{
                border: selected ? '2px solid #C96A3D' : '1px solid #EAEAEA',
                borderRadius: 12,
                padding: 12,
                background: selected ? '#FFF6F1' : '#FFFFFF',
                cursor: 'pointer',
            }}
        >
            <span
                className="font-bold leading-none"
                style={{ fontSize: 22, color: selected ? '#C96A3D' : '#1A1A1A' }}
            >
                {label}
            </span>
            {sublabel && (
                <span
                    className="font-medium"
                    style={{ fontSize: 11, color: selected ? '#C96A3D' : '#777777' }}
                >
                    {sublabel}
                </span>
            )}
            {price && (
                <span
                    className="font-semibold"
                    style={{ fontSize: 13, color: selected ? '#C96A3D' : '#1A1A1A' }}
                >
                    {price}
                </span>
            )}
        </button>
    );
}

// ─── Segment Button — Sugar / Ice / Topping Level ─────────────────────────────
function SegmentBtn({ label, selected, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="transition-all duration-150"
            style={{
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: selected ? 600 : 400,
                border: selected ? '1px solid #C96A3D' : '1px solid #EAEAEA',
                background: selected ? '#C96A3D' : '#FFFFFF',
                color: selected ? '#FFFFFF' : '#1A1A1A',
                cursor: 'pointer',
            }}
        >
            {label}
        </button>
    );
}

// ─── Topping Card — icon tile for topping selection ───────────────────────────
function ToppingCard({ icon, label, sublabel, selected, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-150"
            style={{
                border: selected ? '2px solid #C96A3D' : '1px solid #EAEAEA',
                borderRadius: 12,
                padding: '10px 6px',
                background: selected ? '#FFF6F1' : '#FFFFFF',
                cursor: 'pointer',
            }}
        >
            <div className="flex items-end justify-center h-8">{icon(selected)}</div>
            <span
                className="font-semibold leading-tight"
                style={{ fontSize: 11, color: selected ? '#C96A3D' : '#777777' }}
            >
                {label}
            </span>
            {sublabel && (
                <span style={{ fontSize: 10, color: selected ? '#C96A3D' : '#9ca3af' }}>
                    {sublabel}
                </span>
            )}
        </button>
    );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function CustomizeModal({ product, onClose }) {
    const { addItem } = useCart();

    const hasSizes    = product.sizes && Object.keys(product.sizes).length > 0;
    const hasToppings = product.toppings && product.toppings.length > 0;
    const defaultSize = hasSizes ? Object.keys(product.sizes)[0] : null;
    const iceOptions  = product.ice_levels && product.ice_levels.length > 0
        ? product.ice_levels
        : ICE_OPTIONS;

    const [size, setSize]                 = useState(defaultSize);
    const [sugar, setSugar]               = useState('100%');
    const [ice, setIce]                   = useState(
        iceOptions.includes('Normal Ice') ? 'Normal Ice' : iceOptions[0] ?? ''
    );
    const [topping, setTopping]           = useState('none');
    const [toppingLevel, setToppingLevel] = useState('Normal');

    const basePrice   = hasSizes && size ? product.sizes[size] : product.price;
    const toppingItem =
        hasToppings && topping !== 'none'
            ? product.toppings.find((t) => t.name === topping)
            : null;
    const finalPrice = basePrice + (toppingItem ? toppingItem.extra_price : 0);

    const handleAddToCart = () => {
        const customization = {
            size,
            sugar,
            ice,
            topping      : hasToppings && topping !== 'none' ? topping : null,
            topping_level: hasToppings && topping !== 'none' ? toppingLevel : null,
        };
        const cartKey = [
            product.id,
            size ?? 'default',
            sugar,
            ice,
            topping ?? 'none',
            toppingLevel,
        ].join('|');
        addItem({
            cartKey,
            id: product.id,
            name: product.name,
            image: product.image,
            price: finalPrice,
            customization,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                style={{ maxHeight: '92vh' }}
            >
                {/* ── Modal Header ─────────────────────────────────────── */}
                <div
                    className="flex gap-5 flex-shrink-0 relative"
                    style={{ padding: 24, borderBottom: '1px solid #EAEAEA' }}
                >
                    {/* Product image */}
                    <div
                        className="rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0"
                        style={{ width: 96, height: 96 }}
                    >
                        {product.image ? (
                            <img
                                src={`/storage/${product.image}`}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-4xl">☕</div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center pr-6">
                        <h3
                            className="font-semibold leading-snug"
                            style={{ fontSize: 20, color: '#1A1A1A' }}
                        >
                            {product.name}
                        </h3>

                        {product.description && (
                            <p
                                className="line-clamp-2 leading-relaxed"
                                style={{ fontSize: 14, color: '#777777', marginTop: 6 }}
                            >
                                {product.description}
                            </p>
                        )}

                        <p
                            className="font-semibold"
                            style={{ color: '#C96A3D', marginTop: 8, fontSize: 16 }}
                        >
                            {formatCurrency(finalPrice)}
                            {toppingItem && (
                                <span
                                    className="font-normal"
                                    style={{ fontSize: 12, color: '#9ca3af', marginLeft: 6 }}
                                >
                                    incl. +{formatCurrency(toppingItem.extra_price)} topping
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Scrollable Options ─────────────────────────────── */}
                <div className="overflow-y-auto flex-1" style={{ padding: '32px 24px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Cup Size — premium mini cards */}
                        {hasSizes && (
                            <section>
                                <SectionHeader title="Cup Size" required />
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${Math.min(Object.keys(product.sizes).length, 3)}, 1fr)`,
                                        gap: 12,
                                    }}
                                >
                                    {Object.entries(product.sizes).map(([s, p]) => (
                                        <OptionCard
                                            key={s}
                                            label={s}
                                            sublabel={SIZE_NAMES[s] ?? s}
                                            price={formatCurrency(p)}
                                            selected={size === s}
                                            onClick={() => setSize(s)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Sugar Level — segmented pills */}
                        <section>
                            <SectionHeader title="Sugar Level" required />
                            <div className="flex flex-wrap" style={{ gap: 8 }}>
                                {SUGAR_OPTIONS.map((label) => (
                                    <SegmentBtn
                                        key={label}
                                        label={label}
                                        selected={sugar === label}
                                        onClick={() => setSugar(label)}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Ice Level — segmented pills */}
                        <section>
                            <SectionHeader title="Ice Level" required />
                            <div className="flex flex-wrap" style={{ gap: 8 }}>
                                {iceOptions.map((label) => (
                                    <SegmentBtn
                                        key={label}
                                        label={label}
                                        selected={ice === label}
                                        onClick={() => setIce(label)}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Toppings — icon tile cards */}
                        {hasToppings && (
                            <section>
                                <SectionHeader title="Topping" />
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: 10,
                                    }}
                                >
                                    <ToppingCard
                                        selected={topping === 'none'}
                                        onClick={() => setTopping('none')}
                                        label="None"
                                        icon={(a) => <IcoNoneTopping active={a} />}
                                    />
                                    {product.toppings.map((t) => (
                                        <ToppingCard
                                            key={t.name}
                                            selected={topping === t.name}
                                            onClick={() => setTopping(t.name)}
                                            label={t.name}
                                            sublabel={
                                                t.extra_price > 0
                                                    ? `+${formatCurrency(t.extra_price)}`
                                                    : 'Free'
                                            }
                                            icon={(a) => <IcoTopping active={a} name={t.name} />}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Topping Level — segmented pills */}
                        {hasToppings && topping && topping !== 'none' && (
                            <section>
                                <SectionHeader title="Topping Level" required />
                                <div className="flex flex-wrap" style={{ gap: 8 }}>
                                    {TOPPING_LEVEL_OPTIONS.map((label) => (
                                        <SegmentBtn
                                            key={label}
                                            label={label}
                                            selected={toppingLevel === label}
                                            onClick={() => setToppingLevel(label)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* ── Sticky CTA ──────────────────────────────────────── */}
                <div
                    className="flex-shrink-0"
                    style={{ padding: '16px 24px 24px', borderTop: '1px solid #EAEAEA' }}
                >
                    <AddToCartWrapper>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                        >
                            Add to Cart — {formatCurrency(finalPrice)}
                        </button>
                    </AddToCartWrapper>
                </div>
            </div>
        </div>
    );
}

