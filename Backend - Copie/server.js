const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 11002; // Correction du bug de redéclaration

app.use(cors());
app.use(express.json());

// ✅ Connexion à PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || "myuser",
  host: process.env.DB_HOST || "database",
  database: process.env.DB_NAME || "mydb",
  password: process.env.DB_PASSWORD || "mypassword",
  port: process.env.DB_PORT || 5432,
});

// ✅ Fonction pour retenter la connexion
async function connectWithRetry() {
  let attempts = 5;
  while (attempts > 0) {
    try {
      await pool.connect();
      console.log("✅ Connected to PostgreSQL");
      return;
    } catch (err) {
      console.error(`⏳ Retry connecting to PostgreSQL... Attempts left: ${attempts}`);
      attempts--;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  console.error("❌ Could not connect to PostgreSQL after multiple attempts.");
  process.exit(1);
}

pool.query("SELECT 1", (err, res) => {
  if (err) {
    console.error("❌ Problème de connexion à PostgreSQL:", err);
  } else {
    console.log("✅ Connexion test PostgreSQL réussie !");
  }
});


connectWithRetry();

// ✅ Endpoint pour récupérer tous les utilisateurs
app.get("/Users", async (req, res) => { 
  console.log("✅ Requête reçue sur /Users"); 
  try { 
      const result = await pool.query('SELECT * FROM "Users" ORDER BY "createdAt" DESC');
      res.json(result.rows);
  } catch (err) { 
      console.error("❌ Erreur lors de la récupération des utilisateurs:", err);
      res.status(500).send("Erreur lors de la récupération des utilisateurs.");
  }
});
app.get("/", (req, res) => {
  res.send("🚀 Backend fonctionne !");
});
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});



// ✅ Endpoint pour ajouter un utilisateur
app.post("/Users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "❌ Name et Email sont obligatoires." });
  }
  try {
    console.log("📝 Ajout d'un utilisateur:", name, email);
    const result = await pool.query(
      'INSERT INTO "Users" (name, email, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout de l'utilisateur:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur." });
  }
});

// ✅ Endpoint pour récupérer tous les messages
app.get("/messages", async (req, res) => {
  console.log("📡 Requête reçue : GET /messages");
  try {
    const result = await pool.query('SELECT * FROM "Messages" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des messages:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des messages." });
  }
});

// ✅ Endpoint pour ajouter un message
app.post("/messages", async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "❌ Message content cannot be empty." });
  }
  try {
    console.log("📝 Ajout d'un message:", content);
    await pool.query(
      'INSERT INTO "Messages" (content, "createdAt", "updatedAt") VALUES ($1, NOW(), NOW())',
      [content]
    );
    res.json({ message: "✅ Message logged successfully!" });
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement du message:", err);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du message." });
  }
});

// ✅ Lancement du serveur avec affichage des routes
console.log(`✅  Server ready to start.`);
app.listen(PORT,"0.0.0.0",  () => {
  console.log(`🚀 Backend running on port ${PORT}`);

  console.log("📌 Routes chargées dans Express :");
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(`➡️  ${r.route.path}`);
    }
  });
  console.log(`✅  Server initialized.`);
});
console.log(`✅  Server started.`);
