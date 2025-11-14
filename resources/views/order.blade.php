<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            padding: 20px;
            background: #fff;
            color: #333;
            font-size: 14px;
        }

        .header {
            border-bottom: 2px solid #444;
            padding-bottom: 10px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            width: 220px;
        }

        .invoice-title {
            text-align: right;
            font-size: 20px;
            font-weight: bold;
            color: #222;
        }

        .section-title {
            font-size: 17px;
            margin-top: 22px;
            margin-bottom: 8px;
            font-weight: bold;
            color: #111;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }

        table th, table td {
            border: 1px solid #999;
            padding: 8px;
            font-size: 13px;
        }

        table th {
            background: #f0f0f0;
            font-weight: bold;
            text-align: left;
        }

        .totals {
            margin-top: 20px;
            width: 100%;
        }

        .totals td {
            padding: 5px;
            font-size: 14px;
        }

        .totals .label {
            text-align: right;
            font-weight: bold;
        }

        .signature-section {
            margin-top: 50px;
            text-align: right;
        }

        .signature-img {
            width: 200px;
            opacity: 0.9;
        }

        .footer {
            margin-top: 35px;
            text-align: center;
            font-size: 12px;
            color: #555;
        }
    </style>
</head>
<body>

   
    <div class="header">
        <img src="{{ public_path('logo_largo.jpg') }}" class="logo" width=70  height=60>

        <div class="invoice-title">
            <div> Orden #{{ $order->id }}</div>
            <small>Emitido: {{ $date }}</small>
        </div>
    </div>

    
    <div class="section-title">Datos del Cliente</div>
    <table>
        <tr>
            <td><strong>Nombre:</strong> {{ $order->user->name ?? 'Desconocido' }}</td>
            <td><strong>Email:</strong> {{ $order->user->email ?? '-' }}</td>
        </tr>
        <tr>
            <td>
                <strong>Retiro:</strong>
                {{ $shipping_method === 'local' ? 'Retiro en local' : 'Envío a domicilio' }}
            </td>
            <td>
                <strong>Dirección:</strong>
                {{ $shipping_method === 'domicilio' ? $shipping_address : 'No aplica' }}
            </td>
        </tr>
    </table>

    <div class="section-title">Detalles de la compra</div>
    <table>
        <tr>
            <td><strong>Estado de pago:</strong> {{ $order->paid ? 'Pagado' : 'Pendiente' }}</td>
            <td><strong>Método de pago:</strong> {{ $order->payment_method ?? '-' }}</td>
        </tr>
    </table>

    
    <div class="section-title">Productos</div>
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Variante</th>
                <th>Cantidad</th>
                <th>Precio unit.</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->details as $item)
                <tr>
                    <td>{{ $item->product->name }}</td>
                    <td>{{ $item->variant->name ?? '-' }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->unit_price, 2) }}</td>
                    <td>${{ number_format($item->unit_price * $item->quantity, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

   
    <div class="section-title">Totales</div>
    <table class="totals">
        <tr>
            <td class="label">Subtotal:</td>
            <td>${{ number_format($order->total, 2) }}</td>
        </tr>
        <tr>
            <td class="label">Interés:</td>
            <td>${{ number_format($order->interest, 2) }}</td>
        </tr>
        <tr>
            <td class="label">Envío:</td>
            <td>${{ number_format($shipping_cost, 2) }}</td>
        </tr>
        <tr>
            <td class="label"><strong>Total Final:</strong></td>
            <td><strong>${{ number_format($order->final_total, 2) }}</strong></td>
        </tr>
    </table>

  
    <div class="signature-section">
        <img src="{{ public_path('firma.jpg') }}" class="signature-img">
        <div><strong>Firma Comercial</strong></div>
        <div>Daiana Carolina Mayorga</div>
    </div>

   
    <div class="footer">
        Gracias por comprar en Valquiria.<br>
        
    </div>

</body>
</html>
