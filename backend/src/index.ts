import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventsRouter from './routes/events.js';
import attendancesRouter from './routes/attendances.js';
import profilesRouter from './routes/profiles.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//rota de teste para ver se servidor funciona
app.get('/', (req, res) => {
  res.json({ message: 'Agenda Cultural API is running' });
});

//rotas dos events
app.use('/events', eventsRouter);

//rotas de presenças 
app.use('/attend', attendancesRouter);

//rotas de perfis 
app.use('/profiles', profilesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});