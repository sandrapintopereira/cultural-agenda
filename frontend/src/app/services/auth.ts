import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { UserProfile } from '../interfaces/userProfile';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
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
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  //logout e limpa sessão
  async logout() {
    return await this.supabase.auth.signOut();
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
