<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
   
    public function index()
    {
        $orders = Order::with(['user', 'details.product'])
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    
    public function show($id)
    {
        $order = Order::with(['user', 'details.product'])->findOrFail($id);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

   
    public function edit($id)
    {
        $order = Order::with(['user', 'order.details'])->findOrFail($id);

        return Inertia::render('Orders/Edit', [
            'order' => $order,
        ]);
    }

    
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'paid' => 'required|boolean',
            'status' => 'required|string|in:reserva,en espera,en proceso,enviado',
        ]);

        $order->update($validated);

        return redirect()->route('orders.show', $order->id)
            ->with('success', 'Orden actualizada correctamente.');
    }
}
