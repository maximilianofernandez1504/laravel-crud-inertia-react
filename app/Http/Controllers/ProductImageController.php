<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class ProductImageController extends Controller
{
    //
    public function index($productId)
    {
        $images = ProductImage::where('product_id', $productId)->get();
        return response()->json($images);
    }

    public function upload(Request $request)
    {
        //
    }


    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'image_path' => 'required|image|mimes:jpg,jpeg,png|max:4096',
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
        return response()->json([
            'message' => 'Imagen subida correctamente',
            'image' => $image,
        ]);
        
    }

    public function destroy($id)
    {
        $image = ProductImage::findOrFail($id);
        Storage::disk('public')->delete($image->image_path);
        $image->delete();
        return response()->json(['message' => 'Imagen eliminada correctamente']);
    }   
}


