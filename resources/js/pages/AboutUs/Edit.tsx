import { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react"; 
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePermissions } from "@/hooks/use-permissions";
import AdminLayout from "@/layouts/admin-layout";

export default function Edit({ about }: any) {
  const { can } = usePermissions();
  if (!can("viewall")) { 
    return <div className="p-6 text-yellow-400">No autorizado</div>;
  }

  const { data, setData, post, processing } = useForm({
    title: about.title || "",
    subtitle: about.subtitle || "",
    content: about.content || "",
    footer_text: about.footer_text || "",
    uploaded_files: [] as File[],
    carousel_ids: (about.media || [])
      .filter((m: any) => m.is_in_carousel)
      .map((m: any) => m.id),
    remove_media_ids: [] as number[],
    urls: (about.urls || []).map((u: any) => ({
      id: u.id,
      url: u.url,
      title: u.title,
    })),
  });

  const [localFilesPreview, setLocalFilesPreview] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setData("uploaded_files", files);
    setLocalFilesPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const toggleCarousel = (id: number) => {
    const arr = data.carousel_ids || [];
    setData(
      "carousel_ids",
      arr.includes(id) ? arr.filter((x: number) => x !== id) : [...arr, id]
    );
  };

  const markRemove = (id: number) => {
    const arr = data.remove_media_ids || [];
    setData(
      "remove_media_ids",
      arr.includes(id) ? arr.filter((x: number) => x !== id) : [...arr, id]
    );
  };

  const addUrlRow = () => {
    setData("urls", [...(data.urls || []), { id: null, url: "", title: "" }]);
  };

  const updateUrlRow = (index: number, field: string, value: string) => {
    const newUrls = [...(data.urls || [])];
    newUrls[index][field] = value;
    setData("urls", newUrls);
  };

  const removeUrlRow = (index: number) => {
    const newUrls = [...(data.urls || [])];
    newUrls.splice(index, 1);
    setData("urls", newUrls);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("aboutus.update"), { forceFormData: true });
  };

  return (
    <AppLayout>
      <AdminLayout>
          <Head title="Editar Sobre Nosotros" />
          <div className="min-h-screen bg-black text-yellow-400 px-6 py-8">
            <form
              onSubmit={submit}
              encType="multipart/form-data"
              className="max-w-4xl mx-auto bg-neutral-950 border border-yellow-600 p-6 rounded-lg"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                Editar Sobre Nosotros
              </h2>

              <label className="text-sm text-yellow-500">Título</label>
              <Input
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                className="mb-4 bg-neutral-900 border-yellow-600 text-yellow-400"
              />

              <label className="text-sm text-yellow-500">Subtítulo</label>
              <Input
                value={data.subtitle}
                onChange={(e) => setData("subtitle", e.target.value)}
                className="mb-4 bg-neutral-900 border-yellow-600 text-yellow-400"
              />

              <label className="text-sm text-yellow-500">Contenido</label>
              <Textarea
                value={data.content}
                onChange={(e) => setData("content", e.target.value)}
                className="mb-4 bg-neutral-900 border-yellow-600 text-yellow-400"
              />

              <label className="text-sm text-yellow-500">Texto final</label>
              <Input
                value={data.footer_text}
                onChange={(e) => setData("footer_text", e.target.value)}
                className="mb-4 bg-neutral-900 border-yellow-600 text-yellow-400"
              />

              <hr className="my-4 border-yellow-700" />

              <div className="mb-4">
                <label className="text-sm text-yellow-500 mb-2 block">
                  Subir imágenes/videos
                </label>
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <div className="flex gap-2 mt-3 flex-wrap">
                  {localFilesPreview.map((p, i) => (
                    <img key={i} src={p} className="h-20 object-contain rounded" />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-yellow-400 mb-2">Medios existentes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(about.media || []).map((m: any) => (
                    <div
                      key={m.id}
                      className="p-2 border border-yellow-600 rounded bg-neutral-900"
                    >
                      {m.file_type === "image" ? (
                        <img
                          src={`http://localhost:5173/${m.file_path}`}
                          alt=""
                          className="max-h-28 object-contain mb-2"
                        />
                      ) : (
                        <video
                          src={`http://localhost:5173/${m.file_path}`}
                          className="max-h-28 mb-2"
                          controls
                        />
                      )}

                      {m.file_type === "image" && (
                        <label className="flex items-center gap-2 text-sm mb-1">
                          <input
                            type="checkbox"
                            checked={data.carousel_ids?.includes(m.id)}
                            onChange={() => toggleCarousel(m.id)}
                            className="accent-yellow-500"
                          />
                          Incluir en carrusel
                        </label>
                      )}

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.remove_media_ids?.includes(m.id)}
                          onChange={() => markRemove(m.id)}
                          className="accent-red-500"
                        />
                        Eliminar
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="my-4 border-yellow-700" />

              <div className="mb-4">
                <h3 className="text-yellow-400 mb-2">YouTube URLs</h3>
                <div className="space-y-2">
                  {(data.urls || []).map((u: any, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        placeholder="https://www.youtube.com/embed/..."
                        value={u.url}
                        onChange={(e) => updateUrlRow(i, "url", e.target.value)}
                        className="flex-1 bg-neutral-900 border-yellow-600 text-yellow-400"
                      />
                      <Input
                        placeholder="Título (opcional)"
                        value={u.title}
                        onChange={(e) => updateUrlRow(i, "title", e.target.value)}
                        className="w-56 bg-neutral-900 border-yellow-600 text-yellow-400"
                      />
                      <Button
                        type="button"
                        onClick={() => removeUrlRow(i)}
                        className="bg-red-600"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <Button
                    type="button"
                    onClick={addUrlRow}
                    className="bg-yellow-500 text-black"
                  >
                    Agregar URL
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  disabled={processing}
                  type="submit"
                  className="bg-yellow-500 text-black"
                >
                  Guardar
                </Button>
                <Link href={route("aboutus.index")} className="ml-2">
                  <Button variant="outline">Cancelar</Button>
                </Link>
              </div>
            </form>
          </div>
      </AdminLayout>
    </AppLayout>
  );
}
