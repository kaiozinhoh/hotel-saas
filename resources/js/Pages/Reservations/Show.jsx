import React, { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react'; // Adicionado usePage
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import { ArrowLeft, Printer, Plus, Trash2, ShoppingCart, CheckCircle, X, Car } from "lucide-react";
import dayjs from 'dayjs';

export default function ReservationShow({ reservation, products, paymentMethods }) {

    // --- 1. PERMISSÕES (ACL) ---
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    // --- HELPER: Tradução e Cores de Status ---
    const getStatusConfig = (status) => {
        const map = {
            'confirmed': { label: 'CONFIRMADA', classes: 'bg-green-100 text-green-800 border-green-200' },
            'confirmado': { label: 'CONFIRMADA', classes: 'bg-green-100 text-green-800 border-green-200' },
            'completed': { label: 'FINALIZADA', classes: 'bg-blue-100 text-blue-800 border-blue-200' },
            'completado': { label: 'FINALIZADA', classes: 'bg-blue-100 text-blue-800 border-blue-200' },
            'cancelled': { label: 'CANCELADA', classes: 'bg-red-100 text-red-800 border-red-200' },
            'cancelado': { label: 'CANCELADA', classes: 'bg-red-100 text-red-800 border-red-200' },
            'pending': { label: 'PENDENTE', classes: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            'pendente': { label: 'PENDENTE', classes: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        };
        const key = String(status).toLowerCase();
        return map[key] || { label: status.toUpperCase(), classes: 'bg-gray-100 text-gray-800 border-gray-200' };
    };

    const statusConfig = getStatusConfig(reservation.status);

    // --- CORREÇÃO DE DATAS (SEM FUSO HORÁRIO) ---

    // Essa função ignora o timezone do navegador e formata a string YYYY-MM-DD diretamente
    const formatDateSafe = (dateString) => {
        if (!dateString) return '--/--/----';
        // Pega apenas os 10 primeiros caracteres (YYYY-MM-DD) para ignorar horas se houver
        const cleanDate = dateString.toString().substring(0, 10);
        const [year, month, day] = cleanDate.split('-');
        return `${day}/${month}/${year}`;
    };

    // Cálculo de Dias (Duração)
    // Usamos o dayjs apenas para calcular a diferença, mas exibimos com a função acima
    const start = dayjs(reservation.check_in).startOf('day');
    const end = dayjs(reservation.check_out).startOf('day');
    let days = end.diff(start, 'day');
    if (days < 1) days = 1;

    // --- CÁLCULOS FINANCEIROS ---

    // 2. Calcular Total Quarto
    const roomPrice = parseFloat(reservation.daily_price_snapshot || reservation.room.price_per_night);
    const totalRoom = roomPrice * days;

    // 3. Calcular Total Estacionamento
    const totalParking = reservation.parking_assignments?.reduce((acc, curr) => {
        const price = parseFloat(curr.parking_space?.price_per_day || 0);
        return acc + (price * days);
    }, 0) || 0;

    // 4. Calcular Consumo
    const totalConsumo = reservation.consumptions.reduce((acc, item) => acc + parseFloat(item.total_price), 0);

    // 5. Total Geral e Pagamentos
    const totalGeral = totalRoom + totalParking + totalConsumo;
    const totalPago = reservation.payments?.reduce((acc, pay) => pay.status === 'paid' ? acc + parseFloat(pay.amount) : acc, 0) || 0;
    const faltaPagar = totalGeral - totalPago;


    // --- LÓGICA DE AÇÕES ---
    const { data, setData, post, processing, errors, reset } = useForm({ product_id: '', quantity: 1 });
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const checkoutForm = useForm({ payment_method_id: '', amount_paid: '', notes: '' });

    const handleAddConsumption = (e) => {
        e.preventDefault();
        post(route('consumption.store', reservation.id), { onSuccess: () => reset() });
    };

    const handleDeleteConsumption = (id) => {
        if (confirm('Tem certeza? O item será devolvido ao estoque.')) {
            router.delete(route('consumption.destroy', id));
        }
    };

    const openCheckout = () => {
        checkoutForm.setData({
            payment_method_id: '',
            amount_paid: faltaPagar > 0 ? faltaPagar.toFixed(2) : '0.00',
            notes: ''
        });
        setIsCheckoutModalOpen(true);
    };

    const submitCheckout = (e) => {
        e.preventDefault();
        checkoutForm.post(route('checkout.store', reservation.id), {
            onSuccess: () => setIsCheckoutModalOpen(false)
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestão da Reserva #{reservation.id}</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Barra de Topo */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <Button variant="outline" onClick={() => router.visit(route('reservations.index'))}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                        <div className="flex items-center gap-3">
                            <a href={route('receipt.show', reservation.id)} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" className="bg-white border hover:bg-gray-50 text-gray-700">
                                    <Printer className="mr-2 h-4 w-4" /> PDF / Comprovante
                                </Button>
                            </a>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${statusConfig.classes}`}>
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>

                    {/* Informações Básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Hóspede</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p><span className="font-bold text-gray-600">Nome:</span> {reservation.guest.name}</p>
                                <p><span className="font-bold text-gray-600">Doc:</span> {reservation.guest.document_number || reservation.guest.document || 'N/A'}</p>
                                <p><span className="font-bold text-gray-600">Email:</span> {reservation.guest.email || 'Não informado'}</p>
                                <p><span className="font-bold text-gray-600">Telefone:</span> {reservation.guest.mobile || reservation.guest.phone || 'N/A'}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Hospedagem</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p><span className="font-bold text-gray-600">Quarto:</span> {reservation.room.number} ({reservation.room.type})</p>

                                {/* AQUI ESTÁ A CORREÇÃO VISUAL: Usamos formatDateSafe em vez de new Date() */}
                                <p><span className="font-bold text-gray-600">Entrada:</span> {formatDateSafe(reservation.check_in)}</p>
                                <p><span className="font-bold text-gray-600">Saída:</span> {formatDateSafe(reservation.check_out)}</p>

                                <Separator className="my-2"/>
                                <p><span className="font-bold text-gray-600">Duração:</span> {days} diária(s)</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Área Principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Extrato de Consumo */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Consumo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead className="text-center">Qtd</TableHead>
                                            <TableHead>Valor Un.</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservation.consumptions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-gray-500 py-8">Sem itens adicionados</TableCell>
                                            </TableRow>
                                        ) : (
                                            reservation.consumptions.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.product?.name || 'Item Removido'}</TableCell>
                                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                                    <TableCell>R$ {parseFloat(item.unit_price).toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-bold text-gray-700">R$ {parseFloat(item.total_price).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        {/* LÓGICA DE SEGURANÇA: Só Admin vê o botão de deletar */}
                                                        {isAdmin && (reservation.status === 'confirmed' || reservation.status === 'confirmado') && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:bg-red-50"
                                                                onClick={() => handleDeleteConsumption(item.id)}
                                                                title="Remover Item (Admin)"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Coluna Direita: Ações e Resumo */}
                        <div className="space-y-6">

                            {/* Form Adicionar Item */}
                            <Card className={(reservation.status !== 'confirmado' && reservation.status !== 'confirmed') ? 'hidden' : ''}>
                                <CardHeader><CardTitle className="text-sm uppercase tracking-wide text-gray-500">Adicionar Item</CardTitle></CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAddConsumption} className="space-y-4">
                                        <Select onValueChange={(val) => setData('product_id', val)} value={data.product_id}>
                                            <SelectTrigger><SelectValue placeholder="Selecione o produto" /></SelectTrigger>
                                            <SelectContent>
                                                {products.length === 0 ? <SelectItem value="none" disabled>Sem produtos</SelectItem> :
                                                    products.map((p) => (
                                                        <SelectItem key={p.id} value={String(p.id)}>{p.name} (R$ {parseFloat(p.price).toFixed(2)})</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <div className="flex gap-2">
                                            <Input type="number" min="1" value={data.quantity} onChange={e => setData('quantity', e.target.value)} placeholder="Qtd" className="w-24" />
                                            <Button type="submit" disabled={processing} className="flex-1 bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> Adicionar</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Resumo Financeiro (ATUALIZADO) */}
                            <Card className="bg-slate-900 text-white border-none shadow-xl">
                                <CardHeader className="pb-2"><CardTitle>Resumo Financeiro</CardTitle></CardHeader>
                                <CardContent className="space-y-3">

                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Diárias ({days} dias)</span>
                                        <span>R$ {totalRoom.toFixed(2)}</span>
                                    </div>

                                    {totalParking > 0 && (
                                        <div className="flex justify-between text-sm text-slate-400">
                                            <span className="flex items-center gap-1"><Car className="w-3 h-3"/> Estacionamento</span>
                                            <span>R$ {totalParking.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Consumo</span>
                                        <span>R$ {totalConsumo.toFixed(2)}</span>
                                    </div>

                                    <Separator className="bg-slate-700 my-2" />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Geral</span>
                                        <span>R$ {totalGeral.toFixed(2)}</span>
                                    </div>

                                    {totalPago > 0 && (
                                        <div className="flex justify-between text-sm text-green-400 mt-1">
                                            <span>Já Pago</span>
                                            <span>- R$ {totalPago.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className={`mt-4 p-3 rounded-lg text-center font-bold text-xl border ${faltaPagar <= 0.01 ? 'bg-green-900/50 border-green-500 text-green-400' : 'bg-red-900/50 border-red-500 text-white'}`}>
                                        {faltaPagar <= 0.01 ? 'QUITADO' : `Falta: R$ ${faltaPagar.toFixed(2)}`}
                                    </div>

                                    {/* Botão Check-out */}
                                    {(reservation.status === 'confirmed' || reservation.status === 'confirmado') && (
                                        <div className="pt-4 mt-4 border-t border-slate-700">
                                            <Button onClick={openCheckout} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg">
                                                <CheckCircle className="mr-2 h-5 w-5" /> Finalizar Estadia
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Checkout */}
            {isCheckoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle className="text-green-400" /> Realizar Check-out</h3>
                            <button onClick={() => setIsCheckoutModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
                        </div>
                        <form onSubmit={submitCheckout} className="p-6 space-y-4">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                <p className="text-sm text-yellow-800">Ao confirmar, o quarto <strong>{reservation.room.number}</strong> será marcado para limpeza e a reserva concluída.</p>
                            </div>
                            <div>
                                <Input type="number" step="0.01" value={checkoutForm.data.amount_paid} onChange={e => checkoutForm.setData('amount_paid', e.target.value)} className="text-lg font-bold text-green-700" />
                            </div>
                            <div>
                                <Select value={checkoutForm.data.payment_method_id} onValueChange={(val) => checkoutForm.setData('payment_method_id', val)}>
                                    <SelectTrigger><SelectValue placeholder="Forma de Pagamento..." /></SelectTrigger>
                                    <SelectContent>{paymentMethods?.map((m) => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <Input value={checkoutForm.data.notes} onChange={e => checkoutForm.setData('notes', e.target.value)} placeholder="Observações..." />
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsCheckoutModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={checkoutForm.processing} className="bg-green-600 hover:bg-green-700">Confirmar</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
