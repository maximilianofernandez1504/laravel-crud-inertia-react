import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import Carousel from "@/Components/Carousel";

interface ProductImage {
  id: number;
  image_path: string;
}
interface Product {
  id: number;
  name: string;
  price: number;
  state: number;
  description: Text;
  images: ProductImage[];
  categories: { id: number; name: string }[];
}



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];


export default function Show() {
  const { product } = usePage<{ product: Product }>().props;


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div>
      <Link href={route('products.edit', product.id)}>
          <Button className='mb-4'>
              Editar Producto
          </Button>
      </Link>
      {product.state === 0 ? (
        <Link
          href={route('products.restore', product.id)}
          method="patch">
            <Button className='mb-4'>
                Reactivar Producto
            </Button>
        </Link>
      ) :
      <Link href={route('products.destroy', product.id)}
          method="delete"
          as="button">
            <Button className='mb-4'>
                Desactivar Producto
            </Button>
      </Link>  
      }


    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {product.images.length > 0 ? (
            // product.images.map((img) => (
            //   <img
            //     key={img.id}
            //     src={`http://localhost:5173/${img.image_path}`}
            //     alt={product.name}
            //     className="rounded-lg shadow-md object-cover w-full h-48"
                
            //   />
            // ))
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
          <p className="text-gray-700 mb-4">Descripción: {product.description}</p>

          {/* 🔹 Mostrar categorías */}
          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {product.categories.map((cat) => (
                <span key={cat.id} className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-sm">
                  {cat.name}
                </span>
              ))}
            </div>
           )}
        </div>
      </div>

    </AppLayout>
  ) 
    };