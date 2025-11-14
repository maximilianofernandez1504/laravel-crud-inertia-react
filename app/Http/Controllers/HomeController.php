<?php

namespace App\Http\Controllers;

use App\Models\Home;
use App\Models\HomeImage;
use App\Models\Product;
use App\Models\Category;
use App\Models\SiteAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $home = Home::with('images')->firstOrCreate([]);
        $products = Product::with('images')->where('state', 1)->take(12)->get();
        $categories = Category::all();
        $addresses = SiteAddress::all();

        return Inertia::render('Home/Index', [
            'home' => $home,
            'products' => $products,
            'categories' => $categories,
            'addresses' => $addresses,
        ]);
    }

    public function edit()
    {
        $home = Home::with('images')->firstOrCreate([]);
        return Inertia::render('Home/Edit', ['home' => $home]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title_products' => 'required|string|max:255',
            'title_map' => 'required|string|max:255',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'remove_images' => 'nullable|array',
        ]);

        $home = Home::firstOrCreate([]);
        $home->update([
            'title_products' => $validated['title_products'],
            'title_map' => $validated['title_map'],
        ]);

        // Eliminar imágenes seleccionadas
        if (!empty($validated['remove_images'])) {
            foreach ($validated['remove_images'] as $id) {
                $img = HomeImage::find($id);
                if ($img) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $img->image_path));
                    $img->delete();
                }
            }
        }

        // Subir nuevas imágenes
        if ($request->hasFile('images')) {
            $priority = HomeImage::max('priority') + 1;
            foreach ($request->file('images') as $file) {
                $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('home', $filename, 'public');
                $home->images()->create([
                    'image_path' => 'storage/app/public/home/' . $filename,
                    'priority' => $priority++,
                ]);
            }
        }

        return redirect()->route('home')->with('success', 'Página actualizada correctamente.');
    }
}
