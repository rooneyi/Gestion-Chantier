import { Head, router } from '@inertiajs/react';
import { Calendar, Download, Filter, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsIndex({ reportTypes }: any) {
  const [selectedReport, setSelectedReport] = useState('global');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);

  React.useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const projectsRes = await fetch('/api/projects');
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects || []);
      }

      const workersRes = await fetch('/api/workers');
      if (workersRes.ok) {
        const data = await workersRes.json();
        setWorkers(data.workers || []);
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          type: selectedReport,
          start_date: startDate || null,
          end_date: endDate || null,
          project_id: projectId || null,
          worker_id: workerId || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la génération du rapport');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!reportData) return;

    const content = generateReportContent();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `rapport_${selectedReport}_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateReportContent = (): string => {
    let content = `Rapport ${reportData.type}\n`;
    content += `Généré le,${new Date().toLocaleString('fr-FR')}\n`;
    content += `Période,${reportData.period.start_date || 'Début'} à ${reportData.period.end_date || 'Fin'}\n\n`;

    if (reportData.type === 'global') {
      content += generateGlobalContent();
    } else if (reportData.type === 'project') {
      content += generateProjectContent();
    } else if (reportData.type === 'worker') {
      content += generateWorkerContent();
    } else if (reportData.type === 'activities') {
      content += generateActivitiesContent();
    }

    return content;
  };

  const generateGlobalContent = (): string => {
    const d = reportData.data;
    let content = 'Résumé Global\n';
    content += `Projets totaux,${d.summary.total_projects}\n`;
    content += `Projets actifs,${d.summary.active_projects}\n`;
    content += `Projets complétés,${d.summary.completed_projects}\n`;
    content += `Tâches totales,${d.summary.total_tasks}\n`;
    content += `Tâches complétées,${d.summary.completed_tasks}\n`;
    content += `Budget total €,${d.summary.total_budget}\n`;
    content += `Ouvriers,${d.summary.total_workers}\n`;
    content += `Heures travaillées,${d.summary.total_working_hours}\n\n`;

    content += 'Projets par statut\n';
    Object.entries(d.projects_by_status).forEach(([status, count]: any) => {
      content += `${status},${count}\n`;
    });

    return content;
  };

  const generateProjectContent = (): string => {
    const projects = reportData.data;
    let content = 'Nom,Statut,Début,Fin,Budget €,Manager,Ingénieur,Tâches complétées,Ouvriers,Étapes\n';
    projects.forEach((p: any) => {
      content += `${p.name},${p.status},${p.start_date},${p.deadline},${p.budget},${p.manager || '-'},${p.engineer || '-'},${p.completed_tasks}/${p.total_tasks},${p.total_workers},${p.total_steps}\n`;
    });
    return content;
  };

  const generateWorkerContent = (): string => {
    const workers = reportData.data;
    let content = 'Nom,Email,Rôle,Tâches complétées,Projets,Jours présents,Heures totales,Moyenne/jour\n';
    workers.forEach((w: any) => {
      content += `${w.name},${w.email},${w.role},${w.completed_tasks}/${w.total_tasks},${w.projects_worked_on},${w.attendance_days},${w.total_working_hours},${w.avg_hours_per_day}\n`;
    });
    return content;
  };

  const generateActivitiesContent = (): string => {
    const d = reportData.data;
    let content = `Activités totales,${d.total_activities}\n\n`;
    content += 'Par action\n';
    Object.entries(d.action_statistics).forEach(([action, count]: any) => {
      content += `${action},${count}\n`;
    });
    content += '\nPar utilisateur\n';
    d.user_statistics.forEach((s: any) => {
      content += `${s.user_name || 'Inconnu'},${s.count}\n`;
    });
    return content;
  };

  return (
    <>
      <Head title="Rapports" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Génération de Rapports</h1>
          <p className="text-sm text-muted-foreground">Analysez les données de votre système</p>
        </div>

        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Paramètres du Rapport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateReport} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Type de Rapport</label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                  >
                    {reportTypes.map((type: any) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedReport === 'project' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Projet</label>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                    >
                      <option value="">-- Tous les projets --</option>
                      {projects.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date début
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                  />
                </div>

                {selectedReport === 'worker' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Ouvrier</label>
                    <select
                      value={workerId}
                      onChange={(e) => setWorkerId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                    >
                      <option value="">-- Tous --</option>
                      {workers.map((w: any) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="rounded-lg">
                  {loading ? 'Génération...' : 'Générer le rapport'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {reportData && (
          <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {reportTypes.find((t: any) => t.value === selectedReport)?.label}
                </CardTitle>
                <CardDescription className="mt-2">
                  Période: {reportData.period.start_date || 'Depuis le début'} à {reportData.period.end_date || 'Aujourd\'hui'}
                </CardDescription>
              </div>
              <Button onClick={handleDownloadReport} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Télécharger CSV
              </Button>
            </CardHeader>
            <CardContent>
              {selectedReport === 'global' && <GlobalReport data={reportData.data} />}
              {selectedReport === 'project' && <ProjectReport data={reportData.data} />}
              {selectedReport === 'worker' && <WorkerReport data={reportData.data} />}
              {selectedReport === 'activities' && <ActivitiesReport data={reportData.data} />}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

function GlobalReport({ data }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projets Totaux" value={data.summary.total_projects} />
        <StatCard label="Projets Actifs" value={data.summary.active_projects} />
        <StatCard label="Tâches Complétées" value={`${data.summary.completed_tasks}/${data.summary.total_tasks}`} />
        <StatCard label="Ouvriers" value={data.summary.total_workers} />
        <StatCard label="Budget Total" value={`${Math.round(data.summary.total_budget)} €`} />
        <StatCard label="Heures Travaillées" value={`${data.summary.total_working_hours}h`} />
      </div>

      {data.projects_by_status && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Projets par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(data.projects_by_status).map(([status, count]: any) => (
                <div key={status} className="flex items-center justify-between p-2 rounded border border-border/50">
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                  <Badge>{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.activities && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Activités Enregistrées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(data.activities).map(([action, count]: any) => (
                <div key={action} className="flex items-center justify-between p-2 rounded border border-border/50">
                  <span className="capitalize">{action.replace('_', ' ')}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProjectReport({ data }: any) {
  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Aucun projet trouvé</div>
      ) : (
        data.map((project: any) => (
          <Card key={project.id} className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Statut</span>
                  <Badge className="mt-1">{project.status}</Badge>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Dates</span>
                  <p className="text-sm mt-1">{project.start_date} à {project.deadline}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Budget</span>
                  <p className="text-sm font-bold mt-1">{project.budget} €</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Tâches</span>
                  <p className="text-sm mt-1">{project.completed_tasks}/{project.total_tasks}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Ouvriers</span>
                  <p className="text-sm mt-1">{project.total_workers}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Étapes</span>
                  <p className="text-sm mt-1">{project.total_steps}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function WorkerReport({ data }: any) {
  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Aucun ouvrier trouvé</div>
      ) : (
        data.map((worker: any) => (
          <Card key={worker.id} className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{worker.name}</CardTitle>
              <CardDescription>{worker.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Rôle</span>
                  <Badge className="mt-1">{worker.role}</Badge>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Tâches</span>
                  <p className="text-sm mt-1">{worker.completed_tasks}/{worker.total_tasks}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Projets</span>
                  <p className="text-sm font-bold mt-1">{worker.projects_worked_on}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Présence</span>
                  <p className="text-sm mt-1">{worker.attendance_days}j</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Heures totales</span>
                  <p className="text-sm font-bold mt-1">{worker.total_working_hours}h</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Moyenne/jour</span>
                  <p className="text-sm mt-1">{worker.avg_hours_per_day}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function ActivitiesReport({ data }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Activités Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.total_activities}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Par Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(data.action_statistics).slice(0, 5).map(([action, count]: any) => (
              <div key={action} className="flex justify-between items-center text-sm">
                <span>{action}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {data.user_statistics.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Activités par Utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.user_statistics.map((stat: any) => (
              <div key={stat.user_id} className="flex justify-between items-center p-2 rounded border border-border/50">
                <span>{stat.user_name || 'Utilisateur supprimé'}</span>
                <Badge>{stat.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {data.recent_activities.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">50 Dernières Activités</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {data.recent_activities.map((activity: any) => (
              <div key={activity.id} className="p-2 rounded border border-border/50 text-sm">
                <div className="flex justify-between">
                  <strong>{activity.user}</strong>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
                <p className="text-muted-foreground text-xs mt-1">{activity.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ label, value }: any) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold mt-2">{value}</div>
      </CardContent>
    </Card>
  );
}
