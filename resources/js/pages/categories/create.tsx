import { useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("categories.store"));
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Crear Categoría</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-semibold mb-1">Nombre</label>
          <Input
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            placeholder="Ej. Electrónica"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <Button type="submit" disabled={processing}>
          Guardar
        </Button>
      </form>
    </AppLayout>
  );
}
