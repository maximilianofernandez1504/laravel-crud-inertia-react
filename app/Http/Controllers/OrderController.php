<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Mail\OrderPaidMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{

    public function index(Request $request)
    {
        $query = Order::with(['user']);

        
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('paid') && $request->paid !== 'all') {
            $query->where('paid', $request->paid);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        
        $sort = $request->get('sort_by', 'id'); 
        $direction = $request->get('direction', 'asc');

        if (in_array($sort, ['id', 'created_at', 'final_total'])) {
            $query->orderBy($sort, $direction);
        }

        $orders = $query->paginate(10)->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'paid', 'from_date', 'to_date', 'sort_by', 'direction']),
        ]);
    }

    
    public function show($id)
    {
        $order = Order::with([
            'user',
            'details.product',
            'details.variant'
        ])->findOrFail($id);

        
        $order->items = $order->details;

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

        $wasNotPaid = !$order->paid;

        $validated = $request->validate([
            'paid' => 'required|boolean',
            'status' => 'required|string|in:cancelado,reserva,en espera,en proceso,enviado',
        ]);

        $order->update($validated);

        
        if($wasNotPaid && $validated['paid'] == 1) {
            Mail::to($order->user->email)->send(new OrderPaidMail($order));
        }

        return redirect()->route('orders.show', $order->id)
            ->with('success', 'Orden actualizada correctamente.');
    }

   
    public function exportPdf($id)
    {
        $order = Order::with([
            'user',
            'details.product',
            'details.variant'
        ])->findOrFail($id);

        $data = [
            'order' => $order,
            'date' => $order->created_at->format('d/m/Y'),
            'shipping_cost' => $order->shipping_cost ?? 0,
            'shipping_method' => $order->shipping_method ?? 'local',
            'shipping_address' => $order->shipping_address ?? '-',
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('order', $data)
            ->setPaper('a4', 'portrait');

        return $pdf->stream("orden-{$order->id}.pdf");
    }


    public function myOrders()
    {
        $orders = Order::where('user_id', auth()->id())
            ->with(['details.product', 'details.variant'])
            ->orderBy('created_at', 'asc')
            ->paginate(10);

        return Inertia::render('Orders/MyOrdersIndex', [
            'orders' => $orders,
        ]);
    }

   public function exportListPdf(Request $request)
    {
        $query = Order::with(['user']);

        
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('paid') && $request->paid !== 'all') {
            $query->where('paid', $request->paid);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        
        $sort = $request->get('sort_by', 'id');
        $direction = $request->get('direction', 'asc');

        if (in_array($sort, ['id', 'created_at', 'final_total'])) {
            $query->orderBy($sort, $direction);
        }

        $orders = $query->get();

        
        $data = [
            'orders' => $orders,
            'filters' => $request->all(),
            'date' => now()->format('d/m/Y H:i'),
        ];

        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('order_list', $data)
            ->setPaper('a4', 'portrait');

        return $pdf->stream('ordenes-filtradas.pdf');
    }

  

public function stats()
{
    
    $validOrders = \App\Models\Order::where('status', '!=', 'cancelado')->pluck('id');

   
    $productsWithoutVariants = DB::table('order_details')
        ->join('products', 'order_details.product_id', '=', 'products.id')
        ->select(
            DB::raw('CONCAT("p-", products.id) as id'), 
            'products.name as name',
            DB::raw('NULL as variant'),
            DB::raw('SUM(order_details.quantity) as total_sold')
        )
        ->whereNull('order_details.variant_id')
        ->whereIn('order_id', $validOrders)
        ->groupBy('products.id', 'products.name')
        ->get();

    
    $productsWithVariants = DB::table('order_details')
        ->join('product_variants', 'order_details.variant_id', '=', 'product_variants.id')
        ->join('products', 'product_variants.product_id', '=', 'products.id')
        ->select(
            DB::raw('CONCAT("v-", product_variants.id) as id'),
            'products.name as name',
            'product_variants.name as variant',
            DB::raw('SUM(order_details.quantity) as total_sold')
        )
        ->whereNotNull('order_details.variant_id')
        ->whereIn('order_id', $validOrders)
        ->groupBy('product_variants.id', 'products.name', 'product_variants.name')
        ->get();

    
    $allSoldItems = $productsWithoutVariants
        ->merge($productsWithVariants)
        ->sortByDesc('total_sold')
        ->values()
        ->all(); 

 
    $globalTotalSold = collect($allSoldItems)->sum('total_sold');

    return Inertia::render("Orders/Stats", [
        "allSoldItems" => $allSoldItems,
        "globalTotalSold" => $globalTotalSold,
    ]);
}
}