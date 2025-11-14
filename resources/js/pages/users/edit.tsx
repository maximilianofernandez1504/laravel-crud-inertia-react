import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { UserRole } from '@/types/users';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Editar Usuario', href: '/users' },
];

export default function Edit({ roles, user }: { roles: string[]; user: UserRole }) {
  const roleList = user.roles.map((role) => role.name);

  const { data, setData, put, errors, processing } = useForm({
    name: user.name,
    email: user.email,
    roles: roleList || [],
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    put(`/users/${user.id}`);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <AdminLayout>
        <Head title="Editar Usuario" />

        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
          <Card className="bg-[#111] border border-yellow-600 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <CardHeader className="flex items-center justify-between border-b border-yellow-600 pb-3">
              <CardTitle className="text-2xl font-bold text-yellow-400">
                Editar Usuario
              </CardTitle>
              <CardAction>
                <Link href="/users">
                  <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition">
                    Volver
                  </Button>
                </Link>
              </CardAction>
            </CardHeader>

            <CardContent className="mt-4 text-yellow-200">
              <form onSubmit={submit}>
                {/* Nombre */}
                <div className="mb-5">
                  <Label htmlFor="name" className="text-yellow-400 font-medium">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    className="bg-[#1c1c1c] border border-yellow-700 text-yellow-100 placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-500 mt-1"
                  />
                  <InputError message={errors.name} />
                </div>

                {/* Email */}
                <div className="mb-5">
                  <Label htmlFor="email" className="text-yellow-400 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    aria-invalid={!!errors.email}
                    className="bg-[#1c1c1c] border border-yellow-700 text-yellow-100 placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-500 mt-1"
                  />
                  <InputError message={errors.email} />
                </div>

                {/* Roles */}
                <Label className="text-yellow-400 font-medium">Seleccionar Roles</Label>
                <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {roles.map((role) => (
                    <div key={role} className="flex items-center gap-3">
                      <Checkbox
                        id={role}
                        checked={data.roles.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setData('roles', [...data.roles, role]);
                          } else {
                            setData(
                              'roles',
                              data.roles.filter((p) => p !== role)
                            );
                          }
                        }}
                        className="border-yellow-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-400"
                      />
                      <Label htmlFor={role} className="text-yellow-200">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Botón */}
                <div className="flex justify-end mt-6">
                  <Button
                    size="lg"
                    type="submit"
                    disabled={processing}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg px-6 py-2 transition"
                  >
                    {processing && (
                      <Loader2 size={18} className="animate-spin mr-2" />
                    )}
                    Actualizar
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
