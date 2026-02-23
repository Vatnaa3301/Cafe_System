import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import CategoryList from '../../components/admin/CategoryList';

export default function CategoriesPage() {
    return (
        <AdminLayout>
            <CategoryList />
        </AdminLayout>
    );
}
