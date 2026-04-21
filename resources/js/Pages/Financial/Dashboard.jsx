import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, DollarSign, BedDouble } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FinancialDashboard({ kpis, chartData, recentTransactions }) {

    // Função auxiliar para formatar dinheiro
    const formatMoney = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Painel Financeiro</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* 1. KPIs (Indicadores Principais) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-white border-l-4 border-l-green-500 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Receita (Mês)</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{formatMoney(kpis.revenue)}</h3>
                                    </div>
                                    <ArrowUpCircle className="h-8 w-8 text-green-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-l-4 border-l-red-500 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Despesas (Mês)</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{formatMoney(kpis.expenses)}</h3>
                                    </div>
                                    <ArrowDownCircle className="h-8 w-8 text-red-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Lucro Líquido</p>
                                        <h3 className={`text-2xl font-bold ${kpis.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                            {formatMoney(kpis.profit)}
                                        </h3>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-blue-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-l-4 border-l-purple-500 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Ocupação Hoje</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{kpis.occupancy}%</h3>
                                    </div>
                                    <BedDouble className="h-8 w-8 text-purple-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 2. Gráfico e Lista Lado a Lado */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Gráfico (Ocupa 2 colunas) */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Fluxo de Caixa (Últimos 6 Meses)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) => formatMoney(value)}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="Receita" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lista de Transações Recentes (Ocupa 1 coluna) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Entradas Recentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentTransactions.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-4">Nenhuma transação registrada.</p>
                                    ) : (
                                        recentTransactions.map((t) => (
                                            <div key={t.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-medium text-sm text-gray-800">{t.guest}</p>
                                                    <p className="text-xs text-gray-500">{t.method} • {t.date}</p>
                                                </div>
                                                <span className="font-bold text-sm text-green-600">
                                                    +{formatMoney(t.amount)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
