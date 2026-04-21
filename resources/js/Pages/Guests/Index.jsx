import React from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PlusCircle, Pencil, Trash2, Search, Eye } from "lucide-react";
import { Input } from "@/Components/ui/input";

export default function GuestIndex({ guests, filters }) {

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('guests.index'), { search: e.target.value }, { preserveState: true });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Remover este hóspede?')) {
            router.delete(route('guests.destroy', id));
        }
    };

    // Formata CPF (11 dígitos)
    const formatDocument = (doc) => {
        if (!doc) return '';
        const cleanDoc = doc.replace(/\D/g, ''); // Garante que só tem números

        if (cleanDoc.length === 11) { // CPF
            return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
        return doc; // Retorna original se não for CPF
    };

    // Formata Telefone (10 ou 11 dígitos)
    const formatPhone = (phone) => {
        if (!phone) return '-';
        const cleanPhone = phone.replace(/\D/g, '');

        if (cleanPhone.length === 11) { // Celular (11) 91234-5678
            return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        if (cleanPhone.length === 10) { // Fixo (11) 1234-5678
            return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }
        return phone;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Hóspedes</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Base de Hóspedes</CardTitle>
                            <Link href={route('guests.create')}>
                                <Button>
                                    <PlusCircle className="w-4 h-4 mr-2" />Novo Hóspede
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center gap-2">
                                <Search className="h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar por nome, CPF ou email..."
                                    className="max-w-sm"
                                    defaultValue={filters.search}
                                    onKeyDown={handleSearch}
                                />
                            </div>

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Documento</TableHead>
                                            <TableHead>Contato</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guests.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                    Nenhum hóspede encontrado.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            guests.data.map((guest) => (
                                                <TableRow key={guest.id}>
                                                    <TableCell className="font-medium">
                                                        {guest.name}
                                                        <div className="text-xs text-gray-400">{guest.email}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {guest.document_number ? (
                                                            <span>
                                                                <span className="text-xs font-bold text-gray-400 uppercase mr-1">{guest.document_type || 'DOC'}:</span>
                                                                {formatDocument(guest.document_number)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 italic">Não informado</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatPhone(guest.mobile || guest.phone)}
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={route('guests.show', guest.id)}>
                                                                <Button variant="ghost" size="icon" title="Ver Histórico">
                                                                    <Eye className="h-4 w-4 text-slate-600" />
                                                                </Button>
                                                            </Link>
                                                            <Link href={route('guests.edit', guest.id)}>
                                                                <Button variant="ghost" size="icon" title="Editar">
                                                                    <Pencil className="h-4 w-4 text-blue-600" />
                                                                </Button>
                                                            </Link>
                                                            <Button variant="ghost" size="icon" title="Excluir" onClick={() => handleDelete(guest.id)}>
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Paginação */}
                            <div className="mt-4 flex justify-end gap-2">
                                {guests.links.map((link, i) => {
                                    // Decodifica entidades HTML simples ou substitui texto
                                    let label = link.label;
                                    if (label.includes('&laquo;')) label = 'Anterior';
                                    if (label.includes('&raquo;')) label = 'Próximo';

                                    return link.url ? (
                                        <Link key={i} href={link.url}>
                                            <Button
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                            >
                                                {label}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button key={i} variant="ghost" size="sm" disabled>
                                            {label}
                                        </Button>
                                    );
                                })}
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
