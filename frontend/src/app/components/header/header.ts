import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { ProfileService } from '../../services/profiles';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);

  public user$ = this.authService.user$;
  isAdmin = signal(false);

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.profileService.getMyProfile()
          .then(profile => this.isAdmin.set(profile.role === 'admin'))
          .catch(() => this.isAdmin.set(false));
      } else {
        this.isAdmin.set(false);
      }
    });
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}