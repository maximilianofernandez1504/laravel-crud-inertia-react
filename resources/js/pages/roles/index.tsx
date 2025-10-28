import InputError from '@/components/input-error';
import TablePagination from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index({roles}: {roles: Role}) {

    const {flash} = usePage<{flash: {message?: string}}>().props;

    useEffect(()=>{
        if(flash.message) {
            toast.success(flash.message); 
        }
    }, [flash.message]);

    function deleteRole(id:number){
        if (confirm('Are you sure want to delete this role?')){
            router.delete(`roles/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader className='flex items-center justify-between'>
                        <CardTitle>Roles Management</CardTitle>
                        <CardAction>
                            <Link href={'roles/create'}>
                                <Button variant={'default'}>Add New</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <Table>
                            <TableHeader className='bg-slate-500 dark:bg-slate-500'>
                                <TableRow>
                                    <TableHead className='font-bold text-white'>ID</TableHead>
                                    <TableHead className='font-bold text-white'>Name</TableHead>
                                    <TableHead className='font-bold text-white'>Permissions</TableHead>
                                    <TableHead className='font-bold text-white'>Created</TableHead>
                                    <TableHead className='font-bold text-white'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.data.map((role, index) => (
                                                                    <TableRow className='odd:bg-slate-100 dark:odd:bg-slate-800'>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell className='flex flex-wrap items-center gap-2'>{role.permissions.map((perm, index) => (
                                        <Badge variant={'outline'} key={index}>{perm}</Badge>
                                    ))}</TableCell>
                                    <TableCell>{role.created_at}</TableCell>
                                    <TableCell>
                                        <Link href={`roles/${role.id}/edit`}>
                                            <Button variant={'outline'}><PencilIcon size={18}></PencilIcon>Edit</Button>
                                        </Link>
                                        <Button className='m-4' variant={'destructive'} onClick={() => deleteRole(role.id)}><DeleteIcon size={18}></DeleteIcon>Delete</Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {roles.data.length > 0? (
                        <TablePagination
                            total={roles.total}
                            from={roles.from}
                            to = {roles.to}
                            links={roles.links}
                        ></TablePagination>
                    ):(<div className='flex h-full items-center justify-center'>No Results Found!</div>)} 
                </Card>
                
                </div>
        </AppLayout>
    );
}
