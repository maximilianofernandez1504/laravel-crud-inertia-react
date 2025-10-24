import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Product',
        href: '/products/create',
    },
];

interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    description: string;
}


export default function Edit({product}: {product: Product}) {

    const {data, setData, put, processing, errors} = useForm({
        name: product.name,
        description: product.description,
        stock: product.stock,
        price: product.price
    })

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('products.update', product.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products | Create" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleUpdate} method='post' className='space-y-4'>
                    <div className='gap-1.5'>
                        <Input
                            placeholder='Product Name'
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
                            placeholder='Product Stock'
                            value={data.stock}
                            onChange={e => setData('stock', Number(e.target.value))}
                        ></Input>
                        {errors.stock && (
                            <div className='flex items-center text-red-500 text-sm mt-1'>
                                {errors.stock}
                            </div>
                        )}
                    </div>
                    <div className='gap-1.5'>
                        <Input
                            placeholder='Product Price'
                            value={data.price}
                            onChange={e => setData('price', Number(e.target.value))}
                        ></Input>
                        {errors.price && (
                            <div className='flex items-center text-red-500 text-sm mt-1'>
                                {errors.price}
                            </div>
                        )}
                    </div>
                    <div className='gap-1.5'>
                        <Textarea 
                            placeholder="Priduct description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)} 
                        />
                        {errors.description && (
                            <div className='flex items-center text-red-500 text-sm mt-1'>
                                {errors.description}
                            </div>
                        )}
                    </div>
                    <Button disabled={processing} type='submit'>
                        Update Product
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}



// import React from 'react';
// import { Head, useForm } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import { Input } from '@/components/ui/input';
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from '@/components/ui/button';
// import { type BreadcrumbItem } from '@/types';

// const breadcrumbs: BreadcrumbItem[] = [
//     { title: 'Editar Producto', href: '/products' },
// ];

// interface Product {
//     id: number;
//     name: string;
//     stock: number | string;
//     price: number | string;
//     description?: string;
//     images?: { id: number; image_path?: string; url?: string; attrs?: any }[];
//     active?: number | boolean;
// }

// export default function Edit({ product }: { product: Product }) {
//     const { data, setData, put, processing, errors } = useForm({
//         name: product.name,
//         description: product.description,
//         stock: product.stock,
//         price: product.price,
//         images: [] as File[],
//         active: product.active,
//     });

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setData('images', Array.from(e.target.files));
//         }
//     };

//     const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         const hasFiles = data.images && data.images.length > 0;

//         // 🔧 Convertir valores a formatos válidos para FormData
//         const formData: any = {
//             ...data,
//             name: data.name ?? '',
//             description: data.description ?? '',
//             stock: String(data.stock ?? ''),
//             price: String(data.price ?? ''),
//             active: data.active ? 1 : 0,
//         };

//         // Si no hay imágenes nuevas, las eliminamos del envío
//         if (!hasFiles) {
//             delete formData.images;
//         }

//         // Usar forceFormData solo si hay imágenes
//         put(route('products.update', product.id), {
//             data: formData,
//             forceFormData: hasFiles,
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Editar Producto" />
//             <div className="w-8/12 p-4">
//                 <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-4">
//                     <Input
//                         value={data.name}
//                         onChange={e => setData('name', e.target.value)}
//                         placeholder="Nombre"
//                     />
//                     {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}

//                     <Input
//                         value={String(data.stock)}
//                         onChange={e => setData('stock', e.target.value)}
//                         placeholder="Stock"
//                     />
//                     {errors.stock && <div className="text-red-500 text-sm">{errors.stock}</div>}

//                     <Input
//                         value={String(data.price)}
//                         onChange={e => setData('price', e.target.value)}
//                         placeholder="Precio"
//                     />
//                     {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}

//                     <Textarea
//                         value={data.description ?? ''}
//                         onChange={e => setData('description', e.target.value)}
//                         placeholder="Descripción"
//                     />
//                     {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}

//                     {/* Checkbox para activo/inactivo */}
//                     <div className="flex items-center gap-2">
//                         <input
//                             id="active"
//                             type="checkbox"
//                             checked={Boolean(Number(data.active))}
//                             onChange={e => setData('active', e.target.checked ? 1 : 0)}
//                             className="h-4 w-4"
//                         />
//                         <label htmlFor="active" className="text-sm select-none">
//                             Activo
//                         </label>
//                     </div>

//                     {/* Mostrar imágenes actuales */}
//                     <div className="flex gap-2 flex-wrap">
//                         {product.images?.map(img => (
//                             <img
//                                 key={img.id}
//                                 src={img.url ? img.url : `http://localhost:5173/storage/${img.image_path}`}
//                                 alt=""
//                                 className="w-24 h-24 object-cover rounded"
//                             />
//                         ))}
//                     </div>

//                     <Input
//                         type="file"
//                         name="images[]"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageChange}
//                     />
//                     {errors.images && <div className="text-red-500 text-sm">{errors.images}</div>}

//                     <div className="flex items-center gap-2">
//                         <Button disabled={processing} type="submit">
//                             Guardar cambios
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </AppLayout>
//     );
// }

