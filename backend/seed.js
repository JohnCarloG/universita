import pool from './src/db.js';

const run = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      'INSERT INTO Studenti (Matricola, Nome, Cognome) VALUES (?, ?, ?)',
      [2001, 'Elena', 'Neri']
    );
    await connection.execute(
      'INSERT INTO Docenti (Nome, Cognome) VALUES (?, ?)',
      ['Andrea', 'Gallo']
    );
    await connection.execute(
      'INSERT INTO Materie (Nome, CFU) VALUES (?, ?)',
      ['Database', 9]
    );
    await connection.execute(
      `INSERT INTO Esami (Matricola, IdMateria, IdDocente, DataEsame, Voto, Lode)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [2001, 4, 3, '2024-03-01', 29, 0]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

run()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seed completato.');
    process.exit(0);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Errore seed:', error);
    process.exit(1);
  });
