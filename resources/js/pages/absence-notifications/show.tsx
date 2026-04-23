import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AbsenceNotificationShow({ absenceNotification }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, setData, post, reset } = useForm({
    reason: absenceNotification.reason || '',
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

  const handleResolve = useCallback(() => {
    setIsSubmitting(true);
    post(`/absences/${absenceNotification.id}/resolve`, {
      onFinish: () => {
        setIsSubmitting(false);
        reset();
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  }, [absenceNotification.id, post, reset]);

  const handleMarkAsRead = useCallback(() => {
    fetch(`/absences/${absenceNotification.id}/read`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        'Accept': 'application/json',
      },
    });
  }, [absenceNotification.id]);

  return (
    <>
      <Head title={`Absence - ${absenceNotification.user.name}`} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Absence Notification</h1>
            <p className="text-sm text-muted-foreground">Gérez cette notification d'absence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Worker Info */}
            <Card className="shadow-none border-border/50">
              <CardHeader>
                <CardTitle>Informations de l'Ouvrier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nom</p>
                    <p className="text-lg font-semibold">{absenceNotification.user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Rôle</p>
                    <p className="text-lg font-semibold">{absenceNotification.user.role}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm">{absenceNotification.user.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Absence Details */}
            <Card className="shadow-none border-border/50">
              <CardHeader>
                <CardTitle>Détails de l'Absence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date d'Absence</p>
                    <p className="text-lg font-semibold">{absenceNotification.absence_date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Projet</p>
                    <p className="text-lg font-semibold">{absenceNotification.project?.name || '-'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Notifiée à</p>
                      <p className="text-sm font-semibold">
                        {absenceNotification.notified_at
                          ? new Date(absenceNotification.notified_at).toLocaleString('fr-FR')
                          : 'Pas encore notifiée'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(absenceNotification.status)}>
                      {getStatusLabel(absenceNotification.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reason Section */}
            <Card className="shadow-none border-border/50">
              <CardHeader>
                <CardTitle>Raison de l'Absence</CardTitle>
                <CardDescription>Documentez la raison de cette absence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={data.reason}
                  onChange={(e) => setData('reason', e.target.value)}
                  placeholder="Conge, maladie, raison personnelle..."
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground min-h-32"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleResolve}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marquer comme Résolu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className={`shadow-none border-border/50 ${absenceNotification.status === 'pending' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {absenceNotification.status === 'pending' ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  Statut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getStatusColor(absenceNotification.status)} w-full text-center py-1`}>
                  {getStatusLabel(absenceNotification.status)}
                </Badge>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-none border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Historique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1">Créée</p>
                  <p className="font-semibold">
                    {new Date(absenceNotification.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>

                {absenceNotification.notified_at && (
                  <div className="text-sm border-t border-border/50 pt-3">
                    <p className="text-xs text-muted-foreground mb-1">Notifiée</p>
                    <p className="font-semibold">
                      {new Date(absenceNotification.notified_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}

                {absenceNotification.read_at && (
                  <div className="text-sm border-t border-border/50 pt-3">
                    <p className="text-xs text-muted-foreground mb-1">Lue</p>
                    <p className="font-semibold">
                      {new Date(absenceNotification.read_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {absenceNotification.status === 'pending' && !absenceNotification.read_at && (
              <Button
                onClick={handleMarkAsRead}
                variant="outline"
                className="w-full"
              >
                Marquer comme Lue
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
