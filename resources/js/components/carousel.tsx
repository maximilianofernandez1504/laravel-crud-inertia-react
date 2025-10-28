import { useState, useEffect } from "react";

interface CarouselProps {
  images: { image_path: string }[]; 
  autoPlay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  enableLightbox?: boolean;
  height?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoPlay = true,
  interval = 3000,
  pauseOnHover = true,
  enableLightbox = true,
  height = "h-64",
}) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

 
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, currentIndex]);


  if (images.length === 0) {
    return <p className="text-center text-gray-500">Sin imágenes disponibles</p>;
  }

  return (
    <div
      className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-lg"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, i) => (
            <img
                key={i}
                src={`http://localhost:5173/${img.image_path}`}
                className="w-full flex-shrink-0 object-cover h-64 sm:h-80 md:h-[400px] lg:h-[500px]"
                alt={`Imagen ${i + 1}`}
                onClick={() => enableLightbox && setIsLightboxOpen(true)} 
            />
            )
          )
        }
      </div>

      {/* Botones */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-gray-800"
        aria-label="Anterior"
      >
        ❮
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-gray-800"
        aria-label="Siguiente"
      >
        ❯
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              i === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Lightbox */}
      {enableLightbox && isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setIsLightboxOpen(false)}
        >
          <img
            src={`http://localhost:5173/${images[currentIndex].image_path}`}
            alt="Imagen ampliada"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Carousel;
