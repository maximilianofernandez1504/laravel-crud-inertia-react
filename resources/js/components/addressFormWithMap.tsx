import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrección de íconos de Leaflet
if (typeof L.Icon.Default.prototype._getIconUrl !== 'function') {
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

export interface addressData {
    id: number | null;
    label: string;
    province: string;
    locality: string;
    address: string; 
    postal_code: string;
    country: string;
    latitude: number | null; 
    longitude: number | null; 
}

interface LocationMarkerProps {
    currentLat: number | string | null | undefined;
    currentLng: number | string | null | undefined;
    onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({
  currentLat,
  currentLng,
  onLocationSelect,
}) => {
  const defaultPosition: [number, number] = [-24.7821, -65.4232];
  const parsedLat = currentLat ?? defaultPosition[0];
  const parsedLng = currentLng ?? defaultPosition[1];

  const [position, setPosition] = useState<[number, number]>([parsedLat, parsedLng]);

  const map = useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
      // 👇 centramos sin reiniciar zoom
      map.panTo([lat, lng]);
    },
  });

  useEffect(() => {
    if (currentLat && currentLng) {
      setPosition([currentLat, currentLng]);
    }
  }, [currentLat, currentLng]);

  return <Marker position={position} />;
};


interface addressFormProps {
    address: addressData;
    onChange: (field: keyof addressData, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
}

const addressFormWithMap: React.FC<addressFormProps> = ({
    address,
    onChange,
    onSave,
    onCancel,
}) => {
    const isFormValid =
        !!address.label &&
        !!address.address &&
        !!address.province &&
        !!address.locality &&
        !!address.country &&
        address.latitude !== null &&
        address.longitude !== null;

    const handleLocationSelect = (lat: number, lng: number) => {
        onChange("latitude", lat);
        onChange("longitude", lng);
    };

    const initialLat = address.latitude !== null && address.latitude !== undefined ? Number(address.latitude) : -24.7821;
    const initialLng = address.longitude !== null && address.longitude !== undefined ? Number(address.longitude) : -65.4232;

    const latValid = address.latitude !== null && !Number.isNaN(Number(address.latitude)) && isFinite(Number(address.latitude));
    const lngValid = address.longitude !== null && !Number.isNaN(Number(address.longitude)) && isFinite(Number(address.longitude));

    return (
        <div className="p-4 border border-yellow-500 rounded space-y-4 bg-zinc-800">
            <h3 className="text-xl font-bold">
                {address.id ? "Editar Dirección" : "Crear Nueva Dirección"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="block mb-1 font-semibold">Etiqueta</label>
                    <Input value={address.label} onChange={(e) => onChange("label", e.target.value)} className="bg-zinc-700 text-yellow-400" required />

                    <label className="block mb-1 font-semibold">Dirección Completa</label>
                    <Input value={address.address} onChange={(e) => onChange("address", e.target.value)} className="bg-zinc-700 text-yellow-400" required />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block mb-1 font-semibold">Provincia</label>
                            <Input value={address.province} onChange={(e) => onChange("province", e.target.value)} className="bg-zinc-700 text-yellow-400" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Localidad</label>
                            <Input value={address.locality} onChange={(e) => onChange("locality", e.target.value)} className="bg-zinc-700 text-yellow-400" required />
                        </div>
                    </div>
                    <label className="block mb-1 font-semibold">País</label>
                    <Input value={address.country} onChange={(e) => onChange("country", e.target.value)} className="bg-zinc-700 text-yellow-400" required />
                </div>

                <div className="space-y-3">
                    <label className="block font-semibold">Marca en el Mapa</label>
                    <p className="text-sm text-yellow-400 mb-2">Haz click en el mapa para marcar la ubicación exacta de la dirección.</p>
                    
                    <div style={{ height: '300px', width: '100%' }} className="rounded overflow-hidden">
                        <MapContainer
                            center={[address.latitude ?? -24.7821, address.longitude ?? -65.4232]}
                            zoom={15}
                            minZoom={6}
                            maxZoom={18}
                            zoomControl={true}
                            style={{ height: "100%", width: "100%" }}
                        >

                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker 
                                currentLat={address.latitude}
                                currentLng={address.longitude}
                                onLocationSelect={handleLocationSelect}
                            />
                        </MapContainer>
                    </div>

                    <div className="pt-2">
                        {latValid && lngValid ? (
                            <p className="text-green-400 text-sm">
                                ✅ Ubicación marcada: Lat: {Number(address.latitude).toFixed(6)}, Lng: {Number(address.longitude).toFixed(6)}
                            </p>
                        ) : (
                            <p className="text-red-400 text-sm">
                                📍 Por favor, haz click en el mapa para establecer la latitud y longitud.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={!isFormValid}
                    className={`font-semibold ${isFormValid ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                >
                    Guardar Dirección
                </Button>
                <Button
                    type="button"
                    onClick={onCancel}
                    className="bg-red-600 text-white font-semibold"
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
};

export default addressFormWithMap;
