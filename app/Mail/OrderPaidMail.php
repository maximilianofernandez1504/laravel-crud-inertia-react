<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderPaidMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        
        $pdf = Pdf::loadView('order', [
            'order' => $this->order,
            'date'  => now()->format('d/m/Y H:i'),
        ])->setPaper('a4', 'portrait');
                
        return $this
            ->subject("Tu compra en Valquiria - Orden #{$this->order->id}")
            ->view('order_paid_mail', [
                'order' => $this->order,
            ])
            
            ->attachData($pdf->output(), "orden-{$this->order->id}.pdf", [
                'mime' => 'application/pdf',
            ]);
    }

}
