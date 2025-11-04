<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
  
    public function index()
    {
        $cart = Cart::where('user_id', auth()->id())
            ->with(['items.product', 'items.variant'])
            ->first();

        
        if ($cart && $cart->updated_at->diffInMinutes(now()) >= 10) {
            $this->restoreStockAndEmptyCart($cart);
            $cart->delete();
            $cart = null;
        }

        $items = $cart ? $cart->items->map(fn($i) => [
            'id' => $i->id,
            'product' => $i->product,
            'variant' => $i->variant,
            'quantity' => $i->quantity,
            'subtotal' => $i->quantity * $i->product->price,
        ]) : collect([]);

        $total = $items->sum('subtotal');

        return inertia('Cart/Index', [
            'cart' => $items,
            'total' => $total,
        ]);
    }


    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $variant = $validated['variant_id'] ? ProductVariant::findOrFail($validated['variant_id']) : null;
        $stock = $variant ? $variant->stock : $product->stock;

        if ($validated['quantity'] > $stock) {
            return back()->with('flash', [
                'status' => 'error',
                'message' => 'No hay suficiente stock disponible para este producto.'
            ]);
        }

        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);

      
        $existingItem = $cart->items()
            ->where('product_id', $product->id)
            ->where('variant_id', $variant?->id)
            ->first();

        if ($existingItem) {
         
            $newQty = $existingItem->quantity + $validated['quantity'];
            if ($newQty > $stock + $existingItem->quantity) {
                return back()->with('flash', [
                    'status' => 'error',
                    'message' => 'No hay suficiente stock disponible para agregar más unidades.'
                ]);
            }
            $existingItem->update(['quantity' => $newQty]);
        } else {
           
            $cart->items()->create([
                'product_id' => $product->id,
                'variant_id' => $variant?->id,
                'quantity' => $validated['quantity'],
                'price' => $product->price,
            ]);
        }

      
        if ($variant) $variant->decrement('stock', $validated['quantity']);
        else $product->decrement('stock', $validated['quantity']);

        return back()->with('flash', [
            'status' => 'success',
            'message' => 'Producto agregado al carrito correctamente.'
        ]);
    }

    
    public function update(Request $request, CartItem $item)
    {
        $request->validate(['quantity' => 'required|integer|min:0']);

        $variant = $item->variant;
        $product = $item->product;
        $availableStock = $variant ? $variant->stock : $product->stock;
        $currentQty = $item->quantity;
        $newQty = $request->quantity;
        $difference = $newQty - $currentQty;

        
        if ($newQty === 0) {
            if ($variant) $variant->increment('stock', $currentQty);
            else $product->increment('stock', $currentQty);
            $item->delete();

            return back()->with('flash', [
                'status' => 'success',
                'message' => 'Producto eliminado del carrito.'
            ]);
        }

        
        if ($difference > 0 && $difference > $availableStock) {
            return back()->with('flash', [
                'status' => 'error',
                'message' => 'No hay suficiente stock disponible.'
            ]);
        }


        if ($difference > 0) {
         
            $variant ? $variant->decrement('stock', $difference) : $product->decrement('stock', $difference);
        } elseif ($difference < 0) {
      
            $variant ? $variant->increment('stock', abs($difference)) : $product->increment('stock', abs($difference));
        }

        $item->update(['quantity' => $newQty]);

        return back()->with('flash', [
            'status' => 'success',
            'message' => 'Cantidad actualizada correctamente.'
        ]);
    }

    
    public function remove(CartItem $item)
    {
        $variant = $item->variant;
        $product = $item->product;

        if ($variant) $variant->increment('stock', $item->quantity);
        else $product->increment('stock', $item->quantity);

        $item->delete();

        return back()->with('flash', [
            'status' => 'success',
            'message' => 'Producto eliminado del carrito.'
        ]);
    }

    
    public function clear()
    {
        $cart = Cart::where('user_id', auth()->id())->first();

        if ($cart) {
            foreach ($cart->items as $item) {
                if ($item->variant) $item->variant->increment('stock', $item->quantity);
                else $item->product->increment('stock', $item->quantity);
            }
            $cart->items()->delete();
        }

        return back()->with('flash', [
            'status' => 'success',
            'message' => 'Carrito vaciado correctamente.'
        ]);
    }

  
    private function restoreStockAndEmptyCart(Cart $cart)
    {
        foreach ($cart->items as $item) {
            if ($item->variant) $item->variant->increment('stock', $item->quantity);
            else $item->product->increment('stock', $item->quantity);
        }
        $cart->items()->delete();
    }
}
