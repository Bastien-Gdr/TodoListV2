// Import des dépendances
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Création de l'instance Sequelize
const sequelize = new Sequelize('todolist', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

// Modèle de la table ToDo
const ToDo = sequelize.define('ToDo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Création de l'application Express
const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Middleware pour activer CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests for the DELETE method
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Route pour récupérer toutes les tâches
app.get('/todos', async (req, res) => {
  try {
    const todos = await ToDo.findAll();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des tâches.' });
  }
});

// Route pour créer une nouvelle tâche
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  try {
    const todo = await ToDo.create({ title });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la tâche.' });
  }
});

// Route pour mettre à jour une tâche
app.put('/todos/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const todo = await ToDo.findByPk(id);
    if (todo) {
      todo.title = title;
      todo.completed = completed;
      await todo.save();
      res.json(todo);
    } else {
      res.status(404).json({ error: 'La tâche spécifiée n\'existe pas.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la tâche.' });
  }
});

// Route pour supprimer une tâche
app.delete('/todos/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await ToDo.findByPk(id);
    if (todo) {
      await todo.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).
      json({ error: 'La tâche spécifiée n\'existe pas.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la tâche.' });
  }
});

// Port d'écoute de l'application
const port = 3000;

// Synchronisation avec la base de données et démarrage du serveur
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });
});
