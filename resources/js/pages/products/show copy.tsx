import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import Carousel from "@/components/carousel";

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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Products', href: '/products' }];

export default function Show() {
  const { product } = usePage<{ product: Product }>().props;
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000); // desaparece automáticamente después de 3s
  };

  const handleAddToCart = () => {
    if (quantity <= 0) {
      showMessage("Ingrese una cantidad válida.");
      return;
    }

    if (product.product_type === "unique" && quantity > product.stock) {
      showMessage("No hay suficiente stock disponible.");
      return;
    }

    if (product.product_type === "variable") {
      const variant = product.variants?.find(v => v.id === selectedVariant);
      if (!variant) {
        showMessage("Seleccione una variante.");
        return;
      }
      if (quantity > variant.stock) {
        showMessage("No hay suficiente stock para esa variante.");
        return;
      }
    }

    router.post(
      route("cart.add"),
      {
        product_id: product.id,
        variant_id: selectedVariant || null,
        quantity,
      },
      {
        preserveScroll: true, // evita scroll arriba
        onSuccess: () => {
          showMessage("Producto agregado al carrito ");
        },
        onError: () => {
          showMessage("Error al agregar al carrito ");
        },
      }
    );
  };

  const handlePdfClick = () => window.open(`/products/report/${product.id}`, '_blank');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div>
        <Button asChild className="mb-4">
          <Link href={route('products.edit', product.id)}>Editar Producto</Link>
        </Button>
        {product.state === 0 ? (
          <Button asChild className="mb-4">
            <Link href={route('products.restore', product.id)} method="patch">
              Reactivar Producto
            </Link>
          </Button>
        ) : (
          <Button asChild className="mb-4">
            <Link href={route('products.destroy', product.id)} method="delete">
              Desactivar Producto
            </Link>
          </Button>
        )}
        <Button onClick={handlePdfClick} className='mb-4'>Generar PDF</Button>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {product.images.length > 0 ? (
            <Carousel images={product.images} />
          ) : (
            <img
              src="http://localhost:5173/storage/app/public/products/default.png"
              alt="No hay imagen"
              className="rounded-lg shadow-md object-cover w-full h-48"
            />
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="border p-3 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <p className="text-gray-700 mb-2">Precio: ${product.price.toLocaleString()}</p>
          <p className="whitespace-pre-line">{product.description}</p>

          {product.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {product.categories.map(cat => (
                <span key={cat.id} className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-sm">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            {product.product_type === "unique" ? (
              <>
                <p>Solo quedan {product.stock} productos</p>
                <label className="mr-2">Ingrese cantidad:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border rounded px-2 py-1 w-20 text-white"
                />
                <Button onClick={handleAddToCart} className="ml-2">Agregar</Button>
              </>
            ) : (
              <>
                <label>Seleccione la variante:</label>
                <select
                  value={selectedVariant ?? ""}
                  onChange={(e) => setSelectedVariant(Number(e.target.value))}
                  className="border rounded px-2 py-1 ml-2 bg-black text-white"
                >
                  <option value="">Seleccione la variable</option>
                  {product.variants?.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>

                {selectedVariant && (
                  <>
                    <p>De esta variedad solo quedan {
                      product.variants?.find(v => v.id === selectedVariant)?.stock
                    }</p>
                    <label>Ingrese cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border rounded px-2 py-1 w-20 text-white"
                    />
                    <Button onClick={handleAddToCart} className="ml-2">Agregar</Button>
                  </>
                )}
              </>
            )}
            {/* Mensaje flotante */}
            {message && <p className="mt-3 text-yellow-400 font-semibold">{message}</p>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
