import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

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

export default router; 