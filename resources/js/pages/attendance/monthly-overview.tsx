import { Head } from '@inertiajs/react';
import { Calendar, Users, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MonthlyOverview({ userStats, month, projects, selectedProject }: any) {
  const [displayMonth, setDisplayMonth] = useState(month);
  const [displayProject, setDisplayProject] = useState(selectedProject);

  const handleFiltersChange = () => {
    const params = new URLSearchParams();

    if (displayMonth) {
params.append('month', displayMonth);
}

    if (displayProject) {
params.append('project_id', displayProject);
}

    window.location.href = `/attendance/monthly?${params.toString()}`;
  };

  const getAttendancePercentage = (presentDays: number, totalDays: number) => {
    if (totalDays === 0) {
return 0;
}

    return Math.round((presentDays / totalDays) * 100);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) {
return 'bg-green-100 text-green-800 dark:bg-green-900/30';
}

    if (percentage >= 75) {
return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30';
}

    if (percentage >= 50) {
return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30';
}

    return 'bg-red-100 text-red-800 dark:bg-red-900/30';
  };

  const monthName = new Date(displayMonth + '-01').toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Head title="Aperçu Mensuel - Présence" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aperçu Mensuel</h1>
          <p className="text-sm text-muted-foreground">Vue d'ensemble de la présence par ouvrier</p>
        </div>

        {/* Filters */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Mois</label>
                <input
                  type="month"
                  value={displayMonth}
                  onChange={(e) => setDisplayMonth(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Projet</label>
                <select
                  value={displayProject}
                  onChange={(e) => setDisplayProject(e.target.value)}
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

              <div className="flex items-end">
                <Button onClick={handleFiltersChange} className="w-full rounded-lg">
                  Appliquer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Ouvriers</p>
                  <p className="text-2xl font-bold">{userStats.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600 opacity-25" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Heures</p>
                  <p className="text-2xl font-bold">
                    {userStats.reduce((sum: number, stat: any) => sum + stat.total_working_hours, 0)}h
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-600 opacity-25" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Moyenne Mensuelle</p>
                  <p className="text-2xl font-bold">
                    {userStats.length > 0
                      ? Math.round(
                          userStats.reduce((sum: number, stat: any) => sum + stat.total_working_hours, 0) /
                            userStats.length,
                        )
                      : 0}
                    h
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600 opacity-25" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workers Table */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{monthName}</CardTitle>
            <CardDescription>{userStats.length} ouvrier(s) avec présence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Ouvrier</th>
                    <th className="text-center py-3 px-4 font-semibold">Jours Présents</th>
                    <th className="text-center py-3 px-4 font-semibold">Taux Présence</th>
                    <th className="text-right py-3 px-4 font-semibold">Heures Totales</th>
                    <th className="text-right py-3 px-4 font-semibold">Moyenne/jour</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucune donnée pour cette période
                      </td>
                    </tr>
                  ) : (
                    userStats.map((stat: any) => {
                      const percentage = getAttendancePercentage(stat.present_days, stat.total_days);

                      return (
                        <tr key={stat.id} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <p className="font-semibold">{stat.name}</p>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline">
                              {stat.present_days}/{stat.total_days}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge className={getAttendanceColor(percentage)}>{percentage}%</Badge>
                          </td>
                          <td className="text-right py-3 px-4 font-bold">{stat.total_working_hours}h</td>
                          <td className="text-right py-3 px-4 text-muted-foreground">
                            {stat.present_days > 0
                              ? (stat.total_working_hours / stat.present_days).toFixed(1)
                              : 0}
                            h
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Statistiques Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userStats.length > 0 && (
              <>
                <div className="flex justify-between items-center p-3 rounded border border-border/50">
                  <span className="text-muted-foreground">Plus haute présence</span>
                  <span className="font-bold">
                    {userStats.reduce((max: any, stat: any) => 
                      stat.present_days > (max.present_days || 0) ? stat : max
                    )?.name} (
                    {userStats.reduce((max: any, stat: any) => 
                      stat.present_days > (max.present_days || 0) ? stat : max
                    )?.present_days || 0}j)
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded border border-border/50">
                  <span className="text-muted-foreground">Plus d'heures</span>
                  <span className="font-bold">
                    {userStats.reduce((max: any, stat: any) => 
                      stat.total_working_hours > (max.total_working_hours || 0) ? stat : max
                    )?.name} (
                    {userStats.reduce((max: any, stat: any) => 
                      stat.total_working_hours > (max.total_working_hours || 0) ? stat : max
                    )?.total_working_hours || 0}h)
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded border border-border/50">
                  <span className="text-muted-foreground">Moyenne présence globale</span>
                  <span className="font-bold">
                    {Math.round(
                      (userStats.reduce((sum: number, stat: any) => sum + stat.present_days, 0) /
                        (userStats.length * userStats[0]?.total_days)) *
                        100,
                    )}
                    %
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
