import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head} from "@inertiajs/react";

export default function Welcome() {
   
    return (
        <AuthenticatedLayout

        >
            <Head title="Welcome" />
        


        </AuthenticatedLayout>    
       
    );
}
