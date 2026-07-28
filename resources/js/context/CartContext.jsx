import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems]               = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [discount, setDiscount]         = useState(0);
    const [voucherCode, setVoucherCode]   = useState('');
    const [activeCashier, setActiveCashierState] = useState(
        () => localStorage.getItem('active_cashier') || 'Vatana'
    );

    const setActiveCashier = (name) => {
        setActiveCashierState(name);
        if (name) {
            localStorage.setItem('active_cashier', name);
        } else {
            localStorage.removeItem('active_cashier');
        }
    };

    /**
     * Add an item to the cart. Each item must have a unique `cartKey`
     * that encodes product id + all customization choices so that the same
     * product with different options is treated as a separate cart line.
     *
     * Shape: { cartKey, id, name, image, price, customization: { size, sugar, ice, topping, topping_level } }
     */
    const addItem = (item) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.cartKey === item.cartKey);
            if (existing) {
                return prev.map((i) =>
                    i.cartKey === item.cartKey ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (cartKey) => {
        setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
    };

    const updateQuantity = (cartKey, quantity) => {
        if (quantity <= 0) {
            removeItem(cartKey);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        setCustomerName('');
        setDiscount(0);
        setVoucherCode('');
    };

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax      = (subtotal - discount) * 0.1;
    const total    = subtotal - discount + tax;

    return (
        <CartContext.Provider
            value={{
                items,
                customerName,
                setCustomerName,
                discount,
                setDiscount,
                voucherCode,
                setVoucherCode,
                activeCashier,
                setActiveCashier,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                subtotal,
                tax,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

