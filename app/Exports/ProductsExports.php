<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class ProductsExports implements FromCollection, WithHeadings, WithColumnWidths
{
    public function headings(): array
    {
        return [
            'ID',
            'Nombre',
            'Descripción',
            'Stock',
            'Precio xU',
            'Estado',
            'Creado el',
            'Modificado el',
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 7,
            'B' => 20,
            'C' => 35,
            'D' => 8,
            'E' => 10,
            'F' => 20,
            'G' => 20,
            'H' => 20,
        ];
    }

    public function collection()
   { 
    return Product::select([
        'id',
        'name',
        'description',
        'stock',
        'price',
        'state',
        'created_at',
        'updated_at',
    ])->get()
    ->map(function ($product) {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'stock' => $product->stock,
            'price' => $product->price,
            'state' => $product->state == 1 ? 'Activo' : 'Desactivado',
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ];
    });
    }
}