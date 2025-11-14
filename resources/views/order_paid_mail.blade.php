<!DOCTYPE html>
<html lang="es">
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
    <div style="background: white; padding: 20px; border-radius: 8px;">
        <h2>¡Gracias por confiar y realizar tu compra en Valquiria Artesanias!</h2>

        <p>Hola {{ $order->user->name }},</p>

        <p>
            Tu compra fue registrada correctamente.  
            Tu número de orden es <strong>#{{ $order->id }}</strong>.
        </p>

        <p>Adjuntamos tu factura en formato PDF con todos los detalles.</p>

        <p style="margin-top: 25px;">Valquiria Artesanias</p>
    </div>
</body>
</html>
