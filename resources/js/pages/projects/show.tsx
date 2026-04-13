import { Head, router } from '@inertiajs/react';
import { Calendar, DollarSign, MapPin, User, Save, Users } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update, destroy } from '@/actions/App/Http/Controllers/Api/ProjectController';

export default function ProjectDetail({ project, totalWorkers }: any) {
  const [status, setStatus] = React.useState(project.status);
  const [isLoading, setIsLoading] = React.useState(false);

  const statusOptions = [
    { value: 'initialisation', label: 'Initialisation' },
    { value: 'planifie', label: 'Planifié' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'termine', label: 'Terminé' },
  ];

  const getStatusBadgeColor = (statusVal: string) => {
    const colors: Record<string, string> = {
      en_cours: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      initialisation: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      termine: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      planifie: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
    return colors[statusVal] || colors.initialisation;
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    try {
      const updateRoute = update({ project: project.id });
      const response = await fetch(updateRoute.url, {
        method: updateRoute.method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        alert('Erreur lors de la mise à jour');
        return;
      }

      alert('Statut mis à jour avec succès');
      router.visit(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      const destroyRoute = destroy({ project: project.id });
      const response = await fetch(destroyRoute.url, {
        method: destroyRoute.method,
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        alert('Erreur lors de la suppression');
        return;
      }

      router.visit('/projects');
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <>
      <Head title={`Projet: ${project.name}`} />

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="rounded-lg"
          >
            Supprimer le projet
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Budget</Label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-bold">{project.budget?.toLocaleString('fr-FR')} €</span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Dates</Label>
                <div className="flex items-start gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <div>Début: {formatDate(project.start_date)}</div>
                    <div>Fin: {formatDate(project.deadline)}</div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Responsable</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.engineer?.name || 'Non assigné'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Gestion du Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
                  Statut Actuel
                </Label>
                <Badge className={getStatusBadgeColor(project.status)}>
                  {statusOptions.find((s) => s.value === project.status)?.label || project.status}
                </Badge>
              </div>

              <div>
                <Label htmlFor="status" className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
                  Changer le Statut
                </Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground mb-3"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={isLoading || status === project.status}
                  className="w-full rounded-lg gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Mise à jour...' : 'Mettre à jour le statut'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ressources Humaines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Ouvriers affectés</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-bold">{totalWorkers || 0}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Tâches</Label>
                <div className="text-sm text-muted-foreground mt-1">
                  {project.tasks?.length || 0} tâche(s) planifiée(s)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {project.tasks && project.tasks.length > 0 && (
          <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Tâches du Projet</CardTitle>
              <CardDescription>{project.tasks.length} tâche(s) assignée(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border border-border/50 bg-muted/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{task.name}</div>
                        <div className="text-xs text-muted-foreground">{task.description}</div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {task.status || 'pending'}
                      </Badge>
                    </div>
                    {task.workers && task.workers.length > 0 && (
                      <div className="flex items-center gap-2 text-xs mt-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <div className="flex gap-1 flex-wrap">
                          {task.workers.map((worker: any) => (
                            <Badge key={worker.id} variant="secondary" className="text-xs">
                              {worker.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {project.steps && project.steps.length > 0 && (
          <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Étapes du Projet</CardTitle>
              <CardDescription>{project.steps.length} étape(s) planifiée(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.steps.map((step: any, idx: number) => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-xs text-muted-foreground">Étape {step.order}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{step.budget?.toLocaleString('fr-FR')} €</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
