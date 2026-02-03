# universita

Progetto full-stack con backend Node.js + Express + MySQL e frontend Next.js.

## Struttura

```
/backend
/frontend
/scripts
```

## Requisiti

- Node.js 18+
- MySQL 8+
- Client MySQL (`mysql` CLI) per eseguire gli script di inizializzazione

## Variabili d'ambiente

### Backend

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=universita
DB_USER=root
DB_PASS=secret
DB_SSL=false
DB_CA=\n# base64 oppure path al file CA
CORS_ORIGIN=http://localhost:3000
```

### Frontend

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Setup database

1. Popola il database con lo script SQL:

```bash
./scripts/run_init.sh
```

Lo script richiede queste variabili d'ambiente: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`.

## Avvio backend

```bash
cd backend
npm install
npm run dev
```

Il server parte su `http://localhost:3001`.

## Avvio frontend

```bash
cd frontend
npm install
npm run dev
```

Il frontend parte su `http://localhost:3000`.

### Tailwind CSS (frontend)

Dipendenze richieste:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react
```

Apri il frontend su `http://localhost:3000` per verificare il design system.

Tema ad alto contrasto: aggiungi la classe `theme-high-contrast` al tag `<body>` per aumentare il contrasto.

File principali del design system:

- `frontend/tailwind.config.js`
- `frontend/styles/globals.css`
- `frontend/components/ui/*`

## Inizializzazione DB via script npm

```bash
cd backend
npm run init-db
node seed.js
```

## Demo con curl

Richiede `jq` per formattare l'output JSON.

```bash
./scripts/demo.sh
```

Lo script usa `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).

## Codespaces

1. Apri il repository in GitHub Codespaces.
2. Configura le variabili d'ambiente richieste (vedi sezione **Variabili d'ambiente**).
3. Esegui l'inizializzazione del DB:

```bash
./scripts/run_init.sh
```

4. Avvia backend e frontend:

```bash
cd backend && npm install && npm run dev
```

```bash
cd frontend && npm install && npm run dev
```
