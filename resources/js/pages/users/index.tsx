import InputError from '@/components/input-error';
import TablePagination from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Permission, Role, SinglePermission } from '@/types/role_permission';
import { User } from '@/types/users';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

import { DeleteIcon, Loader2, PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Index({users}: {users: User}) {

    const {flash} = usePage<{flash: {message?: string}}>().props;

    useEffect(()=>{
        if(flash.message) {
            toast.success(flash.message); 
        }
    }, [flash.message]);

    function deleteUser(id:number){
        if (confirm('Are you sure want to delete this user?')){
            router.delete(`users/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader className='flex items-center justify-between'>
                        <CardTitle>Users Management</CardTitle>
                        <CardAction>
                            <Link href={'users/create'}>
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
                                    <TableHead className='font-bold text-white'>Email</TableHead>
                                    <TableHead className='font-bold text-white'>Roles</TableHead>
                                    <TableHead className='font-bold text-white'>Created</TableHead>
                                    <TableHead className='font-bold text-white'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user, index) => (
                                                                    <TableRow className='odd:bg-slate-100 dark:odd:bg-slate-800'>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className='flex flex-wrap items-center gap-2'>{user.roles.map((role, index) => (
                                        <Badge variant={'outline'} key={index}>{role}</Badge>
                                    ))}</TableCell>
                                    <TableCell>{user.created_at}</TableCell>
                                    <TableCell>
                                        <Link href={`users/${user.id}/edit`}>
                                            <Button variant={'outline'}><PencilIcon size={18}></PencilIcon>Edit</Button>
                                        </Link>
                                        <Button className='m-4' variant={'destructive'} onClick={() => deleteUser(user.id)}><DeleteIcon size={18}></DeleteIcon>Delete</Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {users.data.length > 0? (
                        <TablePagination
                            total={users.total}
                            from={users.from}
                            to = {users.to}
                            links={users.links}
                        ></TablePagination>
                    ):(<div className='flex h-full items-center justify-center'>No Results Found!</div>)} 
                </Card>
                
                </div>
        </AppLayout>
    );
}
