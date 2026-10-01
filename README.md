# Brainly

Second-brain app: notes, YouTube, Twitter, documents, and links.

## Local setup after cloning

You need **two terminals**. There is no deploy step for local use.

### 1. Backend

```bash
cd ts_brainly
cp .env.example .env
```

Edit `ts_brainly/.env` and set your MongoDB URL:

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=any-local-secret
PORT=3000
```

Then:

```bash
npm install
npm run build
```

Leave this terminal running. You should see `Server running on port 3000`.

### 2. Frontend

```bash
cd brainly-frontend
cp .env.example .env
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

The frontend talks to `http://localhost:3000` by default.
