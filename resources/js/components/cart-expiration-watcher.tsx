import { usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CartExpirationWatcher() {
  const { cart_updated_at, cart_expiration } = usePage().props;

  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!cart_updated_at || !cart_expiration) return;

    const updatedAt = new Date(cart_updated_at);
    const expiryTime = new Date(updatedAt.getTime() + cart_expiration * 60000);

    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = expiryTime.getTime() - now.getTime();

      if (diffMs <= 0 && !triggered) {
        setTriggered(true);

        router.delete(route("cart.expire"), {
          preserveScroll: true,
          onSuccess: () => {
            toast.warning("⚠ Tu carrito ha expirado automáticamente.");

            // Refrescar la página actual si el usuario está viendo el carrito
            router.reload();
          },
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cart_updated_at, cart_expiration, triggered]);

  return null;
}
