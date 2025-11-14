import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { Title } from "@radix-ui/react-dialog";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
}

export default function FaqIndex({ faqs }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);
  const { can } = usePermissions();

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <AppLayout>
      <Head title="Preguntas frecuentes" />

      <div className="max-w-4xl mx-auto mt-10 text-yellow-200">
        <div className="flex justify-start items-center mb-6">
          {can("viewall") && (
            <Link href={route("faqs.edit")}>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-5 py-2 rounded-lg">
                Editar página
              </Button>
            </Link>
          )}
        </div>
       <h1 className="text-3xl font-bold mb-6 text-center">Preguntas frecuentes</h1>
        {faqs.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No hay preguntas aún.</p>
        ) : (
          faqs.map((faq) => (
            <Card
              key={faq.id}
              className="bg-black text-yellow-300 border-yellow-700 mb-4 cursor-pointer"
              onClick={() => handleToggle(faq.id)}
            >
              <CardContent className="p-4">
                <p className="font-semibold">{faq.question}</p>
                {openId === faq.id && (
                  <div className="mt-2 bg-black text-yellow ">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AppLayout>
  );
}
