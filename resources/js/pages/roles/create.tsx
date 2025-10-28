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
        title: 'Create Role',
        href: '/roles/create',
    },
];

export default function Create({permissions}: {permissions: string[]}) {
    const {data, setData, post, errors, processing} = useForm({
        name:'',
        permissions: [] as string[]
    });


    function submit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        post('/roles');//ver si no va con /roles
    }
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader className='flex items-center justify-between'>
                        <CardTitle>Create Role</CardTitle>
                        <CardAction>
                            <Link href={'/roles'}>
                                <Button variant={'default'}>Go Back</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className='mb-4'>
                                <Label htmlFor='name'>Role Name</Label>
                                <Input id='name' type='text' value={data.name} onChange={(e) => setData('name', e.target.value)} aria-invalid={!!errors.name}></Input>
                                <InputError message={errors.name}></InputError>
                            </div>
                            <Label>Select Permissions</Label>
                            <div className='my-4'>
                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                                    {permissions.map((permission) => (
                                        <div key={permission} className='flex items-center gap-3'>
                                            <Checkbox id={permission}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setData('permissions', [...data.permissions, permission]);
                                                }else{
                                                    setData('permissions', data.permissions.filter((p)=>p!==permission));
                                                }
                                            }}></Checkbox>
                                            <Label htmlFor={permission}>{permission}</Label>
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
