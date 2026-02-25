import React from 'react';
import { CartProvider, useCart } from '../../context/CartContext';
import POSView from '../../components/cashier/POSView';
import CashierSelectModal from '../../components/cashier/CashierSelectModal';

function CashierPageInner() {
    const { activeCashier, setActiveCashier } = useCart();

    return (
        <>
            {!activeCashier && (
                <CashierSelectModal onSelect={setActiveCashier} />
            )}
            <POSView />
        </>
    );
}

export default function CashierPage() {
    return (
        <CartProvider>
            <CashierPageInner />
        </CartProvider>
    );
}
