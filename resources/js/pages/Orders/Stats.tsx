import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Head } from '@inertiajs/react';


interface SoldItem {
    id: string;
    name: string; 
    variant?: string;
    total_sold: number; 
}

interface PieDataEntry {
    name: string;
    value: number; 
    totalSold: number;
}

interface StatsProps {
    allSoldItems: SoldItem[];
    globalTotalSold: number;
}



const COLORS = ["#FFD700", "#FF8800", "#FF4444", "#44FF88", "#8888FF", "#00FFFF", "#FF00FF", "#007BFF"];


export default function Stats({ allSoldItems, globalTotalSold }: StatsProps) {

   
    const TOP_ITEMS_COUNT = 4;
    
   
    const topItems = allSoldItems.slice(0, TOP_ITEMS_COUNT);

    
    const topItemsTotalSold = topItems.reduce((sum, p) => sum + p.total_sold, 0);

    let pieData: PieDataEntry[] = [];

    
    if (topItemsTotalSold > 0) {
        pieData = topItems.map((p) => {
            
            const sliceValue = (p.total_sold / topItemsTotalSold) * 100; 
            
            return {
                name: p.variant ? `${p.name} (${p.variant})` : p.name,
                totalSold: p.total_sold,
                value: sliceValue,
            };
        });
    }





    const CustomTooltip = ({ active, payload }: { active: boolean, payload: any }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload as PieDataEntry;
           
            const realPercentage = globalTotalSold > 0 ? (data.totalSold / globalTotalSold) * 100 : 0;
            
            if (data) {
                return (
                    <div className="bg-zinc-700 p-3 rounded-xl border border-yellow-500 shadow-xl text-yellow-100">
                        <p className="font-bold text-lg mb-1">{data.name}</p>
                        <p className="text-sm">Unidades Vendidas: <span className="font-extrabold text-white">{data.totalSold.toLocaleString()}</span></p>
                        
                    </div>
                );
            }
        }
        return null;
    };

    // --- RENDERIZADO DE ETIQUETAS ---
    const renderLabel = ({ name, value, percent }: { name: string, value: number, percent: number }) => {
        // Muestra la etiqueta si la porción es lo suficientemente grande (ej: > 5% del gráfico)
        if (value > 5) {
            return `${value.toFixed(0)}%`; // Mostrar el valor del gráfico (que ahora es el % del Top 4)
        }
        return null;
    };


    return (
        <AppLayout>
            <Head title="Estadísticas de Ventas" />
            <AdminLayout>
                <div className="min-h-screen bg-zinc-950 text-white p-4">

                    <div className="max-w-7xl mx-auto mt-10 p-4 sm:p-6 lg:p-8">
                    <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 tracking-wider border-b-2 border-yellow-700 pb-2">
                        📊 Estadísticas de Ventas (Total Vendido: {globalTotalSold.toLocaleString()})
                    </h1>

                    {globalTotalSold === 0 ? (
                        <div className="text-zinc-500 text-center text-xl p-10 bg-zinc-800 rounded-2xl">
                            No hay datos de ventas válidos disponibles para mostrar estadísticas.
                        </div>
                    ) : (
                        <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-yellow-800/50 flex flex-col md:flex-row items-center md:items-start gap-12">

                            {/* Gráfico de Torta (Pie Chart) */}
                            <div className="w-full md:w-2/3 min-h-[450px] flex items-center justify-center">
                            
                                <ResponsiveContainer width="100%" height={450}>
                                    <PieChart>
                                        <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={180} 
                                        innerRadius={80} 
                                        labelLine={false}
                                        label={renderLabel}
                                        paddingAngle={3}
                                        >
                                        {/* Solo usamos los primeros TOP_ITEMS_COUNT colores */}
                                        {pieData.map((entry, index) => (
                                            <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % TOP_ITEMS_COUNT]} // Limitamos el índice al número de items
                                            className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                                            />
                                        ))}
                                        </Pie>
                                        <Tooltip content={CustomTooltip} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Leyenda */}
                            <div className="flex flex-col gap-4 w-full md:w-1/3 p-4 bg-zinc-800/50 rounded-xl">
                                <h3 className="text-xl font-bold text-yellow-400 mb-2 border-b border-yellow-700 pb-1">Top {TOP_ITEMS_COUNT} Productos Vendidos</h3>
                                {pieData.map((entry, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700/50 transition duration-150">
                                    <div className="flex items-center gap-3">
                                        <div
                                        className="w-5 h-5 rounded-full shadow-md"
                                        style={{ backgroundColor: COLORS[index % TOP_ITEMS_COUNT] }}
                                        />
                                        <span className="text-yellow-200 font-medium">
                                        {entry.name}
                                        </span>
                                    </div>
                                   
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}