import { Head } from '@inertiajs/react';
import { User, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ActivityLogsIndex({ logs }: any) {
  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      create_project: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      update_project: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      delete_project: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      create_task: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      update_task: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    };
    return colors[action] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create_project: 'Créer Projet',
      update_project: 'Mettre à jour Projet',
      delete_project: 'Supprimer Projet',
      create_task: 'Créer Tâche',
      update_task: 'Mettre à jour Tâche',
    };
    return labels[action] || action;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Head title="Journal d'Activités" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal d'Activités</h1>
          <p className="text-sm text-muted-foreground">Toutes les actions effectuées dans le système</p>
        </div>

        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Historique des activités ({logs.length})</CardTitle>
            <CardDescription>Toutes les modifications de votre système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.length > 0 ? (
                logs.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getActionBadgeColor(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(log.created_at)}
                        </span>
                      </div>

                      <p className="text-sm text-foreground mb-2">{log.description}</p>

                      {log.user && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {log.user.name}
                        </div>
                      )}

                      {log.properties && Object.keys(log.properties).length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          <details>
                            <summary className="cursor-pointer font-medium">Détails</summary>
                            <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words">
                              {JSON.stringify(log.properties, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune activité enregistrée</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
