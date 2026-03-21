import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

//rota GET /events — lista eventos futuros com filtros opcionais
router.get('/', async (req: Request, res: Response) => {
  
  //extrai os filtros que podem vir no URL - ex: ?type=concerto&location=Braga
  const { type, location, date } = req.query;

  //começa a construir a query ao supabase
  let query = supabase
    .from('events')        // vai à tabela events
    .select('*')           // seleciona todas as colunas
    .gte('date', new Date().toISOString().split('T')[0])  // só eventos de hoje em diante
    .order('date', { ascending: true });                  // ordena por data crescente

  //aplica os filtros opcionais
  if (type) query = query.eq('type', type as string);
  if (location) query = query.eq('location', location as string);
  if (date) query = query.eq('date', date as string);

  //executa a query e aguarda o resultado
  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  return res.json(data);
});

//rota GET /events/:id - devolve o detalhe de um evento específico
router.get('/:id', async (req: Request, res: Response) => {
    //para extrair o id do evento
    const { id } = req.params; 

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id) //filtro por id
        .single(); 

    if (error) return res.status(404).json({ error: 'Event not found' });

    return res.json(data);
});

//rota POST - para criar novo evento