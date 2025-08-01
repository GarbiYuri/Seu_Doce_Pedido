export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Lado esquerdo - escondido em telas pequenas */}
            <div
                className="hidden md:flex md:w-1/2 bg-[#EF3167] flex-col items-center justify-center relative overflow-hidden"
                style={{ perspective: '800px' }}
            >
                <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl opacity-40 z-10 animate-pop" />

                <img
                    src="imagens/Logo_GabyAtualizada.png"
                    alt="Logo"
                    className="w-48 h-48 z-20 relative object-contain animate-pop"
                    width="400"
                    height="400"
                />

                <p className="mt-6 text-white font-poppins text-lg max-w-xs text-center">
                    Doces momentos por aqui!
                </p>

                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

                    .font-poppins {
                        font-family: 'Poppins', sans-serif;
                    }

                    @keyframes pop {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.3);
                        }
                    }

                    .animate-pop {
                        animation: pop 4s ease-in-out infinite;
                        transform-style: preserve-3d;
                    }
                `}</style>
            </div>

            {/* Lado direito - ocupa 100% em telas pequenas, 50% em md+ */}
            <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-8 relative">
                {children}
            </div>
        </div>
    );
}
