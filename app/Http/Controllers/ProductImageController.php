<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class ProductImageController extends Controller
{
    //
    public function index($productId)
    {
        
    }

    public function upload(Request $request)
    {
        
    }
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'image_path' => 'required|string',
        ]);
        $archivo= $request->file('image_path');
        $nombreArchivo= time().'-'.$archivo->getClientOriginalName();
        $ruta= $archivo->storeAs('public/product', $nombreArchivo);
        $rutaPublica= 'storage/app/public/'.$nombreArchivo;
        ProductImage::create([
            'product_id' => $request->input('product_id'),
            'image_path' => $rutaPublica,
            'state' => 1,
        ]);
    }

    public function destroy($id)
    {
        
    }


}




// namespace App\Http\Controllers;

// use App\Models\ProductImage; 
// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use Illuminate\Support\Str;

// class ProductImageController extends Controller
// {
//     /**
//      * Display a listing of the resource.
//      */
//     public function index()
//     {
//         //
//     }

//     /**
//      * Show the form for creating a new resource.
//      */
//     public function create()
//     {
//         //
//     }

//     /**
//      * Store a newly created resource in storage.
//      */
//     public function store(Request $request)
//     {
//         // Validar que se envía un archivo
//         $request->validate([
//             'product_id' => 'required|exists:products,id',
//             'image_path' => 'required|file|image|max:5120', // file image
//             'active' => 'nullable|boolean',
//         ]);

//         $file = $request->file('image_path');

//         // Nombre original sanitizado (opcional timestamp para evitar colisiones)
//         $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
//         $safeName = preg_replace('/[^A-Za-z0-9\-\._]/', '_', $originalName);
//         $filename = $safeName . '.' . $file->getClientOriginalExtension();

//         // Guardar en storage/app/public/products (disk 'public')
//         $storedPath = $file->storeAs('products', $filename, 'public'); // devuelve 'products/xxx.ext'

//         // Construir la ruta que quieres guardar en DB: 'app/public/products/xxx.ext'
//         $dbPath = 'app/public/' . $storedPath;

        
//         $image = ProductImage::create([
//             'product_id' => $request->product_id,
//             'image_path' => $dbPath,
//             'active' => $request->input('active', 1),
//         ]);

//         return response()->json($image, 201);
//     }

//     /**
//      * Display the specified resource.
//      */
//     public function show(ProductImage $product_image)
//     {
//         //
//     }

//     /**
//      * Show the form for editing the specified resource.
//      */
//     public function edit(ProductImage $product_image)
//     {
//         //
//     }

//     /**
//      * Update the specified resource in storage.
//      */
//     public function update(Request $request, ProductImage $product_image)
//     {
//         //
//     }

//     /**
//      * Remove the specified resource from storage.
//      */
//     public function destroy(ProductImage $product_image)
//     {
//         //
//     }
// }


