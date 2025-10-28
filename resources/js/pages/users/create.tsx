import InputError from '@/components/input-error';
import TablePagination from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Permission, Role, SinglePermission } from '@/types/role_permission';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

import { DeleteIcon, Loader2, PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create User',
        href: '/users/create',
    },
];

export default function Create({roles}: {roles: string[]}) {
    const {data, setData, post, errors, processing} = useForm({
        name:'',
        email:'',
        password:'',
        roles: [] as string[]
    });


    function submit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        post('/users');
    }
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader className='flex items-center justify-between'>
                        <CardTitle>Create User</CardTitle>
                        <CardAction>
                            <Link href={'/users'}>
                                <Button variant={'default'}>Go Back</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className='mb-4'>
                                <Label htmlFor='name'>Name</Label>
                                <Input id='name' type='text' value={data.name} onChange={(e) => setData('name', e.target.value)} aria-invalid={!!errors.name}></Input>
                                <InputError message={errors.name}></InputError>
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor='email'>Email</Label>
                                <Input id='email' type='text' value={data.email} onChange={(e) => setData('email', e.target.value)} aria-invalid={!!errors.email}></Input>
                                <InputError message={errors.email}></InputError>
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor='password'>Password</Label>
                                <Input id='password' type='password' value={data.password} onChange={(e) => setData('password', e.target.value)} aria-invalid={!!errors.password}></Input>
                                <InputError message={errors.password}></InputError>
                            </div>
                            <Label>Select Roles</Label>
                            <div className='my-4'>
                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                                    {roles.map((role) => (
                                        <div key={role} className='flex items-center gap-3'>
                                            <Checkbox id={role}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setData('roles', [...data.roles, role]);
                                                }else{
                                                    setData('roles', data.roles.filter((p)=>p!==role));
                                                }
                                            }}></Checkbox>
                                            <Label htmlFor={role}>{role}</Label>
                                        </div>
                                    ))}                              
                                    
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <Button size={'lg'} type='submit' disabled={processing}>
                                    Create
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                
                </div>
        </AppLayout>
    );
}
