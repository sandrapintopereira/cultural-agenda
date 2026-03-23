import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase.js";

//nextFunction para validar o pedido e continuar para a rota

//para verificar se utilizador está autenticado
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    //buscar o token ao Authorization
    const authHeader = req.headers.authorization;

    //se não houver token, não está autorizado
    if(!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    //extrai o token, split para remover Bearer do início
    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);

    if(error || !data.user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    //se o token for válido, guarda o user no req e passa para a rota
    //ex: para saber quem está a criar o evento
    (req as any).user = data.user;
    next();
}