
import { useState, useMemo } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import Carousel from "@/components/carousel";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: { id: number; image_path: string }[];
  categories: Category[];
}

interface PaginatedProducts {
  data: Product[];
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface PageProps {
  products: PaginatedProducts;
  categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Products", href: "/products" },
];

export default function Index() {
  const { products, categories } = usePage<PageProps>().props;
  const [visibleProducts, setVisibleProducts] = useState(products.data);
  const [nextPage, setNextPage] = useState(products.next_page_url);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);

  // --- Filtro por texto y categoría ---
  const filteredProducts = useMemo(() => {
    return visibleProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        p.categories.some((cat) => selectedCategories.includes(cat.id));
      return matchesSearch && matchesCategory;
    });
  }, [visibleProducts, search, selectedCategories]);

  // --- Cargar más productos ---
  const loadMore = () => {
    if (!nextPage) return;
    router.get(
      nextPage,
      {},
      {
        preserveScroll: true,
        preserveState: true,
        only: ["products"],
        onSuccess: (page) => {
          const newProducts = page.props.products as PaginatedProducts;
          setVisibleProducts((prev) => [...prev, ...newProducts.data]);
          setNextPage(newProducts.next_page_url);
        },
      }
    );
  };

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    
      <div>
        <Link href={route("products.create")}>
          <Button className="mb-4">Crear Producto</Button>
        </Link>
        <Button className='mb-4'
            onClick={() => window.location.href="/products/export"}
            >
                Exportar Excel
        </Button>
        
      </div>

      
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <Input
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <Button
          variant="outline"
          onClick={() => setShowCategoryFilters(!showCategoryFilters)}
          className="flex items-center gap-2"
        >
          {showCategoryFilters ? "Ocultar filtros" : "Filtrar por categorías"}
          {showCategoryFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>

     
      {showCategoryFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-white-800">{cat.name}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm col-span-3 text-center">
              No hay categorías disponibles.
            </p>
          )}
        </div>
      )}

      {/* 🧱 Productos */}
      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="border p-3 rounded-lg shadow hover:scale-105 transition"
              >
                
                {p.images.length > 0 ? (
                  <Carousel
                    images={p.images}
                    autoPlay={false} 
                    enableLightbox={false} 
                    height="220px"                   />
                ) : (
                  <img
                    src="http://localhost:5173/storage/app/public/products/default.png"
                    alt="No hay imagen"
                    className="rounded-lg shadow-md object-cover w-full h-48"
                  />
                )}

                <Link href={route("products.show", p.id)}>
                  <h3 className="font-bold mt-2">{p.name}</h3>
                  <p className="text-gray-700">${p.price.toLocaleString()}</p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No se encontraron productos.
          </p>
        )}

        {nextPage && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-full"
            >
              Ver más
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
