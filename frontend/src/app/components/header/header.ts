import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { ProfileService } from '../../services/profiles';
import { EventService } from '../../services/events';
import { filter } from 'rxjs/operators';

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
  private readonly eventService = inject(EventService);

  public user$ = this.authService.user$;
  isAdmin = signal(false);
  pendingCount = signal(0);

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.profileService.getMyProfile()
          .then(profile => { this.isAdmin.set(profile.role === 'admin');
            if(profile.role === 'admin') {
              this.loadPendingCount();
            }
        })
          .catch(() => this.isAdmin.set(false));
      } else {
        this.isAdmin.set(false);
        this.pendingCount.set(0);
      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      if (this.isAdmin()) {
        this.loadPendingCount();
      }
    });
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

  private loadPendingCount(): void {
    this.eventService.getPendingEvents().subscribe({
      next: (events) => this.pendingCount.set(events.length),
      error: () => this.pendingCount.set(0)
    })
  }
}