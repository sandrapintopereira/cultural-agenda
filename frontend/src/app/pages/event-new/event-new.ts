import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { EventService } from '../../services/events';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CreateEventDTO, Event } from '../../interfaces/event';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-new',
  imports: [ReactiveFormsModule],
  templateUrl: './event-new.html',
  styleUrl: './event-new.css',
})
export class EventNew {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private auth = inject(Auth);
  private router = inject(Router);
  private location = inject(Location);

  eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    type: ['concert' as Event['type'], Validators.required],
    date: ['', [Validators.required, this.futureDateValidator]],
    time: ['', Validators.required],
    location: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    is_free: [true],
    price: [null as number | null]
  });

  async onSubmit(): Promise<void> {
    if(this.eventForm.valid) {
      const user = await this.auth.getUser();
      const formValues = this.eventForm.getRawValue();

      if(!user) {
        this.router.navigate(['/login']);
        return;
      }

      const newEvent: CreateEventDTO = {
        title: formValues.title!,
        type: formValues.type as Event['type'],
        date: formValues.date!,
        time: formValues.time!,
        location: formValues.location!,
        description: formValues.description!,
        is_free: !!formValues.is_free,
        user_id: user.id,
        price: formValues.is_free ? null : (formValues.price ?? null)
      };

    this.eventService.createEvent(newEvent).subscribe({
      next: () => this.router.navigate(['']), 
      error: (err: Error) => console.error('Error creating event:', err)
    });
  }
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected < today ? { pastDate: true } : null;
  }

  goBack(): void {
    this.location.back();
  }
}
