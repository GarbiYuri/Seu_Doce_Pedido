export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Lado esquerdo rosa com gradiente */}
            <div className="w-1/2 bg-[#EF3167] flex items-center justify-center relative overflow-hidden">
                <div className="absolute w-96 h-96 bg-[#ffffff30] rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Lado direito com o formulário */}
            <div className="w-1/2 bg-white flex items-center justify-center p-8">
                {children}
            </div>
        </div>
    );
}

