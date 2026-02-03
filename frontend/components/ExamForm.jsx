import { useMemo, useState } from 'react';
import { Button, FormField, Input, Select } from './ui/index.js';

const apiBase = process.env.NEXT_PUBLIC_API_URL;

const initialForm = {
  matricola: '',
  idMateria: '',
  idDocente: '',
  dataEsame: '',
  voto: '',
  lode: false
};

export default function ExamForm({ students = [], teachers = [], subjects = [] }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);

  const votoNumber = useMemo(() => Number(form.voto), [form.voto]);
  const isVotoValid = !Number.isNaN(votoNumber) && votoNumber >= 18 && votoNumber <= 30;
  const isLodeAllowed = isVotoValid && votoNumber === 30;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!isVotoValid) {
      setStatus({ type: 'error', message: 'Il voto deve essere tra 18 e 30.' });
      return;
    }

    if (form.lode && !isLodeAllowed) {
      setStatus({ type: 'error', message: 'La lode è consentita solo con voto 30.' });
      return;
    }

    try {
      const response = await fetch(`${apiBase}/api/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricola: Number(form.matricola),
          idMateria: Number(form.idMateria),
          idDocente: Number(form.idDocente),
          dataEsame: form.dataEsame,
          voto: votoNumber,
          lode: form.lode
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'inserimento.');
      }

      setForm(initialForm);
      setStatus({ type: 'success', message: data.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <section className="flex h-full flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-primary">Inserimento nuovo esame</h2>
        <p className="text-sm text-neutral-500">Compila tutti i campi per registrare un nuovo esame.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField id="matricola" label="Studente">
          <Select id="matricola" name="matricola" value={form.matricola} onChange={handleChange} required>
            <option value="">Seleziona studente</option>
            {students.map((student) => (
              <option key={student.Matricola} value={student.Matricola}>
                {student.Nome} {student.Cognome} ({student.Matricola})
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="idMateria" label="Materia">
          <Select id="idMateria" name="idMateria" value={form.idMateria} onChange={handleChange} required>
            <option value="">Seleziona materia</option>
            {subjects.map((subject) => (
              <option key={subject.IdMateria} value={subject.IdMateria}>
                {subject.Nome} ({subject.CFU} CFU)
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="idDocente" label="Docente">
          <Select id="idDocente" name="idDocente" value={form.idDocente} onChange={handleChange} required>
            <option value="">Seleziona docente</option>
            {teachers.map((teacher) => (
              <option key={teacher.IdDocente} value={teacher.IdDocente}>
                {teacher.Nome} {teacher.Cognome}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField id="dataEsame" label="Data esame">
            <Input id="dataEsame" name="dataEsame" type="date" value={form.dataEsame} onChange={handleChange} required />
          </FormField>

          <FormField
            id="voto"
            label="Voto"
            helpText="Valori ammessi 18-30."
          >
            <Input
              id="voto"
              name="voto"
              type="number"
              value={form.voto}
              onChange={handleChange}
              min="18"
              max="30"
              required
            />
          </FormField>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
          <input
            type="checkbox"
            name="lode"
            checked={form.lode}
            onChange={handleChange}
            disabled={!isLodeAllowed}
            className="h-4 w-4 rounded border-neutral-300 text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
          Lode (solo con voto 30)
        </label>

        <Button type="submit" disabled={!isVotoValid || !form.matricola || !form.idMateria || !form.idDocente || !form.dataEsame}>
          Inserisci esame
        </Button>
      </form>

      {status && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-md border px-4 py-3 text-sm font-semibold ${
            status.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}
    </section>
  );
}
