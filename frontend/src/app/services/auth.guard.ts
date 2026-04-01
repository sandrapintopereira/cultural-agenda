//guard para quando se clicar no create event e não tiver loggado, direcionar para o login 
//segurança para evitar que qualquer utilizador crie um evento
import { inject } from "@angular/core";
import { Router, CanActivateFn } from "@angular/router";    
import { Auth } from "./auth";

export const authGuard: CanActivateFn = async () => {
    const authService = inject(Auth);
    const router = inject(Router);

    const user = await authService.getUser();

    if(user) {
        return true;
    } else {
        //se houver login, manda para a página de login
        router.navigate(['/login']);
        return false;
    }
}