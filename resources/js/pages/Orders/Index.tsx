import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Order = {
  id: number;
  user?: { name: string; email: string };
  total: string;
  interest: string;
  final_total: string;
  payment_method: string | null;
  status: "cancelado" | "reserva" | "en espera" | "en proceso" | "enviado";
  paid: number;
  created_at: string;
};

type Props = {
  orders: Order[];
};

export default function OrdersIndex({ orders }: Props) {
  const { put } = useForm();
  const [editing, setEditing] = useState<{ [key: number]: Partial<Order> }>({});

  const handleChange = (id: number, field: keyof Order, value: any) => {
    setEditing((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = (order: Order) => {
    const data = editing[order.id];
    if (!data) return;

    
    put(route("orders.update", order.id), {
      ...data,
      preserveScroll: true,
      onSuccess: () => {
        setEditing((prev) => {
          const updated = { ...prev };
          delete updated[order.id];
          return updated;
        });
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Órdenes" />

      <div className="max-w-6xl mx-auto mt-10 text-yellow-200">
        <h1 className="text-3xl font-bold mb-6 text-center">Listado de Órdenes</h1>

        {orders.length === 0 ? (
          <p className="text-center text-yellow-500">No hay órdenes registradas.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const current = editing[order.id] || {};

              return (
                <Card
                  key={order.id}
                  className="bg-black text-yellow-300 border border-yellow-800"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-between items-center border-b border-yellow-800 pb-2">
                      <h2 className="font-semibold">
                        Orden #{order.id} —{" "}
                        <span className="text-yellow-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </h2>
                      <p className="text-yellow-400">
                        {order.user
                          ? `${order.user.name} (${order.user.email})`
                          : "Sin usuario"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                      
                      <div>
                        <label className="text-sm block mb-1">Estado:</label>
                        <select
                          value={current.status ?? order.status}
                          onChange={(e) =>
                            handleChange(order.id, "status", e.target.value)
                          }
                          className="bg-black border border-yellow-700 text-yellow-200 rounded-lg px-2 py-1 w-full"
                        >
                          <option value="cancelado">Cancelado</option>
                          <option value="reserva">Reserva</option>
                          <option value="en espera">En espera</option>
                          <option value="en proceso">En proceso</option>
                          <option value="enviado">Enviado</option>
                        </select>
                      </div>

                      
                      <div>
                        <label className="text-sm block mb-1">Pago:</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={!!(current.paid ?? order.paid)}
                            onChange={(e) =>
                              handleChange(
                                order.id,
                                "paid",
                                e.target.checked ? 1 : 0
                              )
                            }
                            className="accent-yellow-400"
                          />
                          <span>
                            {current.paid ?? order.paid ? "Pagado" : "Pendiente"}
                          </span>
                        </div>
                      </div>

                   
                      <div>
                        <p className="text-sm">Subtotal:</p>
                        <p>${order.total}</p>
                      </div>
                      <div>
                        <p className="text-sm">Interés:</p>
                        <p>${order.interest}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-yellow-400">
                          Total Final:
                        </p>
                        <p className="font-bold">${order.final_total}</p>
                      </div>
                    </div>

                   
                    <div className="flex justify-between items-center mt-4">
                      {editing[order.id] && (
                        <Button
                          onClick={() => handleSave(order)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                        >
                          Guardar cambios
                        </Button>
                      )}
                    
                      <Link href={route("orders.show", order.id)}>
                        <Button
                          variant="outline"
                          className="border-yellow-700 text-yellow-300 hover:bg-yellow-900"
                        >
                          Ver detalle
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
