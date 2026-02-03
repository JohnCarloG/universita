import { useEffect, useState } from 'react';
import ExamForm from '../components/ExamForm.jsx';
import FilterView from '../components/FilterView.jsx';
import AveragesView from '../components/AveragesView.jsx';
import { Card } from '../components/ui/index.js';

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchLookups = async () => {
      setStatus(null);
      try {
        const [studentsRes, teachersRes, subjectsRes] = await Promise.all([
          fetch(`${apiBase}/api/lookups/students`),
          fetch(`${apiBase}/api/lookups/teachers`),
          fetch(`${apiBase}/api/lookups/subjects`)
        ]);

        const studentsData = await studentsRes.json();
        const teachersData = await teachersRes.json();
        const subjectsData = await subjectsRes.json();

        if (!studentsRes.ok || !teachersRes.ok || !subjectsRes.ok) {
          throw new Error('Errore nel caricamento dei dati iniziali.');
        }

        setStudents(studentsData);
        setTeachers(teachersData);
        setSubjects(subjectsData);
      } catch (error) {
        setStatus({ type: 'error', message: error.message });
      }
    };

    fetchLookups();
  }, []);

  return (
    <main className="bg-neutral-50 py-8">
      <div className="container-main flex flex-col gap-8">
        <header className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Dashboard università</p>
          <h1 className="mt-2 text-2xl font-semibold text-primary">Gestione esami</h1>
          <p className="mt-2 text-base text-neutral-600">
            Inserisci nuovi esami, filtra i risultati e calcola le medie pesate.
          </p>
        </header>

        {status && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {status.message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <ExamForm students={students} teachers={teachers} subjects={subjects} />
          </Card>
          <Card className="lg:col-span-2">
            <FilterView students={students} teachers={teachers} subjects={subjects} />
          </Card>
        </div>

        <Card>
          <AveragesView />
        </Card>
      </div>
    </main>
  );
}
