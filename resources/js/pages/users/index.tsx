import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { User } from '@/types/users';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Usuarios', href: '/users' },
];

export default function Index({ users }: { users: User }) {
  const { flash } = usePage<{ flash: { message?: string } }>().props;

  useEffect(() => {
    if (flash.message) toast.success(flash.message);
  }, [flash.message]);

  function deleteUser(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      router.delete(`users/${id}`);
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <AdminLayout>
        <Head title="Usuarios" />

        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
          <Card className="bg-[#111] border border-yellow-600 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <CardHeader className="flex items-center justify-between border-b border-yellow-600 pb-3">
              <CardTitle className="text-2xl font-bold text-yellow-400">
                Gestión de Usuarios
              </CardTitle>
            </CardHeader>

            <CardContent className="mt-4">
              <Table className="min-w-full border border-yellow-700 text-yellow-100 rounded-lg overflow-hidden">
                <TableHeader>
                  <TableRow className="bg-yellow-950/40 border-b border-yellow-700">
                    <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">ID</TableHead>
                    <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">Nombre</TableHead>
                    <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">Email</TableHead>
                    <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">Roles</TableHead>
                    <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">Creado</TableHead>
                    <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.data.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-yellow-900/30 transition-colors border-b border-yellow-800"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium text-yellow-200">{user.name}</TableCell>
                      <TableCell className="text-yellow-200">{user.email}</TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        {user.roles.map((role, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-yellow-500 text-yellow-300 bg-transparent"
                          >
                            {role}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell className="text-yellow-200">{user.created_at}</TableCell>
                      <TableCell className="flex gap-3 py-2">
                        <Link href={`users/${user.id}/edit`}>
                          <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition px-3">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-600 hover:bg-[#ff6666] text-white font-semibold rounded-lg transition px-3"
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 🟡 Paginación igual a Roles/Permisos */}
              {users.data.length > 0 ? (
                <div className="flex justify-center items-center mt-6 gap-2">
                  {users.links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url || "#"}
                      className={`px-3 py-1 rounded-md border border-yellow-700 transition ${
                        link.active
                          ? "bg-yellow-500 text-black font-bold"
                          : "hover:bg-yellow-700 text-yellow-300"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: link.label
                          .replace("&laquo; Previous", "← Anterior")
                          .replace("Next &raquo;", "Siguiente →")
                          .replace("&laquo;", "←")
                          .replace("&raquo;", "→"),
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-yellow-400 py-6 text-lg">
                  No se encontraron usuarios registrados.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AppLayout>
  );
}
