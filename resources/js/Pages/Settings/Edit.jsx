import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, router } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Save } from "lucide-react";
import InputMask from 'react-input-mask'; // <--- BIBLIOTECA DE MÁSCARA

export default function SettingsEdit({ setting }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        hotel_name: setting.hotel_name || '',
        logo: null,
        cnpj: setting.cnpj || '',
        email: setting.email || '',
        phone: setting.phone || '',
        address: setting.address || '',
        check_in_time: setting.check_in_time || '14:00', // Padrão HH:mm
        check_out_time: setting.check_out_time || '12:00',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('settings.update'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Configurações</h2>}
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Dados Gerais</CardTitle>
                                <CardDescription>Essas informações aparecerão nos relatórios e comprovantes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                {/* Upload de Logo */}
                                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg border">
                                    <div className="shrink-0">
                                        {setting.logo_path ? (
                                            <img src={`/storage/${setting.logo_path}`} alt="Logo" className="h-20 w-20 object-contain bg-white rounded border" />
                                        ) : (
                                            <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Sem Logo</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="logo">Logotipo</Label>
                                        <Input id="logo" type="file" accept="image/*" onChange={(e) => setData('logo', e.target.files[0])} className="bg-white mt-1" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Nome do Estabelecimento</Label>
                                        <Input value={data.hotel_name} onChange={(e) => setData('hotel_name', e.target.value)} required />
                                        {errors.hotel_name && <span className="text-red-500 text-sm">{errors.hotel_name}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>CNPJ</Label>
                                        {/* MÁSCARA DE CNPJ */}
                                        <InputMask
                                            mask="99.999.999/9999-99"
                                            value={data.cnpj}
                                            onChange={(e) => setData('cnpj', e.target.value)}
                                        >
                                            {(inputProps) => <Input {...inputProps} placeholder="00.000.000/0000-00" />}
                                        </InputMask>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Telefone / WhatsApp</Label>
                                        {/* MÁSCARA DE TELEFONE (9 Dígitos) */}
                                        <InputMask
                                            mask="(99) 99999-9999"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        >
                                            {(inputProps) => <Input {...inputProps} placeholder="(00) 00000-0000" />}
                                        </InputMask>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Endereço</Label>
                                    <Input value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                                    <div className="space-y-2">
                                        <Label>Horário Padrão Check-in</Label>
                                        {/* MÁSCARA DE HORA */}
                                        <InputMask
                                            mask="99:99"
                                            value={data.check_in_time}
                                            onChange={(e) => setData('check_in_time', e.target.value)}
                                        >
                                            {(inputProps) => <Input {...inputProps} placeholder="14:00" />}
                                        </InputMask>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Horário Padrão Check-out</Label>
                                        {/* MÁSCARA DE HORA */}
                                        <InputMask
                                            mask="99:99"
                                            value={data.check_out_time}
                                            onChange={(e) => setData('check_out_time', e.target.value)}
                                        >
                                            {(inputProps) => <Input {...inputProps} placeholder="12:00" />}
                                        </InputMask>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                        <Save className="w-4 h-4 mr-2" /> Salvar Configurações
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
