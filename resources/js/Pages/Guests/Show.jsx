import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ArrowLeft, User, Phone, FileText, Mail } from 'lucide-react';

export default function GuestShow({ guest }) {

    // Função auxiliar para exibir documento
    const formatDocument = (doc) => {
        if (!doc) return 'Não informado';
        // Remove tudo que não é número para garantir
        const cleanDoc = doc.replace(/\D/g, '');
        if (cleanDoc.length === 11) return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        return doc;
    };

    // NOVA FUNÇÃO: Formata Telefone (Celular ou Fixo)
    const formatPhone = (phone) => {
        if (!phone) return 'Não informado';
        const cleanPhone = phone.replace(/\D/g, '');

        // Celular (11 dígitos): (11) 91234-5678
        if (cleanPhone.length === 11) {
            return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        // Fixo (10 dígitos): (11) 1234-5678
        if (cleanPhone.length === 10) {
            return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }
        return phone;
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            'confirmed': 'Confirmada',
            'pending': 'Pendente',
            'cancelled': 'Cancelada',
            'completed': 'Concluída',
            'checked_in': 'Hospedado / Check-in',
            'no_show': 'Não Compareceu'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
            case 'completed':
            case 'checked_in':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
            case 'no_show':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfil do Hóspede</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Cartão de Dados Pessoais */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 rounded-full">
                                    <User className="w-8 h-8 text-slate-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{guest.name}</CardTitle>
                                    <p className="text-muted-foreground flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {guest.email || 'Email não informado'}
                                    </p>
                                </div>
                            </div>
                            <Link href={route('guests.index')}>
                                <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar</Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <FileText className="text-gray-400" />
                                <div>
                                    <span className="font-bold block text-xs text-gray-500 uppercase">
                                        {guest.document_type || 'Documento'}
                                    </span>
                                    <span className="text-lg font-medium">
                                        {formatDocument(guest.document_number || guest.document)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Phone className="text-gray-400" />
                                <div>
                                    <span className="font-bold block text-xs text-gray-500 uppercase">Telefone / Celular</span>
                                    {/* APLICANDO A FORMATAÇÃO AQUI */}
                                    <span className="text-lg font-medium">
                                        {formatPhone(guest.mobile || guest.phone)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Histórico de Reservas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Hospedagem</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quarto</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Valor Total</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {guest.reservations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                                Nenhuma reserva encontrada para este hóspede.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        guest.reservations.map((res) => (
                                            <TableRow key={res.id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell>
                                                    {dayjs(res.check_in).format('DD/MM/YYYY')}
                                                </TableCell>
                                                <TableCell>Quarto {res.room?.number || '?'}</TableCell>
                                                <TableCell>
                                                    R$ {parseFloat(res.total_price || 0).toFixed(2).replace('.', ',')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getStatusColor(res.status)}>
                                                        {getStatusLabel(res.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={route('reservations.show', res.id)}>
                                                        <Button size="sm" variant="ghost">Ver Detalhes</Button>
                                                    </Link>
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
