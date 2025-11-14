import { Link, usePage } from "@inertiajs/react";
import { usePermissions } from "@/hooks/use-permissions";

export default function Header() {
  const { can } = usePermissions();
  const { props } = usePage();
  const user = props.auth?.user;
  const cartCount = props.cartCount ?? 0;

  return (
    <header className="w-full bg-black text-yellow-400 border-b border-yellow-600 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        
        
      <div className="flex items-center gap-4">
        
        <Link href={route("home")} className="flex justify-center items-center">
          <img
            src="http://localhost:5173/public/Logo_largo.jpg"
            alt="Logo"
            className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div> 
       
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                href={route("register")}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition"
              >
                Crear cuenta
              </Link>
              <Link
                href={route("login")}
                className="border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black font-semibold px-4 py-2 rounded-lg transition"
              >
                Iniciar sesión
              </Link>
            </>
          ) : (
            <span className="font-semibold text-yellow-400">
              Hola, {user.name}
            </span>
            
          )}
        </div>
         {user && (
            <div className="flex items-center gap-4">
              <Link
                href='settings/profile'
                className="relative"
              >
                <img
                  src="http://localhost:5173/public/user.png"
                  alt="Configuración del usuario"
                  className="h-9 w-9 object-contain hover:scale-110 transition-transform duration-200"
                />
              </Link>

              <Link href={route("cart.index")} className="relative">
                <img
                  src="http://localhost:5173/public/carrito.png"
                  alt="Carrito"
                  className="h-10 w-10 object-contain hover:scale-110 transition-transform duration-200"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}

        </div>
      </div>

      <div className="bg-neutral-900 border-t border-yellow-600">
        <nav className="max-w-7xl mx-auto flex justify-center items-center gap-6 py-3 text-yellow-400 text-sm md:text-base font-semibold">
          <Link href="/" className="hover:text-yellow-300 transition-colors duration-200">
            Inicio
          </Link>
          <span className="text-yellow-600">|</span>

          <Link href="products" className="hover:text-yellow-300 transition-colors duration-200">
            Productos
          </Link>
          <span className="text-yellow-600">|</span>

          <Link href="faqs" className="hover:text-yellow-300 transition-colors duration-200">
            Ayuda
          </Link>
          <span className="text-yellow-600">|</span>

          <Link href="about-us" className="hover:text-yellow-300 transition-colors duration-200">
            Sobre Nosotros
          </Link>

          
          {can("viewall") && (
            <>
              <span className="text-yellow-600">|</span>
              <Link
                href={route('sitesettings.edit')}
                className="hover:text-yellow-300 transition-colors duration-200"
              >
                Panel de Administración
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
