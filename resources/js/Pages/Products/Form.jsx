import React from 'react';
import { useForm, Link } from '@inertiajs/react'; // Padrão Inertia
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function ProductForm({ product = null }) {
    const isEditing = !!product;

    // UseForm do Inertia conecta direto com o backend
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        price: product?.price || '',
        stock: product?.stock || '',
        description: product?.description || '', // Caso tenha descrição
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('products.update', product.id));
        } else {
            post(route('products.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {isEditing ? `Editar Produto: ${product.name}` : 'Novo Produto'}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Dados do Produto</CardTitle>
                            <Link href={route('products.index')}>
                                <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">

                                <div>
                                    <Label htmlFor="name">Nome do Produto</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Ex: Coca-Cola Lata"
                                    />
                                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Preço Unitário (R$)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                                    </div>

                                    <div>
                                        <Label htmlFor="stock">Estoque Inicial</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={data.stock}
                                            onChange={e => setData('stock', e.target.value)}
                                            placeholder="0"
                                            // Se estiver editando, talvez queira bloquear edição direta de estoque
                                            // disabled={isEditing}
                                        />
                                        {errors.stock && <span className="text-red-500 text-sm">{errors.stock}</span>}
                                        {isEditing && <p className="text-xs text-gray-500 mt-1">Para adicionar estoque, use o botão "Repor" na listagem.</p>}
                                    </div>
                                </div>

                                {/* Campo Opcional de Descrição */}
                                <div>
                                    <Label htmlFor="description">Descrição (Opcional)</Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Detalhes do produto..."
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Link href={route('products.index')}>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                        {processing ? 'Salvando...' : 'Salvar Produto'}
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
