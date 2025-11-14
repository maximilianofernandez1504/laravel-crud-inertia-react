<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = Cart::where('user_id', auth()->id())
            ->with(['items.product', 'items.variant'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('flash', [
                'status' => 'error',
                'message' => 'Tu carrito está vacío. Agrega productos antes de continuar con la compra.'
            ]);
        }

        $items = $cart->items->map(fn($i) => [
            'id' => $i->id,
            'product' => [
                'id' => $i->product->id,
                'name' => $i->product->name,
                'price' => $i->product->price,
            ],
            'variant' => $i->variant ? [
                'id' => $i->variant->id,
                'name' => $i->variant->name,
            ] : null,
            'quantity' => $i->quantity,
            'subtotal' => $i->quantity * $i->product->price,
        ]);

        $total = $items->sum('subtotal');

        return Inertia::render('Checkout/Index', [
            'cart' => $items,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        
        $cart = Cart::where('user_id', auth()->id())
            ->with(['items.product', 'items.variant'])
            ->first();

        $user = Auth::user();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('flash', [
                'status' => 'error',
                'message' => 'No hay productos en el carrito.'
            ]);
        }

        // 🟢 VALIDACIÓN CORREGIDA:
        // 1. Provincia ('shipping_province') es SIEMPRE requerida.
        // 2. Dirección ('shipping_address') es requerida SOLO si el método es 'domicilio'.
        $request->validate([
            'payment_method' => 'required|string',
            'paid' => 'required|boolean',
            'shipping_method' => 'required|in:local,domicilio',
            'shipping_province' => 'required|string', 
            // Usa 'nullable' para la base de datos, 'required_if' para la lógica de formulario
            'shipping_address' => 'nullable|string|required_if:shipping_method,domicilio', 
        ]);

        
        // La tasa de interés se mantiene
        $interestRate = $request->payment_method === 'tarjeta' ? 0.10 : 0;

        $items = $cart->items->map(fn($i) => [
            'id' => $i->id,
            'product_id' => $i->product->id,
            'variant_id' => $i->variant?->id,
            'quantity' => $i->quantity,
            'unit_price' => $i->product->price,
            'subtotal' => $i->quantity * $i->product->price,
        ])->toArray();

        $subtotal = collect($items)->sum('subtotal');
        $interest = $subtotal * $interestRate;

        // Costo de envío se mantiene
        $shippingCost = $request->shipping_method === 'local' ? 20000 : 25000;

        $finalTotal = $subtotal + $interest + $shippingCost;

        DB::beginTransaction();

        try {
            
            // 🟢 ASIGNACIÓN DE DIRECCIÓN CORREGIDA:
            // Forzamos el mensaje por defecto si es 'local'.
            // Si es 'domicilio', usamos el valor enviado por el usuario (validado como requerido).
            $shippingAddress = $request->shipping_method === 'local' 
                ? 'La empresa avisará al usuario la dirección para retirar el envío' 
                : $request->shipping_address; 
                
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $subtotal,
                'interest' => $interest,
                'final_total' => $finalTotal,
                'payment_method' => $request->payment_method,
                'paid' => false,
                'shipping_method' => $request->shipping_method,
                // Provincia siempre se toma del request
                'shipping_province' => $request->shipping_province,
                // Usamos la variable con la lógica de defecto/escrita
                'shipping_address' => $shippingAddress,
                'shipping_cost' => $shippingCost,
            ]);

            
            foreach ($items as $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'variant_id' => $item['variant_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

          
            $cart->items()->delete();
            $cart->delete();

            DB::commit();

            return redirect()->route('checkout.thanks')->with('flash', [
                'status' => 'success',
                'message' => 'Tu compra fue realizada con éxito.'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->route('checkout.index')->with('flash', [
                'status' => 'error',
                'message' => 'Ocurrió un error al procesar tu compra: ' . $e->getMessage()
            ]);
        }
    }

    public function thanks()
    {
        return inertia('Checkout/Thanks');
    }
}
