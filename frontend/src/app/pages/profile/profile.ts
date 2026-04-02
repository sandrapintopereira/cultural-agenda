import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { ProfileService } from '../../services/profiles';
import { ProfileResponse, UserProfile } from '../../interfaces/userProfile';
import { Event } from '../../interfaces/event';
import { User } from '@supabase/supabase-js';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);
  private profileService = inject(ProfileService);
  private location = inject(Location);

  profile = signal<ProfileResponse | null>(null);
  createdEvents = signal<Event[]>([]);
  attendingEvents = signal<Event[]>([]);
  currentUser = signal<User | null>(null);
  loading = signal(true);
  isOwnProfile = signal(false);
  isEditing = signal(false);

  editForm: UserProfile = { name: '', type: 'individual' };

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.currentUser.set(user);
      this.initProfile();
    });
  }

  initProfile(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      // /profile — perfil próprio
      const user = this.currentUser();
      if (!user) { this.router.navigate(['/login']); return; }
      this.isOwnProfile.set(true);
      this.loadProfile(user.id);
    } else {
      // /profiles/:id — perfil público
      const user = this.currentUser();
      this.isOwnProfile.set(user?.id === id);
      this.loadProfile(id);
    }
  }

  loadProfile(id: string): void {
    this.profileService.getProfileById(id)
      .then(profile => {
        this.profile.set(profile);
        this.editForm = { name: profile.name, type: profile.type, bio: profile.bio, website: profile.website };
        this.loading.set(false);
        this.loadCreatedEvents(id);
        if (this.isOwnProfile()) this.loadAttendingEvents();
      })
      .catch(() => this.loading.set(false));
  }

  loadCreatedEvents(id: string): void {
    this.profileService.getProfileEvents(id).subscribe({
      next: (events) => this.createdEvents.set(events)
    });
  }

  loadAttendingEvents(): void {
    this.profileService.getAttendingEvents()
      .then(events => this.attendingEvents.set(events))
      .catch((err) => console.error('Error loading attending events:', err));
  }

  toggleEdit(): void {
    this.isEditing.set(!this.isEditing());
  }

  saveProfile(): void {
    this.profileService.updateProfile(this.editForm)
      .then(updated => {
        this.profile.set(updated);
        this.isEditing.set(false);
      })
      .catch(err => console.error(err));
  }

  formatTime(time: string): string {
    return time?.slice(0, 5) ?? '';
  }

  goBack(): void {
    this.location.back();
  }
}