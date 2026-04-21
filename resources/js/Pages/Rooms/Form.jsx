import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function RoomForm({ room = null }) {
    const isEditing = !!room;

    // Padrão Inertia: conecta direto com o backend e recebe erros automaticamente
    const { data, setData, post, put, processing, errors } = useForm({
        number: room?.number || '',
        type: room?.type || 'Standard',
        price_per_night: room?.price_per_night || '',
        status: room?.status || 'available',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('rooms.update', room.id));
        } else {
            post(route('rooms.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {isEditing ? `Editar Quarto ${room.number}` : 'Novo Quarto'}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Detalhes da Acomodação</CardTitle>
                            <Link href={route('rooms.index')}>
                                <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="number">Número / Nome do Quarto</Label>
                                        <Input
                                            id="number"
                                            value={data.number}
                                            onChange={e => setData('number', e.target.value)}
                                            placeholder="Ex: 101"
                                        />
                                        {errors.number && <span className="text-red-500 text-sm">{errors.number}</span>}
                                    </div>

                                    <div>
                                        <Label>Tipo</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(val) => setData('type', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Standard">Standard</SelectItem>
                                                <SelectItem value="Luxo">Luxo</SelectItem>
                                                <SelectItem value="Suíte Master">Suíte Master</SelectItem>
                                                <SelectItem value="Família">Família</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <span className="text-red-500 text-sm">{errors.type}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Preço da Diária (R$)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price_per_night}
                                            onChange={e => setData('price_per_night', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors.price_per_night && <span className="text-red-500 text-sm">{errors.price_per_night}</span>}
                                    </div>

                                    <div>
                                        <Label>Status Atual</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(val) => setData('status', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Disponível</SelectItem>
                                                <SelectItem value="occupied">Ocupado</SelectItem>
                                                <SelectItem value="cleaning">Limpeza</SelectItem>
                                                <SelectItem value="maintenance">Manutenção</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <span className="text-red-500 text-sm">{errors.status}</span>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Link href={route('rooms.index')}>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                        {processing ? 'Salvando...' : 'Salvar Quarto'}
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
