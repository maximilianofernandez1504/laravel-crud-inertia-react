<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Products
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/edit/{product}', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';



// use App\Http\Controllers\ProductController;
// use App\Http\Controllers\ProductImageController;
// use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');

//     // Products/Product Images
//     Route::get('products', [ProductController::class, 'index'])->name('products.index');
//     Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
//     Route::post('products', [ProductController::class, 'store'])->name('products.store');

//     Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
//     Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
//     Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
//     Route::patch('products/{product}/toggle-active', [ProductController::class, 'desable'])->name('products.toggleActive');

//     Route::post('/product-images', [ProductImageController::class, 'store']);
// });

// // RUTA: servir archivos storage (fallback si el symlink o servidor fallan)
// Route::get('/storage-file/{path}', [ProductController::class, 'serveImage'])
//     ->where('path', '.*')
//     ->name('storage.file');

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
