import { useMemo, useState } from 'react';
import { Button, FormField, Select, Table } from './ui/index.js';

const apiBase = process.env.NEXT_PUBLIC_API_URL;

const filters = [
  { key: 'student', label: 'Studente' },
  { key: 'teacher', label: 'Docente' },
  { key: 'subject', label: 'Materia' }
];

export default function FilterView({ students = [], teachers = [], subjects = [] }) {
  const [filterType, setFilterType] = useState('student');
  const [selected, setSelected] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(null);

  const optionsMap = {
    student: students.map((student) => ({
      value: student.Matricola,
      label: `${student.Nome} ${student.Cognome} (${student.Matricola})`
    })),
    teacher: teachers.map((teacher) => ({
      value: teacher.IdDocente,
      label: `${teacher.Nome} ${teacher.Cognome}`
    })),
    subject: subjects.map((subject) => ({
      value: subject.IdMateria,
      label: `${subject.Nome} (${subject.CFU} CFU)`
    }))
  };

  const columns = useMemo(
    () => [
      { key: 'data', label: 'Data' },
      { key: 'voto', label: 'Voto' },
      { key: 'lode', label: 'Lode' },
      { key: 'materia', label: 'Materia' },
      { key: 'docente', label: 'Docente' }
    ],
    []
  );

  const tableData = results.map((exam) => ({
    id: exam.IdEsame,
    data: exam.DataEsame,
    voto: exam.Voto,
    lode: exam.Lode ? 'Sì' : 'No',
    materia: exam.NomeMateria,
    docente: `${exam.NomeDocente} ${exam.CognomeDocente}`
  }));

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setSelected('');
    setResults([]);
  };

  const handleFetch = async () => {
    if (!selected) {
      setStatus({ type: 'error', message: 'Seleziona un valore per filtrare.' });
      return;
    }

    setStatus(null);

    try {
      const response = await fetch(`${apiBase}/api/exams?${filterType}=${selected}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Errore durante il recupero esami.');
      }
      setResults(data);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <section className="flex h-full flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-primary">Visualizzazione esami</h2>
        <p className="text-sm text-neutral-500">Filtra per studente, docente o materia.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <label key={filter.key} className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
            <input
              type="radio"
              name="filterType"
              value={filter.key}
              checked={filterType === filter.key}
              onChange={handleFilterChange}
              className="h-4 w-4 text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            />
            {filter.label}
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <FormField id="filter-select" label={`Seleziona ${filters.find((f) => f.key === filterType).label}`}>
          <Select id="filter-select" value={selected} onChange={(event) => setSelected(event.target.value)}>
            <option value="">Seleziona un valore</option>
            {optionsMap[filterType].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        <Button onClick={handleFetch} className="md:mt-6">
          Visualizza
        </Button>
      </div>

      {status && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-md border px-4 py-3 text-sm font-semibold ${
            status.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {status.message}
        </div>
      )}

      <Table columns={columns} data={tableData} emptyMessage="Nessun esame trovato." />
    </section>
  );
}
