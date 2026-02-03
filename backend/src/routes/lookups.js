import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/students', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT Matricola, Nome, Cognome FROM Studenti ORDER BY Cognome, Nome'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/teachers', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT IdDocente, Nome, Cognome FROM Docenti ORDER BY Cognome, Nome'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/subjects', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT IdMateria, Nome, CFU FROM Materie ORDER BY Nome'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

export default router;
