import React, { useEffect, useState } from "react";

interface ToastProps {
  message?: string | null;
  type?: "success" | "error";
  duration?: number;
  mode?: "fixed" | "inline"; // <-- Nuevo
  className?: string; // opcional para estilos extra
}

export default function Toast({
  message,
  type = "success",
  duration = 3000,
  mode = "fixed",
  className = "",
}: ToastProps) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible || !message) return null;

  const base = `px-5 py-3 rounded-lg shadow-lg font-semibold text-white transition-all duration-300 transform animate-fade-in ${className}`;
  const color = type === "success" ? "bg-yellow-500" : "bg-red-500";

  // Si es fixed, mantenemos la posicion en esquina; si es inline, devolvemos solo el contenedor
  if (mode === "fixed") {
    return (
      <div className={`${base} ${color} fixed bottom-6 right-6 z-50`}>
        {message}
        <style>{`
          @keyframes fadeIn { 0% { opacity:0; transform:translateY(10px)} 100%{opacity:1; transform:translateY(0)} }
          .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        `}</style>
      </div>
    );
  }

  // mode === "inline"
  return (
    <div className={`${base} ${color} z-50`}>
      {message}
      <style>{`
        @keyframes fadeIn { 0% { opacity:0; transform:translateY(10px)} 100%{opacity:1; transform:translateY(0)} }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
