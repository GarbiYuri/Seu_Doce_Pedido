import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="w-full max-w-md font-sans">
                <h2 className="text-3xl font-bold text-[#EF3167] text-center mb-6 tracking-widest">
                    CADASTRO
                </h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nome" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#EF3167] focus:ring focus:ring-[#EF3167] focus:ring-opacity-50 transition duration-300 ease-in-out pl-3"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#EF3167] focus:ring focus:ring-[#EF3167] focus:ring-opacity-50 transition duration-300 ease-in-out pl-3"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Senha" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#EF3167] focus:ring focus:ring-[#EF3167] focus:ring-opacity-50 transition duration-300 ease-in-out pl-3"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirme sua senha" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#EF3167] focus:ring focus:ring-[#EF3167] focus:ring-opacity-50 transition duration-300 ease-in-out pl-3"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="flex flex-col items-center justify-center pt-4 space-y-4">
                        <Link
                            href={route('login')}
                            className="text-sm text-[#EF3167] hover:underline text-center"
                        >
                            Já está cadastrado?
                        </Link>

                        <button
                            type="submit"
                            className="w-3/4 bg-[#EF3167] hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                            disabled={processing}
                        >
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
