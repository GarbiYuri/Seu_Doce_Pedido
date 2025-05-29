import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Importando fonte Poppins */}
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
                rel="stylesheet"
            />

            <div className="w-full max-w-md font-poppins mx-auto px-4">
                <h2 className="text-3xl font-bold text-[#EF3167] text-center mb-6 tracking-widest animate-fadeIn">
                    LOGIN
                </h2>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 animate-fadeIn">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4 animate-fadeInUp">
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#EF3167] focus:ring focus:ring-[#EF3167] focus:ring-opacity-50 transition duration-300 ease-in-out"
                            autoComplete="username"
                            isFocused={true}
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
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#EF3167] focus:ring focus:ring-[#EF3167] focus:ring-opacity-50 transition duration-300 ease-in-out"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="ms-2 text-gray-600">Lembre de mim</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-[#EF3167] hover:underline"
                            >
                                Esqueceu sua Senha?
                            </Link>
                        )}
                    </div>

                    {/* Centralizando o link e colocando botão maior embaixo */}
                    <div className="flex flex-col items-center space-y-4 pt-6">
                        <Link
                            href={route('register')}
                            className="text-sm text-[#EF3167] font-semibold hover:underline text-center w-full max-w-xs"
                        >
                            Não possui uma conta? Cadastre-se
                        </Link>

                        <button
                            type="submit"
                            className="w-full max-w-xs bg-[#EF3167] hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                            disabled={processing}
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                {/* Animações simples com Tailwind extendido */}
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

                    .font-poppins {
                        font-family: 'Poppins', sans-serif;
                    }

                    /* Fade In */
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.7s ease forwards;
                    }

                    /* Fade In + Up */
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fadeInUp {
                        animation: fadeInUp 0.8s ease forwards;
                    }
                `}</style>
            </div>
        </GuestLayout>
    );
}
