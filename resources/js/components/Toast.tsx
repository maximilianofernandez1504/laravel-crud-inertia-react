import React, { useEffect, useState } from "react";

interface ToastProps {
  message?: string | null;
  type?: "success" | "error";
  duration?: number;
}

export default function Toast({ message, type = "success", duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible || !message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg font-semibold text-white transition-all duration-300 transform
      ${type === "success" ? "bg-yellow-500" : "bg-red-500"} animate-fade-in`}
    >
      {message}

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
