import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/use-permissions";

export default function Edit({ home }: any) {
  const { can } = usePermissions();
  const [preview, setPreview] = useState<string[]>([]);

  const { data, setData, post } = useForm({
    title_products: home.title_products || "Productos",
    title_map: home.title_map || "Dónde encontrarnos",
    images: [] as File[],
    remove_images: [] as number[],
  });

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setData("images", files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const toggleRemove = (id: number) => {
    setData("remove_images", (prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("home.update"), { forceFormData: true });
  };

  if (!can("viewall")) {
    return <div className="text-yellow-400 p-6">No autorizado</div>;
  }

  return (
    <AppLayout title="Editar Inicio">
      <div className="min-h-screen bg-black text-yellow-400 p-6">
        <form
          onSubmit={submit}
          encType="multipart/form-data"
          className="max-w-3xl mx-auto bg-neutral-950 border border-yellow-600 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Editar Página de Inicio</h2>

          <label className="text-yellow-500 text-sm">Título Productos</label>
          <Input
            value={data.title_products}
            onChange={(e) => setData("title_products", e.target.value)}
            className="bg-neutral-900 border-yellow-600 text-yellow-400 mb-4"
          />

          <label className="text-yellow-500 text-sm">Título Mapa</label>
          <Input
            value={data.title_map}
            onChange={(e) => setData("title_map", e.target.value)}
            className="bg-neutral-900 border-yellow-600 text-yellow-400 mb-4"
          />

          <label className="text-yellow-500 text-sm mb-2">Imágenes actuales</label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {home.images?.map((img: any) => (
              <div key={img.id} className="relative">
                <img
                  src={`http://localhost:5173/${img.image_path}`}
                  className="rounded-lg border border-yellow-600 object-cover w-full h-40"
                />
                <button
                  type="button"
                  onClick={() => toggleRemove(img.id)}
                  className="absolute top-1 right-1 bg-red-600 rounded-full px-2 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <label className="text-yellow-500 text-sm mb-2">Agregar nuevas imágenes</label>
          <Input type="file" multiple accept="image/*" onChange={handleFiles} />
          <div className="flex gap-2 mt-3 flex-wrap">
            {preview.map((p, i) => (
              <div key={i} className="relative">
                <img
                  src={p}
                  className="h-32 w-32 object-cover rounded-lg border border-yellow-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    const arr = [...preview];
                    arr.splice(i, 1);
                    setPreview(arr);
                  }}
                  className="absolute top-1 right-1 bg-red-600 rounded-full px-2 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <Button type="submit" className="bg-yellow-500 text-black">
              Guardar
            </Button>
            <Link href={route("home")}>
              <Button variant="outline">Cancelar</Button>
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
