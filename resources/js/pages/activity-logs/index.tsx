import { Head } from '@inertiajs/react';
import { 
  User, Clock, FileText, Activity, Layers, 
  Trash2, Edit3, PlusCircle, ChevronRight, Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ActivityLogsIndex({ logs }: any) {
  const getActionTheme = (action: string) => {
    const themes: Record<string, { color: string, icon: any, label: string }> = {
      create_project: { color: 'blue', icon: PlusCircle, label: 'Création Projet' },
      update_project: { color: 'amber', icon: Edit3, label: 'Modification Projet' },
      delete_project: { color: 'rose', icon: Trash2, label: 'Suppression Projet' },
      create_task: { color: 'emerald', icon: PlusCircle, label: 'Nouvelle Tâche' },
      update_task: { color: 'purple', icon: Edit3, label: 'MàJ Tâche' },
      default: { color: 'slate', icon: Activity, label: 'Action Système' }
    };
    return themes[action] || themes.default;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const colorVariants: any = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-200",
    amber: "bg-amber-500/10 text-amber-600 border-amber-200",
    rose: "bg-rose-500/10 text-rose-600 border-rose-200",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    purple: "bg-purple-500/10 text-purple-600 border-purple-200",
    slate: "bg-slate-500/10 text-slate-600 border-slate-200",
  };

  return (
    <>
      <Head title="Journal d'Activités" />

      <div className="relative space-y-8 pb-10">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[500px] bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.05),transparent_40%)]" />

        <div className="flex flex-col gap-2">
            <h1 className="text-[42px] font-bold tracking-tight text-slate-900">Audit & Activités</h1>
            <p className="text-lg text-slate-500">Transparence totale sur les modifications effectuées</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Summary Statistics */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="border-0 bg-slate-900 text-white shadow-xl overflow-hidden relative">
                    <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-white/5 blur-2xl" />
                    <CardHeader>
                        <CardTitle className="text-white/60 text-xs font-bold uppercase tracking-widest">Aperçu</CardTitle>
                        <div className="text-4xl font-black">{logs.length}</div>
                        <p className="text-white/40 text-sm">Événements enregistrés</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs font-medium text-white/80">
                            <Info className="h-4 w-4 text-purple-400" />
                            Les logs sont conservés pendant 3 mois.
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)]">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold">Légende des actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {['create_project', 'update_project', 'delete_project', 'create_task'].map(act => {
                            const theme = getActionTheme(act);
                            return (
                                <div key={act} className="flex items-center gap-3">
                                    <div className={cn("h-2 w-2 rounded-full", `bg-${theme.color}-500`)} />
                                    <span className="text-sm font-semibold text-slate-600">{theme.label}</span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Main Timeline */}
            <div className="lg:col-span-8">
                <Card className="border-0 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
                    <CardHeader className="border-b border-slate-50 pb-6 pt-6 px-8">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-purple-500" />
                            File d'événements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {logs.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {logs.map((log: any) => {
                                    const theme = getActionTheme(log.action);
                                    const Icon = theme.icon;
                                    return (
                                        <div key={log.id} className="group relative p-8 transition-all hover:bg-slate-50/50">
                                            <div className="flex items-start gap-6">
                                                <div className={cn(
                                                    "flex h-12 w-12 items-center justify-center rounded-2xl border bg-white shadow-sm transition-transform group-hover:scale-110",
                                                    colorVariants[theme.color]
                                                )}>
                                                    <Icon className="h-6 w-6" />
                                                </div>

                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-black text-slate-900">{theme.label}</span>
                                                            <div className="h-1 w-1 rounded-full bg-slate-300" />
                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 capitalize">
                                                                <Clock className="h-3 w-3" />
                                                                {formatDate(log.created_at)}
                                                            </span>
                                                        </div>
                                                        {log.user && (
                                                            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                                                                <User className="h-3 w-3" />
                                                                {log.user.name.toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-sm leading-relaxed text-slate-600 font-medium">
                                                        {log.description}
                                                    </p>

                                                    {log.properties && Object.keys(log.properties).length > 0 && (
                                                        <div className="mt-4">
                                                            <details className="group/details">
                                                                <summary className="flex cursor-pointer items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-600 list-none">
                                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white transition-transform group-open/details:rotate-90">
                                                                        <ChevronRight className="h-3 w-3" />
                                                                    </div>
                                                                    Détails techniques
                                                                </summary>
                                                                <div className="mt-3 overflow-hidden rounded-2xl bg-slate-900 p-5 shadow-inner">
                                                                    <pre className="text-[11px] font-medium leading-relaxed text-purple-200/80 whitespace-pre-wrap">
                                                                        {JSON.stringify(log.properties, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            </details>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
                                <div className="rounded-full bg-slate-50 p-6 mb-4">
                                    <Layers className="h-12 w-12 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Aucune activité</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm">Les événements apparaîtront ici dès qu'une action sera effectuée dans le système.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </>
  );
}
