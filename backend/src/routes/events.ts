import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';

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

  if(error) return res.status(500).json({ error: error.message });

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

    if(error) return res.status(404).json({ error: 'Event not found' });

    return res.json(data);
});

//rota POST - para criar novo evento
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    //dados do evento que vem no body do pedido
    const { title, type, date, time, location, description, is_free } = req.body;
    const user = (req as any).user;

    //validação de campos obrigatórios
    if(!title || !type || !date || !time || !location) {
        return res.status(400).json({
            error: 'Missing required fields: title, type, date, time, location.'
        });
    }

    //validação do tipo de evento
    const validTypes = ['concert', 'exhibition', 'reading', 'theatre', 'other'];
    if(!validTypes.includes(type)) {
        return res.status(400).json({
            error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
        });
    } 

    //validação da data 
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0 , 0, 0);
    if(eventDate < today) {
        return res.status(400).json({
            error: 'Event date must be in the future'
        });
    }

    //para inserir o evento na tabela 
    const { data, error } = await supabase
        .from('events')
        .insert([{ title, type, date, time, location, description, is_free, user_id: user.id }])
        .select()   //para devolver o evento criado
        .single();  

    if(error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data);
});

//rota PUT - editar evento que já existe
router.put('/:id', authMiddleware, async (req: Request, res:Response) => {
    //id do evento a editar
    const { id } = req.params;

    //dados atualizados do body
    const { title, type, date, time, location, description, is_free } = req.body;

    //validação de campos obrigatórios
    if(!title || !type || !date || !time || !location) {
        return res.status(400).json({
            error: 'Missing required fields: title, type, date, time, location.'
        });
    }

    //validação do tipo de evento
    const validTypes = ['concert', 'exhibition', 'reading', 'theatre', 'other'];
    if(!validTypes.includes(type)) {
        return res.status(400).json({
            error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
        });
    }

    //validação da data 
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0 , 0, 0);
    if(eventDate < today) {
        return res.status(400).json({
            error: 'Event date must be in the future'
        });
    }

    //atualiza o evento na tabela
    const { data, error } = await supabase
        .from('events')
        .update({ title, type, date, time, location, description, is_free })
        .eq('id', id)
        .select()
        .single();

    if(error) return res.status(500).json({ error: error.message });

    return res.json(data);
});

//rota DELETE 
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {

    const { id } = req.params;

    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

    if(error) return res.status(500).json({ error: error.message });

    //204 - sem conteúdo aka eliminado
    return res.status(204).send();
});

export default router; 