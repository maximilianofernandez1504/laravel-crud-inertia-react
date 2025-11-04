import React, { useEffect, useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button,} from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  id: number;
  product: { id: number; name: string; price: number };
  variant?: { name: string };
  quantity: number;
  subtotal: number;
}

export default function Index() {
  const { cart, flash, total } = usePage<{
    cart: CartItem[];
    total: number;
    flash?: { status: string; message: string };
  }>().props;

  const [message, setMessage] = useState<{ status: string; message: string } | null>(null);

  useEffect(() => {
    if (flash?.message) {
      setMessage({ status: flash.status, message: flash.message });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const handleUpdate = (id: number, quantity: number) => {
    if (quantity <= 0) {
      router.put(route("cart.update", id), { quantity: 0 });
    } else {
      router.put(route("cart.update", id), { quantity });
    }
  };

  const handleRemove = (id: number) => {
    router.delete(route("cart.remove", id));
  };

  const handleClear = () => {
    router.delete(route("cart.clear"));
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Carrito", href: "/cart" }]}>
      <div className="relative">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400">Carrito de Compras</h1>

        <AnimatePresence>
          {message && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 mb-4 text-center rounded-xl font-semibold ${
                message.status === "success"
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400"
                  : "bg-red-500/20 text-red-300 border border-red-400"
              }`}
            >
              {message.message}
            </motion.div>
          )}
        </AnimatePresence>

        {cart.length === 0 ? (
          <p className="text-center text-yellow-300 italic">
            Tu carrito de compras aun está vacío
            <br></br>Muchos productos te esperan en nuestra tienda
          </p>
        ) : (
          <>
            <table className="w-full text-left border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-900 text-yellow-400">
                  <th className="p-2 border border-gray-700">Producto</th>
                  <th className="p-2 border border-gray-700">Cantidad</th>
                  <th className="p-2 border border-gray-700">Precio</th>
                  <th className="p-2 border border-gray-700">Subtotal</th>
                  <th className="p-2 border border-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800 transition">
                    <td className="p-2 border border-gray-700">
                      <span className="text-yellow-300 font-semibold">{item.product.name}</span>
                      {item.variant && (
                        <span className="text-yellow-500"> ({item.variant.name})</span>
                      )}
                    </td>
                    <td className="p-2 border border-gray-700">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdate(item.id, parseInt(e.target.value) || 0)
                        }
                        className="w-16 text-white px-2 py-1 rounded text-center"
                      />
                    </td>
                    <td className="p-2 border border-gray-700">${item.product.price}</td>
                    <td className="p-2 border border-gray-700">${item.subtotal}</td>
                    <td className="p-2 border border-gray-700 text-center">
                      <Button
                        variant="destructive"
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

            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={handleClear}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Vaciar carrito
              </Button>
              <div className="text-right font-bold text-2xl text-yellow-400">
                Total: ${total}
              </div>
              <Link href={route("checkout.index")}>
                <Button  
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Comprar
                </Button>
              </Link>  
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
