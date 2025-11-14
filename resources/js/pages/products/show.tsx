import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import Carousel from "@/components/carousel";
import { usePermissions } from "@/hooks/use-permissions";

interface ProductImage {
  id: number;
  image_path: string;
}
interface Variant {
  id: number;
  name: string;
  stock: number;
}
interface Product {
  id: number;
  name: string;
  price: number;
  state: number;
  description: string;
  product_type: "unique" | "variable";
  stock: number;
  variants?: Variant[];
  images: ProductImage[];
  categories: { id: number; name: string }[];
}

interface PageProps {
  product: Product;
  auth: {
    user: {
      permissions: string[];
    } | null;
  };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Productos", href: "/products" }];

export default function Show() {
  const { can } = usePermissions();
  const { product, auth } = usePage<PageProps>().props;
  const userPermissions = auth?.user?.permissions || [];
 

  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddToCart = () => {
    if (quantity <= 0) return showMessage("Ingrese una cantidad válida.");
    if (product.product_type === "unique" && quantity > product.stock)
      return showMessage("No hay suficiente stock disponible.");

    if (product.product_type === "variable") {
      const variant = product.variants?.find((v) => v.id === selectedVariant);
      if (!variant) return showMessage("Seleccione una variante.");
      if (quantity > variant.stock)
        return showMessage("No hay suficiente stock para esa variante.");
    }

    router.post(
      route("cart.add"),
      {
        product_id: product.id,
        variant_id: selectedVariant || null,
        quantity,
      },
      {
        preserveScroll: true,
        onSuccess: () => showMessage("✅ Producto agregado al carrito."),
        onError: () => showMessage("❌ Error al agregar al carrito."),
      }
    );
  };

  const handlePdfClick = () => window.open(`/products/report/${product.id}`, "_blank");

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-black text-yellow-400 px-6 py-8">

        {can("viewall") && (
          <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-end">
            <Link href={route("products.edit", product.id)}>
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg shadow">
                Editar Producto
              </Button>
            </Link>

            {product.state === 0 ? (
              <Link href={route("products.restore", product.id)} method="patch">
                <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg shadow">
                  Reactivar Producto
                </Button>
              </Link>
            ) : (
              <Link href={route("products.destroy", product.id)} method="delete">
                <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg shadow">
                  Desactivar Producto
                </Button>
              </Link>
            )}

            <Button
              onClick={handlePdfClick}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg shadow"
            >
              Generar PDF
            </Button>
          </div>
        )}

        {/* 🧩 Layout principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-neutral-950 border border-yellow-600 p-6 rounded-xl shadow-lg">
          {/* Carrusel */}
          <div>
            {product.images.length > 0 ? (
              <Carousel
                images={product.images}
                height="420px"
                autoPlay={false}
                enableLightbox={true}
              />
            ) : (
              <img
                src="http://localhost:5173/storage/app/public/products/default.png"
                alt="No hay imagen"
                className="rounded-lg shadow-md object-cover w-full h-[420px]"
              />
            )}

            {/* Descripción debajo */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                Descripción
              </h3>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>

              {product.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info a la derecha */}
          <div className="flex flex-col justify-start">
            <h1 className="text-4xl font-bold text-yellow-400 mb-3">
              {product.name}
            </h1>
            <p className="text-2xl text-gray-300 mb-8 font-medium">
              ${product.price.toLocaleString()}
            </p>

            {/* 🛒 Menú agregar al carrito */}
            <div className="border-t border-yellow-700 pt-4">
              {product.product_type === "unique" ? (
                <>
                  <p className="text-yellow-500 mb-2">
                    Stock disponible: {product.stock}
                  </p>
                  <div className="flex items-center gap-2">
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="bg-neutral-900 border border-yellow-600 rounded px-2 py-1 w-20 text-yellow-400"
                    />
                    <Button
                      onClick={handleAddToCart}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold ml-2"
                    >
                      Agregar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <label className="block mb-2">Seleccione la variante:</label>
                  <select
                    value={selectedVariant ?? ""}
                    onChange={(e) => setSelectedVariant(Number(e.target.value))}
                    className="border border-yellow-600 rounded bg-black text-yellow-400 px-2 py-1 mb-3 w-full"
                  >
                    <option value="">Seleccione la variante</option>
                    {product.variants?.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>

                  {selectedVariant && (
                    <div className="mt-2">
                      <p className="text-yellow-500 mb-2">
                        Stock disponible:{" "}
                        {product.variants?.find((v) => v.id === selectedVariant)
                          ?.stock ?? 0}
                      </p>
                      <div className="flex items-center gap-2">
                        <label>Cantidad:</label>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(parseInt(e.target.value) || 1)
                          }
                          className="bg-neutral-900 border border-yellow-600 rounded px-2 py-1 w-20 text-yellow-400"
                        />
                        <Button
                          onClick={handleAddToCart}
                          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold ml-2"
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Mensaje debajo */}
              {message && (
                <p className="mt-4 text-yellow-400 font-semibold">{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
