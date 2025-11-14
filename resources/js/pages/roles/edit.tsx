import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { RolePermission } from '@/types/role_permission';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Editar Rol', href: '/roles' },
];

export default function Edit({
  permissions,
  role,
}: {
  permissions: string[];
  role: RolePermission;
}) {
  const permissionList = role.permissions.map((perm) => perm.name);

  const { data, setData, put, errors, processing } = useForm({
    name: role.name,
    permissions: permissionList,
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    put(`/roles/${role.id}`);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <AdminLayout>
        <Head title="Editar Rol" />

        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
          <Card className="bg-[#111] border border-yellow-600 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <CardHeader className="flex items-center justify-between border-b border-yellow-600 pb-3">
              <CardTitle className="text-2xl font-bold text-yellow-400">
                Editar Rol
              </CardTitle>
              <CardAction>
                <Link href={'/roles'}>
                  <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition">
                    Volver
                  </Button>
                </Link>
              </CardAction>
            </CardHeader>

            <CardContent className="mt-4 text-yellow-200">
              <form onSubmit={submit} className="space-y-6">
              
                <div>
                  <Label
                    htmlFor="name"
                    className="text-yellow-400 font-semibold mb-2 block"
                  >
                    Nombre del Rol
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="bg-neutral-900 border-yellow-700 text-yellow-100 focus:ring-yellow-500"
                    placeholder="Ejemplo: Administrador"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <InputError message={errors.name} className="text-red-500 mt-2" />
                  )}
                </div>

               
                <div>
                  <Label className="text-yellow-400 font-semibold block mb-3">
                    Permisos asignados
                  </Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center gap-3 bg-neutral-900 border border-yellow-700 rounded-lg p-2 hover:bg-neutral-800 transition"
                      >
                        <Checkbox
                          id={permission}
                          checked={data.permissions.includes(permission)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setData('permissions', [...data.permissions, permission]);
                            } else {
                              setData(
                                'permissions',
                                data.permissions.filter((p) => p !== permission)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={permission}
                          className="text-yellow-300 text-sm cursor-pointer"
                        >
                          {permission}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

               
                <div className="flex justify-end">
                  <Button
                    size={'lg'}
                    type="submit"
                    disabled={processing}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg px-6 py-2 transition"
                  >
                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AppLayout>
  );
}
