<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
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
    Route::get('products/{product}',[ProductController::class,'show'])->name('products.show');
    Route::get('products/export/', [ProductController::class, 'export'])->name('products.export');
    Route::get('products/edit/{product}', [ProductController::class, 'edit'])->name('products.edit');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::post('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::patch('/products/{product}/restore', [ProductController::class, 'restore'])->name('products.restore');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    
    
    
    //Permisions routes
    Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::post('permissions', [PermissionController::class, 'store'])->name('permissions.store');
    Route::put('permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
    

    //Roles routes
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

    //Imagenes de productos
    Route::get('products/{product}/images', [ProductImageController::class, 'index'])->name('products.images.index');
    Route::post('products/images', [ProductImageController::class, 'store'])->name('products.images.store');
    Route::delete('products/images/{id}', [ProductImageController::class, 'destroy'])->name('products.images.destroy');
    Route::delete('/products/{product}/images/{image}', [ProductController::class, 'deleteImage'])->name('products.deleteImage');

    //Categorias
    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create');
     Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

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
