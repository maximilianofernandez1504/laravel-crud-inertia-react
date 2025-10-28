

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden">
                <img
                    src="http://localhost:5173/public/logo.jpg" 
                    alt="Valquiria Logo"
                    className="object-contain w-16 h-16"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">
                    Valquiria Artesanías
                </span>
            </div>
        </>
    );
}
