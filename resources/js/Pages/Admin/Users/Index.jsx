import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Users, Plus, Edit, Trash2, Shield, Eye, EyeOff, Building2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export default function AdminUsersIndex({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredUsers = users.data.filter(user => {
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && user.active) ||
            (statusFilter === 'inactive' && !user.active);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleToggleStatus = (user) => {
        router.post(route('admin.users.toggle', user.id));
    };

    const handleDelete = (user) => {
        if (confirm(`Tem certeza que deseja desativar o usuário "${user.name}"?`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    const getRoleBadge = (role) => {
        const roleMap = {
            'super_admin': { label: 'Super Admin', className: 'bg-purple-100 text-purple-700' },
            'admin': { label: 'Admin', className: 'bg-red-100 text-red-700' },
            'manager': { label: 'Gerente', className: 'bg-blue-100 text-blue-700' },
            'reception': { label: 'Recepção', className: 'bg-green-100 text-green-700' }
        };
        return roleMap[role] || { label: role, className: 'bg-gray-100 text-gray-700' };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gerenciar Usuários</h2>}>
            <Head title="Gerenciar Usuários" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Filtros e busca */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Filtros</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div>
                                    <Label>Buscar</Label>
                                    <Input
                                        placeholder="Nome ou e-mail..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Cargo</Label>
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="super_admin">Super Admin</option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Gerente</option>
                                        <option value="reception">Recepção</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="active">Ativos</option>
                                        <option value="inactive">Inativos</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <Link href={route('admin.users.create')}>
                                        <Button className="w-full">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Novo Usuário
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lista de Usuários */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Usuários ({filteredUsers.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Usuário</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Cargo</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Hotéis</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Criado em</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => {
                                            const roleBadge = getRoleBadge(user.role);
                                            return (
                                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={roleBadge.className}>
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            {roleBadge.label}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {user.hotels && user.hotels.length > 0 ? (
                                                                user.hotels.slice(0, 2).map((hotel) => (
                                                                    <Badge key={hotel.id} variant="outline" className="text-xs">
                                                                        <Building2 className="h-3 w-3 mr-1" />
                                                                        {hotel.name}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-400">Nenhum hotel</span>
                                                            )}
                                                            {user.hotels && user.hotels.length > 2 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{user.hotels.length - 2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                                            {user.active ? (
                                                                <>
                                                                    <Eye className="h-3 w-3 mr-1" />
                                                                    Ativo
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <EyeOff className="h-3 w-3 mr-1" />
                                                                    Inativo
                                                                </>
                                                            )}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-500">
                                                        {formatDate(user.created_at)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <Link href={route('admin.users.edit', user.id)}>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-3 w-3" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleToggleStatus(user)}
                                                                className={user.active ? 'text-orange-600' : 'text-green-600'}
                                                            >
                                                                {user.active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(user)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginação */}
                            {users.links && users.links.length > 3 && (
                                <div className="flex justify-center mt-6">
                                    <div className="flex gap-2">
                                        {users.links.map((link, index) => (
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
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-12">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                                            ? 'Nenhum usuário encontrado' 
                                            : 'Nenhum usuário cadastrado'
                                        }
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                                            ? 'Tente ajustar os filtros de busca.'
                                            : 'Comece cadastrando seu primeiro usuário.'
                                        }
                                    </p>
                                    {!searchTerm && roleFilter === 'all' && statusFilter === 'all' && (
                                        <Link href={route('admin.users.create')}>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Cadastrar Primeiro Usuário
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
