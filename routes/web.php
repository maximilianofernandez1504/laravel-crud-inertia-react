<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AboutUsController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\SiteAddressController;
use App\Http\Controllers\SiteSettingController;
use App\Http\Controllers\FaqController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


//Route::get('/', function () {return Inertia::render('welcome');})->name('home');
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('about-us', [AboutUsController::class, 'index'])->name('aboutus.index');
Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::delete('/cart/expire', [CartController::class, 'expire'])->name('cart.expire');
Route::get('faqs', [FaqController::class, 'index'])->name('faqs.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {return Inertia::render('dashboard');})->name('dashboard');
    //configuraciones del usuario
    
    Route::get('settings/profile', function () {return Inertia\Inertia::render('settings/profile');})->name('settings.profile');
    
    //Inicio
    Route::get('/home/edit', [HomeController::class, 'edit'])->name('home.edit');
    Route::post('/home/update', [HomeController::class, 'update'])->name('home.update');

    //Sobre Nosotros
    Route::get('about-us/edit', [AboutUsController::class, 'edit'])->name('aboutus.edit');
    Route::post('about-us', [AboutUsController::class, 'update'])->name('aboutus.update');
    Route::delete('about-us/media/{id}', [AboutUsController::class, 'deleteMedia'])->name('aboutus.deleteMedia');
    
    
    // Products
   
    Route::get('products/create', [ProductController::class, 'create'])->middleware('can:viewall')->name('products.create');
    Route::get('products/export', [ProductController::class, 'export'])->middleware('can:viewall')->name('products.export');
    Route::get('products/{product}',[ProductController::class,'show'])->name('products.show');
    Route::get('products/edit/{product}', [ProductController::class, 'edit'])->middleware('can:viewall')->name('products.edit');
    Route::get('products/report/{product}', [ProductController::class,'productReport'])->middleware('can:viewall')->name('product.report');
    Route::post('products', [ProductController::class, 'store'])->middleware('can:viewall')->name('products.store');
    Route::post('products/{product}', [ProductController::class, 'update'])->middleware('can:viewall')->name('products.update');
    Route::patch('/products/{product}/restore', [ProductController::class, 'restore'])->middleware('can:viewall')->name('products.restore');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->middleware('can:viewall')->name('products.destroy');
    
    
    
    //Permisions routes
    Route::get('permissions', [PermissionController::class, 'index'])->middleware('can:viewall')->name('permissions.index');
    Route::post('permissions', [PermissionController::class, 'store'])->middleware('can:viewall')->name('permissions.store');
    Route::put('permissions/{permission}', [PermissionController::class, 'update'])->middleware('can:viewall')->name('permissions.update');
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->middleware('can:viewall')->name('permissions.destroy');
    

    //Roles routes
    Route::get('roles', [RoleController::class, 'index'])->middleware('can:viewall')->name('roles.index');
    Route::get('roles/create', [RoleController::class, 'create'])->middleware('can:viewall')->name('roles.create');
    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->middleware('can:viewall')->name('roles.edit');
    Route::post('roles', [RoleController::class, 'store'])->middleware('can:viewall')->name('roles.store');
    Route::put('roles/{role}', [RoleController::class, 'update'])->middleware('can:viewall')->name('roles.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->middleware('can:viewall')->name('roles.destroy');

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

    //user
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    //Carrito
    Route::get('cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::put('cart/{item}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::delete('cart/{item}', [CartController::class, 'remove'])->name('cart.remove');
    
    //Gestion de venta
    Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('checkout/thanks', [CheckoutController::class, 'thanks'])->name('checkout.thanks');
    
    //Gestion de Ordenes
    Route::get('orders/mis-compras', [OrderController::class, 'myOrders'])->name('orders.my');
    Route::get('orders/stats', [OrderController::class, 'stats'])->middleware('can:viewall')->name('order.stats');
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/export-list-pdf', [OrderController::class, 'exportListPdf'])->name('orders.exportListPdf');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('orders/{id}/edit', [OrderController::class, 'edit'])->name('orders.edit');
    Route::put('orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::get('orders/{id}/export-pdf', [OrderController::class, 'exportPdf'])->name('orders.exportPdf');
    
    
    
    
    
    //Configuración del Sitio
   
    Route::get('sitesettings', [SiteSettingController::class, 'edit'])->name('sitesettings.edit');
    Route::put('sitesettings', [SiteSettingController::class, 'update'])->name('sitesettings.update');
    
   
    // Direcciones del sitio
    Route::get('sitesettings/addresses/create', [\App\Http\Controllers\SiteAddressController::class, 'create'])->name('addresses.create');
    Route::post('sitesettings/addresses', [\App\Http\Controllers\SiteAddressController::class, 'store'])->name('addresses.store');
    Route::get('sitesettings/address/{address}/edit', [SiteAddressController::class, 'edit'])->name('addresses.edit');
    Route::put('sitesettings/address/{address}', [SiteAddressController::class, 'update'])->name('addresses.update');
    Route::delete('sitesettings/address/{address}', [SiteAddressController::class, 'destroy'])->name('addresses.destroy');

    //preguntas
    Route::get('faqs/edit', [FaqController::class, 'edit'])->middleware('can:viewall')->name('faqs.edit');
    Route::post('faqs', [FaqController::class, 'store'])->middleware('can:viewall')->name('faqs.store');
    Route::put('faqs/{faq}', [FaqController::class, 'update'])->middleware('can:viewall')->name('faqs.update');
    Route::delete('faqs/{faq}', [FaqController::class, 'destroy'])->middleware('can:viewall')->name('faqs.destroy');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


