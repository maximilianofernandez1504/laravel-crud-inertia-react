import React, { useEffect, useState } from "react";
import { usePage, Link, router, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Toast from "@/components/Toast";

export default function CartAndOrders() {
  const {
    cart,
    flash,
    total,
    orders = { data: [], links: [] },
    cart_expiration,
    cart_updated_at,
  } = usePage().props;

  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg, type = "success") => {
    setToastMsg({ message: msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // ------------------------------
  // CONTADOR DE EXPIRACIÓN
  // ------------------------------
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!cart_updated_at || !cart_expiration || cart.length === 0) return;

    const updatedAt = new Date(cart_updated_at);
    const expiryTime = new Date(updatedAt.getTime() + cart_expiration * 60000);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((expiryTime - now) / 1000);

      if (diff <= 0) {
        clearInterval(interval);

        router.delete(route("cart.expire")).then(() => {
          showToast("⚠ Tu carrito expiró automáticamente.", "error");
          setTimeout(() => {
            router.reload();
          }, 800);
        });
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cart_updated_at, cart_expiration, cart.length]);

  // ------------------------------
  // MENSAJES FLASH DE LARAVEL
  // ------------------------------
  useEffect(() => {
    if (flash?.message) {
      showToast(flash.message, flash.status === "error" ? "error" : "success");
    }
  }, [flash]);

  // ------------------------------
  // EVENTOS DEL CARRITO
  // ------------------------------
  const handleUpdate = (id, quantity) => {
    router.put(
      route("cart.update", id),
      { quantity },
      {
        preserveScroll: true,
        onSuccess: () => showToast("Cantidad actualizada."),
      }
    );
  };

  const handleRemove = (id) => {
    router.delete(route("cart.remove", id), {
      preserveScroll: true,
      onSuccess: () => showToast("Producto eliminado."),
    });
  };

  const handleClear = () => {
    router.delete(route("cart.clear"), {
      preserveScroll: true,
      onSuccess: () => showToast("Carrito vaciado."),
    });
  };

  const openOrderPdf = (id) =>
    window.open(route("orders.exportPdf", id), "_blank");

  return (
    <AppLayout breadcrumbs={[{ title: "Carrito y Compras", href: "/cart" }]}>
      <Head title="Carrito y Mis Compras" />

      <div className="max-w-7xl mx-auto mt-6 text-yellow-200">

        <h1 className="text-3xl font-bold mb-6 text-yellow-400">
          Carrito de Compras
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-yellow-300 italic mb-10">
            Tu carrito está vacío<br />
            <Link href={route("products.index")}><u>Volver a la tienda</u></Link>
          </p>
        ) : (
          <>
            {/* CONTADOR */}
            {timeLeft !== null && (
              <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-600 text-yellow-300 text-center rounded-lg font-semibold">
                El carrito expira en:{" "}
                <span className="text-yellow-400">
                  {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
                </span>
              </div>
            )}

            {/* -------------------- */}
            {/* TABLA + TOAST LATERAL */}
            {/* -------------------- */}
            <div className="relative">

              {/* TOAST CENTRADO AL COSTADO */}
              {toastMsg && (
                <div className="absolute right-[-180px] top-1/2 -translate-y-1/2 z-50">
                  <Toast
                    message={toastMsg.message}
                    type={toastMsg.type}
                  />
                </div>
              )}

              <Card className="bg-zinc-900 p-6 border border-yellow-700 mb-10">
                <table className="w-full text-left border-collapse border border-yellow-700">
                  <thead>
                    <tr className="bg-zinc-800 text-yellow-400">
                      <th className="p-2 border border-yellow-700">Producto</th>
                      <th className="p-2 border border-yellow-700">Cantidad</th>
                      <th className="p-2 border border-yellow-700">Precio</th>
                      <th className="p-2 border border-yellow-700">Subtotal</th>
                      <th className="p-2 border border-yellow-700">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-800 transition">
                        <td className="p-2 border border-yellow-700 text-yellow-300 font-semibold">
                          {item.product.name}
                          {item.variant && (
                            <span className="text-yellow-500"> ({item.variant.name})</span>
                          )}
                        </td>

                        <td className="p-2 border border-yellow-700">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdate(item.id, parseInt(e.target.value))
                            }
                            className="w-16 text-white bg-zinc-800 px-2 py-1 rounded text-center"
                          />
                        </td>

                        <td className="p-2 border border-yellow-700">
                          ${item.product.price}
                        </td>

                        <td className="p-2 border border-yellow-700">
                          ${item.subtotal}
                        </td>

                        <td className="p-2 border border-yellow-700 text-center">
                          <Button
                            onClick={() => handleRemove(item.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-6">
                  <Button
                    onClick={handleClear}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Vaciar carrito
                  </Button>

                  <span className="text-2xl font-bold text-yellow-400">
                    Total: ${total}
                  </span>

                  <Link href={route("checkout.index")}>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                      Comprar
                    </Button>
                  </Link>
                </div>
              </Card>

            </div>
          </>
        )}

        {/* HISTORIAL */}
        {orders.data.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">
              Historial de Compras
            </h2>

            <Card className="bg-zinc-900 p-6 border border-yellow-700">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-yellow-700">
                  <thead>
                    <tr className="bg-zinc-800 text-yellow-400">
                      <th className="p-2 border border-yellow-700">N°</th>
                      <th className="p-2 border border-yellow-700">Fecha</th>
                      <th className="p-2 border border-yellow-700">Pago</th>
                      <th className="p-2 border border-yellow-700">Estado</th>
                      <th className="p-2 border border-yellow-700">Total</th>
                      <th className="p-2 border border-yellow-700 text-center">PDF</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.data.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => router.visit(route("orders.show", order.id))}
                        className="hover:bg-zinc-800 cursor-pointer transition"
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
                            onClick={(e) => {
                              e.stopPropagation();
                              openOrderPdf(order.id);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold border border-yellow-700"
                          >
                            PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINACIÓN */}
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
        )}
      </div>
    </AppLayout>
  );
}
