import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import InputMask from 'react-input-mask'; // <--- Importar

export default function GuestForm({ guest = null }) {
    const isEditing = !!guest;

    const { data, setData, post, put, processing, errors } = useForm({
        name: guest?.name || '',
        email: guest?.email || '',
        phone: guest?.phone || '',
        document_type: guest?.document_type || 'CPF',
        document_number: guest?.document_number || guest?.document || '',
        address: guest?.address || '',
    });

    const submit = (e) => {
        e.preventDefault();

        // A limpeza de caracteres (pontos, traços) é feita no Backend (Controller)
        if (isEditing) {
            put(route('guests.update', guest.id));
        } else {
            post(route('guests.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{isEditing ? 'Editar Hóspede' : 'Novo Hóspede'}</h2>}
        >
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados do Hóspede</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Tipo de Documento</Label>
                                        <Select
                                            value={data.document_type}
                                            onValueChange={(val) => {
                                                setData('document_type', val);
                                                // Opcional: Limpar o número ao trocar o tipo para evitar confusão na máscara
                                                // setData('document_number', '');
                                            }}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CPF">CPF</SelectItem>
                                                <SelectItem value="RG">RG</SelectItem>
                                                <SelectItem value="Passaporte">Passaporte</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Número do Documento</Label>

                                        {/* LÓGICA DE MÁSCARAS */}
                                        {data.document_type === 'CPF' ? (
                                            <InputMask
                                                mask="999.999.999-99"
                                                value={data.document_number}
                                                onChange={e => setData('document_number', e.target.value)}
                                            >
                                                {(inputProps) => <Input {...inputProps} placeholder="000.000.000-00" />}
                                            </InputMask>
                                        ) : data.document_type === 'RG' ? (
                                            // MÁSCARA PARA RG (Padrão 9 dígitos, aceita X no final)
                                            <InputMask
                                                mask="99.999.999-*"
                                                value={data.document_number}
                                                onChange={e => setData('document_number', e.target.value)}
                                            >
                                                {(inputProps) => <Input {...inputProps} placeholder="00.000.000-X" />}
                                            </InputMask>
                                        ) : (
                                            // Passaporte ou Outros (Sem máscara)
                                            <Input
                                                value={data.document_number}
                                                onChange={e => setData('document_number', e.target.value)}
                                                placeholder="Número do documento"
                                            />
                                        )}

                                        {errors.document_number && <span className="text-red-500 text-sm">{errors.document_number}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Telefone / Celular</Label>
                                        <InputMask
                                            mask="(99) 99999-9999"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                        >
                                            {(inputProps) => <Input {...inputProps} placeholder="(00) 90000-0000" />}
                                        </InputMask>
                                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                    </div>
                                </div>

                                <div>
                                    <Label>Endereço</Label>
                                    <Input value={data.address} onChange={e => setData('address', e.target.value)} />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Link href={route('guests.index')}>
                                        <Button type="button" variant="outline">Cancelar</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">Salvar</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
