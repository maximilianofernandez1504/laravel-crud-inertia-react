import React, { useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

export default function Thanks() {
  useEffect(() => {

    router.delete(route("cart.clear"), {}, { preserveScroll: true });

  
    const timer = setTimeout(() => {
      router.visit(route("products.index"));
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <Head title="Gracias por tu compra" />
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-yellow-200 text-center">
        <h1 className="text-4xl font-bold mb-4">¡Gracias por tu compra!</h1>
        <p className="text-lg mb-2">
          Tu orden fue procesada con éxito.
        </p>
        <p className="text-sm opacity-80">
          Serás redirigido al catálogo de productos en unos segundos...
        </p>
      </div>
    </AppLayout>
  );
}
