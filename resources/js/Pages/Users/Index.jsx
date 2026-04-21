import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, router } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { UserPlus, Trash2, Shield, User as UserIcon } from "lucide-react";

export default function UsersIndex({ users }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'receptionist'
    });

    const [isCreating, setIsCreating] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                setIsCreating(false);
                reset();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Tem certeza? Esse usuário perderá o acesso imediatamente.')) {
            router.delete(route('users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestão de Equipe</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Formulário de Cadastro (Toggle) */}
                    <div className="flex justify-end">
                        <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? "secondary" : "default"}>
                            {isCreating ? 'Cancelar Cadastro' : <><UserPlus className="mr-2 h-4 w-4"/> Novo Usuário</>}
                        </Button>
                    </div>

                    {isCreating && (
                        <Card className="animate-in fade-in slide-in-from-top-4">
                            <CardHeader>
                                <CardTitle>Cadastrar Novo Colaborador</CardTitle>
                                <CardDescription>Crie um acesso para recepcionistas ou gerentes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Nome Completo</Label>
                                            <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Ex: Maria Souza" required />
                                            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                        </div>
                                        <div>
                                            <Label>Email de Acesso</Label>
                                            <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="maria@hotel.com" required />
                                            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                        </div>
                                        <div>
                                            <Label>Senha Provisória</Label>
                                            <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                                        </div>
                                        <div>
                                            <Label>Confirmar Senha</Label>
                                            <Input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                                        </div>
                                        <div>
                                            <Label>Nível de Acesso</Label>
                                            <Select value={data.role} onValueChange={val => setData('role', val)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="receptionist">Recepcionista (Padrão)</SelectItem>
                                                    <SelectItem value="admin">Administrador (Total)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                            Salvar Usuário
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Lista de Usuários */}
                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Cargo</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                Nenhum outro usuário cadastrado.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    {user.role === 'admin' ? (
                                                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex w-fit items-center gap-1">
                                                            <Shield className="h-3 w-3" /> Admin
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="flex w-fit items-center gap-1">
                                                            <UserIcon className="h-3 w-3" /> Recepção
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
