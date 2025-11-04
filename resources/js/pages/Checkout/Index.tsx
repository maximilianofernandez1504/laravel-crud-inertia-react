import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CartItem = {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  variant?: {
    id: number;
    name: string;
  } | null;
  quantity: number;
  subtotal: number;
};

type CheckoutProps = {
  cart: CartItem[];
  total: number;
};

export default function Checkout({ cart, total }: CheckoutProps) {
  const { data, setData, post, processing } = useForm({
    payment_method: "efectivo",
    paid: false,
  });

  const [interest, setInterest] = useState(0);
  const [finalTotal, setFinalTotal] = useState(total);

  // 🔹 Calcular interés si se paga con tarjeta
  useEffect(() => {
    if (data.payment_method === "tarjeta") {
      const newInterest = total * 0.1;
      setInterest(newInterest);
      setFinalTotal(total + newInterest);
    } else {
      setInterest(0);
      setFinalTotal(total);
    }
  }, [data.payment_method, total]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("checkout.store"), {
      preserveScroll: true,
    });
  };

  const handleCancel = () => {
    router.visit(route("cart.index"));
  };

  return (
    <AppLayout>
      <Head title="Finalizar compra" />

      <div className="max-w-4xl mx-auto mt-10 text-yellow-200">
        <h1 className="text-3xl font-bold mb-6 text-center">Finalizar compra</h1>

        {/* 🧾 Lista de productos */}
        <Card className="bg-black text-yellow-300 border-yellow-700">
          <CardContent className="p-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b border-yellow-800 py-2"
              >
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  {item.variant && (
                    <p className="text-sm opacity-75">
                      Variante: {item.variant.name}
                    </p>
                  )}
                  <p className="text-sm opacity-75">
                    {item.quantity} × ${item.product.price}
                  </p>
                </div>
                <div className="text-right">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-4 pt-4 border-t border-yellow-800">
              <p>Subtotal:</p>
              <p>${total.toFixed(2)}</p>
            </div>

            {interest > 0 && (
              <div className="flex justify-between mt-2 text-yellow-400">
                <p>Interés (10%):</p>
                <p>${interest.toFixed(2)}</p>
              </div>
            )}

            <div className="flex justify-between mt-2 font-bold text-yellow-300 text-lg">
              <p>Total final:</p>
              <p>${finalTotal.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* 💳 Formulario */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Selector de medio de pago */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Método de pago:
            </label>
            <select
              value={data.payment_method}
              onChange={(e) => setData("payment_method", e.target.value)}
              className="bg-black border border-yellow-700 text-yellow-200 rounded-lg px-3 py-2 w-full"
            >
              <option value="efectivo">Transferencia</option>
              <option value="qr">Mercado Pago</option>
              <option value="tarjeta">Tarjeta de crédito</option>
            </select>
          </div>

          {/* Checkbox de pago */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data.paid}
              onChange={(e) => setData("paid", e.target.checked)}
              id="paid"
              className="accent-yellow-400"
            />
            <label htmlFor="paid" className="text-sm">
              Pagar ahora
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              className="bg-black text-yellow-300 border-yellow-700 hover:bg-yellow-900"
              onClick={handleCancel}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={processing}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
            >
              {processing ? "Procesando..." : "Comprar"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
