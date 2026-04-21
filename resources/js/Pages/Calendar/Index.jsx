import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LogOut, LogIn } from "lucide-react";
import { Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

// Configura Dayjs
dayjs.locale('pt-br');

export default function CalendarIndex({ rooms, currentDate, daysInMonth }) {

    const dateObj = dayjs(currentDate);

    const changeMonth = (direction) => {
        const newDate = direction === 'next'
            ? dateObj.add(1, 'month')
            : dateObj.subtract(1, 'month');

        router.get(route('calendar.index'), { date: newDate.format('YYYY-MM-DD') }, { preserveState: true });
    };

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getReservationsForDay = (room, day) => {
        const currentDayStr = dateObj.date(day).format('YYYY-MM-DD');

        return room.reservations.filter(res => {
            const start = dayjs(res.check_in).format('YYYY-MM-DD');
            const end = dayjs(res.check_out).format('YYYY-MM-DD');
            return currentDayStr >= start && currentDayStr <= end;
        });
    };

    const getCellStyle = (res, currentDayStr) => {
        const end = dayjs(res.check_out).format('YYYY-MM-DD');
        const status = res.status;

        let baseColor = 'bg-blue-500';
        if (status === 'confirmed' || status === 'confirmado') baseColor = 'bg-green-600';
        if (status === 'pending' || status === 'pendente') baseColor = 'bg-yellow-500';
        if (status === 'cancelled') baseColor = 'bg-red-500';

        // Dia de Saída (Degradê)
        if (currentDayStr === end) {
            if (status === 'confirmed' || status === 'confirmado') return 'bg-gradient-to-r from-green-600 to-transparent from-40% to-40%';
            if (status === 'pending' || status === 'pendente') return 'bg-gradient-to-r from-yellow-500 to-transparent from-40% to-40%';
            return 'bg-gradient-to-r from-blue-500 to-transparent from-40% to-40%';
        }

        return baseColor;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5"/> Mapa de Reservas
                    </h2>
                    <div className="flex items-center gap-4 bg-white p-1 rounded-lg border shadow-sm">
                        <Button variant="ghost" size="icon" onClick={() => changeMonth('prev')}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="font-bold w-32 text-center capitalize">
                            {dateObj.format('MMMM YYYY')}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => changeMonth('next')}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="py-12">
                <div className="max-w-[98%] mx-auto sm:px-6 lg:px-8">
                    <Card className="overflow-hidden shadow-lg border-0">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr>
                                            <th className="sticky left-0 z-30 bg-white p-3 text-left border-b border-r min-w-[140px] font-bold text-gray-800 shadow-md">
                                                Acomodação
                                            </th>
                                            {daysArray.map(day => {
                                                const dayDate = dateObj.date(day);
                                                const isWeekend = dayDate.day() === 0 || dayDate.day() === 6;
                                                const isToday = dayjs().format('YYYY-MM-DD') === dayDate.format('YYYY-MM-DD');

                                                return (
                                                    <th
                                                        key={day}
                                                        className={`min-w-[42px] text-center border-b border-r p-2 ${isWeekend ? 'bg-slate-50' : 'bg-white'} ${isToday ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] uppercase font-bold tracking-wider">{dayDate.format('ddd')}</span>
                                                            <span className={`text-lg font-bold ${isToday ? 'scale-110' : ''}`}>{day}</span>
                                                        </div>
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map(room => (
                                            <tr key={room.id} className="hover:bg-slate-50 transition-colors h-12">
                                                {/* Coluna do Quarto */}
                                                <td className="sticky left-0 z-20 bg-white p-2 border-r border-b font-medium text-gray-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-800">#{room.number}</span>
                                                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-semibold truncate max-w-[80px]">{room.type}</span>
                                                    </div>
                                                </td>

                                                {/* Colunas dos Dias */}
                                                {daysArray.map(day => {
                                                    const dayStr = dateObj.date(day).format('YYYY-MM-DD');
                                                    const reservations = getReservationsForDay(room, day);

                                                    return (
                                                        <td key={day} className="border-r border-b p-0 relative h-full">
                                                            {reservations.map((res) => {
                                                                const isEnd = dayjs(res.check_out).format('YYYY-MM-DD') === dayStr;

                                                                return (
                                                                    <Link
                                                                        key={res.id}
                                                                        href={route('reservations.show', res.id)}
                                                                        // REMOVI AS MARGENS HORIZONTAIS (mx-0) E USEI WIDTH TOTAL
                                                                        // Isso cria o efeito de barra contínua
                                                                        className={`absolute inset-y-[3px] inset-x-0 flex items-center justify-center text-white text-[9px] overflow-hidden transition-all hover:brightness-110 cursor-pointer ${getCellStyle(res, dayStr)}`}
                                                                        title={`${res.guest.name} (${dayjs(res.check_in).format('DD/MM')} - ${dayjs(res.check_out).format('DD/MM')})`}
                                                                        style={{ zIndex: isEnd ? 10 : 20 }}
                                                                    >
                                                                        {/* LÓGICA ALTERADA: Mostra o nome em TODOS os dias, exceto se for dia de saída (para não cortar o ícone) */}
                                                                        {!isEnd ? (
                                                                            <span className="truncate w-full text-center font-medium px-0.5 leading-none">
                                                                                {res.guest.name.split(' ')[0]}
                                                                            </span>
                                                                        ) : (
                                                                            // No dia de saída, mostra o ícone alinhado à esquerda do espaço colorido
                                                                            <LogOut className="w-3 h-3 text-white/80 -ml-4" />
                                                                        )}
                                                                    </Link>
                                                                );
                                                            })}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Legenda */}
                    <div className="mt-6 flex flex-wrap gap-6 text-xs font-medium text-gray-600 justify-center bg-white p-3 rounded-full shadow-sm w-fit mx-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-600 rounded-sm"></div> Confirmada
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> Pendente
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-600 to-transparent border border-gray-200 rounded-sm"></div> Saída
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
