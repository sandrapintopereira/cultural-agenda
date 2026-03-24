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

