import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import Carousel from "@/Components/Carousel";

interface Product {
  id: number;
  name: string;
  price: number;
  description: Text;
  images: { id: number; image_path: string }[];
}

interface PaginatedProducts {
  data: Product[];
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface PageProps {
  products: PaginatedProducts;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

export default function Index() {
  const { products } = usePage<PageProps>().props;
  const [visibleProducts, setVisibleProducts] = useState(products.data);
  const [nextPage, setNextPage] = useState(products.next_page_url);

  const loadMore= () => {
  if (!nextPage) return;

  router.get(nextPage, {}, {
      preserveScroll: true,
      preserveState: true,
      only: ['products'],
      onSuccess: (page) => {
        const newProducts = (page.props.products as PaginatedProducts);
        setVisibleProducts((prev) => [...prev, ...newProducts.data]);
        setNextPage(newProducts.next_page_url);
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div>
      <Link href={route('products.create')}>
          <Button className='mb-4'>
              Create Product
          </Button>
      </Link>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {visibleProducts.map((p) => (
          
          <div 
            key={p.id}
            className="border p-3 rounded-lg shadow hover:scale-105 transition">
              {p.images.length > 0 ? (
                <Carousel
                  images={p.images}
                  autoPlay={false}
                  enableLightbox={false}
                  height="200px"
              />) : (
           <img 
              src="http://localhost:5173/storage/app/public/products/default.png" 
              alt="No hay imagen" 
              className="rounded-lg shadow-md object-cover w-full h-48"
            />
          )}
          <Link href={route('products.show', p.id)}>
              
              <div className="text-sm text-yellow-600 font-bold">
              </div>
              <h3 className="font-bold">{p.name}</h3>
            <p className="text-gray-700">${p.price.toLocaleString()}</p>
            </Link>
          </div>
        ))}
      </div>

      {nextPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-full"
          >
            V
          </button>
        </div>
      )}
    </div>
    </AppLayout>
  );
}