<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Comprovante de Estadia</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #2c3e50; font-size: 24px; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #f8f9fa; text-align: left; padding: 8px; border-bottom: 2px solid #ddd; font-size: 12px; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }

        .totals { margin-top: 20px; text-align: right; }
        .totals p { margin: 5px 0; }
        .total-row { font-size: 16px; font-weight: bold; color: #2c3e50; border-top: 2px solid #ddd; padding-top: 10px; margin-top: 10px !important;}

        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        .status-tag { padding: 4px 8px; background: #eee; border-radius: 4px; font-size: 10px; font-weight: bold;}
        .info-title { font-weight: bold; font-size: 10px; color: #7f8c8d; text-transform: uppercase; margin-bottom: 5px; }
    </style>
</head>
<body>

    {{-- 1. BLOCO DE CÁLCULOS (Lógica PHP separada do HTML) --}}
    @php
        // Dias
        $checkIn = \Carbon\Carbon::parse($reservation->check_in);
        $checkOut = \Carbon\Carbon::parse($reservation->check_out);
        $days = $checkIn->diffInDays($checkOut) ?: 1;

        // Valor Diária (Usa o snapshot se tiver, senão o atual)
        $roomPrice = $reservation->daily_price_snapshot ?? $reservation->room->price_per_night;
        $totalRoom = $roomPrice * $days;

        // Cálculo Estacionamento
        $totalParking = 0;
        foreach($reservation->parkingAssignments as $parking) {
            $totalParking += ($parking->parkingSpace->price_per_day * $days);
        }

        // Consumo
        $totalConsumption = $reservation->consumptions->sum('total_price');

        // Total Geral Calculado
        $totalGeneral = $totalRoom + $totalParking + $totalConsumption;
    @endphp

    <div class="header">
        @if(!empty($hotel_logo))
            <img src="{{ $hotel_logo }}" style="width: 80px; height: auto; margin-bottom: 10px;">
        @else
            <h1>{{ $hotel_name }}</h1>
        @endif
        @if(!empty($hotel_cnpj))
            <p style="font-size: 12px; margin: 2px;">CNPJ: {{ $hotel_cnpj }}</p>
        @endif
        @if(!empty($hotel_address))
            <p style="font-size: 12px; margin: 2px;">{{ $hotel_address }}</p>
        @endif
        @if(!empty($hotel_phone))
            <p style="font-size: 12px; margin: 2px;">Tel: {{ $hotel_phone }}</p>
        @endif
        <br>
        <p style="font-weight: bold">COMPROVANTE DE ESTADIA #{{ $reservation->id }}</p>
    </div>

    {{-- Dados do Cliente --}}
    <table style="border: none;">
        <tr>
            <td style="border: none; width: 50%; vertical-align: top;">
                <div class="info-title">HÓSPEDE</div>
                <div style="font-size: 14px;">
                    <strong>{{ $reservation->guest->name }}</strong><br>
                    Doc: {{ $reservation->guest->document_number ?? $reservation->guest->document ?? 'N/A' }}<br>
                    Email: {{ $reservation->guest->email ?? '-' }}
                </div>
            </td>
            <td style="border: none; width: 50%; vertical-align: top; text-align: right;">
                <div class="info-title">DETALHES DA RESERVA</div>
                <div style="font-size: 14px;">
                    Quarto: <strong>{{ $reservation->room->number }}</strong> ({{ $reservation->room->type }})<br>
                    Check-in: {{ $checkIn->format('d/m/Y') }}<br>
                    Check-out: {{ $checkOut->format('d/m/Y') }}<br>
                    Status: <span class="status-tag">{{ strtoupper($reservation->status) }}</span>
                </div>
            </td>
        </tr>
    </table>

    <h3>Descritivo de Serviços</h3>
    <table>
        <thead>
            <tr>
                <th>Descrição</th>
                <th class="text-center">Qtd/Dias</th>
                <th class="text-right">Valor Unit.</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            {{-- Linha da Hospedagem --}}
            <tr>
                <td>Hospedagem - Quarto {{ $reservation->room->number }}</td>
                <td class="text-center">{{ $days }}</td>
                <td class="text-right">R$ {{ number_format($roomPrice, 2, ',', '.') }}</td>
                <td class="text-right">R$ {{ number_format($totalRoom, 2, ',', '.') }}</td>
            </tr>

            {{-- Linhas do Estacionamento --}}
            @foreach($reservation->parkingAssignments as $parking)
                <tr>
                    <td>Estacionamento - Vaga {{ $parking->parkingSpace->number }}</td>
                    <td class="text-center">{{ $days }}</td>
                    <td class="text-right">R$ {{ number_format($parking->parkingSpace->price_per_day, 2, ',', '.') }}</td>
                    <td class="text-right">R$ {{ number_format($parking->parkingSpace->price_per_day * $days, 2, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Tabela de Consumo (só aparece se tiver) --}}
    @if($reservation->consumptions->count() > 0)
        <h3>Extrato de Consumo</h3>
        <table>
            <thead>
                <tr>
                    <th>Produto</th>
                    <th class="text-center">Qtd</th>
                    <th class="text-right">Valor Unit.</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($reservation->consumptions as $item)
                    <tr>
                        <td>{{ $item->product->name }}</td>
                        <td class="text-center">{{ $item->quantity }}</td>
                        <td class="text-right">R$ {{ number_format($item->unit_price, 2, ',', '.') }}</td>
                        <td class="text-right">R$ {{ number_format($item->total_price, 2, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    {{-- TOTAIS GERAIS (Aqui estava o erro, agora separado) --}}
    <div class="totals">
        <p>Total Diárias: R$ {{ number_format($totalRoom, 2, ',', '.') }}</p>

        @if($totalParking > 0)
            <p>Total Estacionamento: R$ {{ number_format($totalParking, 2, ',', '.') }}</p>
        @endif

        @if($totalConsumption > 0)
            <p>Total Consumo: R$ {{ number_format($totalConsumption, 2, ',', '.') }}</p>
        @endif

        <p class="total-row">TOTAL GERAL: R$ {{ number_format($totalGeneral, 2, ',', '.') }}</p>
    </div>

    {{-- Histórico de Pagamentos --}}
    <h3>Pagamentos Recebidos</h3>
    <table>
        <thead>
            <tr>
                <th>Data</th>
                <th>Método</th>
                <th class="text-right">Valor Pago</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reservation->payments as $payment)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($payment->paid_at)->format('d/m/Y H:i') }}</td>
                    <td>{{ $payment->method->name ?? 'N/A' }}</td>
                    <td class="text-right">R$ {{ number_format($payment->amount, 2, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" class="text-center">Nenhum pagamento registrado.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{-- Saldo Restante --}}
    @php
        $totalPaid = $reservation->payments->sum('amount');
        $balanceDue = $totalGeneral - $totalPaid;
    @endphp

    <div class="totals">
        <p>Total Pago: R$ {{ number_format($totalPaid, 2, ',', '.') }}</p>
        @if($balanceDue > 0.01)
            <p style="color: #c0392b; font-weight: bold;">Restante a Pagar: R$ {{ number_format($balanceDue, 2, ',', '.') }}</p>
        @else
            <p style="color: #27ae60; font-weight: bold;">SITUAÇÃO: QUITADO</p>
        @endif
    </div>

    <div class="footer">
        <p>Documento gerado em {{ $generated_at }}</p>
        <p>{{ $hotel_name }} - Agradecemos a preferência!</p>
    </div>

</body>
</html>
