import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function HotelLanding({ hotel }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={`${hotel.name} - Sistema de Gestão Hoteleira`} />
            
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            {hotel.logo && (
                                <img 
                                    src={hotel.logo} 
                                    alt={hotel.name} 
                                    className="h-12 w-12 object-cover rounded-lg"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
                                <p className="text-sm text-gray-600">Sistema de Gestão Hoteleira</p>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <a 
                                href="/login" 
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Acessar Sistema
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Bem-vindo ao {hotel.name}
                    </h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Sistema completo de gestão hoteleira para otimizar suas operações, 
                        reservas e proporcionar a melhor experiência para seus hóspedes.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a 
                            href="/login" 
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Entrar no Sistema
                        </a>
                        <a 
                            href="/register" 
                            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Criar Conta
                        </a>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Recursos do Sistema
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Gestão de Quartos</h4>
                            <p className="text-gray-600">Controle completo dos quartos, status em tempo real e gestão de limpeza.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Reservas Online</h4>
                            <p className="text-gray-600">Sistema de reservas integrado com calendário visual e confirmação automática.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Financeiro</h4>
                            <p className="text-gray-600">Controle de pagamentos, consumos e relatórios financeiros detalhados.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            {hotel.address && (
                <section className="bg-gray-800 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xl font-semibold mb-4">Informações de Contato</h4>
                                <div className="space-y-2">
                                    <p><strong>Endereço:</strong> {hotel.address}</p>
                                    {hotel.city && <p><strong>Cidade:</strong> {hotel.city}, {hotel.state}</p>}
                                    {hotel.phone && <p><strong>Telefone:</strong> {hotel.phone}</p>}
                                    <p><strong>Email:</strong> {hotel.email}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold mb-4">Horário de Funcionamento</h4>
                                <div className="space-y-2">
                                    <p><strong>Recepção:</strong> 24 horas</p>
                                    <p><strong>Check-in:</strong> 14:00</p>
                                    <p><strong>Check-out:</strong> 12:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2024 {hotel.name}. Todos os direitos reservados.</p>
                    <p className="mt-2 text-gray-400">
                        Desenvolvido por Hotel Manager SaaS
                    </p>
                </div>
            </footer>
        </div>
    );
}
