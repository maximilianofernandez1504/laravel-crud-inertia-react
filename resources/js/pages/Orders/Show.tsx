import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


export default function Show({ order }) {
  const { data, setData, put, processing } = useForm({
    paid: !!order.paid,
    status: order.status ?? "reserva",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("orders.update", order.id));
  };

  return (
    <AppLayout>
      <Head title={`Orden #${order.id}`} />

      <div className="max-w-6xl mx-auto mt-8">
        <Card className="bg-zinc-900 text-yellow-300 shadow-lg border border-yellow-700">
          <CardHeader className="border-b border-yellow-700 pb-4">
            <CardTitle className="text-center text-2xl font-bold text-yellow-400">
              ORDEN DE COMPRA
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-4 space-y-6">

            {/* ENCABEZADO */}
            <div className="grid grid-cols-2 text-sm">
              <div>
                <p className="font-bold text-yellow-400">VALQUIRIA</p>
                <p>Productos artesanales</p>
                <p>Argentina</p>
              </div>

              <div className="text-right">
                <p>
                  <strong>N° Orden:</strong> {order.id}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Método de pago:</strong>{" "}
                  {order.payment_method || "-"}
                </p>
              </div>
            </div>

            {/* DATOS DEL CLIENTE */}
            <div className="border-t border-yellow-800 pt-4">
              <h3 className="text-yellow-400 font-bold mb-2">
                Datos del Cliente
              </h3>

              <div className="grid grid-cols-2 text-sm">
                <p>
                  <strong>Nombre:</strong> {order.user?.name ?? "-"}
                </p>
                <p>
                  <strong>Email:</strong> {order.user?.email ?? "-"}
                </p>
              </div>
            </div>

            {/* DETALLE DE PRODUCTOS */}
            <div className="border-t border-yellow-800 pt-4">
              <h3 className="text-yellow-400 font-bold mb-2">
                Detalle de Productos
              </h3>

              {order.items?.length ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-yellow-700">
                      <th className="pb-2 text-left">Producto</th>
                      <th className="pb-2 text-left">Variante</th>
                      <th className="pb-2 text-left">Cant.</th>
                      <th className="pb-2 text-left">Precio</th>
                      <th className="pb-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b border-yellow-800">
                        <td className="py-2">{item.product?.name}</td>
                        <td className="py-2">
                          {item.variant?.name ?? "-"}
                        </td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">${item.unit_price}</td>
                        <td className="py-2 text-right">
                          ${item.subtotal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay productos.</p>
              )}
            </div>

            {/* TOTALES */}
            <div className="border-t border-yellow-800 pt-4 text-right space-y-1 text-sm">
              <p>
                <strong>Subtotal:</strong> ${order.total}
              </p>
              <p>
                <strong>Interés:</strong> ${order.interest}
              </p>
              <p className="text-yellow-400 font-bold text-lg">
                Total Final: ${order.final_total}
              </p>
            </div>

            {/* FORMULARIO DE EDICIÓN */}
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">

              <div className="grid grid-cols-2 gap-6 items-center">

                {/* PAGO */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pago realizado:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={data.paid}
                      onChange={(e) => setData("paid", e.target.checked)}
                      className="h-5 w-5 accent-yellow-500 cursor-pointer"
                    />
                    <span>{data.paid ? "Pagado" : "Pendiente"}</span>
                  </div>
                </div>
                {/* ESTADO */}
                <div>
                  <p className="mb-2 font-semibold">Estado:</p>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData("status", value)}
                  >
                    <SelectTrigger className="bg-zinc-800 text-yellow-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 text-yellow-200">
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                      <SelectItem value="reserva">Reserva</SelectItem>
                      <SelectItem value="en espera">En espera</SelectItem>
                      <SelectItem value="en proceso">En proceso</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              {/* BOTONES */}
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  Guardar cambios
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="border-yellow-700 text-yellow-300"
                  onClick={() => router.visit(route("orders.index"))}
                >
                  Volver
                </Button>
                <Button
                type="button"
                variant="outline"
                className="border-yellow-700 text-yellow-300"
                onClick={() => window.open(route('orders.exportPdf', order.id), '_blank')}
                >
                  Exportar PDF
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
