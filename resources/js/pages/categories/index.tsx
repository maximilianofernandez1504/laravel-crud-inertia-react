import { useState, useEffect } from "react";
import { Link, useForm, usePage, Head } from "@inertiajs/react";
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
import { toast } from "sonner";
import { Loader2, PencilIcon, Trash2, PlusCircle } from "lucide-react";

interface Category {
  id: number;
  name: string;
  created_at?: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  categories: {
    data: Category[];
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

export default function Index() {
  const { categories, flash } = usePage<PageProps>().props;

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Formularios Inertia
  const createForm = useForm({ name: "" });
  const editForm = useForm({ id: 0, name: "" });

  // Toasts de mensajes
  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  // Crear categoría
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createForm.post(route("categories.store"), {
      onSuccess: () => {
        toast.success("Categoría creada correctamente.");
        createForm.reset("name");
        setOpenCreateDialog(false);
      },
    });
  };

  // Editar categoría
  const openEdit = (category: Category) => {
    setEditingCategory(category);
    editForm.setData({ id: category.id, name: category.name });
    setOpenEditDialog(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    editForm.put(route("categories.update", editForm.data.id), {
      onSuccess: () => {
        toast.success("Categoría actualizada correctamente.");
        setOpenEditDialog(false);
      },
    });
  };

  // Eliminar categoría
  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta categoría?")) {
      editForm.delete(route("categories.destroy", id), {
        onSuccess: () => toast.success("Categoría eliminada."),
      });
    }
  };

  return (
    <AppLayout>
      <AdminLayout>
        <Head title="Categorías" />

        <div className="bg-neutral-900 border border-yellow-600 rounded-xl shadow-lg p-6 mt-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-yellow-700 pb-4">
            <h1 className="text-3xl font-bold text-yellow-400 drop-shadow-sm">
              Categorías
            </h1>

            <Button
              onClick={() => setOpenCreateDialog(true)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg shadow-md flex items-center gap-2 transition"
            >
              <PlusCircle size={18} />
              Nueva Categoría
            </Button>
          </div>

          {/* Tabla */}
          {categories.data.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-lg">
                <Table className="min-w-full border border-yellow-700 text-yellow-100">
                  <TableHeader>
                    <TableRow className="bg-yellow-950/40 border-b border-yellow-700">
                      <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">
                        ID
                      </TableHead>
                      <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">
                        Nombre
                      </TableHead>
                      <TableHead className="text-yellow-400 uppercase text-sm py-3 text-left">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.data.map((category) => (
                      <TableRow
                        key={category.id}
                        className="hover:bg-yellow-900/30 transition-colors border-b border-yellow-800"
                      >
                        <TableCell>{category.id}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="flex gap-3 py-2">
                          <Button
                            onClick={() => openEdit(category)}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition px-3"
                          >
                            Editar
                          </Button>

                          <Button
                            onClick={() => handleDelete(category.id)}
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
                {categories.links.map((link, index) => (
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
            <p className="text-gray-400 mt-6 text-center italic">
              No hay categorías registradas.
            </p>
          )}
        </div>

        
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogContent className="bg-neutral-900 border border-yellow-600 text-yellow-300">
            <DialogHeader>
              <DialogTitle className="text-yellow-400 text-xl">
                Crear Nueva Categoría
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate}>
              <div className="grid gap-3 mt-4">
                <Label htmlFor="name" className="text-yellow-400">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={createForm.data.name}
                  onChange={(e) => createForm.setData("name", e.target.value)}
                  placeholder="Ej: Artesanías"
                  className="bg-neutral-800 border-yellow-700 text-yellow-200"
                />
                {createForm.errors.name && (
                  <p className="text-red-500 text-sm">{createForm.errors.name}</p>
                )}
              </div>

              <DialogFooter className="mt-6 flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline" className="text-yellow-400 border-yellow-600">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={createForm.processing}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                >
                  {createForm.processing && <Loader2 className="animate-spin mr-2" size={16} />}
                  Crear
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

   
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent className="bg-neutral-900 border border-yellow-600 text-yellow-300">
            <DialogHeader>
              <DialogTitle className="text-yellow-400 text-xl">
                Editar Categoría
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEdit}>
              <div className="grid gap-3 mt-4">
                <Label htmlFor="edit-name" className="text-yellow-400">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  value={editForm.data.name}
                  onChange={(e) => editForm.setData("name", e.target.value)}
                  placeholder="Ej: Nuevas artesanías"
                  className="bg-neutral-800 border-yellow-700 text-yellow-200"
                />
                {editForm.errors.name && (
                  <p className="text-red-500 text-sm">{editForm.errors.name}</p>
                )}
              </div>

              <DialogFooter className="mt-6 flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline" className="text-yellow-400 border-yellow-600">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={editForm.processing}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                >
                  {editForm.processing && <Loader2 className="animate-spin mr-2" size={16} />}
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AppLayout>
  );
}
