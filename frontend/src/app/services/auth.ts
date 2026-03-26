import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { UserProfile } from '../interfaces/userProfile';
import { BehaviorSubject } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private supabase: SupabaseClient;
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    //sessão atual ao iniciar app
    this.supabase.auth.getSession().then(({ data }) => {
      this._user.next(data.session?.user ?? null);
    });

    //listener automático para login logout
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._user.next(session?.user ?? null);
    })
  }

  //para registo com email e pass
  async register(email: string, password: string, userData: UserProfile) {
    return await this.supabase.auth.signUp({ 
      email, 
      password, 
      options: {
        data: userData
      }});
  }

  //login com email e pass
  async login(email: string, password: string) {
    const { data, error } =
      await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (data.user) {
      this._user.next(data.user); //atualização imediata
    }

    return { data, error };
  }

  //logout e limpa sessão
  async logout() {
    const { error } = await this.supabase.auth.signOut();
    this._user.next(null);
    return { error };
  }

  //user atual autenticado 
  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  //token jwt da sessão atual para mandar no header 'authorization bearer'
  async getToken() {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token;
  }
}