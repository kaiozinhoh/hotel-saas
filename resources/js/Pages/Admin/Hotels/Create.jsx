import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Link } from '@inertiajs/react';

export default function AdminHotelsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Brasil',
        description: '',
        rooms_count: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.hotels.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Novo Hotel</h2>}>
            <Head title="Novo Hotel" />
            
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link href={route('admin.hotels.index')} className="flex items-center text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar para Hotéis
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Cadastrar Novo Hotel
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Informações Básicas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informações Básicas</h3>
                                    
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="name">Nome do Hotel *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Ex: Hotel Paradise"
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="email">E-mail *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="contato@hotel.com"
                                                required
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Telefone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="(11) 99999-9999"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="rooms_count">Número de Quartos *</Label>
                                            <Input
                                                id="rooms_count"
                                                type="number"
                                                min="1"
                                                value={data.rooms_count}
                                                onChange={(e) => setData('rooms_count', parseInt(e.target.value))}
                                                required
                                            />
                                            {errors.rooms_count && <p className="text-red-500 text-sm mt-1">{errors.rooms_count}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="country">País</Label>
                                            <Input
                                                id="country"
                                                type="text"
                                                value={data.country}
                                                onChange={(e) => setData('country', e.target.value)}
                                            />
                                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Endereço */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Endereço</h3>
                                    
                                    <div>
                                        <Label htmlFor="address">Endereço</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Rua das Flores, 123"
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div>
                                            <Label htmlFor="city">Cidade</Label>
                                            <Input
                                                id="city"
                                                type="text"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                placeholder="São Paulo"
                                            />
                                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="state">Estado</Label>
                                            <Input
                                                id="state"
                                                type="text"
                                                value={data.state}
                                                onChange={(e) => setData('state', e.target.value)}
                                                placeholder="SP"
                                            />
                                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="postal_code">CEP</Label>
                                            <Input
                                                id="postal_code"
                                                type="text"
                                                value={data.postal_code}
                                                onChange={(e) => setData('postal_code', e.target.value)}
                                                placeholder="01234-567"
                                            />
                                            {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Descrição</h3>
                                    
                                    <div>
                                        <Label htmlFor="description">Descrição do Hotel</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Descreva as características do hotel, serviços oferecidos, etc."
                                            rows={4}
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex justify-end gap-4 pt-6 border-t">
                                    <Link href={route('admin.hotels.index')}>
                                        <Button variant="outline" type="button">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Cadastrando...' : 'Cadastrar Hotel'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
