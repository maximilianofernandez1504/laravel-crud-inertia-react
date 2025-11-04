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
import { Switch } from "@/components/ui/switch";

export default function Show({ order }: any) {
  const { data, setData, put, processing } = useForm({
    paid: !!order.paid,
    status: order.status ?? "reserva",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("orders.update", order.id));
  };

  return (
    <AppLayout>
      <Head title={`Orden #${order.id}`} />

      <div className="max-w-3xl mx-auto mt-8">
        <Card className="bg-zinc-900 text-yellow-400 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Detalles de la Orden #{order.id}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 🧾 Información general */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Cliente:</strong>{" "}
                  {order.user?.name ?? "Desconocido"}
                </p>
                <p>
                  <strong>Email:</strong> {order.user?.email ?? "-"}
                </p>
              </div>
              <div>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "-"}
                </p>
                <p>
                  <strong>Método de pago:</strong>{" "}
                  {order.payment_method ?? "No especificado"}
                </p>
              </div>
            </div>

            {/* 💰 Totales */}
            <div className="border-t border-yellow-800 pt-4 space-y-1">
              <p>
                <strong>Subtotal:</strong> ${Number(order.total).toFixed(2)}
              </p>
              <p>
                <strong>Interés:</strong> ${Number(order.interest).toFixed(2)}
              </p>
              <p className="text-yellow-300 font-semibold">
                <strong>Total Final:</strong> $
                {Number(order.final_total).toFixed(2)}
              </p>
            </div>

            {/* 🛠️ Formulario de edición */}
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                {/* Estado */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium mb-2"
                  >
                    Estado:
                  </label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData("status", value)}
                  >
                    <SelectTrigger className="w-full bg-zinc-800 text-yellow-200">
                      <SelectValue placeholder="Seleccionar estado" />
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

                {/* Pago */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pago realizado:
                  </label>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={data.paid}
                      onCheckedChange={(checked: boolean) =>
                        setData("paid", checked)
                      }
                    />
                    <span>{data.paid ? "Pagado" : "Pendiente"}</span>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  {processing ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-yellow-700 text-yellow-300"
                  onClick={() => router.visit(route("orders.index"))}
                >
                  Volver
                </Button>
              </div>
            </form>

            {/* 🧩 Productos */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Productos</h3>

              {order.items && order.items.length > 0 ? (
                <table className="w-full text-sm text-yellow-200">
                  <thead>
                    <tr className="border-b border-yellow-800">
                      <th className="py-2 text-left">Producto</th>
                      <th className="py-2 text-left">Precio</th>
                      <th className="py-2 text-left">Cantidad</th>
                      <th className="py-2 text-left">Variante</th>
                      <th className="py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any) => (
                      <tr key={item.id} className="border-b border-yellow-800">
                        <td className="py-2">{item.product?.name ?? "—"}</td>
                        <td className="py-2">
                          ${Number(item.price ?? 0).toFixed(2)}
                        </td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">
                          {item.variant?.name ?? item.variant_id ?? "-"}
                        </td>
                        <td className="py-2 text-right">
                          $
                          {Number(
                            item.subtotal ??
                              item.quantity * Number(item.price ?? 0)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-yellow-400">
                  No hay productos en esta orden.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
