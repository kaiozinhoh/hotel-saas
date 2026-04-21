import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Plus, Edit, Trash2, Users, BedDouble, Calendar, Eye } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export default function AdminHotelsIndex({ hotels }) {
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHotels = hotels.data.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (hotel) => {
        if (confirm(`Tem certeza que deseja excluir o hotel "${hotel.name}"?`)) {
            router.delete(route('admin.hotels.destroy', hotel.id));
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gerenciar Hotéis</h2>}>
            <Head title="Gerenciar Hotéis" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header com busca e ações */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 max-w-md">
                            <Input
                                placeholder="Buscar hotéis..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Link href={route('admin.hotels.create')}>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Novo Hotel
                            </Button>
                        </Link>
                    </div>

                    {/* Grid de Hotéis */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredHotels.map((hotel) => (
                            <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{hotel.name}</CardTitle>
                                                <p className="text-sm text-gray-600">{hotel.email}</p>
                                            </div>
                                        </div>
                                        <Badge className={hotel.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                            {hotel.active ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    {/* Endereço */}
                                    <div className="text-sm text-gray-600">
                                        {hotel.address && (
                                            <p>{hotel.address}</p>
                                        )}
                                        {(hotel.city || hotel.state) && (
                                            <p>
                                                {hotel.city}
                                                {hotel.city && hotel.state && ', '}
                                                {hotel.state}
                                            </p>
                                        )}
                                        {!hotel.address && !hotel.city && !hotel.state && (
                                            <p className="text-gray-400">Endereço não informado</p>
                                        )}
                                    </div>

                                    {/* Estatísticas */}
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-center">
                                                <BedDouble className="h-3 w-3 text-gray-400 mr-1" />
                                                <span className="text-sm font-semibold">{hotel.rooms_count || 0}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Quartos</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-center">
                                                <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                                                <span className="text-sm font-semibold">{hotel.reservations_count || 0}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Reservas</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-center">
                                                <Users className="h-3 w-3 text-gray-400 mr-1" />
                                                <span className="text-sm font-semibold">{hotel.users?.length || 0}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Usuários</p>
                                        </div>
                                    </div>

                                    {/* Data de criação */}
                                    <div className="text-xs text-gray-400">
                                        Criado em {formatDate(hotel.created_at)}
                                    </div>

                                    {/* Ações */}
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <Link href={route('admin.hotels.edit', hotel.id)}>
                                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                <Edit className="h-3 w-3" />
                                                Editar
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(hotel)}
                                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Excluir
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Paginação */}
                    {hotels.links && hotels.links.length > 3 && (
                        <div className="flex justify-center">
                            <div className="flex gap-2">
                                {hotels.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-md text-sm ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Estado vazio */}
                    {filteredHotels.length === 0 && (
                        <div className="text-center py-12">
                            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'Nenhum hotel encontrado' : 'Nenhum hotel cadastrado'}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm 
                                    ? 'Tente buscar com outros termos.' 
                                    : 'Comece cadastrando seu primeiro hotel.'
                                }
                            </p>
                            {!searchTerm && (
                                <Link href={route('admin.hotels.create')}>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Cadastrar Primeiro Hotel
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
