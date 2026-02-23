import React from 'react';
import { CartProvider } from '../../context/CartContext';
import POSView from '../../components/cashier/POSView';

export default function CashierPage() {
    return (
        <CartProvider>
            <POSView />
        </CartProvider>
    );
}
