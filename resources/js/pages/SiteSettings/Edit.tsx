// resources/js/pages/SiteSettings/Edit.tsx

import { useForm, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react"; 
import AddressFormWithMap, { addressData } from "@/components/addressFormWithMap"; 
import AdminLayout from "@/layouts/admin-layout";

interface SiteAddress {
    id: number;
    label: string | null;
    address_line: string | null; 
    city: string | null;
    state: string | null; 
    country: string | null;
    postal_code: string | null;
    latitude: number | null;
    longitude: number | null;
}

interface Props {
    settings: any;
    addresses: SiteAddress[];
}

export default function Edit({ settings, addresses }: Props) {

    const initialAddressList: addressData[] = addresses.map((a) => ({
        id: a.id,
        label: a.label || "",
        province: a.state || "",
        locality: a.city || "",
        address: a.address_line || "",
        postal_code: a.postal_code || "",
        country: a.country || "Argentina",
        latitude: a.latitude || null,
        longitude: a.longitude || null,
    }));
    
   
    const [addressList, setAddressList] = useState<addressData[]>(initialAddressList);

   
    const { data, setData, put, processing } = useForm({
        ...settings,
        addresses: initialAddressList, 
    });
    
  
    useEffect(() => {
        setData('addresses', addressList);
    }, [addressList]); 


    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    
    const [formData, setFormData] = useState<addressData>({
        id: null,
        label: "",
        province: "",
        locality: "",
        address: "",
        postal_code: "",
        country: "Argentina",
        latitude: null, 
        longitude: null, 
    });

    
   
    const openForm = (addr?: addressData, index: number | null = null) => {
    setEditingIndex(index);
    setIsFormOpen(true);

    const defaultLat = -24.7821;
    const defaultLng = -65.4232;

    if (addr) {
        
        const lat = addr.latitude !== null && addr.latitude !== undefined ? Number(addr.latitude) : defaultLat;
        const lng = addr.longitude !== null && addr.longitude !== undefined ? Number(addr.longitude) : defaultLng;

        setFormData({ 
            ...addr,
            latitude: isFinite(lat) ? lat : defaultLat,
            longitude: isFinite(lng) ? lng : defaultLng,
        });
    } else {
        setFormData({
            id: null,
            label: "",
            province: "",
            locality: "",
            address: "",
            postal_code: "",
            country: "Argentina",
            latitude: defaultLat,
            longitude: defaultLng,
        });
    }
};


    const updateFormField = (field: keyof addressData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const saveForm = () => {
        let updated = [...addressList];

        
        if (formData.latitude === null || formData.longitude === null) {
             alert("Debe seleccionar una ubicación en el mapa.");
             return;
         }

        if (editingIndex !== null) {
            updated[editingIndex] = formData;
        } else {
            updated.push(formData);
        }

        setAddressList(updated); 
        setIsFormOpen(false); 
        setEditingIndex(null);
    };

    const cancelForm = () => {
        setIsFormOpen(false);
        setEditingIndex(null);
    };

    const removeAddress = (index: number) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta dirección?")) {
            setAddressList(addressList.filter((_, i) => i !== index)); 
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("sitesettings.update")); 
    };


    return (
        <AppLayout>
            <AdminLayout>
                <Head title="Configuración" />
                <div className="max-w-5xl mx-auto mt-8 text-yellow-200">
                    <Card className="bg-zinc-900 border border-yellow-700">
                        <CardContent className="p-6 space-y-8">
                            <h1 className="text-2xl font-bold">Configuración del Sitio</h1>
                            
                            {/* FORMULARIO PRINCIPAL */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6 items-center">
                                
                                    <label>Horas de reserva</label>
                                    <Input className="bg-zinc-800 text-yellow-400" type="number" value={data.reservation_hours} onChange={(e) => setData("reservation_hours", e.target.value)} />
                                    <label>Minutos de expiración del carrito</label>
                                    <Input className="bg-zinc-800 text-yellow-400" type="number" value={data.cart_expiration_minutes} onChange={(e) => setData("cart_expiration_minutes", e.target.value)} />
                                    <label>Mínimo de compra</label>
                                    <Input className="bg-zinc-800 text-yellow-400" type="number" value={data.minimum_purchase} onChange={(e) => setData("minimum_purchase", e.target.value)} />
                                    <label>Email de contacto</label>
                                    <Input className="bg-zinc-800 text-yellow-400" type="email" value={data.contact_email} onChange={(e) => setData("contact_email", e.target.value)} />
                                    <label>Instagram</label>
                                    <Input className="bg-zinc-800 text-yellow-400" value={data.instagram} onChange={(e) => setData("instagram", e.target.value)} />
                                    <label>WhatsApp</label>
                                    <Input className="bg-zinc-800 text-yellow-400" value={data.whatsapp_number} onChange={(e) => setData("whatsapp_number", e.target.value)} />
                                </div>
                                <Button disabled={processing} className="bg-yellow-500 text-black font-semibold">
                                    Guardar cambios (Configuración y Direcciones)
                                </Button>
                            </form>

                        
                            <hr className="border-yellow-700" />
                            <div>
                                <h2 className="text-xl font-bold mb-3">Direcciones del local</h2>
                                <table className="w-full text-yellow-200 border border-yellow-700">
                                    <thead className="bg-zinc-800">
                                        <tr>
                                            <th className="p-2 border border-yellow-700">Etiqueta</th>
                                            <th className="p-2 border border-yellow-700">Dirección</th>
                                            <th className="p-2 border border-yellow-700">Localidad (Prov.)</th>
                                            <th className="p-2 border border-yellow-700">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addressList.map((addr, index) => (
                                            <tr key={addr.id || index} className="text-center bg-zinc-900">
                                                <td className="p-2 border border-yellow-700">{addr.label}</td>
                                                <td className="p-2 border border-yellow-700">{addr.address}</td>
                                                <td className="p-2 border border-yellow-700">{addr.locality} ({addr.province})</td>
                                                <td className="p-2 border border-yellow-700 space-x-2">
                                                    <Button type="button" className="bg-blue-600 text-white" onClick={() => openForm(addr, index)} disabled={isFormOpen}>Editar</Button>
                                                    <Button type="button" className="bg-red-600 text-white" onClick={() => removeAddress(index)} disabled={isFormOpen}>Eliminar</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <Button
                                    type="button"
                                    onClick={() => openForm()}
                                    disabled={isFormOpen}
                                    className={`mt-4 font-semibold text-black transition-colors duration-200 ${
                                        isFormOpen
                                        ? "bg-yellow-600 opacity-50 cursor-not-allowed"
                                        : "bg-yellow-500 hover:bg-yellow-400"
                                    }`}
                                >
                                    + Crear nueva dirección
                                </Button>

                            
                                {isFormOpen && (
                                    <div className="mt-6">
                                        <AddressFormWithMap
                                            address={formData}
                                            onChange={updateFormField}
                                            onSave={saveForm}
                                            onCancel={cancelForm}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        </AppLayout>

    );
}