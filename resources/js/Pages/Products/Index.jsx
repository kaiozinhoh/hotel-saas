import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PlusCircle, Pencil, Trash2, Package, PackagePlus, Search } from "lucide-react";
import { Input } from "@/Components/ui/input";

export default function ProductIndex({ products, filters }) {
    // Estados para controlar o Modal de Reposição
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Formulário do Inertia para a reposição
    const { data, setData, post, processing, reset, errors } = useForm({
        quantity: '',
        unit_cost: ''
    });

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('products.index'), { search: e.target.value }, { preserveState: true });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Remover este produto?')) {
            router.delete(route('products.destroy', id));
        }
    };

    // Funções para abrir e fechar o modal
    const openRestockModal = (product) => {
        setSelectedProduct(product);
        setData({ quantity: '', unit_cost: '' }); // Limpa o form
        setIsRestockModalOpen(true);
    };

    const closeRestockModal = () => {
        setIsRestockModalOpen(false);
        setSelectedProduct(null);
        reset();
    };

    // Enviar a reposição
    const submitRestock = (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        post(route('products.add_stock', selectedProduct.id), {
            onSuccess: () => {
                closeRestockModal();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Estoque e Produtos</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Catálogo de Produtos</CardTitle>
                            <Link href={route('products.create')}>
                                <Button>
                                    <PlusCircle className="w-4" />Novo
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center gap-2">
                                <Search className="h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar produto..."
                                    className="max-w-sm"
                                    defaultValue={filters.search}
                                    onKeyDown={handleSearch}
                                />
                            </div>

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>Preço</TableHead>
                                            <TableHead>Estoque</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                    Nenhum produto cadastrado.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            products.data.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell className="font-medium flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-gray-400" />
                                                        {product.name}
                                                    </TableCell>
                                                    <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <span className={product.stock < 5 ? "text-red-500 font-bold" : "text-green-600"}>
                                                            {product.stock} un.
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2">

                                                        {/* Botão de Reposição */}
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => openRestockModal(product)}
                                                            title="Repor Estoque"
                                                            className="border-green-200 hover:bg-green-50 hover:text-green-700"
                                                        >
                                                            <PackagePlus className="h-4 w-4 text-green-600" />
                                                        </Button>

                                                        <Link href={route('products.edit', product.id)}>
                                                            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4 text-blue-600" /></Button>
                                                        </Link>

                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Paginação */}
                            <div className="mt-4 flex justify-end gap-2">
                                {products.links?.map((link, i) => {
                                    // Sanitização Manual: Troca HTML entities por texto
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

            {/* --- MODAL DE REPOSIÇÃO --- */}
            {isRestockModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">
                                Repor Estoque: <span className="text-blue-600">{selectedProduct?.name}</span>
                            </h3>
                            <button onClick={closeRestockModal} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitRestock} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantidade a Adicionar
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    required
                                    value={data.quantity}
                                    onChange={e => setData('quantity', e.target.value)}
                                    placeholder="Ex: 12"
                                />
                                {errors.quantity && <div className="text-red-500 text-sm mt-1">{errors.quantity}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Custo Unitário da Compra (Opcional)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.unit_cost}
                                    onChange={e => setData('unit_cost', e.target.value)}
                                    placeholder="Quanto você pagou por unidade?"
                                />
                                <p className="text-xs text-gray-500 mt-1">Usado para calcular margem de lucro.</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={closeRestockModal}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                                    {processing ? 'Salvando...' : 'Confirmar Entrada'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
