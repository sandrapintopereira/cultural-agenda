import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { UserProfile } from '../../interfaces/userProfile';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  public errorMessage = '';
  public isLoading = false;


  ngOnInit() {
    //para o backend acordar
    this.http.get('https://cultural-agenda.onrender.com').subscribe({
      next: () => console.log('Backend is awake'),
      error: () => console.log('Backend is waking up...')
    });
  }
  public registerForm = this.fb.group({
    name: ['', [Validators.required]],
    type: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    bio: ['', [Validators.maxLength(300)]],
    website: ['', [Validators.pattern('https?://.+')]],
  });

  public async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValues = this.registerForm.getRawValue();
    
    const metadata: UserProfile = {
      name: formValues.name!,
      type: formValues.type as UserProfile['type'],
      bio: formValues.bio || null,
      website: formValues.website || null
    };

    try {
      //registo no Supabase Auth
      //supabase guarda o 'metadata' e a trigger SQL cria o perfil automaticamente
      const { error } = await this.authService.register(
        formValues.email!, 
        formValues.password!, 
        metadata
      );

      if (error) {
        this.errorMessage = error.message;
        this.isLoading = false;
        return;
      }

      await this.router.navigate(['']);

    } catch (err: unknown) {
      if (err instanceof Error) {
        this.errorMessage = err.message;
      } else {
        this.errorMessage = 'An unexpected error occurred during registration.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}