import { useState, useEffect } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import AdminLayout from "@/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilIcon, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Permission {
  id: number;
  name: string;
  created_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  permissions: {
    data: Permission[];
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function PermissionsIndex() {
  const { permissions, flash } = usePage<PageProps>().props;

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    id: 0,
    name: "",
  });

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);


  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(route("permissions.store"), {
      onSuccess: () => {
        toast.success("Permiso creado correctamente.");
        form.reset("name");
        setOpenDialog(false);
      },
    });
  };


  const handleEdit = (permission: Permission) => {
    setIsEditing(true);
    form.setData({
      id: permission.id,
      name: permission.name,
    });
    setOpenDialog(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    form.put(route("permissions.update", form.data.id), {
      onSuccess: () => {
        toast.success("Permiso actualizado correctamente.");
        setOpenDialog(false);
      },
    });
  };


  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este permiso?")) {
      form.delete(route("permissions.destroy", id), {
        onSuccess: () => toast.success("Permiso eliminado correctamente."),
      });
    }
  };

  return (
    <AppLayout>
      <AdminLayout>
        <Head title="Permisos" />

        <div className="bg-neutral-900 border border-yellow-600 rounded-xl shadow-lg p-6 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-yellow-700 pb-4">
            <h1 className="text-3xl font-bold text-yellow-400">Gestión de Permisos</h1>
            <Button
              onClick={() => {
                setIsEditing(false);
                form.reset("name");
                setOpenDialog(true);
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg shadow-md flex items-center gap-2 transition"
            >
              <PlusCircle size={18} />
              Nuevo Permiso
            </Button>
          </div>

          {permissions.data.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-lg">
                <Table className="min-w-full border border-yellow-700 text-yellow-100">
                  <TableHeader>
                    <TableRow className="bg-yellow-950/40 border-b border-yellow-700">
                      <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">ID</TableHead>
                      <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">Nombre</TableHead>
                      <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">Creado</TableHead>
                      <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.data.map((permission) => (
                      <TableRow
                        key={permission.id}
                        className="hover:bg-yellow-900/30 transition-colors border-b border-yellow-800"
                      >
                        <TableCell>{permission.id}</TableCell>
                        <TableCell className="font-medium">{permission.name}</TableCell>
                        <TableCell>{permission.created_at}</TableCell>
                        <TableCell className="flex gap-3 py-2">
                          <Button
                            onClick={() => handleEdit(permission)}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition px-3"
                          >
                           Editar
                          </Button>
                          <Button
                            onClick={() => handleDelete(permission.id)}
                            className="bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition px-3"
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

            
              <div className="flex justify-center items-center mt-6 gap-2">
                {permissions.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || "#"}
                    className={`px-3 py-1 rounded-md border border-yellow-700 transition ${
                      link.active
                        ? "bg-yellow-500 text-black font-bold"
                        : "hover:bg-yellow-700 text-yellow-300"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-400 mt-6 text-center italic">No hay permisos registrados.</p>
          )}
        </div>

       
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="bg-neutral-900 border border-yellow-600 text-yellow-300">
            <DialogHeader>
              <DialogTitle className="text-yellow-400 text-xl font-semibold">
                {isEditing ? "Editar Permiso" : "Crear Permiso"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={isEditing ? handleUpdate : handleCreate}>
              <div className="grid gap-3 mt-4">
                <Label htmlFor="name" className="text-yellow-400">
                  Nombre del Permiso
                </Label>
                <Input
                  id="name"
                  value={form.data.name}
                  onChange={(e) => form.setData("name", e.target.value)}
                  placeholder="Ej: editar_productos"
                  className="bg-neutral-800 border-yellow-700 text-yellow-200"
                />
                {form.errors.name && <p className="text-red-500 text-sm">{form.errors.name}</p>}
              </div>

              <DialogFooter className="mt-6 flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline" className="text-yellow-400 border-yellow-600">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={form.processing}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                >
                  {form.processing && <Loader2 className="animate-spin mr-2" size={16} />}
                  {isEditing ? "Guardar cambios" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AppLayout>
  );
}
