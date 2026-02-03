import { Router } from 'express';
import { body, query as queryParam, validationResult } from 'express-validator';
import { query } from '../db.js';
import { normalizeWeightedAverage } from '../services/averageService.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation error', details: errors.array() });
  }
  return next();
};

router.post(
  '/exams',
  [
    body('matricola').isInt().toInt(),
    body('idMateria').isInt().toInt(),
    body('idDocente').isInt().toInt(),
    body('dataEsame').isISO8601(),
    body('voto').isInt({ min: 18, max: 30 }).toInt(),
    body('lode').isBoolean().toBoolean()
  ],
  validate,
  async (req, res, next) => {
    try {
      const { matricola, idMateria, idDocente, dataEsame, voto, lode } = req.body;

      if (lode && voto !== 30) {
        return res.status(400).json({ error: 'La lode è consentita solo con voto 30.' });
      }

      const [[student]] = await query(
        'SELECT Matricola FROM Studenti WHERE Matricola = ?',
        [matricola]
      );
      if (!student) {
        return res.status(404).json({ error: 'Studente non trovato.' });
      }

      const [[subject]] = await query(
        'SELECT IdMateria FROM Materie WHERE IdMateria = ?',
        [idMateria]
      );
      if (!subject) {
        return res.status(404).json({ error: 'Materia non trovata.' });
      }

      const [[teacher]] = await query(
        'SELECT IdDocente FROM Docenti WHERE IdDocente = ?',
        [idDocente]
      );
      if (!teacher) {
        return res.status(404).json({ error: 'Docente non trovato.' });
      }

      await query(
        `INSERT INTO Esami (Matricola, IdMateria, IdDocente, DataEsame, Voto, Lode)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [matricola, idMateria, idDocente, dataEsame, voto, lode ? 1 : 0]
      );

      res.status(201).json({ message: 'Esame inserito con successo.' });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/exams',
  [
    queryParam('student').optional().isInt().toInt(),
    queryParam('teacher').optional().isInt().toInt(),
    queryParam('subject').optional().isInt().toInt()
  ],
  validate,
  async (req, res, next) => {
    try {
      const { student, teacher, subject } = req.query;
      const filters = [];
      const params = [];

      if (student) {
        filters.push('Esami.Matricola = ?');
        params.push(student);
      }
      if (teacher) {
        filters.push('Esami.IdDocente = ?');
        params.push(teacher);
      }
      if (subject) {
        filters.push('Esami.IdMateria = ?');
        params.push(subject);
      }

      if (filters.length === 0) {
        return res.status(400).json({ error: 'Specificare un filtro: student, teacher o subject.' });
      }

      const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

      const [rows] = await query(
        `SELECT Esami.IdEsame, Esami.DataEsame, Esami.Voto, Esami.Lode,
                Studenti.Matricola, Studenti.Nome AS NomeStudente, Studenti.Cognome AS CognomeStudente,
                Docenti.IdDocente, Docenti.Nome AS NomeDocente, Docenti.Cognome AS CognomeDocente,
                Materie.IdMateria, Materie.Nome AS NomeMateria, Materie.CFU
         FROM Esami
         JOIN Studenti ON Esami.Matricola = Studenti.Matricola
         JOIN Docenti ON Esami.IdDocente = Docenti.IdDocente
         JOIN Materie ON Esami.IdMateria = Materie.IdMateria
         ${whereClause}
         ORDER BY Esami.DataEsame DESC`,
        params
      );

      res.json(rows);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/averages/students', async (req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT Studenti.Matricola, Studenti.Nome, Studenti.Cognome,
              SUM((CASE WHEN Esami.Lode = 1 THEN 30.5 ELSE Esami.Voto END) * Materie.CFU)
                / SUM(Materie.CFU) AS MediaPesata
       FROM Esami
       JOIN Studenti ON Esami.Matricola = Studenti.Matricola
       JOIN Materie ON Esami.IdMateria = Materie.IdMateria
       GROUP BY Studenti.Matricola, Studenti.Nome, Studenti.Cognome
       ORDER BY Studenti.Cognome, Studenti.Nome`
    );

    const formatted = rows.map((row) => ({
      matricola: row.Matricola,
      nome: row.Nome,
      cognome: row.Cognome,
      mediaPesata: normalizeWeightedAverage(row.MediaPesata)
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
});

router.get('/averages/global', async (req, res, next) => {
  try {
    const [[row]] = await query(
      `SELECT SUM((CASE WHEN Esami.Lode = 1 THEN 30.5 ELSE Esami.Voto END) * Materie.CFU)
                / SUM(Materie.CFU) AS MediaPesata
       FROM Esami
       JOIN Materie ON Esami.IdMateria = Materie.IdMateria`
    );

    res.json({
      mediaPesata: normalizeWeightedAverage(row?.MediaPesata)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
