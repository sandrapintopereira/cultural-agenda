import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
// GET /profiles/me/attending — eventos que o utilizador logado vai
router.get('/me/attending', authMiddleware, async (req: Request, res: Response) => {
    const user = (req as any).user;

    const { data, error } = await supabase
        .from('attendances')
        .select('event_id, events(*, attendances(count))')
        .eq('user_id', user.id);

    if (error) return res.status(500).json({ error: error.message });

    const events = data.map((a: any) => a.events);
    return res.json(events);
});

//GET /profiles/:id - ver perfis de utilizadores
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if(error) return res.status(404).json({ error: 'Profile not found' });
    
    return res.json(data);
});

//POST - criar perfil 
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    const { name, type, bio, website } = req.body;

    //validação de campos obrigatórios
    if(!name || !type) {
        return res.status(400).json({ error: 'Missing required fields: name, type' });
    }

    //validação do tipo
    const validTypes = ['individual', 'collective', 'artist', 'venue'];
    if(!validTypes.includes(type)) {
        return res.status(400).json({ error: `Invalid type: Must be one of: ${validTypes.join(', ')}`});
    }

    //usa o id do utilizador autenticado 
    const user = (req as any).user;

    const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: user.id, name, type, bio, website }])
        .select()
        .single();

    if(error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data);
});

//PUT /profiles - atualizar perfil - só o próprio utilizador é que pode
router.put('/', authMiddleware, async (req: Request, res: Response) => {
    const { name, type, bio, website } = req.body;

    //validação dos campos obrigatórios
    if(!name || !type) {
        return res.status(400).json({ error: 'Missing required fields: name, type' });
    }

    //validação do tipo
    const validTypes = ['individual', 'collective', 'artist', 'venue'];
    if(!validTypes.includes(type)) {
        return res.status(400).json({ error: `Invalid type: Must be one of: ${validTypes.join(', ')}`});
    }

    //usa o id do utilizador autenticado 
    const user = (req as any).user;

    const { data, error } = await supabase
        .from('profiles')
        .update({ name, type, bio, website })
        .eq('id', user.id)
        .select()
        .single();

    if(error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data);
});

// GET /profiles/:id/events — eventos criados por um utilizador
router.get('/:id/events', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('events')
        .select('*, attendances(count)')
        .eq('user_id', id)
        .order('date', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    return res.json(data);
});

export default router; 