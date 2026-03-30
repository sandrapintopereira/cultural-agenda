import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/events';
import { Event } from '../../interfaces/event';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private eventService = inject(EventService);

  allEvents = signal<Event[]>([]); //signal para guardar todos os evnetos
  
  searchTerm = '';
  selectedType = '';
  selectedLocation = '';
  selectedDate = '';

  ngOnInit(): void {
    this.loadEvents(); //carrega eventos ao iniciar 
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => this.allEvents.set(data), //atualiza os eventos
      error: (err) => console.error('Error fetching events:', err)
    });
  }

  formatTime(time: string): string {
    if(!time) return '';
    return time.slice(0, 5);
  }

  get filteredEvents(): Event[] {
    //filtra com base nos critérios selecionados
    return this.allEvents().filter(event => {
      const matchesTitle = event.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesLocation = event.location.toLowerCase().includes(this.selectedLocation.toLowerCase());
      const matchesType = !this.selectedType || event.type === this.selectedType;
      const matchesDate = !this.selectedDate || event.date === this.selectedDate;
      
      return matchesTitle && matchesLocation && matchesType && matchesDate;
    });
  }

  get upcomingEvent(): Event | undefined {
    const now = new Date().setHours(0, 0, 0, 0); //data atual sem horas

    //retorna o evento mais próximo
    return [...this.allEvents()]
      .filter(e => new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }

  get popularEvent(): Event | undefined {
    //retorna o evento com maior número de participantes
    return [...this.allEvents()].sort((a, b) => {
      const countA = a.attend_count?.[0]?.count ?? 0; //n de participantes do evento a
      const countB = b.attend_count?.[0]?.count ?? 0; //n de participantes do evento b
      return countB - countA; //maior primeiro
    })[0];
  }
}