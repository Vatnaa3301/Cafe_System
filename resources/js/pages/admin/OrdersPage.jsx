import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import OrderList from '../../components/admin/OrderList';

export default function OrdersPage() {
    return (
        <AdminLayout>
            <OrderList />
        </AdminLayout>
    );
}
