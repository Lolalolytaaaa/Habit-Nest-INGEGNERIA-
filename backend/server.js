const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Habit = require('./models/Habit');

const app = express();

app.use(cors());
app.use(express.json());

console.log("DEBUG - Valore di MONGO_URI caricato:", process.env.MONGO_URI ? "TROVATO" : "NON TROVATO");

// Connessione a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connesso a MongoDB Atlas!'))
  .catch((err) => console.error('❌ Errore di connessione:', err));


app.get('/api/habits', async (req, res) => {
    try {
        const habits = await Habit.find();
        res.json(habits);
    } catch (err) {
        res.status(500).json({ error: "Errore nel recupero dati" });
    }
});

app.post('/api/habits', async (req, res) => {
    try {
        const newHabit = new Habit(req.body);
        await newHabit.save();
        res.status(201).json(newHabit);
    } catch (err) {
        res.status(400).json({ error: "Errore nel salvataggio" });
    }
});

app.put('/api/habits/:id', async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ error: "Abitudine non trovata" });
        
        habit.completed = !habit.completed;
        await habit.save();
        res.json(habit);
    } catch (err) {
        res.status(400).json({ error: "Errore nell'aggiornamento" });
    }
});

app.delete('/api/habits/:id', async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: "Abitudine eliminata con successo" });
    } catch (err) {
        res.status(400).json({ error: "Errore nell'eliminazione" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});