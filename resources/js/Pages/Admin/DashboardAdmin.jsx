import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage } from '@inertiajs/react';

export default function DashboardAdmin() {
    const user = usePage().props.auth.user;
    return (
        <AdminLayout

        >
            <Head title="Administração" />

            
   
        </AdminLayout>
    );
}