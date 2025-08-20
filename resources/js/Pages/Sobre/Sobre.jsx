import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Sobre() {

  return (
    <AuthenticatedLayout>
    <Head title="Sobre" />
    <p className='text-center text-3xl font-bold text-black-700 mb-8'>Criando...</p>
    </AuthenticatedLayout>
  );
}
