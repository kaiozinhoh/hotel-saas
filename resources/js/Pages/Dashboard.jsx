import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from "@/Components/ui/card"
import { DollarSign, Users, BedDouble, CalendarCheck, Package } from "lucide-react"
import { Badge } from "@/Components/ui/badge";
import { usePage } from '@inertiajs/react';
import HotelSelector from '@/Components/HotelSelector';

const getStatusBadgeColor = (status) => {
    const statusMap = {
        'confirmed': { label: 'Confirmada', className: 'bg-green-600' },
        'pending': { label: 'Pendente', className: 'bg-yellow-500' },
        'completed': { label: 'Concluída', className: 'bg-blue-600' },
        'cancelled': { label: 'Cancelada', className: 'bg-red-600' },
        'checked_in': { label: 'Hospedado', className: 'bg-green-600' },
        'no_show': { label: 'No Show', className: 'bg-gray-600' },
        'confirmado': { label: 'Confirmada', className: 'bg-green-600' },
        'pendente': { label: 'Pendente', className: 'bg-yellow-500' },
        'completado': { label: 'Concluída', className: 'bg-blue-600' },
        'cancelado': { label: 'Cancelada', className: 'bg-red-600' }
    };

    const status_lower = String(status).toLowerCase();
    return statusMap[status_lower] || { label: status, className: 'bg-gray-500' };
};

export default function Dashboard({ stats, topProducts, recentReservations, hotels, currentHotel, currentHotelId }) {

    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Visão Geral</h2>}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Seletor de Hotel */}
                    <HotelSelector 
                        hotels={hotels}
                        currentHotel={currentHotel}
                        currentHotelId={currentHotelId}
                    />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {isAdmin ? (
                            <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Faturamento (Mês)</p>
                                            <div className="mt-2 flex items-baseline gap-2">
                                                <span className="text-2xl font-extrabold text-gray-900">
                                                    R$ {parseFloat(stats.revenueMonth).toFixed(2).replace('.', ',')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-full">
                                            <DollarSign className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-400">Entradas confirmadas</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="bg-slate-50 opacity-70 border-l-4 border-l-gray-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Perfil</p>
                                            <div className="mt-2">
                                                <span className="text-xl font-bold text-gray-700">Recepção</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gray-200 rounded-full">
                                            <Users className="h-6 w-6 text-gray-500" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-400">Acesso Operacional</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ocupação</p>
                                        <div className="mt-2 flex items-baseline gap-2">
                                            <span className="text-3xl font-extrabold text-gray-900">{stats.occupancyRate}%</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-full">
                                        <BedDouble className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {stats.occupiedRooms} de {stats.totalRooms} quartos ocupados
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check-ins Hoje</p>
                                        <div className="mt-2">
                                            <span className="text-3xl font-extrabold text-gray-900">{stats.checkinsToday}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-full">
                                        <CalendarCheck className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs text-gray-400">Chegadas previstas</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-black shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-black-500 uppercase tracking-wider">Total Quartos</p>
                                        <div className="mt-2">
                                            <span className="text-3xl font-extrabold text-gray-900">{stats.totalRooms}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-100 rounded-full">
                                        <Package className="h-6 w-6 text-black" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs text-gray-400">Capacidade total</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-7">
                        <Card className="col-span-4 shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-semibold text-lg text-gray-800">Últimas Reservas</h3>
                                <p className="text-sm text-gray-500">Movimentações recentes no hotel.</p>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-100">
                                    {recentReservations.map((res) => (
                                        <div key={res.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{res.guest?.name || 'Cliente'}</span>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Quarto {res.room?.number || '?'}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className={`w-32 justify-center shadow-none ${getStatusBadgeColor(res.status).className}`}>
                                                    {getStatusBadgeColor(res.status).label}
                                                </Badge>
                                                <span className="font-bold text-sm w-24 text-right text-gray-700">
                                                    R$ {parseFloat(res.total_price || res.total_amount || 0).toFixed(2).replace('.', ',')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {recentReservations.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <CalendarCheck className="h-10 w-10 mb-2 opacity-20" />
                                            <p className="text-sm">Nenhuma reserva recente.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-semibold text-lg text-gray-800">Produtos Mais Vendidos</h3>
                                <p className="text-sm text-gray-500">Itens mais consumidos do mês.</p>
                            </div>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {topProducts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                            <Package className="h-10 w-10 mb-2 opacity-20" />
                                            <p className="text-sm">Nenhum consumo registrado.</p>
                                        </div>
                                    ) : (
                                        topProducts.map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-xs mr-4 text-blue-600">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none text-gray-800">{item.product?.name || 'Item Removido'}</p>
                                                    <p className="text-xs text-muted-foreground">Total vendido</p>
                                                </div>
                                                <div className="font-bold text-gray-700">
                                                    {item.total_qty} <span className="text-xs font-normal text-gray-400">un</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
