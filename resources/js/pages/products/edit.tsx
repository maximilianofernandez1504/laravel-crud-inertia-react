import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Editar Producto',
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

interface Variant {
  id?: number;
  name: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  description: string;
  images: ProductImage[];
  categories: Category[];
  product_type?: 'unique' | 'variable';
  variants?: Variant[];
}

export default function Edit({ product, categories }: { product: Product; categories: Category[] }) {
  const { data, setData, post, processing, errors } = useForm({
    name: product.name,
    description: product.description,
    stock: product.stock ?? 0,
    price: product.price,
    product_type: product.product_type ?? 'unique',
    variants: product.variants
    ? product.variants.map(v => ({ id: v.id, name: v.name, stock: v.stock }))
    : [] as { id?: number; name: string; stock: number }[],
    images: [] as File[],
    category_ids: product.categories.map((c) => c.id),

  });

  //Tipo de Producto
  const handleTypeChange = (type: 'unique' | 'variable') => {
    setData('product_type', type);
    if (type === 'unique') {
        setVariants([]);
        setData('variants', []); // Añadir esta línea
    }
  };


  //Variantes

  const [variants, setVariants] = useState<Variant[]>(product.variants ? product.variants.map(v => ({ id: v.id, name: v.name, stock: v.stock })) : []);
 
  useEffect(() => {
    setData('product_type', data.product_type);
  }, [data.product_type, setData]);

  
  const handleAddVariant = () => {
    const newVariants = [...variants, { name: '', stock: 0 }];
    setVariants(newVariants);
    setData('variants', newVariants); 
  };

  const handleVariantChange = (index: number, field: 'name' | 'stock', value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: field === 'stock' ? Number(value) : value };
    setVariants(newVariants);
    setData('variants', newVariants); 
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
    setData('variants', newVariants); 
  };

  //Categorias
  const handleCategoryToggle = (id: number) => {
        setData('category_ids', data.category_ids.includes(id)
        ? data.category_ids.filter(c => c !== id)
        : [...data.category_ids, id]
    );
  };
  

  //Imagenes
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setData('images', files);

      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const handleDeleteImage = (imageId: number) => {
    if (confirm('¿Seguro que deseas eliminar esta imagen?')) {
      router.delete(route('products.deleteImage', { product: product.id, image: imageId }), {
        preserveScroll: true,
      });
    }
  };

  //Update
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setData('variants', variants);
    
    post(route('products.update', product.id), {
      _method: 'PUT',
      forceFormData: true,
      preserveScroll: true,
    });
  };
  

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Producto" />
      <div className="w-8/12 p-4 space-y-6">
        <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-4">
          {/*Nombre*/}
          <div className="gap-1.5">
            <Input
              placeholder="Nombre del Producto"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>
          {/*Precio*/}
          <div className="gap-1.5">
            <Input
              placeholder="Precio"
              type="number"
              value={data.price}
              onChange={(e) => setData('price', Number(e.target.value))}
            />
            {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
          </div>

           {/* Tipo de producto */}
          <div>
            <label className="font-semibold">Tipo de producto:</label>
            <div className="flex gap-4 mt-2">
              <label>
                <input type="radio" value="unique" checked={data.product_type === 'unique'}
                  onChange={() => handleTypeChange('unique')} /> Único
              </label>
              <label>
                <input type="radio" value="variable" checked={data.product_type === 'variable'}
                  onChange={() => handleTypeChange('variable')} /> Variable
              </label>
            </div>
          </div>

            {/* Stock si es único */}
          {data.product_type === 'unique' && (
            <div className="gap-1.5">
              <Input placeholder="Stock" type="number" value={data.stock}
                onChange={(e) => setData('stock', Number(e.target.value))} />
              {errors.stock && <div className="text-red-500 text-sm mt-1">{errors.stock}</div>}
            </div>
          )}

          {/* Manejo de variantes */}
          {data.product_type === 'variable' && (
            <div className="border p-4 rounded-lg space-y-3 bg-black-50">
              <p className="font-semibold">Variantes</p>
              {variants.map((variant, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder="Nombre de la variante" value={variant.name}
                    onChange={(e) => handleVariantChange(i, 'name', e.target.value)} />
                  <Input placeholder="Stock" type="number" value={variant.stock}
                    onChange={(e) => handleVariantChange(i, 'stock', Number(e.target.value))} />
                  <Button type="button" onClick={() => handleRemoveVariant(i)}>Eliminar</Button>
                </div>
              ))}

              <div>
                <Button type="button" onClick={handleAddVariant}>+ Agregar Variante</Button>
              </div>
            </div>
          )}
          {/*Descripción*/}
          <div className="gap-1.5">
            <Textarea
              placeholder="Descripción"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            {errors.description && (
              <div className="text-red-500 text-sm mt-1">{errors.description}</div>
            )}
          </div>

          {/*Selección de categorías */}
          <p className="font-semibold mb-2">Categorías</p>
            <div className="grid grid-cols-4 gap-3">
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
          

          {/*imágenes */}
          <div className="gap-1.5">
            <label className="block text-sm font-medium mb-1">Agregar nuevas imágenes</label>
            <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
            {errors.images && <div className="text-red-500 text-sm mt-1">{errors.images}</div>}
          </div>

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
