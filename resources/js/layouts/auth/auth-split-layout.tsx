import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { login } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props as any;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
                <div
                    className="absolute inset-0 bg-cover bg-center brightness-[0.4] bg-zinc-900"
                    style={{ backgroundImage: 'url("/images/login-bg.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <Link
                    href={login()}
                    className="relative z-20 flex items-center text-2xl font-bold tracking-tight"
                >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                        <AppLogoIcon className="size-6 fill-current text-white" />
                    </div>
                    {name}
                </Link>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-3">
                        <p className="text-xl font-medium leading-relaxed italic text-slate-100">
                            "La gestion de chantier n'a jamais été aussi fluide. Une vue d'ensemble en temps réel pour bâtir l'avenir avec précision."
                        </p>
                        <footer className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                            Équipe de Gestion du Chantier
                        </footer>
                    </blockquote>
                </div>
            </div>

            <div className="w-full lg:p-12">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
                    <div className="flex flex-col items-center gap-2 lg:hidden mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20 mb-2">
                            <AppLogoIcon className="h-7 fill-current text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
                    </div>

                    <div className="flex flex-col space-y-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{title}</h1>
                        <p className="text-base text-slate-500 max-w-[320px] mx-auto">
                            {description}
                        </p>
                    </div>
                    <div className="p-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
