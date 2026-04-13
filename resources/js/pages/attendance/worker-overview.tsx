import { Head } from '@inertiajs/react';
import { Calendar, Clock, TrendingUp, User } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkerOverview({ worker, attendances, statistics, period, workers, selectedWorker }: any) {
  const [startDate, setStartDate] = useState(period.start_date);
  const [endDate, setEndDate] = useState(period.end_date);
  const [selectedId, setSelectedId] = useState(selectedWorker);

  const handleLoad = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (selectedId) params.append('worker_id', selectedId);
    window.location.href = `/attendance/worker/${selectedId}?${params.toString()}`;
  };

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    try {
      return new Date(time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return time;
    }
  };

  const calculateDuration = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return '-';
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffMs = end.getTime() - start.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return '-';
    }
  };

  return (
    <>
      <Head title={`Présence - ${worker.name}`} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suivi de Présence</h1>
          <p className="text-sm text-muted-foreground">Historique détaillé d'un ouvrier</p>
        </div>

        {/* Filters */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Ouvrier</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                >
                  {workers.map((w: any) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Date début</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Date fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleLoad} className="w-full rounded-lg">
                  Charger
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Worker Info */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {worker.name}
            </CardTitle>
            <CardDescription>
              {worker.email} • Rôle: {worker.role}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            label="Jours Présents"
            value={statistics.present_days}
            color="text-blue-600"
          />
          <StatCard
            icon={Clock}
            label="Heures Totales"
            value={`${statistics.total_working_hours}h`}
            color="text-green-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Moyenne/jour"
            value={`${statistics.avg_hours_per_day}h`}
            color="text-purple-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Projets"
            value={statistics.projects_worked_on}
            color="text-orange-600"
          />
        </div>

        {/* Attendances List */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Historique de Présence</CardTitle>
            <CardDescription>
              Du {new Date(startDate).toLocaleDateString('fr-FR')} au{' '}
              {new Date(endDate).toLocaleDateString('fr-FR')} ({attendances.length} jour(s))
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendances.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune présence enregistrée sur cette période
                </div>
              ) : (
                attendances.map((attendance: any) => (
                  <div key={attendance.id} className="p-4 rounded-lg border border-border/50 bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">
                          {new Date(attendance.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">{attendance.project?.name}</p>
                      </div>
                      <Badge
                        className={
                          attendance.check_out
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30'
                        }
                      >
                        {attendance.check_out ? 'Complet' : 'Incomplet'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">Arrivée: </span>
                        <span className="font-semibold">{formatTime(attendance.check_in)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Départ: </span>
                        <span className="font-semibold">{formatTime(attendance.check_out)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Durée: </span>
                        <span className="font-semibold">{calculateDuration(attendance.check_in, attendance.check_out)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, color = 'text-muted-foreground' }: any) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color} opacity-25`} />
        </div>
      </CardContent>
    </Card>
  );
}
