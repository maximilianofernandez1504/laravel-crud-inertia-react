import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import Carousel from "@/components/carousel";
import { usePermissions } from "@/hooks/use-permissions";

interface Media {
  id: number;
  file_path: string;
  file_type: "image" | "video";
  is_in_carousel: boolean;
}

interface UrlItem {
  id: number;
  url: string;
  title?: string;
}

interface About {
  id: number;
  title: string;
  subtitle?: string;
  content?: string;
  footer_text?: string;
  media?: Media[];
  urls?: UrlItem[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Sobre Nosotros", href: "/about-us" }];

export default function Index({ about }: { about: About }) {
  const { can } = usePermissions();
  const carouselImages = (about.media || []).filter(
    (m) => m.file_type === "image" && m.is_in_carousel
  );
  const images = (about.media || []).filter(
    (m) => m.file_type === "image" && !m.is_in_carousel
  );
  const videos = (about.media || []).filter((m) => m.file_type === "video");

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-black text-yellow-400 px-6 py-8">
        {can("viewall") && (
          <div className="flex justify-end w-full mb-6">
            <Link href={route("aboutus.edit")}>
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg">
                Editar página
              </button>
            </Link>
          </div>
        )}

        {/* Carrusel */}
        {carouselImages.length > 0 && (
          <div className="mb-10">
            <Carousel
              images={carouselImages.map((c) => ({image_path: c.file_path,}))}
              autoPlay
              height="h-90"
              fitMode="contain"
            />
          </div>
        )}

        <h1 className="text-center text-3xl font-bold mb-2">{about.title}</h1>
        <p className="text-center text-lg text-gray-300 mb-6">{about.subtitle}</p>

        <div className="p-6 rounded-lg max-w-5xl mx-auto text-gray-300 whitespace-pre-line mb-10">
          {about.content}
        </div>

        {/* IMÁGENES */}
        {images.length > 0 && (
          <>
            <h3 className="text-center text-xl text-yellow-400 font-semibold mb-4">
              Imágenes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center mb-10">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={`http://localhost:5173/${img.file_path}`}
                  alt="about"
                  className="w-full h-48 object-cover rounded-lg border border-yellow-600"
                />
              ))}
            </div>
          </>
        )}

        {/* VIDEOS */}
        {videos.length > 0 && (
          <>
            <h3 className="text-center text-xl text-yellow-400 font-semibold mb-4">
              Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center mb-10">
              {videos.map((v) => (
                <video
                  key={v.id}
                  src={`http://localhost:5173/${v.file_path}`}
                  controls
                  className="w-full h-56 rounded-lg border border-yellow-600 object-cover"
                />
              ))}
            </div>
          </>
        )}

        {/* YOUTUBE */}
        {about.urls && about.urls.length > 0 && (
          <>
            <h3 className="text-center text-xl text-yellow-400 font-semibold mb-4">
              YouTube
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center mb-10">
              {about.urls.map((u) => (
                <iframe width="560"
                 height="315" 
                  key={u.id}
                  src={u.url}
                  title={u.title || u.url}
                  className="w-full h-56 rounded-lg border border-yellow-600"
                   
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                />
              ))}
            </div>
          </>
        )}

        <p className="text-center text-gray-300 mt-6">{about.footer_text}</p>
      </div>
    </AppLayout>
  );
}
