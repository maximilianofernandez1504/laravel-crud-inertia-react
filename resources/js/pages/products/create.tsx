import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Crear Producto',
    href: '/products/create',
  },
];

export default function Create({ categories }: { categories: { id: number; name: string }[] }) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [productType, setProductType] = useState<'unique' | 'variable'>('unique');
  const [variants, setVariants] = useState<{ name: string; stock: number }[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    stock: '0',
    price: '',
    product_type: 'unique',
    variants: [] as { name: string; stock: number }[],
    images: [] as File[],
    category_ids: [] as number[],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);
      setData('images', files);

      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const handleAddVariant = () => {
    const newVariants = [...variants, { name: '', stock: 0 }];
    setVariants(newVariants);
    setData('variants', newVariants);
  };

  const handleVariantChange = (index: number, field: 'name' | 'stock', value: string | number) => {
    const newVariants = [...variants];
    newVariants[index][field] = value as any;
    setVariants(newVariants);
    setData('variants', newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
    setData('variants', newVariants);
  };

  const handleCategoryToggle = (id: number) => {
    setData(
      'category_ids',
      data.category_ids.includes(id)
        ? data.category_ids.filter((c) => c !== id)
        : [...data.category_ids, id]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('products.store'), {
      forceFormData: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Producto" />

      <div className="flex justify-center">
        <div className="w-8/12 p-6 space-y-6 bg-black text-yellow-400 rounded-xl shadow-lg border border-yellow-600">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Crear Producto</h2>

          <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-1">
                Nombre del Producto:
              </label>
              <Input
                placeholder="Nombre del producto"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="bg-neutral-900 border-yellow-600 text-yellow-400 placeholder-yellow-700"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-1">Precio:</label>
              <Input
                placeholder="Precio del Producto"
                type="number"
                value={data.price}
                onChange={(e) => setData('price', e.target.value)}
                className="bg-neutral-900 border-yellow-600 text-yellow-400 placeholder-yellow-700"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Tipo de producto */}
            <div>
              <label className="font-semibold text-yellow-400">Tipo de producto:</label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="unique"
                    checked={productType === 'unique'}
                    onChange={() => {
                      setProductType('unique');
                      setData('product_type', 'unique');
                      setVariants([]);
                      setData('variants', []);
                    }}
                    className="accent-yellow-500"
                  />
                  Único
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="variable"
                    checked={productType === 'variable'}
                    onChange={() => {
                      setProductType('variable');
                      setData('product_type', 'variable');
                    }}
                    className="accent-yellow-500"
                  />
                  Variable
                </label>
              </div>
            </div>

            {/* Stock o Variantes */}
            {productType === 'unique' && (
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">Stock:</label>
                <Input
                  placeholder="Stock"
                  type="number"
                  value={data.stock}
                  onChange={(e) => setData('stock', e.target.value)}
                  className="bg-neutral-900 border-yellow-600 text-yellow-400 placeholder-yellow-700"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
            )}

            {productType === 'variable' && (
              <div className="border border-yellow-600 p-4 rounded-lg space-y-3 bg-neutral-950">
                <p className="font-semibold text-yellow-400">Variantes</p>
                {variants.map((variant, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Nombre de la variante"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(i, 'name', e.target.value)}
                      className="bg-neutral-900 border-yellow-600 text-yellow-400 placeholder-yellow-700"
                    />
                    <Input
                      placeholder="Stock"
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(i, 'stock', Number(e.target.value))}
                      className="bg-neutral-900 border-yellow-600 text-yellow-400 placeholder-yellow-700"
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveVariant(i)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black"
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddVariant}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black"
                >
                  + Agregar Variante
                </Button>
              </div>
            )}

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-1">Descripción:</label>
              <Textarea
                placeholder="Descripción del producto"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="bg-neutral-900 border-yellow-600 text-yellow-400 placeholder-yellow-700"
              />
            </div>

            {/* Categorías */}
            <div>
              <p className="font-semibold text-yellow-400 mb-2">Categorías</p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.category_ids.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="accent-yellow-500"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-1">Imágenes:</label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="bg-neutral-900 border-yellow-600 text-yellow-400"
              />
            </div>

            {/* Previsualización de imágenes */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {previewImages.map((src, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center bg-neutral-800 border border-yellow-600 rounded-lg p-2"
                  >
                    <img
                      src={src}
                      alt={`Preview-${index}`}
                      className="max-h-40 w-auto object-contain rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Botón */}
            <Button
              disabled={processing}
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold mt-4"
            >
              Crear Producto
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
