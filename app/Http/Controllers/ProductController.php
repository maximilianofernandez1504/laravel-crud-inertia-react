<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product=Product::paginate(12);
        return Inertia::render('products/index', [
            'products' => $product,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('products/create', [
            'products' => new Product()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        Product::create($validated);

        return redirect()->route('products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return inertia('products/edit', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        $product->update($validated);

        return redirect()->route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index');
    }
}


// namespace App\Http\Controllers;

// use App\Models\Product;
// use App\Http\Requests\StoreProductRequest;
// use App\Http\Requests\UpdateProductRequest;
// use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Str;
// use Illuminate\Support\Facades\Response;

// class ProductController extends Controller
// {
//     /**
//      * Display a listing of the resource.
//      */
//     public function index()
//     {
//         return inertia('products/index', [
//             'products' => Product::latest()->paginate(10)
//         ]);
//     }

//     /**
//      * Show the form for creating a new resource.
//      */
//     public function create()
//     {
//         return inertia('products/create', [
//             'products' => new Product()
//         ]);
//     }

//     /**
//      * Store a newly created resource in storage.
//      */
//     public function store(StoreProductRequest $request)
//     {
//         $validated = $request->validated();

//         $product = Product::create($validated);

//         if ($request->hasFile('images')) {
//             foreach ($request->file('images') as $file) {
//                 $path = $file->store('products', 'public');
//                 $product->images()->create(['image_path' => $path]);
//             }
//         }

//         return redirect()->route('products.index');
//     }

//     /**
//      * Display the specified resource.
//      */
//     public function show(Product $product)
//     {
//         //
//     }

//     /**
//      * Show the form for editing the specified resource.
//      */
//     public function edit(Product $product)
//     {
//         $product->load('images');
            
        
//         $product->images = $product->images->map(function ($img) {
//             $attrs = $img->toArray();
            

//             $imgPath = $attrs['image_path'] ?? $attrs['path'] ?? $attrs['file_path'] ?? $attrs['filename'] ?? $attrs['url'] ?? null;
            
//             if (!$imgPath) {
//                 return ['id' => $img->id, 'url' => null, 'attrs' => $attrs];
//             }
            
//             if (Str::startsWith($imgPath, ['http'])) {
//                 $url = $imgPath;
//             } elseif (Str::startsWith($imgPath, ['/storage/app/public/'])) {
//                 $url = url($imgPath);
//             } else {
//                $url = url(Storage::url($imgPath));
//             }

//             return ['id' => $img->id, 'url' => $url, 'attrs' => $attrs];
//         })->toArray();

//         return inertia('products/edit', ['product' => $product]);
//     }

//     /**
//      * Update the specified resource in storage.
//      */
//    public function update(UpdateProductRequest $request, Product $product)
//     {
//         $validated = $request->validated();

//         // Asegurar que 'active' se toma del request si viene (checkbox) o se mantiene el valor actual
//         $validated['active'] = $request->has('active') ? (int) $request->input('active') : $product->active;

//         $product->update($validated);


//         if ($request->hasFile('images')) {
//             foreach ($request->file('images') as $file) {
//                 $path = $file->store('products', 'public');
//                 $product->images()->create(['image_path' => $path]);
//             }
//         }

//         return redirect()->route('products.index')->with('success', 'Producto actualizado.');
//     }
    
//     /**
//      * Remove the specified resource from storage.
//      */
//     public function destroy(Product $product)
//     {
//         $product->delete();

//         return redirect()->route('products.index');
//     }
    
//     /**
//      * Fallback: servir archivo desde storage/app/public vía Laravel
//      * URL: /storage-file/{path}
//      */
//     public function serveImage($path)
//     {
//         $path = ltrim($path, '/');

//         if (!Storage::disk('public')->exists($path)) {
//             abort(404);
//         }

//         $full = storage_path('/app/public/products/' . $path);

//         return Response::file($full);
//     }

//     public function desable(Product $product)
//     {
//         $product->active = !$product->active;
//         $product->save();

//         return redirect()->route('products.index');
//     }
// }
