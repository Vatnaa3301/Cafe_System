import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Dashboard from '../../components/admin/Dashboard';

export default function DashboardPage() {
    return (
        <AdminLayout>
            <Dashboard />
        </AdminLayout>
    );
}
