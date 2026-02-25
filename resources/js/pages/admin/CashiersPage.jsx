import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import CashierList from '../../components/admin/CashierList';

export default function CashiersPage() {
    return (
        <AdminLayout>
            <CashierList />
        </AdminLayout>
    );
}
