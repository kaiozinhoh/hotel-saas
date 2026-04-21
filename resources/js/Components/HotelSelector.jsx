import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Building2, ChevronDown } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function HotelSelector({ hotels, currentHotel, currentHotelId }) {
    const { auth } = usePage().props;
    const [isSwitching, setIsSwitching] = useState(false);

    const handleSwitchHotel = (hotelId) => {
        if (hotelId === currentHotelId) return;
        
        setIsSwitching(true);
        router.post(
            route('hotels.switch', hotelId),
            {},
            {
                onSuccess: () => {
                    setIsSwitching(false);
                    // Recarregar a página para atualizar os dados
                    router.reload();
                },
                onError: () => {
                    setIsSwitching(false);
                }
            }
        );
    };

    if (!hotels || hotels.length <= 1) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Hotel Atual</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {currentHotel?.name || 'Nenhum hotel selecionado'}
                        </p>
                    </div>
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-2"
                            disabled={isSwitching}
                        >
                            <span>Trocar Hotel</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        {hotels.map((hotel) => (
                            <DropdownMenuItem
                                key={hotel.id}
                                onClick={() => handleSwitchHotel(hotel.id)}
                                className={`flex flex-col items-start p-3 cursor-pointer ${
                                    hotel.id === currentHotelId 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center space-x-2 w-full">
                                    <Building2 className="h-4 w-4" />
                                    <span className="font-medium">{hotel.name}</span>
                                    {hotel.id === currentHotelId && (
                                        <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            Atual
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 ml-6">
                                    {hotel.rooms_count || 0} quartos • {hotel.reservations_count || 0} reservas
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
