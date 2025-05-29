import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Senha" />

            <div className="mb-4 text-gray-600 font-sans text-sm">
                Esqueceu sua senha? Sem problemas.
            </div>
            <div className="mb-4 text-gray-600 font-sans text-sm">
                Informe seu email abaixo e enviaremos um link para você criar uma nova senha.
            </div>

            {status && (
                <div className="mb-4 text-green-600 font-medium text-sm">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4 w-full max-w-md font-sans">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#EF3167] focus:ring focus:ring-[#EF3167] focus:ring-opacity-50 transition duration-300 ease-in-out pl-3"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="flex flex-col items-center justify-center pt-4 space-y-4">
                    <PrimaryButton
                        className="w-3/4 bg-[#EF3167] hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex justify-center"
                        disabled={processing}
                    >
                        Enviar link de recuperação
                    </PrimaryButton>

                </div>
            </form>
        </GuestLayout>
    );
}
