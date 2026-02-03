import { useMemo, useState } from 'react';
import { Button, Card, Table } from './ui/index.js';

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export default function AveragesView() {
  const [students, setStudents] = useState([]);
  const [globalAverage, setGlobalAverage] = useState(null);
  const [status, setStatus] = useState(null);

  const columns = useMemo(
    () => [
      { key: 'matricola', label: 'Matricola' },
      { key: 'studente', label: 'Studente' },
      { key: 'media', label: 'Media pesata' }
    ],
    []
  );

  const tableData = students.map((student) => ({
    id: student.matricola,
    matricola: student.matricola,
    studente: `${student.nome} ${student.cognome}`,
    media: student.mediaPesata
  }));

  const handleFetch = async () => {
    setStatus(null);
    try {
      const [studentsRes, globalRes] = await Promise.all([
        fetch(`${apiBase}/api/averages/students`),
        fetch(`${apiBase}/api/averages/global`)
      ]);

      const studentsData = await studentsRes.json();
      const globalData = await globalRes.json();

      if (!studentsRes.ok) {
        throw new Error(studentsData.error || 'Errore nel calcolo medie studenti.');
      }
      if (!globalRes.ok) {
        throw new Error(globalData.error || 'Errore nel calcolo media globale.');
      }

      setStudents(studentsData);
      setGlobalAverage(globalData.mediaPesata);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <section className="flex h-full flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-primary">Calcolo medie</h2>
        <p className="text-sm text-neutral-500">Ottieni le medie pesate per studente e quella globale.</p>
      </div>

      <Button onClick={handleFetch}>
        Calcola medie
      </Button>

      {status && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {status.message}
        </div>
      )}

      <Table columns={columns} data={tableData} emptyMessage="Nessuna media disponibile." />

      {globalAverage !== null && (
        <Card className="border-accent/30 bg-accent/10">
          <p className="text-sm font-semibold text-primary">Media pesata globale</p>
          <p className="text-2xl font-semibold text-primary">{globalAverage}</p>
        </Card>
      )}
    </section>
  );
}
