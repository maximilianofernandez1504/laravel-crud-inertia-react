import { useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Category {
  id: number;
  name: string;
}

export default function Edit() {
  const { category } = usePage<{ category: Category }>().props;
  const { data, setData, put, processing, errors } = useForm({
    name: category.name || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("categories.update", category.id));
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Editar Categoría</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-semibold mb-1">Nombre</label>
          <Input
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <Button type="submit" disabled={processing}>
          Actualizar
        </Button>
      </form>
    </AppLayout>
  );
}
