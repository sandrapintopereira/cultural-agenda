import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/events';
import { Auth } from '../../services/auth';
import { Event } from '../../interfaces/event';
import { User } from '@supabase/supabase-js';
import { ProfileService } from '../../services/profiles';
import { ProfileResponse } from '../../interfaces/userProfile';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css'
})
export class EventDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private auth = inject(Auth);
  private profileService = inject(ProfileService);

  event = signal<Event | null>(null);
  currentUser = signal<User | null>(null);
  isAttending = signal(false);
  loading = signal(true);
  organizer = signal<ProfileResponse | null>(null);

  ngOnInit(): void {
    // subscreve o utilizador atual
    this.auth.user$.subscribe(user => this.currentUser.set(user));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadEvent(id);
  }

  loadEvent(id: string, skipAttendanceCheck = false): void {
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event.set(data);
        this.loading.set(false);

        this.profileService.getProfileById(data.user_id)
          .then(profile => this.organizer.set(profile))
          .catch(() => this.organizer.set(null));

        if (!skipAttendanceCheck && this.currentUser()) {
          this.eventService.checkAttendance(id).subscribe({
            next: (res) => this.isAttending.set(res.attending)
          });
        }
      },
      error: () => this.loading.set(false)
    });
  }

  formatTime(time: string): string {
    return time?.slice(0, 5) ?? '';
  }

  toggleAttend(): void {
    if (!this.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    const ev = this.event();
    if (!ev) return;

    if (this.isAttending()) {
      this.eventService.unattendEvent(ev.id).subscribe({
        next: () => {
          this.isAttending.set(false);
          this.loadEvent(ev.id, true);
        }
      });
    } else {
      this.eventService.attendEvent(ev.id).subscribe({
        next: () => {
          this.isAttending.set(true);
          this.loadEvent(ev.id, true);
        }
      });
    }
  }
}