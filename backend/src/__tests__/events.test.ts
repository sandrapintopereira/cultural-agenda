import { describe, expect, test } from '@jest/globals';

describe('Events API', () => {

  //verifica se um evento tem os campos obrigatórios
  test('event should have required fields', () => {
    const event = {
      title: 'Concerto de Jazz',
      type: 'concerto',
      date: '2026-04-15',
      time: '18:00',
      location: 'Braga',
      is_free: true
    };

    expect(event.title).toBeDefined();
    expect(event.type).toBeDefined();
    expect(event.date).toBeDefined();
    expect(event.location).toBeDefined();
  });

  //verifica se a data do evento é futura
  test('event date should be in the future', () => {
    const eventDate = new Date('2026-04-15');
    const today = new Date();

    expect(eventDate.getTime()).toBeGreaterThan(today.getTime());
  });

  //verifica se is_free é um booleano
  test('event is_free should be a boolean', () => {
    const event = { is_free: true };

    expect(typeof event.is_free).toBe('boolean');
  });

});