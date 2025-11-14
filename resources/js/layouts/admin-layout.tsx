import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { usePermissions } from "@/hooks/use-permissions";
import {
  Folder,
  LockKeyhole,
  UsersRound,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/header";

export default function AdminLayout({ children }) {
  const { can } = usePermissions();
  const { props } = usePage();
  const user = props.auth?.user;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!can("viewall")) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-yellow-400 text-lg">
        No tienes permiso para acceder a esta sección.
      </div>
    );
  }

  const menuItems = [
    { title: "Configuración de la página", url: "/sitesettings", icon: Settings },
    { title: "Categorías", url: "/categories", icon: Folder },
    { title: "Roles", url: "/roles", icon: LockKeyhole },
    { title: "Permisos", url: "/permissions", icon: LockKeyhole },
    { title: "Usuarios", url: "/users", icon: UsersRound },
    { title: "Órdenes", url: "/orders", icon: FileText },
    { title: "Estadistica", url: "/orders/stats", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-yellow-400 flex relative">
      
      {/* HEADER FIJO */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* BOTÓN MEJORADO Y BIEN POSICIONADO */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        // CLASES MODIFICADAS AQUÍ: El 'left' es dinámico
        className={`fixed top-1/2 -translate-y-1/2 z-50 bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-full shadow-md transition-all ${
            sidebarOpen ? 'left-64 ml-[-10px]' : 'left-3' 
        }`}
        title={sidebarOpen ? "Ocultar panel" : "Mostrar panel"}
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`bg-neutral-950 border-r border-yellow-600  p-4 fixed h-full flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div
          className={`text-center transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src="http://localhost:5173/public/Logo_largo.jpg"
            alt="Logo"
            className="w-36 mx-auto mb-4"
          />
          <h2 className="text-sm uppercase font-semibold tracking-wide text-yellow-400">
            Panel de Administración
          </h2>
        </div>

        <nav
          className={`flex flex-col gap-2 mt-6 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {menuItems.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-yellow-500 hover:text-black transition-colors"
            >
              <item.icon size={18} />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-12"
        } pt-28 p-6`} // <-- CLASE CORREGIDA AQUÍ: Cambiado de pt-32 a pt-28
      >
        {children}
      </main>
    </div>
  );
}