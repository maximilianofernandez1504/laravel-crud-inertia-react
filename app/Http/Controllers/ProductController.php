<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Exports\ProductsExport;
use Maatwebsite\Excel\Facades\Excel;


class ProductController extends Controller
{
    public function index(Request $request)
    {   
        $categories = Category::all(); 
        if ($request->query('all') === 'true') {
            $products = Product::with('categories', 'images')->paginate(12);
        } else {
            $products = Product::with('categories', 'images')
                ->where('state', 1)
                ->paginate(12);
        }

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $categories = Category::all(['id', 'name']);
        return inertia('products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        // Si usás FormRequest, podés usar $request->validated(); aquí dejo validación inline por seguridad.
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();
        try {
            
            $product = Product::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? '',
                'stock' => $validated['stock'],
                'price' => $validated['price'],
                'state' => 1,
            ]);

            //categorías
            if (!empty($validated['category_ids'])) {
               
                $product->categories()->sync($validated['category_ids']);
            }

            // Guardar imágenes
            if ($request->hasFile('images')) {
                $priority = 0;
                foreach ($request->file('images') as $file) {
                    $nombreArchivo = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('products', $nombreArchivo, 'public');

                    $product->images()->create([
                        'image_path' => 'storage/app/public/products/' . $nombreArchivo,
                        'priority' => $priority,
                    ]);
                    $priority++;
                }
            }
            
            DB::commit();
            return redirect()->route('products.index')->with('success', 'Producto creado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withInput()->withErrors(['general' => 'Error al crear producto.']);
        }
    }

    public function show(Product $product)
    {
        $product->load('images', 'categories');
        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product)
    {
        $product->load('images', 'categories');
        $categories = Category::all(['id', 'name']);

        return inertia('products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {   
        $priority = $product->images()->max('priority') ?? 0;
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();
        try {
            $product->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? '',
                'stock' => $validated['stock'],
                'price' => $validated['price'],
            ]);

            // Sync categorías (vacío = desvincula todas)
            if (array_key_exists('category_ids', $validated)) {
                $product->categories()->sync($validated['category_ids'] ?? []);
            }

            // Agregar nuevas imágenes si las envían
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $priority++;
                    $nombreArchivo = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('products', $nombreArchivo, 'public');

                    $product->images()->create([
                        'image_path' => 'storage/app/public/products/' . $nombreArchivo,
                        'priority' => $priority,
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('products.index')->with('success', 'Producto actualizado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Error actualizando producto: '.$e->getMessage());
            return back()->withInput()->withErrors(['general' => 'Error al actualizar producto.']);
        }
    }

    public function destroy(Product $product)
    {
        $product->update(['state' => 0]);
        return redirect()->route('products.index')->with('success', 'Producto desactivado correctamente.');
    }

    public function restore(Product $product)
    {
        $product->update(['state' => 1]);
        return redirect()->route('products.index')->with('success', 'Producto reactivado correctamente.');
    }

    public function deleteImage(Product $product, $imageId)
    {
        $image = $product->images()->findOrFail($imageId);

        if (Storage::disk('public')->exists(str_replace('storage/', '', $image->image_path))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $image->image_path));
        }

        $image->delete();

        return back()->with('success', 'Imagen eliminada correctamente.');
    }

      public function export() 
    {
        return Excel::download(new ProductsExport, 'products.xlsx');
    }
    

    
}
