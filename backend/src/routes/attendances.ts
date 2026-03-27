import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();


//POST - registar presença num evento
router.post('/:id/attend', authMiddleware, async (req: Request, res: Response) => {

    const { id } = req.params;

    const user_id = (req as any).user.id; //extrai o id do user autenticado

    //verifica se o evento existe antes de registar presença
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id')
        .eq('id', id)
        .single();

    //se o evento não existir
    if (eventError || !event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    //para inserir o id do utlizador na tabela
    const { data, error } = await supabase
        .from('attendances')
        .insert([{ event_id: id, user_id }]) //para associar o user ao evento
        .select()
        .single();

    if(error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data);
});

//DELETE - cancelar presença num evento
router.delete('/:id/attend', authMiddleware, async (req: Request, res: Response) => {

    const { id } = req.params;

    const user_id = (req as any).user.id; //extrai o id do user autenticado

    //para eliminar presença na tabela
    const { error } = await supabase
        .from('attendances')
        .delete()
        .eq('event_id', id) //filtra pelo evento
        .eq('user_id', user_id); //filtra pelo user

    if(error) return res.status(500).json({ error: error.message });

    return res.status(204).send();
});

export default router;