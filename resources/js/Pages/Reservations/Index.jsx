import React from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ShoppingBag, LogOut, XCircle, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import dayjs from 'dayjs';
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const getStatusBadge = (status) => {
    const statusMap = {
        'confirmed': { label: 'Confirmada', className: 'bg-green-600' },
        'confirmado': { label: 'Confirmada', className: 'bg-green-600' },
        'pending': { label: 'Pendente', className: 'bg-yellow-500' },
        'pendente': { label: 'Pendente', className: 'bg-yellow-500' },
        'completed': { label: 'Concluída', className: 'bg-blue-600' },
        'completado': { label: 'Concluída', className: 'bg-blue-600' },
        'cancelled': { label: 'Cancelada', className: 'bg-red-600' },
        'cancelado': { label: 'Cancelada', className: 'bg-red-600' }
    };

    const status_lower = String(status).toLowerCase();
    const config = statusMap[status_lower] || { label: status.toUpperCase(), className: 'bg-gray-500' };

    // CORREÇÃO: Adicionado w-28 (largura fixa) e justify-center
    return <Badge className={`w-28 justify-center ${config.className}`}>{config.label}</Badge>;
};

export default function ReservationIndex({ reservations }) {

    const handleCheckout = (id) => {
        if(confirm('Deseja iniciar o check-out desta reserva?')) {
            router.visit(route('reservations.show', id));
        }
    };

    const handleCancel = (id) => {
        if(confirm('Tem certeza que deseja cancelar esta reserva? O quarto será liberado.')) {
            router.post(route('reservations.cancel', id));
        }
    };

    const [searchParams, setSearchParams] = React.useState({
        status: new URLSearchParams(window.location.search).get('status') || 'all',
        date_start: new URLSearchParams(window.location.search).get('date_start') || '',
        date_end: new URLSearchParams(window.location.search).get('date_end') || '',
        search: new URLSearchParams(window.location.search).get('search') || '',
    });

    const applyFilters = () => {
        const params = {};
        if (searchParams.status && searchParams.status !== 'all') params.status = searchParams.status;
        if (searchParams.date_start) params.date_start = searchParams.date_start;
        if (searchParams.date_end) params.date_end = searchParams.date_end;
        if (searchParams.search) params.search = searchParams.search;

        router.get(route('reservations.index'), params, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reservas</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4">
                    {/* BARRA DE FILTROS */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Buscar Hóspede</label>
                                    <Input
                                        placeholder="Nome..."
                                        value={searchParams.search}
                                        onChange={(e) => setSearchParams({...searchParams, search: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Situação</label>
                                    <Select
                                        value={searchParams.status}
                                        onValueChange={(val) => setSearchParams({...searchParams, status: val})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="confirmed">Confirmada</SelectItem>
                                            <SelectItem value="pending">Pendente</SelectItem>
                                            <SelectItem value="completed">Concluída</SelectItem>
                                            <SelectItem value="cancelled">Cancelada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Data Entrada (De)</label>
                                    <Input
                                        type="date"
                                        value={searchParams.date_start}
                                        onChange={(e) => setSearchParams({...searchParams, date_start: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <Button className="w-full" onClick={applyFilters}>Filtrar</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Reservas</CardTitle>
                            <Link href={route('reservations.create')}>
                                <Button>+ Nova</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-[100px] text-xs font-bold text-gray-500 uppercase tracking-wider">Quarto</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hóspede</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Período</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</TableHead>
                                        <TableHead className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservations.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="p-4 bg-gray-100 rounded-full">
                                                        <CalendarCheck className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-lg font-medium text-gray-900">Sem reservas aqui</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Não encontramos nenhuma reserva com os filtros atuais.
                                                        </p>
                                                    </div>
                                                    <Button variant="outline" onClick={() => window.location.href = route('reservations.create')}>
                                                        Criar nova reserva
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        reservations.data.map((res) => (
                                            <TableRow key={res.id} className="hover:bg-blue-50/30 transition-colors cursor-default">
                                                <TableCell className="font-medium">#{res.room?.number || 'N/A'}</TableCell>
                                                <TableCell>{res.guest?.name || 'Anônimo'}</TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {dayjs(res.check_in).format('DD/MM/YYYY')} <br/>
                                                    até {dayjs(res.check_out).format('DD/MM/YYYY')}
                                                </TableCell>

                                                <TableCell>
                                                    {/* CORREÇÃO: Formatação de Moeda com Vírgula */}
                                                    R$ {parseFloat(res.total_price || res.total_amount || 0).toFixed(2).replace('.', ',')}
                                                </TableCell>

                                                <TableCell>{getStatusBadge(res.status)}</TableCell>

                                                <TableCell className="text-right flex justify-end gap-2">
                                                    <Link href={route('reservations.show', res.id)}>
                                                        <Button size="icon" variant="ghost" title="Ver Detalhes">
                                                            <ShoppingBag className="w-4 h-4 text-slate-600" />
                                                        </Button>
                                                    </Link>

                                                    {(res.status === 'confirmed' || res.status === 'pending') && (
                                                        <>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleCheckout(res.id)}
                                                                title="Ir para Check-out"
                                                            >
                                                                <LogOut className="w-4 h-4 text-blue-600" />
                                                            </Button>

                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleCancel(res.id)}
                                                                title="Cancelar Reserva"
                                                                className="hover:bg-red-50"
                                                            >
                                                                <XCircle className="w-4 h-4 text-red-500" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
