import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Eye, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AbsenceNotificationsIndex({ absenceNotifications, pendingCount }: any) {
  const [filters, setFilters] = useState({
    status: '',
    from_date: '',
    to_date: '',
    project_id: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30';
      case 'notified':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      notified: 'Notifié',
      resolved: 'Résolu',
    };
    return labels[status] || status;
  };

  return (
    <>
      <Head title="Notifications d'Absences" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications d'Absences</h1>
            <p className="text-sm text-muted-foreground">Gérez les absences des ouvriers</p>
          </div>
          <div className="flex items-center gap-2">
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">En attente</p>
                    <p className="text-xl font-bold text-red-600">{pendingCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                >
                  <option value="">-- Tous les statuts --</option>
                  <option value="pending">En attente</option>
                  <option value="notified">Notifié</option>
                  <option value="resolved">Résolu</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Du</label>
                <input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Au</label>
                <input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div className="flex items-end">
                <Button className="w-full rounded-lg" variant="outline">
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Absence List */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{absenceNotifications.data?.length} absence(s)</CardTitle>
            <CardDescription>Liste de toutes les notifications d'absences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {absenceNotifications.data?.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Aucune absence pour cette période</p>
              ) : (
                absenceNotifications.data?.map((notification: any) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold">{notification.user.name}</h3>
                        <Badge className={getStatusColor(notification.status)}>
                          {getStatusLabel(notification.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p className="font-semibold text-foreground">{notification.project?.name}</p>
                          <p className="text-xs">Projet</p>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{notification.absence_date}</p>
                          <p className="text-xs">Date d'absence</p>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {notification.read_at ? 'Lue' : 'Non lue'}
                          </p>
                          <p className="text-xs">État de notification</p>
                        </div>
                      </div>
                      {notification.reason && (
                        <p className="text-sm mt-2 p-2 bg-muted rounded border border-border/50">
                          <strong>Raison:</strong> {notification.reason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/absences/${notification.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {notification.status === 'pending' && (
                        <Link href={`/absences/${notification.id}`}>
                          <Button size="sm" variant="ghost">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {absenceNotifications.links && (
              <div className="flex justify-center gap-2 mt-6">
                {absenceNotifications.links.map((link: any, idx: number) => (
                  <a
                    key={idx}
                    href={link.url}
                    className={`px-3 py-1 rounded border ${
                      link.active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
