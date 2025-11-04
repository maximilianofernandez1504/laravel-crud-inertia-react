<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; }

        body {
            font-family: DejaVu Sans, sans-serif;
            background-color: #000;
            color: #FFD700;
            margin: 40px;
        }

        /* 🔹 Logo centrado */
        .logo-container {
            text-align: center;
            margin-bottom: 40px;
        }

        .logo {
            width: 300px;
            height: auto;
        }

        /* 🔹 Tabla principal */
        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .product-table td {
            vertical-align: top;
        }

        /* 🔹 Imagen */
        .product-image {
            width: 250px;
            height: 250px;
            object-fit: cover;
            border-radius: 15px;
        }

        /* 🔹 Información del producto */
        .info-box {
            padding-left: 15px; 
            text-aling:center;
        }

        .info-box h1 {
            font-size: 28px;
            text-aling: center;
            color: #FFD700;
        }

        .price {
            font-size: 22px;
            margin-bottom: 10px;
        }

        .description {
            font-size: 16px;
            color: #f8f8f8;
            text-align: justify;
            line-height: 1.3;
            max-width: 420px;
        }
        
        .category-table {
            width: auto;
            border-collapse: separate;
            border-spacing: 5px; /* 🔹 Menor espacio entre celdas */
            margin-top: 6px; /* 🔹 Más cerca del texto */
            transform: scale(0.9); /* 🔹 Escala global de la tabla */
            transform-origin: top left; /* Evita que se desplace */
        }

        .category-table td {
            background-color: #333; /* 🔹 Un poco más oscuro para contraste */
            color: #FFD700;
            border-radius: 6px;
            text-align: center;
            padding: 3px 6px; /* 🔹 Menos padding = tabla más chica */
            font-size: 12px; /* 🔹 Fuente más pequeña */
            border: 1px solid #555;
            min-width: 60px; /* 🔹 Celdas más angostas */
            white-space: nowrap;
        }


        .category-table tr {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>

    {{-- 🔹 Logo --}}
    <div class="logo-container">
        <img src="{{ public_path('Logo_largo.jpg') }}" alt="Logo" class="logo">
    </div>

    {{-- 🔹 Contenedor principal --}}
    <table class="product-table">
        <tr>
            {{-- Imagen --}}
            <td style="width: 300px;">
                @php
                    $relativePath = $image ? str_replace('storage/app/public/', 'storage/', $image->image_path) : null;
                    $fullPath = $relativePath ? public_path($relativePath) : null;
                @endphp

                @if($image && $fullPath && file_exists($fullPath))
                    <img src="{{ $fullPath }}" class="product-image" alt="{{ $product->name }}">
                @else
                    <img src="{{ public_path('storage/default.png') }}" class="product-image" alt="Sin imagen">
                @endif
            </td>

            {{-- Información del producto --}}
            <td>
                <div class="info-box">
                    <h1>{{ $product->name }}</h1>
                    <div class="price">${{ number_format($product->price, 2, ',', '.') }}</div>
                    <div class="description">{!! nl2br(e($product->description)) !!}</div>
                    @if($categories && count($categories) > 0)
                        <table class="category-table">
                            @php
                                $chunks = $categories->chunk(3);
                            @endphp
                            @foreach($chunks as $row)
                                <tr>
                                    @foreach($row as $category)
                                        <td>{{ $category->name }}</td>
                                    @endforeach
                                </tr>
                            @endforeach
                        </table>
                    @endif
                </div>
            </td>
        </tr>
    </table>

</body>
</html>
