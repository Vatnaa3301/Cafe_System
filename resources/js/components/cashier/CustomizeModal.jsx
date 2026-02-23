import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/format';

// ─── Cup icons ────────────────────────────────────────────────────────────────
function IcoCupS({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 48 60" className="h-10 w-8" fill="none">
            <path d="M8 10 L40 10 L36 54 Q36 56 34 56 L14 56 Q12 56 12 54 Z" stroke={c} strokeWidth="2.5" strokeLinejoin="round" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M6 10 L42 10" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            <text x="24" y="36" textAnchor="middle" fontSize="13" fontWeight="bold" fill={c}>S</text>
        </svg>
    );
}
function IcoCupM({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 48 60" className="h-12 w-9" fill="none">
            <path d="M6 8 L42 8 L37 55 Q37 58 34 58 L14 58 Q11 58 11 55 Z" stroke={c} strokeWidth="2.5" strokeLinejoin="round" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M4 8 L44 8" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            <text x="24" y="36" textAnchor="middle" fontSize="13" fontWeight="bold" fill={c}>M</text>
        </svg>
    );
}
function IcoCupL({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 48 60" className="h-14 w-10" fill="none">
            <path d="M4 6 L44 6 L38 56 Q38 60 34 60 L14 60 Q10 60 10 56 Z" stroke={c} strokeWidth="2.5" strokeLinejoin="round" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M2 6 L46 6" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            <text x="24" y="36" textAnchor="middle" fontSize="13" fontWeight="bold" fill={c}>L</text>
        </svg>
    );
}

