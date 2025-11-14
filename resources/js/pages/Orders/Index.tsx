import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import AdminLayout from "@/layouts/admin-layout";

export default function OrdersIndex({ orders, filters }) {
  const [filter, setFilter] = useState({
    status: filters.status || "all",
    paid: filters.paid || "all",
    from_date: filters.from_date || "",
    to_date: filters.to_date || "",
    sort_by: filters.sort_by || "id", 
    direction: filters.direction || "asc",
  });

  const handleFilterChange = (name, value) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    router.get(route("orders.index"), filter, { preserveScroll: true });
  };

  const exportPDF = () => {
    const safeFilter = {
      ...filter,
      sort_by: String(filter.sort_by || "id"),
      direction: String(filter.direction || "asc"),
    };

    const query = new URLSearchParams(safeFilter).toString();
    window.open(route("orders.exportListPdf") + "?" + query, "_blank");
  };

  return (
    <AppLayout>
      <AdminLayout>
            <Head title="Órdenes" />
            <div className="max-w-7xl mx-auto mt-10 text-yellow-200">
              <h1 className="text-3xl font-bold mb-6 text-center">Listado de Órdenes</h1>

              
              <Card className="bg-zinc-900 p-6 mb-6 border border-yellow-700">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label>Desde</label>
                    <Input
                      type="date"
                      value={filter.from_date}
                      onChange={(e) => handleFilterChange("from_date", e.target.value)}
                      className="bg-zinc-800 text-yellow-400"
                    />
                  </div>

                  <div>
                    <label>Hasta</label>
                    <Input
                      type="date"
                      value={filter.to_date}
                      onChange={(e) => handleFilterChange("to_date", e.target.value)}
                      className="bg-zinc-800 text-yellow-400"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label>Estado</label>
                    <Select
                      value={filter.status}
                      onValueChange={(v) => handleFilterChange("status", v)}
                    >
                      <SelectTrigger className="bg-zinc-800 text-yellow-400">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="reserva">Reserva</SelectItem>
                        <SelectItem value="en espera">En espera</SelectItem>
                        <SelectItem value="en proceso">En proceso</SelectItem>
                        <SelectItem value="enviado">Enviado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label>Pago</label>
                    <Select
                      value={filter.paid}
                      onValueChange={(v) => handleFilterChange("paid", v)}
                    >
                      <SelectTrigger className="bg-zinc-800 text-yellow-400">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="1">Pagadas</SelectItem>
                        <SelectItem value="0">Pendientes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <label>Ordenar por</label>
                    <div className="flex space-x-2 items-center">
                      
                      <Select
                        value={filter.sort_by}
                        onValueChange={(v) => handleFilterChange("sort_by", v)}
                      >
                        <SelectTrigger className="bg-zinc-800 text-yellow-400 w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">N° de orden</SelectItem>
                          <SelectItem value="created_at">Fecha</SelectItem>
                          <SelectItem value="final_total">Total</SelectItem>
                        </SelectContent>
                      </Select>

                  
                      <Button
                        type="button"
                        onClick={() => {
                          const newDirection = filter.direction === "asc" ? "desc" : "asc";
                          handleFilterChange("direction", newDirection);
                          router.get(route("orders.index"), {
                            ...filter,
                            direction: newDirection,
                          });
                        }}
                        className="bg-zinc-800 border border-yellow-600 hover:bg-zinc-700 text-yellow-400 px-3"
                      >
                        {filter.direction === "asc" ? "🔼" : "🔽"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-end space-x-2">
                    <Button onClick={applyFilters} className="bg-yellow-500 text-black">
                      Filtrar
                    </Button>
                    <Button
                      onClick={exportPDF}
                      variant="outline"
                      className="border-yellow-700 text-yellow-400"
                    >
                      Exportar PDF
                    </Button>
                  </div>
                </div>
              </Card>

          
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-yellow-700">
                  <thead>
                    <tr className="bg-yellow-950/40 border-b border-yellow-700">
                      <th className="p-2 border border-yellow-700">N° de orden</th>
                      <th className="p-2 border border-yellow-700">Fecha</th>
                      <th className="p-2 border border-yellow-700">Usuario</th>
                      <th className="p-2 border border-yellow-700">Pago</th>
                      <th className="p-2 border border-yellow-700">Estado</th>
                      <th className="p-2 border border-yellow-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.data.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-zinc-800 cursor-pointer"
                        onClick={() => router.visit(route("orders.show", order.id))}
                      >
                        <td className="p-2 border border-yellow-700">{order.id}</td>
                        <td className="p-2 border border-yellow-700">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-2 border border-yellow-700">
                          {order.user?.name || "Sin usuario"}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              <div className="flex justify-center mt-6 space-x-2">
                {orders.links.map((link, index) => (
                  <Button
                    key={index}
                    onClick={() => router.get(link.url)}
                    disabled={!link.url}
                    className={`${
                      link.active
                        ? "bg-yellow-500 text-black"
                        : "bg-zinc-800 text-yellow-400"
                    }`}
                  >
                    {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
                  </Button>
                ))}
              </div>
            </div>
      </AdminLayout>
    </AppLayout>
  );
}
