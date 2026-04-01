import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth'; 
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  //injeção de dependências
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  public errorMessage = '';

  //configuração do formulário . formulário reativo
  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();
      
      //chamada direta ao serviço de autenticação
      const { error } = await this.authService.login(email!, password!);

      if (error) {
        this.errorMessage = 'Email or password incorrect.';
      } else {
        await this.router.navigate(['/explore']);
      }
    } else {
      //se clicar sem preencher mostra os erros visuais
      this.loginForm.markAllAsTouched();
    }
  }
}