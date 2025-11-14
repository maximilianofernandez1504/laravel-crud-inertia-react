import { useEffect, useState } from "react";
import { router, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import Carousel from "@/components/carousel";
import { usePermissions } from "@/hooks/use-permissions";

interface Category {
  id: number;
  name: string;
}

interface Image {
  id: number;
  image_path: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: Image[];
  categories?: Category[];
}

interface PaginatedProducts {
  data: Product[];
  next_page_url: string | null;
}

interface Props {
  products: PaginatedProducts;
  categories: Category[];
}

export default function Index({ products, categories }: Props) {
  const { can } = usePermissions(); 
  const isFullReload =
    performance.getEntriesByType("navigation")[0]?.type === "reload";

  
  useEffect(() => {
    router.on("before", (event) => {
      const nextUrl = event.detail.visit.url;
      const stillInProducts = nextUrl.startsWith("/products");

      if (!stillInProducts) {
        sessionStorage.removeItem("visibleProducts");
        sessionStorage.removeItem("nextPage");
        sessionStorage.removeItem("productSearch");
        sessionStorage.removeItem("productCategories");
      }
    });
  }, []);

  
  if (isFullReload) {
    sessionStorage.clear();
  }

  
  const sessionProducts = sessionStorage.getItem("visibleProducts");
  const sessionNextPage = sessionStorage.getItem("nextPage");
  const sessionSearch = sessionStorage.getItem("productSearch");
  const sessionCategories = sessionStorage.getItem("productCategories");

  const [visibleProducts, setVisibleProducts] = useState<Product[]>(
    sessionProducts ? JSON.parse(sessionProducts) : products.data
  );

  const [nextPage, setNextPage] = useState<string | null>(
    sessionNextPage === "null" ? null : sessionNextPage || products.next_page_url
  );

  const [search, setSearch] = useState(sessionSearch || "");
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    sessionCategories ? JSON.parse(sessionCategories) : []
  );


  useEffect(() => {
    sessionStorage.setItem("visibleProducts", JSON.stringify(visibleProducts));
    sessionStorage.setItem("nextPage", String(nextPage));
  }, [visibleProducts, nextPage]);

  useEffect(() => {
    sessionStorage.setItem("productSearch", search);
  }, [search]);

  useEffect(() => {
    sessionStorage.setItem("productCategories", JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredProducts = visibleProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      p.categories?.some((c) => selectedCategories.includes(c.id));
    return matchesSearch && matchesCategory;
  });

  
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
          const combined = [...visibleProducts, ...newProducts.data];

          setVisibleProducts(combined);
          setNextPage(newProducts.next_page_url);

          sessionStorage.setItem("visibleProducts", JSON.stringify(combined));
          sessionStorage.setItem("nextPage", String(newProducts.next_page_url));
        },
      }
    );
  };

  return (
    <AppLayout title="Productos">
      <div className="min-h-screen bg-black text-yellow-400 flex flex-col items-center">
       
       {can("viewall") && (
          <div className="flex flex-wrap gap-4 justify-center md:justify-end w-11/12 mt-6 mb-4">
            <Link href={route("products.create")}>
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg">
                Crear Producto
              </Button>
            </Link>
            <Button
              onClick={() => (window.location.href = "/products/export")}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg"
            >
              Exportar Excel
            </Button>
          </div>
)}


        
        <div className="w-11/12 flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-yellow-600 shadow-lg">
         
          <div className="md:w-1/4 w-full bg-neutral-950 border border-yellow-600 rounded-lg p-4 space-y-4 h-fit md:sticky md:top-4 self-start">
            <h2 className="text-lg font-bold border-b border-yellow-600 pb-2">
              Filtros
            </h2>

            <div>
              <label className="text-sm text-yellow-500">Buscar producto</label>
              <Input
                placeholder="Ej: teclado, mouse..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2 bg-neutral-900 border-yellow-600 text-yellow-400 placeholder-yellow-700 w-full"
              />
            </div>

            <div>
              <h3 className="text-sm text-yellow-500 mb-2">Categorías</h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-neutral-900 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="accent-yellow-500"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

         
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="border border-yellow-600 bg-neutral-950 p-3 rounded-lg shadow-md hover:scale-[1.02] transition"
                >
                  {p.images.length > 0 ? (
                    <Carousel
                      images={p.images}
                      autoPlay={false}
                      enableLightbox={false}
                      height="220px"
                    />
                  ) : (
                    <img
                      src="http://localhost:5173/storage/app/public/products/default.png"
                      alt="Sin imagen"
                      className="rounded-lg shadow-md object-cover w-full h-48"
                    />
                  )}

                  <Link href={route("products.show", p.id)}>
                    <h3 className="font-bold mt-2 text-yellow-400">{p.name}</h3>
                    <p className="text-yellow-500">${p.price.toLocaleString()}</p>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-yellow-500 text-center col-span-full">
                No se encontraron productos.
              </p>
            )}

            {nextPage && (
              <div className="col-span-full flex justify-center mt-6">
                <Button
                  onClick={loadMore}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full"
                >
                  Ver más
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
