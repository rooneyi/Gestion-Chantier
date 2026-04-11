import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Mail, Lock, UserPlus } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Connexion" />

            {status && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-600 text-center">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-8"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            <div className="grid gap-2.5">
                                <Label htmlFor="email" className="text-sm font-bold text-slate-800 ml-1">Email professionnel</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="votre@entreprise.com"
                                        className="h-12 pl-10 pr-4 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                    />
                                </div>
                                <InputError message={errors.email} className="ml-1" />
                            </div>

                            <div className="grid gap-2.5">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" title="Mot de passe" className="text-sm font-bold text-slate-800">Mot de passe</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                            tabIndex={5}
                                        >
                                            Oublié ?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                                        <Lock size={18} />
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="h-12 pl-10 pr-4 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                    />
                                </div>
                                <InputError message={errors.password} className="ml-1" />
                            </div>

                            <div className="flex items-center justify-between ml-1 pt-1">
                                <div className="flex items-center space-x-2.5">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="h-5 w-5 rounded-md border-slate-300 transition-colors"
                                    />
                                    <Label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">Se souvenir de moi</Label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="h-14 w-full rounded-xl bg-blue-600 font-bold text-base shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-2" />
                                        Authentification...
                                    </>
                                ) : (
                                    "Se connecter"
                                )}
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="relative mt-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">OU</span>
                                </div>
                            </div>
                        )}

                        {canRegister && (
                            <div className="text-center group">
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="inline-flex items-center gap-2 py-3 px-6 rounded-xl border border-slate-100 font-bold text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all no-underline"
                                >
                                    <UserPlus size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                    Créer un nouveau compte
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </div>
    );
}

Login.layout = {
    title: 'Connexion Espace Chantier',
    description: 'Accédez à vos outils de gestion de terrain et de suivi administratif.',
};
