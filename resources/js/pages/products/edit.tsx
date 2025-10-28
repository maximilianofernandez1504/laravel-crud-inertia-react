import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Edit Product',
    href: '/products/edit',
  },
];

interface ProductImage {
  id: number;
  image_path: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  description: string;
  images: ProductImage[];
  categories: Category[];
}

export default function Edit({ product, categories }: { product: Product; categories: Category[] }) {
  const { data, setData, post, processing, errors } = useForm({
    name: product.name,
    description: product.description,
    stock: product.stock,
    price: product.price,
    images: [] as File[],
    category_ids: product.categories.map((c) => c.id), // 🔹 categorías preseleccionadas
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setData('images', files);

      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };


  const handleCategoryToggle = (id: number) => {
        setData('category_ids', data.category_ids.includes(id)
        ? data.category_ids.filter(c => c !== id)
        : [...data.category_ids, id]
    );
  };
  // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selected = Array.from(e.target.selectedOptions, (option) => Number(option.value));
  //   setData('category_ids', selected);
  // };
  

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('products.update', product.id), {
      _method: 'PUT',
      forceFormData: true,
      preserveScroll: true,
    });
  };

  const handleDeleteImage = (imageId: number) => {
    if (confirm('¿Seguro que deseas eliminar esta imagen?')) {
      router.delete(route('products.deleteImage', { product: product.id, image: imageId }), {
        preserveScroll: true,
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Producto" />
      <div className="w-8/12 p-4 space-y-6">
        <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-4">
          <div className="gap-1.5">
            <Input
              placeholder="Product Name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>

          <div className="gap-1.5">
            <Input
              placeholder="Product Stock"
              type="number"
              value={data.stock}
              onChange={(e) => setData('stock', Number(e.target.value))}
            />
            {errors.stock && <div className="text-red-500 text-sm mt-1">{errors.stock}</div>}
          </div>

          <div className="gap-1.5">
            <Input
              placeholder="Product Price"
              type="number"
              value={data.price}
              onChange={(e) => setData('price', Number(e.target.value))}
            />
            {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
          </div>

          <div className="gap-1.5">
            <Textarea
              placeholder="Product description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            {errors.description && (
              <div className="text-red-500 text-sm mt-1">{errors.description}</div>
            )}
          </div>

          {/* 🔹 Selección de categorías */}
          <div className="flex flex-wrap gap-3 mt-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.category_ids.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>

          {/* 🔹 Subir nuevas imágenes */}
          <div className="gap-1.5">
            <label className="block text-sm font-medium mb-1">Agregar nuevas imágenes</label>
            <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
            {errors.images && <div className="text-red-500 text-sm mt-1">{errors.images}</div>}
          </div>

          {/* 🔹 Previsualización de nuevas imágenes */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {previewImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Preview"
                  className="rounded-lg shadow-md object-cover w-full h-48 opacity-80"
                />
              ))}
            </div>
          )}

          {/* 🔹 Imágenes existentes */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {product.images.length > 0 ? (
              product.images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={`http://localhost:5173/${img.image_path}`}
                    alt="Product"
                    className="rounded-lg shadow-md object-cover w-full h-48"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <img
                src="http://localhost:5173/storage/app/public/products/default.png"
                alt="No Image"
                className="rounded-lg shadow-md object-cover w-full h-48"
              />
            )}
          </div>

          <Button disabled={processing} type="submit" className="mt-4">
            Actualizar Producto
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
