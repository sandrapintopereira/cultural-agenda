import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/events';
import { Event } from '../../interfaces/event';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private eventService = inject(EventService);
  private location = inject(Location);

  pendingEvents = signal<Event[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadPendingEvents();
  }

  loadPendingEvents(): void {
    this.eventService.getPendingEvents().subscribe({
      next: (events) => {
        this.pendingEvents.set(events);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  approve(id: string): void {
    this.eventService.updateEventStatus(id, 'approved').subscribe({
      next: () => this.pendingEvents.update(events => events.filter(e => e.id !== id))
    });
  }

  reject(id: string): void {
    this.eventService.updateEventStatus(id, 'rejected').subscribe({
      next: () => this.pendingEvents.update(events => events.filter(e => e.id !== id))
    });
  }

  formatTime(time: string): string {
    return time?.slice(0, 5) ?? '';
  }

  goBack(): void {
    this.location.back();
  }
}
