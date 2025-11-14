import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { usePermissions } from "@/hooks/use-permissions";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/layouts/admin-layout";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Preguntas frecuentes", href: "/faqs" }];

export default function FaqEdit({ faqs }: Props) {
  const { can } = usePermissions();
  const { data, setData, post, put, processing } = useForm({
    question: "",
    answer: "",
  });

  const handleUpdate = (e: React.FormEvent, faqId: number) => {
    e.preventDefault();
    put(route("faqs.update", faqId), {
      ...data,
      preserveScroll: true,
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("faqs.store"), {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <AdminLayout>
          <div className="min-h-screen bg-black text-yellow-400 px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Editar preguntas frecuentes</h1>
              <Link href={route("faqs.index")}>
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg">
                  Volver al índice
                </button>
              </Link>
            </div>

            {/* Formulario para agregar nueva pregunta */}
            {can("viewall") && (
              <Card className="bg-black text-yellow-300 border-yellow-700 mb-6">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Agregar nueva pregunta</h2>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <label className="block mb-1 font-semibold text-yellow-200">Pregunta</label>
                      <input
                        type="text"
                        value={data.question}
                        placeholder="Pregunta"
                        onChange={(e) => setData("question", e.target.value)}
                        className="w-full rounded p-2 border border-yellow-500 bg-black text-yellow-200"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold text-yellow-200">Respuesta</label>
                      <textarea
                        value={data.answer}
                        placeholder="Respuesta"
                        onChange={(e) => setData("answer", e.target.value)}
                        className="w-full rounded p-2 border border-yellow-500 bg-black text-yellow-200"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={processing}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black w-full"
                    >
                      Agregar
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Formulario para editar preguntas existentes */}
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id} className="bg-black text-yellow-300 border-yellow-700">
                  <CardContent className="p-4">
                    <form onSubmit={(e) => handleUpdate(e, faq.id)} className="space-y-4">
                      <div>
                        <label className="block mb-1 font-semibold text-yellow-200">Pregunta</label>
                        <input
                          type="text"
                          defaultValue={faq.question}
                          onChange={(e) => setData("question", e.target.value)}
                          className="w-full rounded p-2 border border-yellow-500 bg-black text-yellow-200"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-yellow-200">Respuesta</label>
                        <textarea
                          defaultValue={faq.answer}
                          onChange={(e) => setData("answer", e.target.value)}
                          className="w-full rounded p-2 border border-yellow-500 bg-black text-yellow-200"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={processing}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black w-full"
                      >
                        Guardar cambios
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
      </AdminLayout>
    </AppLayout>
  );
}
