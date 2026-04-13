import { Head } from '@inertiajs/react';
import { Calendar, Clock, MapPin, User, Users, CheckCircle, XCircle, Plus, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AttendanceIndex({
  attendances,
  date,
  statistics,
  projects,
  workers,
  statuses,
  selectedProject,
}: any) {
  const [displayDate, setDisplayDate] = useState(date);
  const [displayProject, setDisplayProject] = useState(selectedProject);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showAssignWorkers, setShowAssignWorkers] = useState(false);
  const [showInitialize, setShowInitialize] = useState(false);
  // Assurer que le statut a toujours une valeur par défaut
  const defaultStatus = statuses && statuses.length > 0 ? statuses[0].value : 'present';
  const [checkInData, setCheckInData] = useState({ user_id: '', project_id: '', status: defaultStatus });
  const [selectedProjectForAssign, setSelectedProjectForAssign] = useState('');
  const [selectedWorkersForAssign, setSelectedWorkersForAssign] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [attendanceStatuses, setAttendanceStatuses] = useState<Record<number, string>>({});

  const handleFiltersChange = () => {
    const params = new URLSearchParams();
    if (displayDate) params.append('date', displayDate);
    if (displayProject) params.append('project_id', displayProject);
    window.location.href = `/attendance?${params.toString()}`;
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Submitting check-in data:', checkInData);

    try {
      const response = await fetch('/attendance/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(checkInData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        alert(error.message || 'Erreur lors de l\'enregistrement');
        return;
      }

      const result = await response.json();
      console.log('Success response:', result);

      alert('Arrivée enregistrée avec succès');
      setShowCheckIn(false);
      setCheckInData({ user_id: '', project_id: '', status: defaultStatus });
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (attendanceId: number) => {
    if (!window.confirm('Confirmer le départ?')) return;

    try {
      const response = await fetch(`/attendance/${attendanceId}/check-out`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Erreur lors du départ');
        return;
      }

      alert('Départ enregistré');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors du départ');
    }
  };

  const handleStatusChange = async (attendanceId: number, newStatus: string) => {
    try {
      const response = await fetch(`/attendance/${attendanceId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        alert('Erreur lors de la mise à jour du statut');
        return;
      }

      setAttendanceStatuses({ ...attendanceStatuses, [attendanceId]: newStatus });
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleInitializePresences = async () => {
    if (!displayProject) {
      alert('Veuillez sélectionner un projet');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/attendance/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ date: displayDate, project_id: displayProject }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Erreur lors de l\'initialisation');
        return;
      }

      const result = await response.json();
      alert(`${result.created} présences initialisées`);
      setShowInitialize(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de l\'initialisation');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignWorkers = async () => {
    if (!selectedProjectForAssign) {
      alert('Veuillez sélectionner un projet');
      return;
    }

    if (selectedWorkersForAssign.length === 0) {
      alert('Veuillez sélectionner au moins un ouvrier');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${selectedProjectForAssign}/workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ worker_ids: selectedWorkersForAssign }),
      });

      if (!response.ok) {
        alert('Erreur lors de l\'assignation des ouvriers');
        return;
      }

      alert('Ouvriers assignés avec succès');
      setShowAssignWorkers(false);
      setSelectedWorkersForAssign([]);
      setSelectedProjectForAssign('');
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de l\'assignation');
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkerSelection = (workerId: number) => {
    setSelectedWorkersForAssign((prev) =>
      prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId]
    );
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses?.find((s: any) => s.value === status);
    return statusObj?.color || 'text-gray-600';
  };

  const getStatusLabel = (status: string) => {
    const statusObj = statuses?.find((s: any) => s.value === status);
    return statusObj?.label || status;
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
      <Head title="Gestion de la Présence" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion de la Présence</h1>
            <p className="text-sm text-muted-foreground">Suivi des arrivées et départs</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAssignWorkers(true)} variant="outline" className="rounded-lg gap-2">
              <Settings className="h-4 w-4" />
              Assigner Ouvriers
            </Button>
            <Button onClick={() => setShowInitialize(true)} variant="outline" className="rounded-lg gap-2">
              <Plus className="h-4 w-4" />
              Initialiser
            </Button>
            <Button onClick={() => setShowCheckIn(true)} className="rounded-lg gap-2">
              <Clock className="h-4 w-4" />
              Nouvelle Présence
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Ouvriers" value={statistics.total_workers} />
          <StatCard icon={CheckCircle} label="Présents" value={statistics.present} color="text-green-600" />
          <StatCard icon={Clock} label="Partis" value={statistics.checked_out} color="text-blue-600" />
          <StatCard icon={XCircle} label="Absents" value={statistics.absent} color="text-red-600" />
        </div>

        {/* Filters */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Date</label>
                <input
                  type="date"
                  value={displayDate}
                  onChange={(e) => setDisplayDate(e.target.value)}
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

        {/* Attendances List */}
        <Card className="shadow-none border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Présences du {new Date(displayDate).toLocaleDateString('fr-FR')}</CardTitle>
            <CardDescription>{attendances.length} enregistrement(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendances.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Aucune présence enregistrée</div>
              ) : (
                attendances.map((attendance: any) => {
                  const currentStatus = attendanceStatuses[attendance.id] || attendance.status;
                  return (
                    <div key={attendance.id} className="p-4 rounded-lg border border-border/50 bg-muted/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">{attendance.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{attendance.project?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(attendance.id, e.target.value)}
                            className={`px-2 py-1 rounded text-sm font-semibold border ${getStatusColor(currentStatus)} bg-background`}
                          >
                            {statuses?.map((s: any) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Arrivée: </span>
                            <span className="font-semibold">{formatTime(attendance.check_in)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Départ: </span>
                            <span className="font-semibold">{formatTime(attendance.check_out)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Durée: </span>
                            <span className="font-semibold">
                              {calculateDuration(attendance.check_in, attendance.check_out)}
                            </span>
                          </div>
                        </div>

                        {!attendance.check_out && (
                          <Button
                            onClick={() => handleCheckOut(attendance.id)}
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                          >
                            Enregistrer Départ
                          </Button>
                        )}
                      </div>

                      {attendance.latitude && attendance.longitude && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          Géolocalisation: {attendance.latitude.toFixed(4)}, {attendance.longitude.toFixed(4)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Check In Modal */}
        {showCheckIn && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Nouvelle Présence</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckIn} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Ouvrier</label>
                    <select
                      value={checkInData.user_id}
                      onChange={(e) => setCheckInData({ ...checkInData, user_id: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                      required
                    >
                      <option value="">-- Sélectionner --</option>
                      {workers?.map((worker: any) => (
                        <option key={worker.id} value={worker.id}>
                          {worker.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Projet</label>
                    <select
                      value={checkInData.project_id}
                      onChange={(e) => setCheckInData({ ...checkInData, project_id: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                      required
                    >
                      <option value="">-- Sélectionner --</option>
                      {projects.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Statut</label>
                    {!statuses || statuses.length === 0 ? (
                      <div className="p-2 bg-yellow-100 text-yellow-800 rounded text-sm">Statuts non chargés</div>
                    ) : (
                      <select
                        value={checkInData.status}
                        onChange={(e) => setCheckInData({ ...checkInData, status: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                      >
                        {statuses?.map((s: any) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1 rounded-lg">
                      {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCheckIn(false)} className="flex-1 rounded-lg">
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Initialize Presences Modal */}
        {showInitialize && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Initialiser les Présences</CardTitle>
                <CardDescription>Créer les enregistrements pour tous les ouvriers du projet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Date</label>
                    <input
                      type="date"
                      value={displayDate}
                      onChange={(e) => setDisplayDate(e.target.value)}
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
                      <option value="">-- Sélectionner --</option>
                      {projects.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleInitializePresences}
                      disabled={loading || !displayProject}
                      className="flex-1 rounded-lg"
                    >
                      {loading ? 'Initialisation...' : 'Initialiser'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowInitialize(false)}
                      className="flex-1 rounded-lg"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assign Workers Modal */}
        {showAssignWorkers && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Assigner les Ouvriers au Projet</CardTitle>
                <CardDescription>Sélectionnez les ouvriers à assigner au projet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Projet</label>
                    <select
                      value={selectedProjectForAssign}
                      onChange={(e) => setSelectedProjectForAssign(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
                    >
                      <option value="">-- Sélectionner --</option>
                      {projects.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Ouvriers ({selectedWorkersForAssign.length} sélectionnés)</label>
                    <div className="border rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto bg-muted/20">
                      {workers?.map((worker: any) => (
                        <label key={worker.id} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedWorkersForAssign.includes(worker.id)}
                            onChange={() => toggleWorkerSelection(worker.id)}
                            className="rounded"
                          />
                          <span>{worker.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAssignWorkers}
                      disabled={loading || !selectedProjectForAssign || selectedWorkersForAssign.length === 0}
                      className="flex-1 rounded-lg"
                    >
                      {loading ? 'Assignation...' : 'Assigner'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAssignWorkers(false);
                        setSelectedWorkersForAssign([]);
                        setSelectedProjectForAssign('');
                      }}
                      className="flex-1 rounded-lg"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
