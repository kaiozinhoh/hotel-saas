import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import HotelSelector from '@/Components/HotelSelector';
import { Head } from '@inertiajs/react';
import { Building2, Users, BedDouble, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

export default function HotelsIndex({ hotels, currentHotel, currentHotelId }) {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Meus Hotéis</h2>}>
            <Head title="Meus Hotéis" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Seletor de Hotel */}
                    <HotelSelector 
                        hotels={hotels}
                        currentHotel={currentHotel}
                        currentHotelId={currentHotelId}
                    />

                    {/* Grid de Hotéis */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {hotels.map((hotel) => (
                            <Card 
                                key={hotel.id} 
                                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                                    hotel.id === currentHotelId 
                                        ? 'ring-2 ring-blue-500 border-blue-200' 
                                        : 'hover:border-gray-300'
                                }`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <Building2 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        {hotel.id === currentHotelId && (
                                            <Badge className="bg-blue-100 text-blue-700">
                                                Atual
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {hotel.name}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-600 mb-4">
                                        {hotel.address && `${hotel.address}, ${hotel.city || ''}`}
                                        {hotel.city && !hotel.address && hotel.city}
                                        {!hotel.address && !hotel.city && 'Endereço não informado'}
                                    </p>
                                    
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="flex items-center justify-center mb-1">
                                                <BedDouble className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {hotel.rooms_count || 0}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">Quartos</p>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center justify-center mb-1">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {hotel.reservations_count || 0}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">Reservas</p>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center justify-center mb-1">
                                                <Users className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {hotel.users?.length || 0}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">Usuários</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Status</span>
                                            <Badge className={hotel.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                                {hotel.active ? 'Ativo' : 'Inativo'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    {hotels.length === 0 && (
                        <div className="text-center py-12">
                            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhum hotel encontrado
                            </h3>
                            <p className="text-gray-500">
                                Você não tem acesso a nenhum hotel no momento.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
