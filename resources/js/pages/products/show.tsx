import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  price: number;
  description: Text;
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
    </div>
    <div className="p-6">
      <div className="border p-3 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
        <p className="text-gray-700 mb-2">Precio: ${product.price.toLocaleString()}</p>
        <p className="text-gray-700">Descripcion: {product.description}</p>
      </div>
    </div>

    </AppLayout>
  ) 
    };