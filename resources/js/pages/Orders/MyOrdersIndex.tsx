import React from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyOrders({ orders }) {
  const openOrderPdf = (id) => {
    window.open(route("orders.exportPdf", id), "_blank");
  };

  return (
    <AppLayout>
      <Head title="Mis Órdenes" />

      <div className="max-w-7xl mx-auto mt-10 text-yellow-200">
        <h1 className="text-3xl font-bold mb-6 text-center">Mis Órdenes</h1>

        {/* 🔹 Contenedor tipo Card (igual que en OrdersIndex) */}
        <Card className="bg-zinc-900 p-6 mb-6 border border-yellow-700">
          {/* 🔹 Tabla de Órdenes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-yellow-700">
              <thead>
                <tr className="bg-zinc-800 text-yellow-400">
                  <th className="p-2 border border-yellow-700">N°</th>
                  <th className="p-2 border border-yellow-700">Fecha</th>
                  <th className="p-2 border border-yellow-700">Pago</th>
                  <th className="p-2 border border-yellow-700">Estado</th>
                  <th className="p-2 border border-yellow-700">Total</th>
                  <th className="p-2 border border-yellow-700 text-center">
                    PDF
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.data.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-zinc-800 cursor-pointer transition-colors"
                    onClick={() => router.visit(route("orders.show", order.id))}
                  >
                    <td className="p-2 border border-yellow-700">{order.id}</td>

                    <td className="p-2 border border-yellow-700">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-2 border border-yellow-700">
                      {order.paid ? "Pagado" : "Pendiente"}
                    </td>

                    <td className="p-2 border border-yellow-700">
                      {order.status}
                    </td>

                    <td className="p-2 border border-yellow-700">
                      ${order.final_total}
                    </td>

                    <td className="p-2 border border-yellow-700 text-center">
                      <Button
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold border border-yellow-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderPdf(order.id);
                        }}
                      >
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Paginación */}
          <div className="flex justify-center mt-6 space-x-2">
            {orders.links.map((link, index) => (
              <Button
                key={index}
                onClick={() => link.url && router.get(link.url)}
                disabled={!link.url}
                className={`${
                  link.active
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-800 text-yellow-400 border border-yellow-700 hover:bg-zinc-700"
                }`}
              >
                {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
