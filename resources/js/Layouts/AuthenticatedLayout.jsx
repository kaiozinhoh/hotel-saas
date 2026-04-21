import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    BedDouble,
    Package,
    DollarSign,
    Settings,
    LogOut,
    Menu,
    X,
    UserCircle
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, app_settings } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role === 'admin';

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- LÓGICA DE NOTIFICAÇÃO ---
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.message) toast(flash.message);
    }, [flash]);

    // Componente de Link do Menu Lateral
    const SidebarLink = ({ href, active, icon: Icon, children }) => (
        <Link
            href={href}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200
            ${active
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            }`}
        >
            <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400'}`} />
            {children}
        </Link>
    );

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

            {/* --- SIDEBAR (Desktop: Fixa / Mobile: Drawer) --- */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo Area */}
                <div className="flex items-center justify-center h-16 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <Link href="/">
                        {app_settings?.logo_url ? (
                            <img src={app_settings.logo_url} alt="Logo" className="h-8 w-auto" />
                        ) : (
                            <ApplicationLogo className="h-8 w-auto fill-current text-blue-600" />
                        )}
                    </Link>
                </div>

                {/* Menu Itens */}
                <nav className="mt-5 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
                    <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Operacional
                    </div>

                    <SidebarLink href={route('dashboard')} active={route().current('dashboard')} icon={LayoutDashboard}>
                        Dashboard
                    </SidebarLink>
                    <SidebarLink href={route('reservations.index')} active={route().current('reservations.*')} icon={CalendarDays}>
                        Reservas
                    </SidebarLink>
                    <SidebarLink href={route('calendar.index')} active={route().current('calendar.*')} icon={CalendarDays}>
                        Mapa / Calendário
                    </SidebarLink>
                    <SidebarLink href={route('guests.index')} active={route().current('guests.*')} icon={Users}>
                        Hóspedes
                    </SidebarLink>
                    <SidebarLink href={route('rooms.index')} active={route().current('rooms.*')} icon={BedDouble}>
                        Acomodações
                    </SidebarLink>
                    <SidebarLink href={route('products.index')} active={route().current('products.*')} icon={Package}>
                        Estoque
                    </SidebarLink>

                    {isAdmin && (
                        <>
                            <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Gestão
                            </div>
                            <SidebarLink href={route('financial.index')} active={route().current('financial.*')} icon={DollarSign}>
                                Financeiro
                            </SidebarLink>
                            <SidebarLink href={route('users.index')} active={route().current('users.*')} icon={Users}>
                                Equipe
                            </SidebarLink>
                            <SidebarLink href={route('settings.edit')} active={route().current('settings.*')} icon={Settings}>
                                Configurações
                            </SidebarLink>
                        </>
                    )}
                </nav>
            </aside>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top Header (Navbar Superior Simples) */}
                <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm">

                    {/* Botão Hamburger (Mobile) */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Título da Página (Opcional, vindo do prop header) */}
                    <div className="flex-1 px-4 font-semibold text-xl text-gray-800 dark:text-gray-200">
                        {header}
                    </div>

                    {/* User Dropdown */}
                    <div className="flex items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out focus:outline-none">
                                    <div className="text-right mr-3 hidden md:block">
                                        <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.name}</div>
                                        <div className="text-xs text-gray-400">{isAdmin ? 'Administrador' : 'Recepcionista'}</div>
                                    </div>
                                    <UserCircle className="w-8 h-8 text-gray-400" />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Meu Perfil</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    <div className="flex items-center text-red-600">
                                        <LogOut className="w-4 h-4 mr-2" /> Sair
                                    </div>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Área de Scroll do Conteúdo */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay para Mobile (fecha sidebar ao clicar fora) */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
                ></div>
            )}

            <Toaster richColors position="top-right" />
        </div>
    );
}
