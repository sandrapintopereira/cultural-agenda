import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();


//POST - registar presença num evento
router.post('/:id/attend', async (req: Request, res: Response) => {

    const { id } = req.params;

    const { user_id } = req.body;

    //para inserir o id do utlizador na tabela
    const { data, error } = await supabase
        .from('attendances')
        .insert([{ event_id: id, user_id }]) //para associar o user ao evento
        .select()
        .single();

    if(error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data);
});