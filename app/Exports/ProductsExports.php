<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;


class ProductsExport implements FromCollection, WithHeadings, WithColumnWidths
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function headings(): array
    {
        return [
            'ID',
            'Nombre',
            'Description',
            'Stock',
            'Precio',
            'Estado',
            'Creado el',
            'Modificado el',
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 10,
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
        
        return Product::all();
    }
}