<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::all(); 
        $products = ($request->query('all') === 'true')
            ? Product::with('categories', 'images')->paginate(12)
            : Product::with('categories', 'images')->where('state', 1)->paginate(12);

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_type' => 'required|in:unique,variable',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required_with:variants|string|max:255',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            $initialStock = ($validated['product_type'] === 'unique') ? ($validated['stock'] ?? 0) : 0;

            $product = Product::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? '',
                'stock' => $initialStock,
                'price' => $validated['price'],
                'product_type' => $validated['product_type'],
                'state' => 1,
            ]);

            if (!empty($validated['category_ids'])) {
                $product->categories()->sync($validated['category_ids']);
            }

            if ($request->hasFile('images')) {
                $priority = 0;
                foreach ($request->file('images') as $file) {
                    $nombreArchivo = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('products', $nombreArchivo, 'public');

                    $product->images()->create([
                        'image_path' => 'storage/app/public/products/' . $nombreArchivo,
                        'priority' => $priority,
                    ]);
                    $priority++;
                }
            }

            if ($validated['product_type'] === 'variable' && !empty($validated['variants'])) {
                $totalStock = 0;
                foreach ($validated['variants'] as $variant) {
                    $product->variants()->create([
                        'name' => $variant['name'],
                        'stock' => $variant['stock'],
                    ]);
                    $totalStock += intval($variant['stock']);
                }
                $product->update(['stock' => $totalStock]);
            }

            DB::commit();
            return redirect()->route('products.index')->with('success', 'Producto creado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Error al crear producto: ' . $e->getMessage());
            return back()->withInput()->withErrors(['general' => 'Error al crear producto.']);
        }
    }

    public function show(Product $product)
    {
        $product->load('images', 'categories', 'variants');
        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product)
    {
        $product->load('images', 'variants', 'categories');
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
            'product_type' => 'required|in:unique,variable',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|integer|exists:product_variants,id',
            'variants.*.name' => 'required_with:variants|string|max:255',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            $product->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? '',
                'price' => $validated['price'],
                'product_type' => $validated['product_type'],
            ]);

            $product->categories()->sync($validated['category_ids'] ?? []);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $priority++;
                    $nombreArchivo = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('products', $nombreArchivo, 'public');

                    $product->images()->create([
                        'image_path' => 'storage/app/public/products/' . $nombreArchivo,
                        'priority' => $priority,
                    ]);
                }
            }

            if ($validated['product_type'] === 'unique') {
                $product->variants()->delete();
                $product->update(['stock' => $validated['stock'] ?? 0]);
            } else {
                $variants = $validated['variants'] ?? [];
                $totalStock = 0;
                $variantIds = collect($variants)->pluck('id')->filter()->toArray();

                $product->variants()->whereNotIn('id', $variantIds)->delete();

                foreach ($variants as $variantData) {
                    if (isset($variantData['id'])) {
                        $variant = $product->variants()->find($variantData['id']);
                        if ($variant) {
                            $variant->update([
                                'name' => $variantData['name'],
                                'stock' => $variantData['stock'],
                            ]);
                        }
                    } else {
                        $product->variants()->create([
                            'name' => $variantData['name'],
                            'stock' => $variantData['stock'],
                        ]);
                    }
                    $totalStock += intval($variantData['stock']);
                }

                $product->update(['stock' => $totalStock]);
            }

            DB::commit();
            return redirect()->route('products.index')->with('success', 'Producto actualizado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Error actualizando producto: ' . $e->getMessage());
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
        return Excel::download(new \App\Exports\ProductsExports, 'products.xlsx');
    }

    public function productReport(Product $product)
    {
        $image = $product->images()->orderBy('priority', 'asc')->first();
        $category = $product->categories();
        $data = [
            'product' => $product,
            'image' => $image,
            'categories' => $category->get(),
        ];

        $pdf = Pdf::loadView('productReport', $data)->setPaper('a4', 'portrait');
        return $pdf->stream("producto-{$product->id}.pdf");
    }
}
