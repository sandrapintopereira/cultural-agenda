import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/events';
import { Auth } from '../../services/auth';
import { CreateEventDTO, Event } from '../../interfaces/event';

@Component({
  selector: 'app-event-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './event-edit.html',
  styleUrl: './event-edit.css'
})
export class EventEdit implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  eventId = '';

  eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    type: ['concert' as Event['type'], Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    location: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    is_free: [true]
  });

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.eventId) this.loadEvent();
  }

  loadEvent(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.title,
          type: event.type,
          date: event.date,
          time: event.time,
          location: event.location,
          description: event.description,
          is_free: event.is_free
        });
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.eventForm.valid) {
      const user = await this.auth.getUser();
      const formValues = this.eventForm.getRawValue();

      if (!user) { this.router.navigate(['/login']); return; }

      const updatedEvent: CreateEventDTO = {
        title: formValues.title!,
        type: formValues.type as Event['type'],
        date: formValues.date!,
        time: formValues.time!,
        location: formValues.location!,
        description: formValues.description!,
        is_free: !!formValues.is_free,
        user_id: user.id
      };

      this.eventService.updateEvent(this.eventId, updatedEvent).subscribe({
        next: () => this.router.navigate(['/events', this.eventId]),
        error: (err: Error) => console.error('Error updating event:', err)
      });
    }
  }
}