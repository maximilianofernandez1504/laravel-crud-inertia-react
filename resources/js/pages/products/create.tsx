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

    const {data, setData, post, processing, errors} = useForm({
        name: '',
        description: '',
        stock: '',
        price: '',
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
                    <div className='gap-1.5'>
                        <Input
                            placeholder='Nombre del producto'
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        ></Input>
                        {errors.name && (
                            <div className='flex items-center text-red-500 text-sm mt-1'>
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <div className='gap-1.5'>
                        <Input
                            placeholder='Stock'
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                        ></Input>
                        {errors.stock && (
                            <div className='flex items-center text-red-500 text-sm mt-1'>
                                {errors.stock}
                            </div>
                        )}
                    </div>
                    <div className='gap-1.5'>
                        <Input
                            placeholder='Precio del Producto'
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                        ></Input>
                        {errors.price && (
                            <div className='flex items-center text-red-500 text-sm mt-1'>
                                {errors.price}
                            </div>
                        )}
                    </div>
                    <div className='gap-1.5'>
                        <Textarea 
                            placeholder="Descripcion del producto"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)} 
                        />
                        {errors.description && (
                            <div className='flex items-center text-red-500 text-sm mt-1'>
                                {errors.description}
                            </div>
                        )}
                    </div>
                    <div>
                        <Input
                            type='file'
                            multiple
                            accept='image/*'
                            onChange={handleImageChange}
                        />
                        {errors.images && <p className='text-red-500 text-sm'>{errors.images}</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {selectedImages.map((file, i) => (
                        <img
                            key={i}
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-full h-24 object-cover rounded"
                        />
                        ))}
                    </div>

                    {errors.images && (
                        <div className='flex items-center text-red-500 text-sm mt-1'>
                            {errors.images}
                        </div>
                    )}

                    <div>
                        <p className="font-semibold mb-2">Categorías</p>
                        <div className="grid grid-cols-3 gap-3">
                        {categories.map(category => (
                            <label key={category.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.category_ids.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id)}
                            />
                            {category.name}
                            </label>
                        ))}
                        </div>
                    </div>



                    <Button disabled={processing} type='submit'>
                        Crear Producto
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
