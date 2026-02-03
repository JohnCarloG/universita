CREATE DATABASE IF NOT EXISTS universita;
USE universita;

CREATE TABLE IF NOT EXISTS Studenti (
  Matricola INT PRIMARY KEY,
  Nome VARCHAR(50) NOT NULL,
  Cognome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Docenti (
  IdDocente INT PRIMARY KEY AUTO_INCREMENT,
  Nome VARCHAR(50) NOT NULL,
  Cognome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Materie (
  IdMateria INT PRIMARY KEY AUTO_INCREMENT,
  Nome VARCHAR(100) NOT NULL,
  CFU INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Esami (
  IdEsame INT PRIMARY KEY AUTO_INCREMENT,
  Matricola INT NOT NULL,
  IdMateria INT NOT NULL,
  IdDocente INT NOT NULL,
  DataEsame DATE NOT NULL,
  Voto INT NOT NULL,
  Lode TINYINT(1) NOT NULL DEFAULT 0
);

ALTER TABLE Esami
  ADD CONSTRAINT fk_esami_studenti FOREIGN KEY (Matricola) REFERENCES Studenti(Matricola),
  ADD CONSTRAINT fk_esami_materie FOREIGN KEY (IdMateria) REFERENCES Materie(IdMateria),
  ADD CONSTRAINT fk_esami_docenti FOREIGN KEY (IdDocente) REFERENCES Docenti(IdDocente);

INSERT INTO Studenti (Matricola, Nome, Cognome) VALUES
  (1001, 'Luca', 'Bianchi'),
  (1002, 'Sara', 'Rossi'),
  (1003, 'Marco', 'Verdi');

INSERT INTO Docenti (Nome, Cognome) VALUES
  ('Giulia', 'Ferrari'),
  ('Paolo', 'Conti');

INSERT INTO Materie (Nome, CFU) VALUES
  ('Analisi Matematica', 9),
  ('Programmazione', 12),
  ('Fisica', 6);

INSERT INTO Esami (Matricola, IdMateria, IdDocente, DataEsame, Voto, Lode) VALUES
  (1001, 1, 1, '2024-02-10', 28, 0),
  (1002, 2, 2, '2024-02-12', 30, 1),
  (1003, 3, 1, '2024-02-15', 24, 0);
