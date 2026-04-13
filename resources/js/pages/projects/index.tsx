import { Head, Link } from '@inertiajs/react';
import { Calendar, DollarSign, MapPin, User, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectsIndex({ projects }: any) {
  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      en_cours: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      initialisation: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      termine: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      planifie: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };

    return colors[status] || colors.initialisation;
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getUniqueWorkerCount = (project: any) => {
    if (!project.tasks || project.tasks.length === 0) {
      return 0;
    }

    const workers = new Set();
    project.tasks.forEach((task: any) => {
      if (task.workers && task.workers.length > 0) {
        task.workers.forEach((worker: any) => {
          workers.add(worker.id);
        });
      }
    });

    return workers.size;
  };

  return (
    <>
      <Head title="Projets" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Projets</h1>
          <p className="text-sm text-muted-foreground">Consultez tous les projets en cours et planifiés</p>
        </div>

        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Liste des projets ({projects.length})</CardTitle>
            <CardDescription>Tous les projets du système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <Link href={`/projects/${project.id}`} key={project.id}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{project.name}</CardTitle>
                            <CardDescription className="text-xs mt-1">{project.description}</CardDescription>
                          </div>
                          <Badge className={getStatusBadgeColor(project.status)}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-foreground">{project.budget?.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>De {formatDate(project.start_date)} à {formatDate(project.deadline)}</span>
                        </div>
                        {project.manager && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{project.manager.name}</span>
                          </div>
                        )}
                        {project.engineer && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{project.engineer.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{getUniqueWorkerCount(project)} ouvrier(s)</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Aucun projet trouvé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
