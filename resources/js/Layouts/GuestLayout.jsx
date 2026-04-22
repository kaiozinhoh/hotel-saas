import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { app_settings } = usePage().props;
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <Link href="/">
                    {app_settings?.logo_url ? (
                        <img src={app_settings.logo_url} alt="Logo" className="w-24 h-auto mx-auto" />
                    ) : (
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    )}
                </Link>
                {/* Opcional: Mostrar nome do hotel abaixo da logo */}
                {app_settings?.hotel_name && (
                    <h1 className="text-center mt-4 text-xl font-bold text-gray-700">{app_settings.hotel_name}</h1>
                )}
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}
