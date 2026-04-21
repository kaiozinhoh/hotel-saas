import React, { useEffect, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react'; // Adicionado 'router'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import dayjs from 'dayjs';

export default function CreateReservation({ guests, rooms, parkingSpaces, paymentMethods, filters }) {

    // 1. Setup do Formulário Inertia
    const { data, setData, post, processing, errors } = useForm({
        guest_id: '',
        room_id: '',
        check_in: filters?.check_in || '', // Mantém o valor se vier do backend (filtro)
        check_out: filters?.check_out || '',
        total_price: 0,
        parking_space_id: '',
        initial_payment: '',
        payment_method_id: ''
    });

    const [daysCount, setDaysCount] = useState(0);
    const [roomTotal, setRoomTotal] = useState(0);
    const [parkingTotal, setParkingTotal] = useState(0);

    // --- NOVA LÓGICA: BUSCAR QUARTOS DISPONÍVEIS ---
    // Sempre que check_in ou check_out mudar, pedimos ao servidor a lista atualizada
    useEffect(() => {
        // Só busca se tiver as duas datas preenchidas e válidas
        if (data.check_in && data.check_out && data.check_in <= data.check_out) {

            router.get(
                route('reservations.create'),
                {
                    check_in: data.check_in,
                    check_out: data.check_out
                },
                {
                    preserveState: true, // Não perde o que foi digitado (hóspede, etc)
                    preserveScroll: true,
                    replace: true, // Não suja o histórico do navegador
                    only: ['rooms', 'filters'] // Só recarrega 'rooms' para ser rápido
                }
            );
        }
    }, [data.check_in, data.check_out]);

    // 2. Cálculo Automático de Preço (Quarto + Estacionamento)
    useEffect(() => {
        let days = 0;
        let rTotal = 0;
        let pTotal = 0;

        // VALIDAÇÃO DE QUARTO: Verifica se o quarto selecionado ainda está livre
        if (data.room_id && rooms) {
            const roomStillAvailable = rooms.find(r => String(r.id) === String(data.room_id));
            if (!roomStillAvailable) {
                // Se o quarto sumiu da lista (ocupado), limpamos a seleção
                setData('room_id', '');
            }
        }

        // Calcula dias
        if (data.check_in && data.check_out) {
            const start = dayjs(data.check_in);
            const end = dayjs(data.check_out);

            if (end.isAfter(start)) {
                days = end.diff(start, 'day');
                if (days < 1) days = 1;
            }
        }
        setDaysCount(days);

        // Calcula valor do Quarto
        if (days > 0 && data.room_id && rooms) {
            const room = rooms.find(r => String(r.id) === String(data.room_id));
            if (room) {
                rTotal = days * parseFloat(room.price_per_night || 0);
            }
        }
        setRoomTotal(rTotal);

        // Calcula valor do Estacionamento
        if (days > 0 && data.parking_space_id && parkingSpaces) {
            const space = parkingSpaces.find(p => String(p.id) === String(data.parking_space_id));
            if (space) {
                pTotal = days * parseFloat(space.price_per_day || 0);
            }
        }
        setParkingTotal(pTotal);

        // Atualiza o total no formulário
        setData(prev => ({ ...prev, total_price: rTotal + pTotal }));

    }, [data.check_in, data.check_out, data.room_id, data.parking_space_id, rooms]); // Adicionei 'rooms' nas dependências

    // 3. Envio do Formulário
    const submit = (e) => {
        e.preventDefault();
        post(route('reservations.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nova Reserva</h2>}
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Resumo de Valores em Tempo Real */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <p className="text-sm font-medium text-blue-600">Total Diárias ({daysCount} dias)</p>
                                <p className="text-2xl font-bold text-blue-900">R$ {roomTotal.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="text-sm font-medium text-green-600">Total Estacionamento</p>
                                <p className="text-2xl font-bold text-green-900">R$ {parkingTotal.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900 text-white border-gray-800">
                            <CardContent className="pt-6">
                                <p className="text-sm font-medium text-gray-400">Total Geral</p>
                                <p className="text-2xl font-bold">R$ {(roomTotal + parkingTotal).toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dados da Estadia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                {/* Hóspede */}
                                <div>
                                    <Label>Hóspede</Label>
                                    <Select
                                        value={data.guest_id}
                                        onValueChange={(val) => setData('guest_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o hóspede..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {guests && guests.map((g) => {
                                                const docDisplay = g.document_number
                                                    ? `${g.document_type || 'Doc'}: ${g.document_number}`
                                                    : (g.document ? `Doc: ${g.document}` : 'Sem Doc');

                                                return (
                                                    <SelectItem key={g.id} value={String(g.id)}>
                                                        {g.name} ({docDisplay})
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {errors.guest_id && <span className="text-red-500 text-sm">{errors.guest_id}</span>}
                                </div>

                                {/* Datas (Agora vem antes do Quarto para filtrar) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Entrada</Label>
                                        <Input
                                            type="date"
                                            value={data.check_in}
                                            onChange={e => setData('check_in', e.target.value)}
                                        />
                                        {errors.check_in && <span className="text-red-500 text-sm">{errors.check_in}</span>}
                                    </div>
                                    <div>
                                        <Label>Saída</Label>
                                        <Input
                                            type="date"
                                            value={data.check_out}
                                            onChange={e => setData('check_out', e.target.value)}
                                        />
                                        {errors.check_out && <span className="text-red-500 text-sm">{errors.check_out}</span>}
                                    </div>
                                </div>

                                {/* Quarto (Dinâmico) */}
                                <div>
                                    <Label>
                                        Quarto Disponível
                                        {data.check_in && data.check_out ? <span className="text-green-600 font-normal ml-2">(Filtrado por data)</span> : ''}
                                    </Label>
                                    <Select
                                        value={data.room_id}
                                        onValueChange={(val) => setData('room_id', val)}
                                        disabled={!data.check_in || !data.check_out} // Trava se não tiver data
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={
                                                (!data.check_in || !data.check_out)
                                                ? "Selecione as datas primeiro..."
                                                : "Escolha o quarto..."
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms && rooms.length > 0 ? (
                                                rooms.map((r) => (
                                                    <SelectItem key={r.id} value={String(r.id)}>
                                                        Quarto {r.number} ({r.type}) - R$ {parseFloat(r.price_per_night).toFixed(2)}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="none" disabled>
                                                    {(!data.check_in || !data.check_out)
                                                        ? "Aguardando datas..."
                                                        : "Nenhum quarto livre nestas datas"}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.room_id && <span className="text-red-500 text-sm">{errors.room_id}</span>}
                                </div>

                                {/* Estacionamento */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                                    <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        🚗 Estacionamento <span className="text-xs font-normal text-gray-500">(Opcional)</span>
                                    </h3>

                                    <div>
                                        <Label>Vaga</Label>
                                        <select
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={data.parking_space_id}
                                            onChange={e => setData('parking_space_id', e.target.value)}
                                        >
                                            <option value="">Não utilizar estacionamento</option>
                                            {parkingSpaces && parkingSpaces.map(space => (
                                                <option key={space.id} value={space.id}>
                                                    {space.number} ({space.type === 'car' ? 'Carro' : 'Moto'}) - R$ {parseFloat(space.price_per_day).toFixed(2)}/dia
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Pagamento */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                                    <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        💰 Pagamento Inicial
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Valor Pago Agora (R$)</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={data.initial_payment}
                                                onChange={e => setData('initial_payment', e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>

                                        {data.initial_payment > 0 && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label>Forma de Pagamento</Label>
                                                <select
                                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={data.payment_method_id}
                                                    onChange={e => setData('payment_method_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Selecione...</option>
                                                    {paymentMethods && paymentMethods.map(method => (
                                                        <option key={method.id} value={method.id}>
                                                            {method.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.payment_method_id && <span className="text-red-500 text-sm">{errors.payment_method_id}</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700" disabled={processing}>
                                    {processing ? 'Processando...' : `Confirmar Reserva (R$ ${(roomTotal + parkingTotal).toFixed(2)})`}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
