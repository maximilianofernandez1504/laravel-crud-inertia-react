import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import Carousel from "@/components/carousel";
import { usePermissions } from "@/hooks/use-permissions";

export default function Index({ home, products, categories, addresses }: any) {
  const { can } = usePermissions();

  return (
    <AppLayout title="Inicio">
      <div className="min-h-screen bg-black text-yellow-400 px-6 py-8">
        {/* Botón de editar */}
        {can("viewall") && (
          <div className="flex justify-end mb-4">
            <Link href={route("home.edit")}>
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg">
                Editar Página
              </button>
            </Link>
          </div>
        )}

        {/* Carrusel */}
        {home.images?.length > 0 && (
          <div className="mb-10">
            <Carousel
              images={home.images.map((i: any) => ({ image_path: i.image_path }))}
              height="h-[500px]"
              fitMode="contain"
            />
          </div>
        )}

        {/* Productos */}
        <h2 className="text-center text-3xl font-bold mb-6">
          {home.title_products}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((p: any) => (
            <div
              key={p.id}
              className="border border-yellow-600 bg-neutral-950 p-3 rounded-lg shadow-md"
            >
              {p.images?.[0] ? (
                <img
                  src={`http://localhost:5173/${p.images[0].image_path}`}
                  alt={p.name}
                  className="w-full h-52 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-52 bg-neutral-900 rounded-lg">
                  <img
                    src={`http://localhost:5173/storage/app/public/products/default.png`}
                    alt={p.name}
                    className="w-full h-52 object-cover rounded-lg"
                  />
                </div>
              )}
              <h3 className="mt-2 font-bold text-yellow-400">{p.name}</h3>
              <p className="text-gray-300">${p.price}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <Link href={route("products.index")}>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-full">
              Ver más
            </button>
          </Link>
        </div>

        {/* Categorías */}
        <h3 className="text-center text-2xl font-bold mb-6">Categorías</h3>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat: any) => (
            <span
              key={cat.id}
              className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold"
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* Mapa */}
        <h3 className="text-center text-2xl font-bold mb-4">{home.title_map}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {addresses.map((addr: any) => (
            <div
              key={addr.id}
              className="border border-yellow-600 rounded-lg bg-neutral-950 p-4 text-center"
            >
              <iframe
                src={`https://maps.google.com/maps?q=${addr.latitude},${addr.longitude}&z=15&output=embed`}
                className="w-full h-64 rounded-lg mb-2"
              ></iframe>
              <p className="text-yellow-300 font-semibold">{addr.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