// ─── Sugar icons ──────────────────────────────────────────────────────────────
function IcoSugar0({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 40 40" className="h-9 w-9">
            <path d="M20 8 C20 8 10 20 10 28 a10 10 0 0 0 20 0 C30 20 20 8 20 8Z" stroke={c} strokeWidth="2" fill="none" />
            <line x1="8" y1="8" x2="32" y2="32" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="8" x2="8" y2="32" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}
function IcoSugar25({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 40 40" className="h-9 w-9">
            <path d="M20 6 C20 6 10 20 10 28 a10 10 0 0 0 20 0 C30 20 20 6 20 6Z" stroke={c} strokeWidth="2" fill={active ? '#fed7aa' : '#e5e7eb'} />
        </svg>
    );
}
function IcoSugar50({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 44 40" className="h-9 w-9">
            {[12, 28].map((x, i) => (
                <path key={i} d={`M${x} 6 C${x} 6 ${x-7} 16 ${x-7} 23 a7 7 0 0 0 14 0 C${x+7} 16 ${x} 6 ${x} 6Z`} stroke={c} strokeWidth="2" fill={active ? '#fed7aa' : '#e5e7eb'} />
            ))}
        </svg>
    );
}
function IcoSugar70({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 44 40" className="h-9 w-9">
            {[12, 28].map((x, i) => (
                <path key={i} d={`M${x} 4 C${x} 4 ${x-8} 18 ${x-8} 26 a8 8 0 0 0 16 0 C${x+8} 18 ${x} 4 ${x} 4Z`} stroke={c} strokeWidth="2" fill={active ? '#fed7aa' : '#e5e7eb'} />
            ))}
        </svg>
    );
}
function IcoSugar100({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 54 40" className="h-9 w-9">
            {[10, 24, 38].map((x, i) => (
                <path key={i} d={`M${x} 6 C${x} 6 ${x-6} 17 ${x-6} 23 a6 6 0 0 0 12 0 C${x+6} 17 ${x} 6 ${x} 6Z`} stroke={c} strokeWidth="2" fill={active ? '#fed7aa' : '#e5e7eb'} />
            ))}
            {[17, 31].map((x, i) => (
                <path key={i+3} d={`M${x} 20 C${x} 20 ${x-5} 28 ${x-5} 33 a5 5 0 0 0 10 0 C${x+5} 28 ${x} 20 ${x} 20Z`} stroke={c} strokeWidth="2" fill={active ? '#fed7aa' : '#e5e7eb'} />
            ))}
        </svg>
    );
}
function IcoSugar120({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 54 44" className="h-9 w-9">
            {[10, 27, 44].map((x, i) => (
                <path key={i} d={`M${x} 4 C${x} 4 ${x-7} 16 ${x-7} 23 a7 7 0 0 0 14 0 C${x+7} 16 ${x} 4 ${x} 4Z`} stroke={c} strokeWidth="2" fill={active ? '#fed7aa' : '#e5e7eb'} />
            ))}
            {[10, 27, 44].map((x, i) => (
                <path key={i+3} d={`M${x} 25 C${x} 25 ${x-5} 33 ${x-5} 37 a5 5 0 0 0 10 0 C${x+5} 33 ${x} 25 ${x} 25Z`} stroke={c} strokeWidth="2" fill={active ? '#fed7aa' : '#e5e7eb'} />
            ))}
        </svg>
    );
}

// ─── Ice icons ────────────────────────────────────────────────────────────────
function IcoNoIce({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 40 44" className="h-10 w-10" fill="none">
            <path d="M6 8 L34 8 L30 40 Q30 42 28 42 L12 42 Q10 42 10 40 Z" stroke={c} strokeWidth="2" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M4 8 L36 8" stroke={c} strokeWidth="2" strokeLinecap="round" />
            <path d="M14 20 Q20 24 26 20" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
function IcoLessIce({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 40 44" className="h-10 w-10" fill="none">
            <path d="M6 8 L34 8 L30 40 Q30 42 28 42 L12 42 Q10 42 10 40 Z" stroke={c} strokeWidth="2" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M4 8 L36 8" stroke={c} strokeWidth="2" strokeLinecap="round" />
            <rect x="14" y="30" width="6" height="6" rx="1.5" stroke={c} strokeWidth="1.8" fill={active ? '#bae6fd' : '#d1d5db'} />
        </svg>
    );
}
function IcoNormalIce({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 40 44" className="h-10 w-10" fill="none">
            <path d="M6 8 L34 8 L30 40 Q30 42 28 42 L12 42 Q10 42 10 40 Z" stroke={c} strokeWidth="2" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M4 8 L36 8" stroke={c} strokeWidth="2" strokeLinecap="round" />
            <rect x="11" y="26" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" fill={active ? '#7dd3fc' : '#d1d5db'} />
            <rect x="22" y="26" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" fill={active ? '#7dd3fc' : '#d1d5db'} />
        </svg>
    );
}
function IcoMoreIce({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 40 44" className="h-10 w-10" fill="none">
            <path d="M6 8 L34 8 L30 40 Q30 42 28 42 L12 42 Q10 42 10 40 Z" stroke={c} strokeWidth="2" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M4 8 L36 8" stroke={c} strokeWidth="2" strokeLinecap="round" />
            <rect x="11" y="18" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.5" fill={active ? '#7dd3fc' : '#d1d5db'} />
            <rect x="22" y="18" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.5" fill={active ? '#7dd3fc' : '#d1d5db'} />
            <rect x="11" y="28" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.5" fill={active ? '#38bdf8' : '#d1d5db'} />
            <rect x="22" y="28" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.5" fill={active ? '#38bdf8' : '#d1d5db'} />
        </svg>
    );
}
function IcoWarm({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 40 44" className="h-10 w-10" fill="none">
            <path d="M6 14 L34 14 L30 40 Q30 42 28 42 L12 42 Q10 42 10 40 Z" stroke={c} strokeWidth="2" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M4 14 L36 14" stroke={c} strokeWidth="2" strokeLinecap="round" />
            <path d="M14 6 Q16 4 18 6 Q20 8 22 6 Q24 4 26 6" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
function IcoHot({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 40 44" className="h-10 w-10" fill="none">
            <path d="M6 14 L34 14 L30 40 Q30 42 28 42 L12 42 Q10 42 10 40 Z" stroke={c} strokeWidth="2" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M4 14 L36 14" stroke={c} strokeWidth="2" strokeLinecap="round" />
            <path d="M12 7 Q14 4 16 7 Q18 10 20 7 Q22 4 24 7 Q26 10 28 7" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// ─── Topping icons ────────────────────────────────────────────────────────────
function IcoTopping({ active, name }) {
    const c = active ? '#f97316' : '#9ca3af';
    const f = active ? '#fed7aa' : '#e5e7eb';
    const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '•';
    return (
        <svg viewBox="0 0 44 40" className="h-9 w-9" fill="none">
            <circle cx="14" cy="24" r="8" stroke={c} strokeWidth="2" fill={f} />
            <circle cx="30" cy="24" r="8" stroke={c} strokeWidth="2" fill={f} />
            <circle cx="22" cy="14" r="8" stroke={c} strokeWidth="2" fill={f} />
            <text x="22" y="18" textAnchor="middle" fontSize="7" fontWeight="bold" fill={active ? '#f97316' : '#9ca3af'}>{initials}</text>
        </svg>
    );
}
function IcoNoneTopping({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 44 40" className="h-9 w-9" fill="none">
            <circle cx="14" cy="24" r="7" stroke={c} strokeWidth="1.8" />
            <circle cx="30" cy="24" r="7" stroke={c} strokeWidth="1.8" />
            <circle cx="22" cy="14" r="7" stroke={c} strokeWidth="1.8" />
            <line x1="6" y1="6" x2="38" y2="38" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

// ─── Topping level / bowl icons ───────────────────────────────────────────────
function IcoBowl({ active, filled }) {
    const c = active ? '#f97316' : '#9ca3af';
    const f = active ? '#fed7aa' : '#e5e7eb';
    return (
        <svg viewBox="0 0 44 36" className="h-9 w-9" fill="none">
            <path d="M4 12 Q4 32 22 32 Q40 32 40 12 Z" stroke={c} strokeWidth="2" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M2 12 L42 12" stroke={c} strokeWidth="2" strokeLinecap="round" />
            {filled >= 1 && <circle cx="16" cy="10" r="4" stroke={c} strokeWidth="1.5" fill={f} />}
            {filled >= 2 && <circle cx="28" cy="10" r="4" stroke={c} strokeWidth="1.5" fill={f} />}
            {filled >= 3 && <circle cx="22" cy="4" r="4" stroke={c} strokeWidth="1.5" fill={f} />}
        </svg>
    );
}
function IcoNoBowl({ active }) {
    const c = active ? '#f97316' : '#9ca3af';
    return (
        <svg viewBox="0 0 44 36" className="h-9 w-9" fill="none">
            <path d="M4 12 Q4 32 22 32 Q40 32 40 12 Z" stroke={c} strokeWidth="2" fill={active ? '#fff7ed' : '#f9fafb'} />
            <path d="M2 12 L42 12" stroke={c} strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="4" x2="34" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="34" y1="4" x2="10" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

// ─── Option data ──────────────────────────────────────────────────────────────
const SUGAR_OPTIONS = [
    { label: '0%',   icon: (a) => <IcoSugar0   active={a} /> },
    { label: '25%',  icon: (a) => <IcoSugar25  active={a} /> },
    { label: '50%',  icon: (a) => <IcoSugar50  active={a} /> },
    { label: '70%',  icon: (a) => <IcoSugar70  active={a} /> },
    { label: '100%', icon: (a) => <IcoSugar100 active={a} /> },
    { label: '120%', icon: (a) => <IcoSugar120 active={a} /> },
];
const ICE_OPTIONS = [
    { label: 'No Ice',     icon: (a) => <IcoNoIce     active={a} /> },
    { label: 'Less Ice',   icon: (a) => <IcoLessIce   active={a} /> },
    { label: 'Normal Ice', icon: (a) => <IcoNormalIce active={a} /> },
    { label: 'More Ice',   icon: (a) => <IcoMoreIce   active={a} /> },
    { label: 'Warm',       icon: (a) => <IcoWarm      active={a} /> },
    { label: 'Hot',        icon: (a) => <IcoHot       active={a} /> },
];
const TOPPING_LEVEL_OPTIONS = [
    { label: 'No Topping', icon: (a) => <IcoNoBowl active={a} /> },
    { label: 'Less',       icon: (a) => <IcoBowl   active={a} filled={1} /> },
    { label: 'Normal',     icon: (a) => <IcoBowl   active={a} filled={2} /> },
    { label: 'More',       icon: (a) => <IcoBowl   active={a} filled={3} /> },
];
const CUP_ICONS = { S: IcoCupS, M: IcoCupM, L: IcoCupL };

// ─── Icon card tile ───────────────────────────────────────────────────────────
function IconCard({ icon, label, sublabel, selected, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center justify-end gap-1 rounded-2xl border-2 transition-all duration-150 px-2 py-3 min-w-[68px] ${
                selected
                    ? 'border-primary-400 bg-primary-50 shadow-sm shadow-primary-100'
                    : 'border-gray-100 bg-white hover:border-primary-200'
            }`}
        >
            <div className="flex items-end justify-center h-11">{icon(selected)}</div>
            <span className={`text-[11px] font-bold leading-tight text-center ${selected ? 'text-primary-600' : 'text-gray-500'}`}>
                {label}
            </span>
            {sublabel && (
                <span className={`text-[10px] font-semibold ${selected ? 'text-primary-400' : 'text-gray-400'}`}>
                    {sublabel}
                </span>
            )}
        </button>
    );
}

function SectionHeader({ title, required }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-bold text-gray-800">{title}</h4>
            {required && (
                <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full">
                    1 Required
                </span>
            )}
        </div>
    );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function CustomizeModal({ product, onClose }) {
    const { addItem } = useCart();

    const hasSizes    = product.sizes && Object.keys(product.sizes).length > 0;
    const hasToppings = product.toppings && product.toppings.length > 0;
    const defaultSize = hasSizes ? Object.keys(product.sizes)[0] : null;

    const [size, setSize]                 = useState(defaultSize);
    const [sugar, setSugar]               = useState('100%');
    const [ice, setIce]                   = useState('Normal Ice');
    const [topping, setTopping]           = useState('none');
    const [toppingLevel, setToppingLevel] = useState('Normal');

    const basePrice   = hasSizes && size ? product.sizes[size] : product.price;
    const toppingItem = hasToppings && topping !== 'none'
        ? product.toppings.find((t) => t.name === topping)
        : null;
    const finalPrice  = basePrice + (toppingItem ? toppingItem.extra_price : 0);

    const handleAddToCart = () => {
        const customization = {
            size,
            sugar,
            ice,
            topping      : (hasToppings && topping !== 'none') ? topping : null,
            topping_level: (hasToppings && topping !== 'none') ? toppingLevel : null,
        };
        const cartKey = [product.id, size ?? 'default', sugar, ice, topping ?? 'none', toppingLevel].join('|');
        addItem({ cartKey, id: product.id, name: product.name, image: product.image, price: finalPrice, customization });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

                {/* Header */}
                <div className="flex gap-4 p-5 border-b border-gray-100 flex-shrink-0">
                    <div className="h-16 w-16 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                        {product.image ? (
                            <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full flex items-center justify-center text-3xl">☕</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-base leading-snug truncate">{product.name}</h3>
                        <p className="text-primary-500 font-extrabold text-xl mt-0.5">{formatCurrency(finalPrice)}</p>
                        {toppingItem && (
                            <p className="text-xs text-gray-400">incl. +{formatCurrency(toppingItem.extra_price)} topping</p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-500 self-start transition-colors">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable options */}
                <div className="overflow-y-auto flex-1 px-5 py-5 space-y-7">

                    {/* Cup Size */}
                    {hasSizes && (
                        <section>
                            <SectionHeader title="Cup Size" required />
                            <div className="flex gap-3 flex-wrap">
                                {Object.entries(product.sizes).map(([s, p]) => {
                                    const CupIcon = CUP_ICONS[s] ?? IcoCupM;
                                    return (
                                        <IconCard
                                            key={s}
                                            selected={size === s}
                                            onClick={() => setSize(s)}
                                            label={s}
                                            sublabel={formatCurrency(p)}
                                            icon={(active) => <CupIcon active={active} />}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Sugar Level */}
                    <section>
                        <SectionHeader title="Sugar Level" required />
                        <div className="flex gap-2 flex-wrap">
                            {SUGAR_OPTIONS.map(({ label, icon }) => (
                                <IconCard key={label} selected={sugar === label} onClick={() => setSugar(label)} label={label} icon={icon} />
                            ))}
                        </div>
                    </section>

                    {/* Ice Level */}
                    <section>
                        <SectionHeader title="Ice Level" required />
                        <div className="flex gap-2 flex-wrap">
                            {ICE_OPTIONS.map(({ label, icon }) => (
                                <IconCard key={label} selected={ice === label} onClick={() => setIce(label)} label={label} icon={icon} />
                            ))}
                        </div>
                    </section>

                    {/* Toppings */}
                    {hasToppings && (
                        <section>
                            <SectionHeader title="Topping" />
                            <div className="flex gap-2 flex-wrap">
                                <IconCard
                                    selected={topping === 'none'}
                                    onClick={() => setTopping('none')}
                                    label="None"
                                    icon={(a) => <IcoNoneTopping active={a} />}
                                />
                                {product.toppings.map((t) => (
                                    <IconCard
                                        key={t.name}
                                        selected={topping === t.name}
                                        onClick={() => setTopping(t.name)}
                                        label={t.name}
                                        sublabel={t.extra_price > 0 ? `+${formatCurrency(t.extra_price)}` : 'Free'}
                                        icon={(a) => <IcoTopping active={a} name={t.name} />}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Topping Level */}
                    {hasToppings && topping && topping !== 'none' && (
                        <section>
                            <SectionHeader title="Topping Level" required />
                            <div className="flex gap-2 flex-wrap">
                                {TOPPING_LEVEL_OPTIONS.map(({ label, icon }) => (
                                    <IconCard key={label} selected={toppingLevel === label} onClick={() => setToppingLevel(label)} label={label} icon={icon} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Add to Cart */}
                <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex-shrink-0">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-md shadow-primary-200"
                    >
                        Add to Cart — {formatCurrency(finalPrice)}
                    </button>
                </div>
            </div>
        </div>
    );
}

