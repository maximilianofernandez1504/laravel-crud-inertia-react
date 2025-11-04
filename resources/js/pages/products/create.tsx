import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import React from 'react';
import { useState, ChangeEvent } from "react";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Product',
        href: '/products/create',
    },
];

export default function Create({ categories }: { categories: { id: number; name: string }[] }) {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [productType, setProductType] = useState<'unique' | 'variable'>('unique');
    const [variants, setVariants] = useState<{ name: string; stock: number }[]>([]);


    const {data, setData, post, processing, errors} = useForm({
        name: '',
        description: '',
        stock: '0',
        price: '',
        product_type: 'unique',
        variants: [] as { name: string; stock: number }[],
        images: [] as File[],
        category_ids: [] as number[]
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedImages(files);
            setData('images', files);
        }  
    };

    const handleAddVariant = () => {
        setVariants([...variants, { name: '', stock: 0 }]);
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
        setData('category_ids', data.category_ids.includes(id)
        ? data.category_ids.filter(c => c !== id)
        : [...data.category_ids, id]
    );
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("products.store"), {
            forceFormData: true,
        });
    }



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products | Create" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleSubmit} method='post' className='space-y-4'>

                    {/* Nombre*/}
                    <div className='gap-1.5'>
                        <Input placeholder='Nombre del producto' value={data.name}
                            onChange={e => setData('name', e.target.value)} />
                        {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
                    </div>
                    {/*Precio*/}
                    <div className='gap-1.5'>
                        <Input placeholder='Precio del Producto' type="number" value={data.price}
                            onChange={e => setData('price', e.target.value)} />
                        {errors.price && <p className='text-red-500 text-sm'>{errors.price}</p>}
                    </div>

                    {/* Tipo de producto */}
                    <div>
                        <label className="font-semibold">Tipo de producto:</label>
                        <div className="flex gap-4 mt-2">
                            <label><input type="radio" value="unique" checked={productType === 'unique'}
                                onChange={() => { setProductType('unique'); setData('product_type', 'unique'); }} /> Único</label>
                            <label><input type="radio" value="variable" checked={productType === 'variable'}
                                onChange={() => { setProductType('variable'); setData('product_type', 'variable'); }} /> Variable</label>
                        </div>
                    </div>

                    {productType === 'unique' && (
                        <div className='gap-1.5'>
                            <Input placeholder='Stock' type="number" value={data.stock}
                                onChange={e => setData('stock', e.target.value)} />
                            {errors.stock && <p className='text-red-500 text-sm'>{errors.stock}</p>}
                        </div>
                    )}

                    {productType === 'variable' && (
                        <div className="border p-4 rounded-lg space-y-3 bg-black-50">
                            <p className="font-semibold">Variantes</p>
                            {variants.map((variant, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input placeholder="Nombre de la variante"
                                        value={variant.name}
                                        onChange={e => handleVariantChange(i, 'name', e.target.value)} />
                                    <Input placeholder="Stock" type="number"
                                        value={variant.stock}
                                        onChange={e => handleVariantChange(i, 'stock', Number(e.target.value))} />
                                    <Button type="button" variant="destructive" onClick={() => handleRemoveVariant(i)}>🗑</Button>
                                </div>
                            ))}
                            <Button type="button" onClick={handleAddVariant}>+ Agregar Variante</Button>
                        </div>
                    )}

                    {/* Descripción*/}
                    <div className='gap-1.5'>
                        <Textarea placeholder="Descripción del producto" value={data.description}
                            onChange={e => setData('description', e.target.value)} />
                    </div>


                    {/*Categorias*/}
                    <div>
                        <p className="font-semibold mb-2">Categorías</p>
                        <div className="grid grid-cols-5 gap-3">
                            {categories.map(category => (
                                <label key={category.id} className="flex items-center gap-2">
                                    <input type="checkbox"
                                        checked={data.category_ids.includes(category.id)}
                                        onChange={() => setData('category_ids',
                                            data.category_ids.includes(category.id)
                                                ? data.category_ids.filter(c => c !== category.id)
                                                : [...data.category_ids, category.id]
                                        )}
                                    />
                                    {category.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Input type='file' multiple accept='image/*' onChange={handleImageChange} />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {selectedImages.map((file, i) => (
                            <img key={i} src={URL.createObjectURL(file)} alt="preview"
                                className="w-full h-24 object-cover rounded" />
                        ))}
                    </div>

                    

                    <Button disabled={processing} type='submit'>Crear Producto</Button>
                </form>
            </div>
        </AppLayout>
    );
}
