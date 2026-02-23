import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import ProductList from '../../components/admin/ProductList';

export default function ProductsPage() {
    return (
        <AdminLayout>
            <ProductList />
        </AdminLayout>
    );
}
